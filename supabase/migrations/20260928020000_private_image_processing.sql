-- Additive preparation. Observed storage.objects: bucket_id/name/owner_id text;
-- post-images is public with a 5 MiB limit and three post_images_*_own policies.
-- Does not disable legacy uploads; activate only after server verification.
begin;
do $$ begin
 if exists(select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname not in ('post_images_insert_own','post_images_select_own','post_images_delete_own')) then raise exception 'Unreviewed Storage policy';end if;
 if not exists(select 1 from storage.buckets where id='post-images' and public and file_size_limit=5242880) then raise exception 'Unexpected public image bucket';end if;
end $$;
create table public.post_image_jobs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 status text not null default 'pending' check(status in ('pending','processing','ready','failed')),
 public_path text unique check(public_path ~ '^public/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif)$'),
 staging_removed boolean not null default false,
 check(status <> 'ready' or (public_path is not null and staging_removed))
);
create index post_image_jobs_quota on public.post_image_jobs(user_id,created_at);
create index post_image_jobs_cleanup on public.post_image_jobs(created_at) where not staging_removed;
alter table public.post_image_jobs enable row level security;
revoke all on public.post_image_jobs from public,anon,authenticated;
grant select,insert,update,delete on public.post_image_jobs to service_role;

create function public.reserve_post_image() returns uuid
language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); result uuid;
begin
 if actor is null then raise exception 'Authentication required' using errcode='42501';end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,821));
 if (select count(*) from public.post_image_jobs where user_id=actor and created_at>now()-interval '24 hours')>=30
 or (select count(*) from public.post_image_jobs where user_id=actor and status in ('pending','processing') and created_at>now()-interval '15 minutes')>=5
 then raise exception 'Image upload limit reached' using errcode='42501';end if;
 insert into public.post_image_jobs(user_id) values(actor) returning id into result;
 return result;
end $$;
revoke all on function public.reserve_post_image() from public,anon;
grant execute on function public.reserve_post_image() to authenticated;

create function public.owns_post_image(p_name text) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.post_image_jobs where public_path=p_name and user_id=auth.uid() and status='ready');
$$;
create function public.can_stage_post_image(p_name text) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.post_image_jobs where id::text=p_name and user_id=auth.uid() and status='pending' and created_at>now()-interval '15 minutes');
$$;
revoke all on function public.owns_post_image(text),public.can_stage_post_image(text) from public,anon;
grant execute on function public.owns_post_image(text),public.can_stage_post_image(text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('post-image-staging','post-image-staging',false,5242880,array['image/jpeg','image/png','image/webp','image/gif']);
create policy post_image_staging_insert on storage.objects for insert to authenticated
with check(bucket_id='post-image-staging' and owner_id=auth.uid()::text and public.can_stage_post_image(name));
create policy post_image_staging_select on storage.objects for select to authenticated
using(bucket_id='post-image-staging' and owner_id=auth.uid()::text);
create policy post_image_staging_delete on storage.objects for delete to authenticated
using(bucket_id='post-image-staging' and owner_id=auth.uid()::text);
create policy post_image_processed_select on storage.objects for select to authenticated
using(bucket_id='post-images' and public.owns_post_image(name));
create policy post_image_processed_delete on storage.objects for delete to authenticated
using(bucket_id='post-images' and public.owns_post_image(name));
notify pgrst,'reload schema';
commit;
