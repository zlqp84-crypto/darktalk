-- The observed bucket contained zero objects / image-bearing posts.
-- Keep public downloads; stop exposing account IDs in paths or object listings.
begin;
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'storage'
    and table_name = 'objects' and column_name = 'owner_id' and udt_name = 'text') then
    raise exception 'P0 preflight: storage.objects.owner_id was not found';
  end if;
  if exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects'
    and policyname not in ('post-images: authenticated users upload own folder',
      'post-images: public read','post-images: users delete own files',
      'post_images_insert_own','post_images_select_own','post_images_delete_own')) then
    raise exception 'P0 preflight: unreviewed Storage policies exist; inspect before applying';
  end if;
  if exists (select 1 from public.posts p cross join lateral unnest(p.image_urls) u(url)
    where u.url !~ '/post-images/public/[0-9a-f-]{36}\.(jpg|png|webp|gif)$')
    or exists (select 1 from storage.objects where bucket_id = 'post-images'
      and name !~ '^public/[0-9a-f-]{36}\.(jpg|png|webp|gif)$') then
    raise exception 'P0 preflight: legacy image paths exist; migrate objects and references first';
  end if;
end;
$$;

drop policy if exists "post-images: authenticated users upload own folder" on storage.objects;
drop policy if exists "post-images: public read" on storage.objects;
drop policy if exists "post-images: users delete own files" on storage.objects;
drop policy if exists post_images_insert_own on storage.objects;
drop policy if exists post_images_select_own on storage.objects;
drop policy if exists post_images_delete_own on storage.objects;

create policy post_images_insert_own on storage.objects for insert to authenticated
with check (
  bucket_id = 'post-images' and owner_id = (select auth.uid())::text
  and name ~ '^public/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|gif)$'
);
create policy post_images_select_own on storage.objects for select to authenticated
using (bucket_id = 'post-images' and owner_id = (select auth.uid())::text);
create policy post_images_delete_own on storage.objects for delete to authenticated
using (bucket_id = 'post-images' and owner_id = (select auth.uid())::text);

-- Public file retrieval bypasses SELECT RLS in Supabase Storage; object metadata
-- and bucket listings do not. No bucket visibility/size/MIME settings change.
notify pgrst, 'reload schema';
commit;
