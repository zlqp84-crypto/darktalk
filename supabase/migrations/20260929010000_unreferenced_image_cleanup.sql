-- Existing job ledger doubles as a durable retry queue. No Storage SQL deletes.
-- Requires the completed server-image cutover.
begin;
do $$ begin
 if not exists(select 1 from pg_trigger where tgrelid='public.posts'::regclass and tgname='posts_require_processed_images') then
  raise exception 'Server image cutover required';
 end if;
end $$;

create or replace function public.check_processed_post_images() returns trigger
language plpgsql security definer set search_path='' as $$
declare image_url text; image_path text;
begin
 if cardinality(new.image_urls)>5 then raise exception 'Too many images' using errcode='23514';end if;
 -- Consistent lock ordering for posts containing the same images.
 for image_url in select distinct u from unnest(new.image_urls) u order by u loop
  if image_url is null or image_url not like 'https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/public/%' then raise exception 'Unprocessed image' using errcode='23514';end if;
  image_path:=substring(image_url from length('https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/')+1);
  -- The cleanup claim takes an exclusive row lock. A new post cannot attach
  -- a file after cleanup has claimed it, even if Storage deletion is pending.
  perform 1 from public.post_image_jobs j
   where j.public_path=image_path and j.user_id=new.user_id and j.status='ready'
   for share;
  if not found then raise exception 'Unprocessed image' using errcode='23514';end if;
  if not exists(select 1 from storage.objects where bucket_id='post-images' and name=image_path) then raise exception 'Unprocessed image' using errcode='23514';end if;
 end loop;
 return new;
end $$;
revoke all on function public.check_processed_post_images() from public,anon,authenticated;

create function public.claim_unreferenced_post_images(p_limit integer default 100) returns integer
language plpgsql security definer set search_path='' as $$
declare claimed integer; candidate_ids uuid[];
begin
 if current_setting('transaction_isolation') <> 'read committed' then
  raise exception 'Cleanup requires READ COMMITTED';
 end if;
 select array_agg(c.id) into candidate_ids from (
  select j.id from public.post_image_jobs j
  where j.status='ready' and j.created_at<now()-interval '24 hours'
   and not exists(select 1 from public.posts p where
    p.image_urls @> array['https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/'||j.public_path])
  order by j.created_at,j.id limit least(greatest(coalesce(p_limit,100),0),100)
  for update of j skip locked
 ) c;
 -- Separate statement: recheck references with a fresh READ COMMITTED
 -- snapshot after acquiring the locks (a post may have just committed).
 update public.post_image_jobs j set status='failed',staging_removed=false
 where j.id=any(candidate_ids) and j.status='ready'
  and not exists(select 1 from public.posts p where
   p.image_urls @> array['https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/'||j.public_path]);
 get diagnostics claimed=row_count;
 return claimed;
end $$;
revoke all on function public.claim_unreferenced_post_images(integer) from public,anon,authenticated;
grant execute on function public.claim_unreferenced_post_images(integer) to service_role;
create index if not exists posts_image_urls_gin on public.posts using gin(image_urls);
notify pgrst,'reload schema';
commit;
