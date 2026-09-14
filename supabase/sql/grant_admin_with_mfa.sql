-- 1) 아래 이메일을 본인이 Supabase 대시보드(Authentication > Users > Add user)에서
--    직접 만든 개인 이메일 계정으로 바꿔서 실행하세요.
--    (공개 회원가입 폼은 회사 이메일만 허용하므로, 관리자 계정은 대시보드에서 직접 생성합니다.)

insert into profiles (id, nickname, company, is_admin)
select id, '운영자', '다크톡', true
from auth.users
where email = '본인_개인_이메일@gmail.com'
on conflict (id) do update set is_admin = true;

-- 2) 삭제 함수가 MFA(OTP) 인증까지 완료된 세션에서만 동작하도록 강화.
--    /admin 페이지에서 QR 스캔으로 최초 설정하거나 코드 인증을 완료해야
--    이 조건(aal2)을 만족합니다. 이미 add_admin_support.sql로 만든 함수를 덮어씁니다.

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
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2' then
    raise exception 'mfa required';
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
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2' then
    raise exception 'mfa required';
  end if;
  delete from comments where id = p_comment_id;
end;
$$;
