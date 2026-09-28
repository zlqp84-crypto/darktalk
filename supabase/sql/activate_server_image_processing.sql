-- MANUAL CUTOVER ONLY: additive migration + production endpoint + daily cleanup
-- must be verified first. Kept outside migrations to prevent accidental cutover.
begin;
do $$ begin
 if to_regclass('public.post_image_jobs') is null then raise exception 'Image preparation missing';end if;
 if not exists(select 1 from storage.buckets where id='post-image-staging' and not public and file_size_limit=5242880) then raise exception 'Private staging missing';end if;
end $$;
-- Restrictive policies also deny an accidental additional permissive policy.
create policy post_images_server_insert_only on storage.objects as restrictive for insert to anon,authenticated
with check(bucket_id <> 'post-images');
create policy post_images_server_update_only on storage.objects as restrictive for update to anon,authenticated
using(bucket_id <> 'post-images') with check(bucket_id <> 'post-images');
create function public.check_processed_post_images() returns trigger
language plpgsql security definer set search_path='' as $$
declare image_url text; image_path text;
begin
 if cardinality(new.image_urls)>5 then raise exception 'Too many images' using errcode='23514';end if;
 foreach image_url in array new.image_urls loop
  if image_url is null or image_url not like 'https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/public/%' then raise exception 'Unprocessed image' using errcode='23514';end if;
  image_path:=substring(image_url from length('https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/')+1);
  if not exists(select 1 from public.post_image_jobs j join storage.objects o on o.bucket_id='post-images' and o.name=j.public_path where j.public_path=image_path and j.user_id=new.user_id and j.status='ready') then raise exception 'Unprocessed image' using errcode='23514';end if;
 end loop;
 return new;
end $$;
revoke all on function public.check_processed_post_images() from public,anon,authenticated;
create trigger posts_require_processed_images before insert or update of image_urls on public.posts
for each row execute function public.check_processed_post_images();
notify pgrst,'reload schema';
commit;
