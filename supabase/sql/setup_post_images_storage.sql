-- 게시글 사진 첨부를 위한 Storage 버킷 + 보안 정책.
-- P0 migration 이후 UID 경로/공개 객체 목록 정책으로 되돌리지 않습니다.
do $$ begin
  if to_regprocedure('public.require_admin_aal2()') is not null then
    raise exception 'Deprecated after P0: use the image identity migration';
  end if;
end $$;
-- Supabase SQL Editor에서 실행하세요. (재실행해도 안전하게 만들어짐)

-- 1) posts 테이블에 이미지 URL 배열 컬럼 추가
alter table posts
  add column if not exists image_urls text[] not null default '{}';

-- 2) 버킷 생성: 공개 읽기, 장당 5MB 제한, 이미지 파일만 허용
--    (허용 목록 밖의 파일 형식/용량은 Supabase가 업로드 요청 자체를 거부함 -
--     클라이언트 검증을 우회해도 서버에서 다시 막힘)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 3) 업로드 권한: 로그인한 사용자만, 반드시 "자기 uid 폴더" 안에만 업로드 가능
--    (다른 사람 폴더에 덮어쓰거나 남의 이름으로 업로드하는 것 방지)
drop policy if exists "post-images: authenticated users upload own folder" on storage.objects;
create policy "post-images: authenticated users upload own folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4) 본인이 올린 파일은 본인이 삭제 가능
drop policy if exists "post-images: users delete own files" on storage.objects;
create policy "post-images: users delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 5) 누구나 읽기 가능 (게시글 이미지는 공개)
drop policy if exists "post-images: public read" on storage.objects;
create policy "post-images: public read"
on storage.objects for select
to public
using (bucket_id = 'post-images');
