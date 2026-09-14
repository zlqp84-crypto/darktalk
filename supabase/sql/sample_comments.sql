-- 샘플 게시글에 달리는 자연스러운 직장인 댓글 시드 데이터.
-- 먼저 add_comments_likes_count.sql 을 실행한 뒤 이 파일을 실행하세요.

-- 삼성전자 연봉협상 어떻게 하셨나요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '저도 이번에 4% 불렀는데 그냥 통과됐어요. 부서마다 편차 진짜 큰 듯',
  35,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '2 days' + interval '12 hours' + interval '54 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '삼전은 원래 개인 협상 폭이 크지 않아요 성과급이 메인이라',
  8,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '3 days' + interval '16 hours' + interval '31 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '3%로 조정된 거면 그래도 나쁘지 않은데요? 저는 그냥 0%였습니다...',
  50,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '1 days' + interval '5 hours' + interval '17 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '인상폭 줄어든 거 맞음 작년보다 확실히 짜졌어요',
  13,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '3 days' + interval '16 hours' + interval '21 minutes'
);

-- 현대차 인턴 후기 솔직하게
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '저도 현차 인턴 했었는데 딱 이 느낌 맞아요 전환 기준 진짜 애매함',
  42,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '1 days' + interval '21 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '업무량 정규직이랑 비슷하다는 거 완전 공감... 인턴인데 실무 다 시킴',
  3,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '2 days' + interval '6 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '그래도 이력서에 한 줄 들어가는 건 확실히 도움되더라고요',
  6,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '3 days' + interval '23 hours' + interval '48 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '전환 안 되면 그냥 시간 버린 느낌이라 좀 아쉬울 듯',
  14,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '2 days' + interval '15 hours' + interval '3 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '6개월이면 짧은데 그 안에 평가받는 것도 스트레스겠네요',
  26,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '2 days' + interval '18 hours' + interval '16 minutes'
);

-- LG전자 복지 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '눈치문화 어느 대기업이나 다 있는 듯... LG는 그나마 낫다고 들었는데',
  33,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '1 days' + interval '13 hours' + interval '33 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '사내 어린이집 진짜 부럽네요 저희 회사는 그런 거 꿈도 못 꿈',
  12,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '3 days' + interval '20 hours' + interval '48 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '복지 좋아도 야근 많으면 무슨 소용인가 싶기도 하고',
  7,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '3 days' + interval '10 hours' + interval '55 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '이직해서 좋다고 느끼신 거면 그래도 잘하신 선택인듯요',
  25,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '3 days' + interval '6 hours' + interval '1 minutes'
);

-- 대기업 팀장이 되고 싶다는 생각이 사라졌습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '완전 공감이요 팀장 되는 순간부터 책임만 늘어나는 구조 진짜 싫음',
  13,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '1 days' + interval '3 hours' + interval '56 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '저희 팀장님 보면 딱 이 느낌... 위에서 까이고 밑에서 치이고',
  30,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '1 days' + interval '14 hours' + interval '43 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '그래도 연봉 차이 크면 또 고민되긴 할 것 같아요 회사마다 다르니',
  5,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '3 days' + interval '14 hours' + interval '37 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '승진 포기하는 사람들 늘어나는 거 요즘 진짜 체감됨',
  49,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '1 days' + interval '1 hours' + interval '54 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '리스크만 떠안고 보상은 크지 않은 구조면 당연한 선택 같아요',
  22,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '1 days' + interval '19 hours' + interval '13 minutes'
);

-- SK하이닉스 요즘 야근 어때요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '호황기엔 다 야근 늘어요 특히 메모리쪽은 더 그런 듯',
  18,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '1 days' + interval '0 hours' + interval '8 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '저희 팀은 오히려 예전보다 워라밸 나아졌는데 부서 by 부서인 듯',
  19,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '2 days' + interval '23 hours' + interval '25 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  'HBM 라인은 진짜 바쁘다고 들었어요 친구가 거기 있는데 죽어나감',
  2,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '2 days' + interval '15 hours' + interval '24 minutes'
);

-- 중소기업 5년 다니고 느낀 점
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '넓게 일할 수 있다는 거 진짜 맞말... 대신 몸이 힘들죠',
  9,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '3 days' + interval '10 hours' + interval '49 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '경력 인정 문제 진짜 공감됩니다 이직할 때 직급부터 깎이더라고요',
  32,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '3 days' + interval '12 hours' + interval '45 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '그래도 5년이나 다니신 거면 회사가 나쁘진 않았나봐요',
  1,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '2 days' + interval '10 hours' + interval '14 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '중소는 배우는 건 많은데 딱 그만큼 힘든 것 같아요',
  50,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '1 days' + interval '12 hours' + interval '17 minutes'
);

-- 중소기업 연봉 협상 팁 공유
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '높게 부르는 거 진짜 중요한 듯 처음에 낮게 부르면 그대로 굳어짐',
  48,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '3 days' + interval '14 hours' + interval '5 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '저도 이 방법으로 협상해서 생각보다 잘 받았어요 감사합니다',
  5,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '2 days' + interval '14 hours' + interval '7 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '밴드 없는 게 장점이자 단점이네요 운 나쁘면 그냥 후려침 당함',
  40,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '3 days' + interval '16 hours' + interval '27 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '협상 데이터 좀 준비해가는 게 도움 많이 됐어요',
  7,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '2 days' + interval '20 hours' + interval '20 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '사장님 성향 많이 타는 것 같아요 회사마다 케바케',
  18,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '2 days' + interval '1 hours' + interval '54 minutes'
);

-- 중소기업 면접에서 물어보면 좋은 것들
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '연차 진짜 쓸 수 있는지 이거 꼭 물어봐야 함 서류상이랑 다른 곳 너무 많음',
  5,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '3 days' + interval '12 hours' + interval '4 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '솔직하게 대답 안 하면 빨간불이라는 말 100% 공감',
  2,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '2 days' + interval '10 hours' + interval '57 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '복리후생보다 실제 분위기가 더 중요한 것 같아요',
  32,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '3 days' + interval '22 hours' + interval '36 minutes'
);

-- 중소기업 대표 바뀌면 다 바뀌나요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '저 겪어봤는데 진짜 방향 확 바뀌더라고요 마음의 준비 하세요',
  12,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '2 days' + interval '11 hours' + interval '30 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '대표 바뀌고 좋아진 경우도 있어요 무조건 나쁘다곤 못함',
  50,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '1 days' + interval '2 hours' + interval '19 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '일단 지켜보시고 너무 안 맞으면 이직 준비하는 것도 방법',
  15,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '2 days' + interval '5 hours' + interval '42 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '조직문화까지 바뀌는 경우 많아서 적응 힘드실 수도',
  4,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '3 days' + interval '21 hours' + interval '15 minutes'
);

-- 매출 100억 이하 회사 복지 현실
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '4대보험만 있어도 감사한 곳도 많아요 그게 일반적이라기보단 최소치인 듯',
  13,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '2 days' + interval '18 hours' + interval '38 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '식대 현금으로 주는 거 나쁘지 않은데요 저희는 그것도 없음',
  2,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '3 days' + interval '22 hours' + interval '10 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '처음 취업이시면 다른 곳도 좀 알아보시고 비교해보세요',
  13,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '1 days' + interval '4 hours' + interval '27 minutes'
);

-- 스타트업 스톡옵션 실제로 받은 분 계신가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '받아봤는데 회사 안 망해야 의미 있는 거라 그냥 보너스 정도로 생각하세요',
  10,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '3 days' + interval '6 hours' + interval '3 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '계약서에 행사가격이랑 베스팅 기간 명시 안 되어 있으면 의심하셔야 해요',
  1,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '2 days' + interval '1 hours' + interval '49 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '구두로만 약속한 거면 십중팔구 흐지부지됩니다 경험담',
  10,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '3 days' + interval '1 hours' + interval '42 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '상장 안 하면 휴지조각... 큰 기대는 안 하는 게 정신건강에 좋아요',
  28,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '3 days' + interval '7 hours' + interval '22 minutes'
);

-- 시리즈 A 받은 스타트업 입사해도 될까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '시리즈 A는 아직 초기예요 안정됐다고 보기엔 이름',
  34,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '2 days' + interval '16 hours' + interval '43 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '런웨이 얼마나 남았는지 물어보세요 그게 제일 중요함',
  40,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '2 days' + interval '7 hours' + interval '36 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '투자 분위기 안 좋을 때 시리즈 A 받은 거면 그래도 나쁘지 않은 신호',
  4,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '3 days' + interval '9 hours' + interval '3 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '대표 이력이랑 투자사 어디인지도 같이 보시는 게 좋아요',
  45,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '3 days' + interval '13 hours' + interval '34 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '저는 시리즈 A에서 시작해서 지금 시리즈 C까지 왔어요 잘 크는 곳도 있음',
  3,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '3 days' + interval '20 hours' + interval '51 minutes'
);

-- 스타트업에서 1년 만에 팀장됐습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '빠른 성장의 그림자죠... 축하드리면서도 고생 많으실 것 같아요',
  24,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '2 days' + interval '9 hours' + interval '2 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '경험 없이 팀장 하는 거 진짜 힘든데 그만큼 빨리 배우기도 해요',
  34,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '3 days' + interval '14 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '주변에 물어볼 선배가 없다는 게 제일 힘든 부분 아닐까요',
  29,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '2 days' + interval '0 hours' + interval '49 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '1년차에 팀장이면 나중에 이력서에 확실히 도움될듯',
  1,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '1 days' + interval '3 hours' + interval '10 minutes'
);

-- 스타트업 갑작스러운 구조조정 경험담
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '고생 많으셨어요... 저도 비슷한 일 겪어봐서 그 심정 압니다',
  9,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '1 days' + interval '16 hours' + interval '4 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '법적으로 해고예고수당은 받으셔야 해요 안 주면 노동청 가세요',
  1,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '3 days' + interval '3 hours' + interval '10 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '스타트업 특성상 흔한 일이긴 한데 그래도 갑자기는 너무하네요',
  18,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '1 days' + interval '20 hours' + interval '44 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '실업급여 신청은 하셨나요? 일단 그것부터 챙기세요',
  32,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '2 days' + interval '16 hours' + interval '22 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '위로가 될진 모르겠지만 좋은 곳으로 곧 가실 거예요',
  1,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '3 days' + interval '15 hours' + interval '24 minutes'
);

-- 스타트업 창업자 마인드셋이 싫어요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '주인의식 강요하면서 지분은 안 주는 곳 진짜 많죠',
  26,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '1 days' + interval '0 hours' + interval '21 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '그 회사 대표만의 문제가 아니라 스타트업 업계 전반적인 병폐인듯',
  20,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '1 days' + interval '17 hours' + interval '41 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '시장가보다 낮으면 그냥 나가는 게 맞아요 주인의식은 지분 받고 나서',
  37,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '1 days' + interval '6 hours' + interval '25 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '저도 딱 이런 곳 다니다 나왔어요 이직하고 나서 마음이 편해짐',
  23,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '1 days' + interval '15 hours' + interval '51 minutes'
);

-- 직장인 여행 어디로 가세요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '다낭이나 나트랑 가성비 최고예요 직항도 많고',
  6,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '3 days' + interval '2 hours' + interval '41 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '저는 국내 강릉 자주 가요 비행기 값 아끼고 싶을 때',
  16,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '3 days' + interval '12 hours' + interval '44 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '연차 붙여서 유럽 한 번 가보세요 인생샷 건집니다',
  4,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '2 days' + interval '16 hours' + interval '57 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '가까운 오사카도 나쁘지 않아요 2박3일로 딱 좋음',
  18,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '1 days' + interval '12 hours' + interval '18 minutes'
);

-- 직장인이 보는 드라마 추천
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '미생 다시 보고 있어요 직장인이면 공감 100배',
  14,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '1 days' + interval '14 hours' + interval '10 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '나 혼자 산다 보면서 힐링해요 예능이 스트레스 덜 받는듯',
  24,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '2 days' + interval '10 hours' + interval '14 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '최근엔 오피스 누아르 장르가 재밌더라고요',
  37,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '2 days' + interval '2 hours' + interval '38 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '출퇴근길엔 그냥 유튜브 짧은 거 보는게 편해요 드라마는 집중이 안됨',
  44,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '3 days' + interval '1 hours' + interval '51 minutes'
);

-- 30대 초반 직장인 재테크 시작법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '일단 예적금부터 시작해서 종잣돈 만드는 게 우선이에요',
  5,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '3 days' + interval '15 hours' + interval '23 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '저는 ETF 적립식으로 시작했어요 개별주보다 마음 편함',
  13,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '3 days' + interval '14 hours' + interval '58 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '재테크 책 몇 권 읽어보시고 시작하세요 무작정 하면 손해봄',
  42,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '2 days' + interval '10 hours' + interval '56 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '청약통장부터 만드세요 이거 진짜 기본입니다',
  49,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '2 days' + interval '1 hours' + interval '38 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '너무 조급해하지 마시고 소액으로 경험 쌓는 게 먼저예요',
  5,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '1 days' + interval '3 hours' + interval '37 minutes'
);

-- 직장인 점심 추천 (혼자 먹기 좋은)
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '편의점 도시락도 요즘 퀄리티 좋아요 부담없이 혼밥하기 좋음',
  27,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '3 days' + interval '6 hours' + interval '39 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '일본식 정식집 카운터 자리 있는 곳 가면 편해요',
  10,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '3 days' + interval '13 hours' + interval '12 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '저는 그냥 샐러드 배달시켜서 자리에서 먹어요',
  38,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '2 days' + interval '14 hours' + interval '37 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '혼밥 식당 많아지는 추세라 요즘은 눈치 안 봐도 되더라고요',
  7,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '3 days' + interval '21 hours' + interval '57 minutes'
);

-- 직장 다니면서 사이드 프로젝트 하시는 분
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '저는 주말에 외주 좀 받아서 하는데 수익은 크진 않아도 재밌어요',
  7,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '3 days' + interval '4 hours' + interval '58 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '블로그 애드센스 하고 있는데 용돈벌이 정도예요',
  2,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '3 days' + interval '9 hours' + interval '15 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '본업에 지장 없는 선에서 하는 게 제일 중요한 것 같아요',
  17,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '1 days' + interval '12 hours' + interval '55 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '사이드로 시작한 게 커져서 결국 퇴사하고 창업한 케이스도 봤어요',
  16,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '2 days' + interval '7 hours' + interval '24 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '체력 관리가 관건이에요 저는 번아웃 와서 잠깐 쉬는 중',
  37,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '1 days' + interval '9 hours' + interval '15 minutes'
);

-- 프리랜서 시작 1년 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '1년차 불안감 진짜 공감돼요 저도 아직도 그래요 2년차인데',
  15,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '3 days' + interval '21 hours' + interval '11 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '수입 늘어난 것만으로도 성공적인 시작 아닌가요',
  10,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '1 days' + interval '5 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '다음 프로젝트 걱정은 프리랜서 숙명인 듯... 파이프라인 여러 개 만드세요',
  20,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '1 days' + interval '23 hours' + interval '15 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '저축 좀 해두시면 불안감 그나마 덜해요 비상금 3개월치는 필수',
  30,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '3 days' + interval '15 hours' + interval '21 minutes'
);

-- 프리랜서 세금 신고 어떻게 하세요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '세무사 쓰는 거 강추해요 처음엔 특히 더',
  7,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '3 days' + interval '5 hours' + interval '40 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '홈택스로 직접 해봤는데 생각보다 어렵진 않아요 유튜브 보고 따라했어요',
  41,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '3 days' + interval '13 hours' + interval '1 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '경비처리 꼼꼼히 하셔야 세금 덜 나가요 영수증 챙기세요',
  44,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '1 days' + interval '4 hours' + interval '49 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '종소세 첫해는 세무사한테 맡기고 다음부터 직접 해도 될듯',
  33,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '1 days' + interval '23 hours' + interval '20 minutes'
);

-- 프리랜서 단가 협상 어떻게 하시나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '낮은 단가는 그냥 거절하는 게 맞아요 한 번 낮추면 계속 낮춤',
  23,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '2 days' + interval '8 hours' + interval '21 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '포트폴리오 보여주면서 근거 있게 협상하면 잘 먹히더라고요',
  3,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '1 days' + interval '22 hours' + interval '48 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '다른 곳도 알아보고 있다고 살짝 흘리는 것도 방법이에요',
  38,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '2 days' + interval '7 hours' + interval '11 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '시장 단가 리서치 먼저 하고 협상 들어가세요',
  44,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '2 days' + interval '15 hours' + interval '45 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '저자세로 가면 계속 낮게 취급받아요 자신감 있게 부르세요',
  25,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '2 days' + interval '21 hours' + interval '58 minutes'
);

-- 프리랜서 국민연금 안 내도 되나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '지역가입자는 소득 없다고 증빙하면 줄일 수 있어요 민원 넣어보세요',
  16,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '3 days' + interval '3 hours' + interval '2 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '저도 매달 아까운데 나중에 연금 받는 거 생각하면 그냥 내고 있어요',
  39,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '1 days' + interval '9 hours' + interval '4 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '소득 신고 전이면 최저 등급으로 조정 가능해요',
  40,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '2 days' + interval '20 hours' + interval '51 minutes'
);

-- 클라이언트가 갑자기 계약 파기했어요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '계약서 있으면 위약금 청구 가능해요 내용증명 먼저 보내세요',
  48,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '3 days' + interval '0 hours' + interval '20 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '저도 비슷한 일 당해서 소액소송 걸었어요 시간 걸리지만 이겼습니다',
  24,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '3 days' + interval '6 hours' + interval '53 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '다음부턴 계약금 미리 받으세요 이런 일 방지하는 제일 좋은 방법',
  33,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '2 days' + interval '10 hours' + interval '0 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '법률 상담 한 번 받아보시는 걸 추천드려요 무료 상담도 많아요',
  39,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '3 days' + interval '9 hours' + interval '40 minutes'
);

-- 연봉 실수령액 계산 방법 정리해드려요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '이거 진짜 유용하네요 저장해뒀습니다',
  29,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '3 days' + interval '2 hours' + interval '24 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '4대보험 비율 회사마다 조금씩 다르지 않나요?',
  47,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '3 days' + interval '7 hours' + interval '5 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '부양가족 있으면 좀 더 달라지는데 그 부분도 궁금하네요',
  5,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '3 days' + interval '19 hours' + interval '40 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '실수령액 보면 항상 현타옴... 세금이 이렇게 많이 나가다니',
  47,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '2 days' + interval '7 hours' + interval '54 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '3000만원대도 한 번 계산해주실 수 있나요',
  13,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '3 days' + interval '16 hours' + interval '20 minutes'
);

-- 연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '복지 좋은 곳이 장기적으론 나을 수도 있어요 식대 교통비 다 더하면',
  37,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '2 days' + interval '2 hours' + interval '35 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '그냥 현금이 최고예요 복지는 변할 수 있지만 연봉은 그대로 남음',
  46,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '3 days' + interval '9 hours' + interval '3 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '복지 종류 나름인데 식대 교통비면 거의 200 차이날 수도 있어요',
  43,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '3 days' + interval '7 hours' + interval '59 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '저라면 그냥 연봉 높은 곳 갈 듯 복지는 잘 안 써지더라고요',
  10,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '2 days' + interval '10 hours' + interval '30 minutes'
);

-- 포괄임금제 야근 수당 없는 게 맞나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '포괄임금이라도 최저임금 미달이면 불법이에요 계산해보세요',
  22,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '1 days' + interval '22 hours' + interval '17 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '이거 불법인 경우 많아요 노동청 상담 한번 받아보세요',
  35,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '1 days' + interval '22 hours' + interval '56 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '저희 회사도 포괄임금인데 야근 거의 없어서 그냥 다녀요',
  43,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '2 days' + interval '10 hours' + interval '31 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '고정 OT 시간 넘으면 추가수당 줘야 하는 게 맞습니다',
  4,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '2 days' + interval '4 hours' + interval '27 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '포괄임금제 자체는 합법인데 악용하는 회사가 문제인 거죠',
  10,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '2 days' + interval '10 hours' + interval '8 minutes'
);

-- 연봉 협상 매년 하는 건가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '회사마다 달라요 저희는 매년 고과 반영해서 자동으로 오름',
  5,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '2 days' + interval '7 hours' + interval '14 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '협상이라기보단 통보인 곳이 대부분 아닐까요',
  12,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '1 days' + interval '20 hours' + interval '0 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '이직 아니면 협상력 거의 없다고 보시면 돼요',
  23,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '3 days' + interval '10 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '매년 하는 척만 하고 실제론 정해진 인상률대로 가는 곳 많아요',
  46,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '3 days' + interval '18 hours' + interval '15 minutes'
);

-- 직군별 연봉 현실 공유 (IT 개발자)
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '저는 백엔드 4년차 스타트업인데 6500 받아요 비슷한 것 같네요',
  33,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '3 days' + interval '18 hours' + interval '32 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  'ML쪽은 확실히 높긴 하네요 부럽습니다',
  43,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '2 days' + interval '21 hours' + interval '45 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '프론트엔드는 좀 더 낮은 편인 것 같아요 직군별 차이가 꽤 큼',
  14,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '3 days' + interval '6 hours' + interval '11 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '대기업 8000이면 낮은 편 아닌가요 스톡옵션 없으면 더더욱',
  9,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '1 days' + interval '22 hours' + interval '55 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '저도 공유합니다 QA 3년차 5000 받고 있어요',
  10,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '2 days' + interval '0 hours' + interval '27 minutes'
);

-- 직장 상사가 저만 싫어하는 것 같아요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '저도 똑같은 경험 있어요 나중에 알고보니 그냥 그 상사 성향이었어요',
  36,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '3 days' + interval '20 hours' + interval '46 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '혹시 예전에 실수한 거 있는지 곰곰히 생각해보세요 계기가 있을 수도',
  46,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '1 days' + interval '4 hours' + interval '4 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '너무 신경쓰지 마세요 모두에게 사랑받을 필요는 없어요',
  44,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '3 days' + interval '9 hours' + interval '55 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '1:1로 조심스럽게 여쭤보는 것도 방법일 수 있어요',
  1,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '2 days' + interval '8 hours' + interval '54 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '다른 팀원한테 넌지시 물어보세요 객관적인 시선이 도움될 수도',
  41,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '3 days' + interval '18 hours' + interval '46 minutes'
);

-- 회식 문화 없애고 싶은데 방법이 있나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '팀장님한테 직접 얘기하기 부담되면 익명 설문 돌려보세요',
  36,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '2 days' + interval '11 hours' + interval '35 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '요즘은 회식 대신 점심 회식으로 바꾸는 곳도 많더라고요',
  39,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '2 days' + interval '18 hours' + interval '57 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '혼자 말 꺼내기 힘들면 동료 몇 명이랑 같이 얘기해보세요',
  10,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '3 days' + interval '21 hours' + interval '50 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '저희 팀은 자율 참석으로 바꾸고 나서 훨씬 편해졌어요',
  28,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '2 days' + interval '8 hours' + interval '57 minutes'
);

-- 칼퇴하는데 눈치 안 보이는 법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '그냥 인사하고 나가세요 눈치 보는 것부터가 지는 겁니다',
  48,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '3 days' + interval '2 hours' + interval '21 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '일 다 끝냈으면 당당하게 나가도 돼요 눈치 주는 사람이 이상한 거예요',
  11,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '1 days' + interval '15 hours' + interval '1 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '저는 이어폰 끼고 칼같이 나갑니다 신경 안 써요',
  31,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '3 days' + interval '9 hours' + interval '57 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '처음이 어렵지 습관 들이면 아무도 신경 안 써요',
  25,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '1 days' + interval '10 hours' + interval '15 minutes'
);

-- 직장 내 괴롭힘 신고하면 어떻게 되나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '증거 자료부터 모으세요 녹음이든 메시지든 최대한 많이',
  11,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '3 days' + interval '3 hours' + interval '25 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '노동청에 신고하시면 조사 들어가요 혼자 참지 마세요',
  31,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '1 days' + interval '19 hours' + interval '37 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '저도 신고했었는데 보호는 받았어요 다만 시간이 좀 걸립니다',
  6,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '3 days' + interval '12 hours' + interval '53 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '회사 내 신고보다 외부 기관이 더 확실해요',
  38,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '1 days' + interval '16 hours' + interval '45 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '언어폭력이면 녹취 증거가 제일 중요해요 꼭 남겨두세요',
  30,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '2 days' + interval '12 hours' + interval '34 minutes'
);

-- 점심 혼밥 어떻게 생각하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '요즘은 혼밥 이상하게 보는 사람 거의 없어요 편하게 하세요',
  37,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '3 days' + interval '8 hours' + interval '37 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '처음엔 눈치 보였는데 하다보니 오히려 이 시간이 제일 힐링돼요',
  38,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '2 days' + interval '8 hours' + interval '17 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '같이 먹자고 안 하면 그냥 혼자 드세요 전혀 이상한 거 아니에요',
  24,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '2 days' + interval '6 hours' + interval '12 minutes'
);

-- 취업 준비 2년만에 대기업 합격했습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '축하드려요!! 68번이라니 진짜 대단하시네요',
  9,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '1 days' + interval '10 hours' + interval '5 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '포기 안 하신 게 대단해요 저도 힘내야겠어요',
  48,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '3 days' + interval '21 hours' + interval '27 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '혹시 자소서나 면접 팁 좀 공유해주실 수 있나요',
  14,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '1 days' + interval '18 hours' + interval '33 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '저도 지금 30번 넘게 떨어지고 있는데 희망이 생기네요',
  26,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '2 days' + interval '18 hours' + interval '19 minutes'
);

-- 이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '정확한 숫자보다 범위로 말하는 게 안전해요',
  35,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '3 days' + interval '9 hours' + interval '30 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '너무 낮게 말하면 나중에 협상할 때 불리해져요 살짝 올려 말하세요',
  10,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '2 days' + interval '17 hours' + interval '31 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '요즘은 이 질문 자체가 불법인 나라도 있던데 한국은 아직인가봐요',
  35,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '1 days' + interval '23 hours' + interval '8 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '그냥 솔직하게 말하고 대신 희망 연봉을 확실히 어필하세요',
  4,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '2 days' + interval '19 hours' + interval '40 minutes'
);

-- 이직 준비 중 현 직장 눈치 어떻게 하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '반차 여러 번 쪼개서 쓰세요 하루 통으로 쓰면 티 남',
  27,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '2 days' + interval '3 hours' + interval '32 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '병원 간다고 하고 반차 쓰는 게 제일 무난해요',
  26,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '3 days' + interval '10 hours' + interval '15 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '너무 자주 쓰면 티 나니까 면접 몰아서 잡는 것도 방법이에요',
  12,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '1 days' + interval '15 hours' + interval '47 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '걸려도 어쩔 수 없죠 이직은 원래 눈치 보면서 하는 겁니다',
  46,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '3 days' + interval '5 hours' + interval '49 minutes'
);

-- 경력직 이직 시 레퍼런스 체크 두렵습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '요즘은 레퍼런스 체크 형식적인 곳도 많아요 너무 걱정 마세요',
  48,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '1 days' + interval '6 hours' + interval '41 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '친했던 동료 연락처를 레퍼런스로 제출하는 방법도 있어요',
  2,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '1 days' + interval '0 hours' + interval '40 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '저도 사이 안 좋은 상사 있었는데 그냥 다른 팀 사람으로 냈어요',
  2,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '1 days' + interval '15 hours' + interval '1 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '솔직히 그 상사가 나쁘게 말해도 회사에서 다 믿진 않아요',
  24,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '2 days' + interval '7 hours' + interval '7 minutes'
);

-- 자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '첨삭 서비스 효과 있었어요 저도 받고 나서 합격률 올라감',
  42,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '3 days' + interval '17 hours' + interval '27 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '직무 관련 키워드 잘 들어갔는지 확인해보세요 ATS 필터링 있을 수도',
  38,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '3 days' + interval '11 hours' + interval '15 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '스펙보다 직무 적합성을 더 보는 것 같아요 자소서 방향 점검해보세요',
  10,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '2 days' + interval '2 hours' + interval '58 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '친구나 선배한테 한번 봐달라고 하세요 객관적 피드백이 도움돼요',
  23,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '1 days' + interval '1 hours' + interval '36 minutes'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '탈락 사유는 회사도 잘 안 알려줘서 답답하시겠어요 힘내세요',
  28,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '1 days' + interval '20 hours' + interval '19 minutes'
);
