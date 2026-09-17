-- 관리자 페이지(/admin)를 위한 준비 작업.
-- Supabase SQL Editor에서 실행하세요.
-- P0 migration 이후에는 이 구버전 스크립트로 보안을 되돌릴 수 없습니다.
do $$ begin
  if to_regprocedure('public.require_admin_aal2()') is not null then
    raise exception 'Deprecated after P0: use versioned migrations; do not restore legacy admin functions';
  end if;
end $$;

-- 1) profiles에 관리자 플래그 추가
alter table profiles
  add column if not exists is_admin boolean not null default false;

-- 2) 관리자만 실행 가능한 삭제 함수 (RLS와 무관하게 서버에서 권한을 직접 검사함)
create or replace function admin_delete_post(p_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    raise exception 'not authorized';
  end if;
  delete from comments where post_id = p_post_id;
  delete from posts where id = p_post_id;
end;
$$;

create or replace function admin_delete_comment(p_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_admin = true) then
    raise exception 'not authorized';
  end if;
  delete from comments where id = p_comment_id;
end;
$$;

grant execute on function admin_delete_post(uuid) to authenticated;
grant execute on function admin_delete_comment(uuid) to authenticated;

-- 3) 본인 계정을 관리자로 지정 (아래 이메일을 본인 가입 이메일로 바꿔서 실행)
-- update profiles set is_admin = true
-- where id = (select id from auth.users where email = '본인_가입_이메일@company.com');
