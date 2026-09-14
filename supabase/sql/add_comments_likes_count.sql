-- comments 테이블에 likes_count 컬럼 추가 (posts.likes_count와 동일한 패턴).
-- sample_comments.sql 실행 전에 먼저 적용하세요.

alter table comments
  add column if not exists likes_count integer not null default 0;
