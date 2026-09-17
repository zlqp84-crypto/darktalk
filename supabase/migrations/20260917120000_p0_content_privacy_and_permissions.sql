-- Observed schema: docs/security/p0-schema-snapshot.md (2026-09-17).
-- No table/column creation, no data deletion, no role assignments.
-- Deploy with the explicit-projection / admin-RPC application changes.
begin;

-- Fail closed on missing/type-changed columns instead of inventing a schema.
do $$
declare
  expected record;
begin
  for expected in
    select * from (values
      ('posts','id','uuid'), ('posts','user_id','uuid'),
      ('posts','title','text'), ('posts','content','text'), ('posts','category','text'),
      ('posts','likes_count','int4'), ('posts','comments_count','int4'),
      ('posts','views_count','int4'), ('posts','created_at','timestamptz'), ('posts','image_urls','_text'),
      ('comments','id','uuid'), ('comments','post_id','uuid'), ('comments','user_id','uuid'),
      ('comments','content','text'), ('comments','created_at','timestamptz'), ('comments','likes_count','int4'),
      ('profiles','id','uuid'), ('profiles','nickname','text'), ('profiles','company','text'),
      ('profiles','job_title','text'), ('profiles','is_verified','bool'),
      ('profiles','is_admin','bool'), ('profiles','created_at','timestamptz')
    ) as columns(table_name, column_name, udt_name)
  loop
    if not exists (
      select 1 from information_schema.columns c
      where c.table_schema = 'public' and c.table_name = expected.table_name
        and c.column_name = expected.column_name and c.udt_name = expected.udt_name
    ) then
      raise exception 'P0 preflight: missing/type-changed %.%', expected.table_name, expected.column_name;
    end if;
  end loop;

  if exists (
    select 1 from pg_policies where schemaname = 'public'
      and tablename in ('posts','comments','profiles')
      and policyname not in (
        '게시글 공개 읽기','본인 게시글 작성','댓글 공개 읽기','본인 댓글 작성','프로필 본인만 수정',
        'posts_public_read','posts_insert_own','comments_public_read','comments_insert_own',
        'profiles_select_own','profiles_insert_own','profiles_update_own'
      )
  ) then
    raise exception 'P0 preflight: unreviewed policies exist; inspect them before applying';
  end if;
end;
$$;

alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.profiles enable row level security;

-- Remove table-wide grants AND any earlier per-column grants. A table grant
-- overrides a column restriction; clearing both prevents stale privileges.
revoke all privileges on public.posts, public.comments, public.profiles from public, anon, authenticated;
do $$
declare
  t text;
  columns_sql text;
begin
  foreach t in array array['posts','comments','profiles'] loop
    select string_agg(quote_ident(attname), ', ' order by attnum) into columns_sql
    from pg_attribute where attrelid = format('public.%I', t)::regclass
      and attnum > 0 and not attisdropped;
    execute format('revoke all privileges (%s) on public.%I from public, anon, authenticated', columns_sql, t);
  end loop;
end;
$$;

-- RLS restricts rows; these grants separately restrict response fields.
grant select (id, title, content, category, likes_count, comments_count, views_count, created_at, image_urls)
  on public.posts to anon, authenticated;
grant select (id, post_id, content, created_at, likes_count)
  on public.comments to anon, authenticated;
grant insert (user_id, title, content, category, image_urls) on public.posts to authenticated;
grant insert (post_id, user_id, content) on public.comments to authenticated;

-- Owners may see their own account flags but cannot write them, including via
-- INSERT/UPSERT. Ordinary clients never get DELETE/TRUNCATE/TRIGGER privileges.
grant select (id, nickname, company, job_title, is_verified, created_at, is_admin)
  on public.profiles to authenticated;
grant insert (id, nickname, company, job_title) on public.profiles to authenticated;
grant update (nickname, company, job_title) on public.profiles to authenticated;

alter table public.posts alter column user_id set default auth.uid();
alter table public.comments alter column user_id set default auth.uid();

drop policy if exists "게시글 공개 읽기" on public.posts;
drop policy if exists "본인 게시글 작성" on public.posts;
drop policy if exists "댓글 공개 읽기" on public.comments;
drop policy if exists "본인 댓글 작성" on public.comments;
drop policy if exists "프로필 본인만 수정" on public.profiles;
drop policy if exists posts_public_read on public.posts;
drop policy if exists posts_insert_own on public.posts;
drop policy if exists comments_public_read on public.comments;
drop policy if exists comments_insert_own on public.comments;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy posts_public_read on public.posts for select to anon, authenticated using (true);
create policy posts_insert_own on public.posts for insert to authenticated
  with check ((select auth.uid()) is not null and user_id = (select auth.uid()));
create policy comments_public_read on public.comments for select to anon, authenticated using (true);
create policy comments_insert_own on public.comments for insert to authenticated
  with check ((select auth.uid()) is not null and user_id = (select auth.uid()));
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check (id = (select auth.uid()) and is_admin = false and is_verified = false);
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Internal guard: checks stored role state, never editable JWT user_metadata.
-- No browser role can execute this helper directly.
create or replace function public.require_admin_aal2()
returns void language plpgsql stable security definer set search_path = ''
as $$
begin
  if auth.uid() is null
    or coalesce(auth.jwt()->>'aal', '') <> 'aal2'
    or not exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin = true)
  then
    raise exception 'admin and MFA required' using errcode = '42501';
  end if;
end;
$$;
revoke all on function public.require_admin_aal2() from public, anon, authenticated, service_role;

create or replace function public.admin_delete_post(p_post_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  delete from public.comments where post_id = p_post_id;
  delete from public.posts where id = p_post_id;
end;
$$;

create or replace function public.admin_delete_comment(p_comment_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  delete from public.comments where id = p_comment_id;
end;
$$;

create or replace function public.admin_get_stats()
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  return jsonb_build_object(
    'posts', (select count(*) from public.posts),
    'comments', (select count(*) from public.comments),
    'users', (select count(*) from public.profiles)
  );
end;
$$;

create or replace function public.admin_list_posts()
returns table (id uuid, title text, category text, likes_count integer, comments_count integer, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  return query select p.id, p.title, p.category, p.likes_count, p.comments_count, p.created_at
    from public.posts p order by p.created_at desc, p.id desc limit 50;
end;
$$;

create or replace function public.admin_list_comments()
returns table (id uuid, content text, created_at timestamptz, post_title text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  return query select c.id, c.content, c.created_at, p.title
    from public.comments c left join public.posts p on p.id = c.post_id
    order by c.created_at desc, c.id desc limit 50;
end;
$$;

create or replace function public.admin_list_profiles()
returns table (id uuid, nickname text, company text, job_title text, is_verified boolean, is_admin boolean, created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform public.require_admin_aal2();
  return query select p.id, p.nickname, p.company, p.job_title, p.is_verified, p.is_admin, p.created_at
    from public.profiles p order by p.created_at desc, p.id desc limit 50;
end;
$$;

revoke all on function public.admin_delete_post(uuid), public.admin_delete_comment(uuid),
  public.admin_get_stats(), public.admin_list_posts(), public.admin_list_comments(), public.admin_list_profiles()
  from public, anon, authenticated, service_role;
grant execute on function public.admin_delete_post(uuid), public.admin_delete_comment(uuid),
  public.admin_get_stats(), public.admin_list_posts(), public.admin_list_comments(), public.admin_list_profiles()
  to authenticated;

-- Counter RPCs are intentionally unchanged: abuse controls are outside P0.
notify pgrst, 'reload schema';
commit;
