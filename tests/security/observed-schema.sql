-- TEST ONLY. Reconstructs the observed public schema, constraints and policies.
-- auth.users / storage.objects are minimal service fixtures containing ONLY
-- inspected columns needed by these tests, not full Supabase service schemas.
-- Provenance: docs/security/p0-schema-snapshot.md.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;
create schema auth;
create schema storage;
grant usage on schema public, auth, storage to anon, authenticated, service_role;

create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid
$$;
create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim', true), ''),
    nullif(current_setting('request.jwt.claims', true), ''))::jsonb
$$;

create table public.profiles (
  id uuid not null primary key references auth.users(id),
  nickname text not null unique,
  company text,
  job_title text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  is_admin boolean not null default false
);
create table public.posts (
  id uuid not null primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  title text not null,
  content text not null,
  category text,
  likes_count integer default 0,
  comments_count integer default 0,
  views_count integer default 0,
  is_anonymous boolean default true,
  created_at timestamptz default now(),
  image_urls text[] not null default '{}'
);
create table public.comments (
  id uuid not null primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id),
  content text not null,
  is_anonymous boolean default true,
  created_at timestamptz default now(),
  likes_count integer not null default 0
);
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.profiles enable row level security;
grant all on public.posts, public.comments, public.profiles to anon, authenticated, service_role;
create policy "게시글 공개 읽기" on public.posts for select using (true);
create policy "본인 게시글 작성" on public.posts for insert with check (auth.uid() = user_id);
create policy "댓글 공개 읽기" on public.comments for select using (true);
create policy "본인 댓글 작성" on public.comments for insert with check (auth.uid() = user_id);
create policy "프로필 본인만 수정" on public.profiles for all using (auth.uid() = id);

create table storage.objects (
  id uuid default gen_random_uuid(), bucket_id text, name text, owner uuid, owner_id text
);
alter table storage.objects enable row level security;
grant all on storage.objects to anon, authenticated, service_role;
create function storage.foldername(text) returns text[] language sql immutable as $$
  select (string_to_array($1, '/'))[1:array_length(string_to_array($1, '/'), 1)-1]
$$;
create policy "post-images: authenticated users upload own folder" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "post-images: public read" on storage.objects for select to public using (bucket_id = 'post-images');
create policy "post-images: users delete own files" on storage.objects for delete to authenticated
  using (bucket_id = 'post-images' and (storage.foldername(name))[1] = auth.uid()::text);
