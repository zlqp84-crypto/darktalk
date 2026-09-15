-- 댓글이 달려있지 않은 게시글(312개)을 전부 삭제하고,
-- 댓글이 있는 게시글(80개)만 남깁니다.
-- 실행 전 총 게시글 수 확인: select count(*) from posts; (392가 나와야 정상)

delete from posts
where id not in (select distinct post_id from comments);

-- 실행 후 확인용:
-- select count(*) from posts;   -> 80이 나와야 정상
