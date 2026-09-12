-- posts 테이블 likes_count / views_count / comments_count 를
-- RLS를 우회하는 열린 UPDATE 정책 없이 안전하게 증감시키기 위한 RPC 함수.
-- Supabase 대시보드 > SQL Editor 에서 실행하세요.

create or replace function increment_post_likes(p_post_id uuid, p_delta int)
returns void
language sql
security definer
set search_path = public
as $$
  update posts set likes_count = greatest(0, likes_count + p_delta) where id = p_post_id;
$$;

create or replace function increment_post_views(p_post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update posts set views_count = views_count + 1 where id = p_post_id;
$$;

create or replace function increment_post_comments_count(p_post_id uuid, p_delta int)
returns void
language sql
security definer
set search_path = public
as $$
  update posts set comments_count = greatest(0, comments_count + p_delta) where id = p_post_id;
$$;

grant execute on function increment_post_likes(uuid, int) to anon, authenticated;
grant execute on function increment_post_views(uuid) to anon, authenticated;
grant execute on function increment_post_comments_count(uuid, int) to anon, authenticated;
