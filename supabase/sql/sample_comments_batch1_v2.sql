-- 1차 배치(sample_comments.sql) 40개 글의 댓글을 장문/단문/반박/공감이 섞인
-- 버전으로 교체하는 스크립트. 2차(리서치) 배치가 달린 다른 40개 글은 건드리지 않음.

-- 1) 이 40개 글에 달린 기존 댓글만 삭제 (다른 글의 댓글은 안전함)
delete from comments where post_id in (
  select id from posts where title in (
    '삼성전자 연봉협상 어떻게 하셨나요?',
    '현대차 인턴 후기 솔직하게',
    'LG전자 복지 솔직 후기',
    '대기업 팀장이 되고 싶다는 생각이 사라졌습니다',
    'SK하이닉스 요즘 야근 어때요?',
    '중소기업 5년 다니고 느낀 점',
    '중소기업 연봉 협상 팁 공유',
    '중소기업 면접에서 물어보면 좋은 것들',
    '중소기업 대표 바뀌면 다 바뀌나요?',
    '매출 100억 이하 회사 복지 현실',
    '스타트업 스톡옵션 실제로 받은 분 계신가요',
    '시리즈 A 받은 스타트업 입사해도 될까요',
    '스타트업에서 1년 만에 팀장됐습니다',
    '스타트업 갑작스러운 구조조정 경험담',
    '스타트업 창업자 마인드셋이 싫어요',
    '직장인 여행 어디로 가세요?',
    '직장인이 보는 드라마 추천',
    '30대 초반 직장인 재테크 시작법',
    '직장인 점심 추천 (혼자 먹기 좋은)',
    '직장 다니면서 사이드 프로젝트 하시는 분',
    '프리랜서 시작 1년 솔직 후기',
    '프리랜서 세금 신고 어떻게 하세요?',
    '프리랜서 단가 협상 어떻게 하시나요',
    '프리랜서 국민연금 안 내도 되나요',
    '클라이언트가 갑자기 계약 파기했어요',
    '연봉 실수령액 계산 방법 정리해드려요',
    '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요',
    '포괄임금제 야근 수당 없는 게 맞나요',
    '연봉 협상 매년 하는 건가요',
    '직군별 연봉 현실 공유 (IT 개발자)',
    '직장 상사가 저만 싫어하는 것 같아요',
    '회식 문화 없애고 싶은데 방법이 있나요',
    '칼퇴하는데 눈치 안 보이는 법',
    '직장 내 괴롭힘 신고하면 어떻게 되나요',
    '점심 혼밥 어떻게 생각하세요',
    '취업 준비 2년만에 대기업 합격했습니다',
    '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요',
    '이직 준비 중 현 직장 눈치 어떻게 하세요',
    '경력직 이직 시 레퍼런스 체크 두렵습니다',
    '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요'
  )
);

-- 2) 새 댓글 삽입

-- 삼성전자 연봉협상 어떻게 하셨나요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '저도 이번에 협상 시도해봤는데요, 처음엔 회사에서 3% 얘기하길래 그냥 받아들일까 하다가 동종업계 이직 오퍼 얘기를 슬쩍 꺼냈더니 팀장이 잠깐 나갔다 오더니 4.5%로 조정해주더라고요. 사실 큰 걸 바란 것도 아니었는데 그것만으로도 태도가 달라지는 게 신기했어요. 다들 협상 자체를 두려워하시는데 해봐서 손해볼 건 없는 것 같아요',
  5,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '4 days' + interval '17 hours' + interval '15 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '3%로 조정됐다는 것도 나쁘지 않아 보이는데요 저는 그냥 통보받고 끝났어요 ㅠㅠ',
  25,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '3 days' + interval '17 hours' + interval '11 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '인상폭 줄었다고는 하는데 삼전 정도면 그래도 업계 상위권 아닌가요 너무 비관적으로 볼 건 아닌 듯',
  3,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '2 days' + interval '7 hours' + interval '29 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1),
  null,
  '부서마다 편차 크다는 거 진짜 공감돼요 옆팀은 저랑 똑같은 연차인데 훨씬 더 받더라고요',
  37,
  (select created_at from posts where title = '삼성전자 연봉협상 어떻게 하셨나요?' limit 1) + interval '4 days' + interval '18 hours' + interval '10 minutes' + interval '2 seconds'
);

-- 현대차 인턴 후기 솔직하게
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '저도 작년에 현차 인턴 했었는데 글쓴이분이랑 정말 비슷한 경험이었어요. 처음엔 그냥 보조 업무만 할 줄 알았는데 실제로는 프로젝트 하나를 거의 담당해서 진행했어요. 배우는 건 확실히 많았는데 그만큼 평가 부담도 커서 스트레스도 상당했습니다. 전환 안 됐을 때 그 허탈함은 겪어본 사람만 알 것 같아요',
  24,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '3 days' + interval '13 hours' + interval '1 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '6개월 안에 평가받는다는 게 진짜 부담이겠어요 응원합니다',
  32,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '3 days' + interval '20 hours' + interval '22 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '그래도 이력서 한 줄은 확실한 자산이에요 전환 안 됐다고 시간 버린 건 아니라고 생각해요',
  43,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '1 days' + interval '13 hours' + interval '4 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '현대차 인턴 후기 솔직하게' limit 1),
  null,
  '인턴인데 실무 다 시킨다는 거 어느 대기업이나 다 그런 듯 ㅋㅋ',
  49,
  (select created_at from posts where title = '현대차 인턴 후기 솔직하게' limit 1) + interval '0 days' + interval '19 hours' + interval '6 minutes' + interval '2 seconds'
);

-- LG전자 복지 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '저도 다른 회사 다니다가 LG로 이직했는데 복지 얘기는 정말 공감돼요. 특히 육아휴직 눈치 안 보고 쓸 수 있는 분위기가 제일 좋았습니다. 다만 말씀하신 것처럼 여전히 보이지 않는 위계질서 같은 게 있어서 적응하는 데 시간이 좀 걸렸어요. 그래도 종합적으로는 만족스러운 선택이었다고 생각해요',
  10,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '1 days' + interval '1 hours' + interval '55 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '눈치문화 어느 대기업이나 있는 것 같아요 정도 차이일 뿐',
  5,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '2 days' + interval '9 hours' + interval '7 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '복지 좋으면 그걸로 충분한 거 아닌가요 눈치 문화 없는 회사가 어딨어요',
  9,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '0 days' + interval '11 hours' + interval '28 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'LG전자 복지 솔직 후기' limit 1),
  null,
  '사내 어린이집 있는 곳 진짜 부러워요 저희 회사는 꿈도 못 꿈',
  12,
  (select created_at from posts where title = 'LG전자 복지 솔직 후기' limit 1) + interval '1 days' + interval '12 hours' + interval '1 minutes' + interval '2 seconds'
);

-- 대기업 팀장이 되고 싶다는 생각이 사라졌습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '저희 팀장님 보면 정말 공감가는 글이에요. 실적 압박은 위에서 오고, 팀원 관리랑 감정노동은 밑에서 오고, 그 사이에서 계속 눌리는 느낌이더라고요. 연봉 차이도 생각보다 크지 않아서 왜 저러고 계신가 싶을 때도 있어요. 저는 승진 욕심 접은 지 오래됐습니다',
  9,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '2 days' + interval '8 hours' + interval '20 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '승진 포기하는 사람들 요즘 진짜 많아진 것 같아요 저도 그중 하나예요',
  16,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '4 days' + interval '19 hours' + interval '7 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '그래도 회사마다 다를 것 같아요 저희 팀장님은 오히려 여유 있어 보이시던데',
  29,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '4 days' + interval '19 hours' + interval '54 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1),
  null,
  '리스크는 커지는데 보상은 그대로면 당연한 선택이죠',
  6,
  (select created_at from posts where title = '대기업 팀장이 되고 싶다는 생각이 사라졌습니다' limit 1) + interval '1 days' + interval '14 hours' + interval '24 minutes' + interval '2 seconds'
);

-- SK하이닉스 요즘 야근 어때요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '친구가 하이닉스 다니는데 요즘 HBM 관련 부서는 정말 바쁘다고 하더라고요. 반면 다른 부서는 예전보다 오히려 여유로워졌다고 들었어요. 호황기라고 무조건 다 바빠지는 게 아니라 담당 라인에 따라 완전히 갈리는 것 같습니다. 이직 고려하신다면 어느 부서인지가 진짜 중요할 것 같아요',
  47,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '0 days' + interval '16 hours' + interval '17 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '호황기엔 특정 라인 위주로 야근 몰리는 거 맞는 것 같아요',
  33,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '3 days' + interval '22 hours' + interval '47 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '요즘 반도체 업계 전반적으로 바쁜 걸로 아는데 부서마다 다르다는 말은 좀 의외네요',
  30,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '0 days' + interval '18 hours' + interval '45 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1),
  null,
  '메모리쪽은 확실히 바쁘다는 얘기 많이 들려요',
  1,
  (select created_at from posts where title = 'SK하이닉스 요즘 야근 어때요?' limit 1) + interval '4 days' + interval '20 hours' + interval '45 minutes' + interval '2 seconds'
);

-- 중소기업 5년 다니고 느낀 점
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '저도 중소기업에서 4년 넘게 일하다가 최근에 이직 준비 중인데 딱 공감되는 내용이네요. 여러 업무를 동시에 처리하다 보니 확실히 배우는 폭은 넓었는데, 막상 이직 시장에 나가보니 경력 인정을 온전히 못 받는 느낌이 들어서 속상했습니다. 그래도 이 경험 자체가 나쁘진 않았다고 생각해요',
  2,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '4 days' + interval '17 hours' + interval '10 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '경력 인정 문제 진짜 공감돼요 직급부터 깎이는 경우 흔하죠',
  3,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '1 days' + interval '17 hours' + interval '15 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '중소가 무조건 손해라고 보긴 어려운 것 같아요 배운 게 많다면 그것도 자산이죠',
  11,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '4 days' + interval '22 hours' + interval '46 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 5년 다니고 느낀 점' limit 1),
  null,
  '5년이나 다니셨으면 나쁘지 않은 회사였나봐요',
  21,
  (select created_at from posts where title = '중소기업 5년 다니고 느낀 점' limit 1) + interval '0 days' + interval '10 hours' + interval '5 minutes' + interval '2 seconds'
);

-- 중소기업 연봉 협상 팁 공유
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '저도 이 방법대로 해봤는데 확실히 효과 있었어요. 처음 제시받은 금액에서 시장 평균 자료를 조금 준비해가서 근거 있게 얘기했더니 생각보다 순순히 올려주시더라고요. 중소기업은 밴드가 없다 보니 오히려 준비만 잘하면 협상 여지가 더 큰 것 같습니다',
  40,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '1 days' + interval '13 hours' + interval '59 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '높게 부르는 게 중요하다는 말 진짜 맞아요 처음이 기준이 되더라고요',
  9,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '2 days' + interval '20 hours' + interval '20 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '사장님 성향 많이 타서 이 방법이 항상 통하진 않을 것 같아요',
  32,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '3 days' + interval '14 hours' + interval '1 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 연봉 협상 팁 공유' limit 1),
  null,
  '협상 데이터 준비하는 게 핵심인 것 같네요 저장해둘게요',
  15,
  (select created_at from posts where title = '중소기업 연봉 협상 팁 공유' limit 1) + interval '3 days' + interval '14 hours' + interval '40 minutes' + interval '2 seconds'
);

-- 중소기업 면접에서 물어보면 좋은 것들
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '저도 이직할 때 이 질문들 다 물어봤는데 반응 보는 것만으로도 회사 분위기가 대충 보이더라고요. 특히 연차 관련 질문에 얼버무리면 거의 백퍼센트 문제 있는 회사였어요. 면접에서 직접 물어보는 게 부담스러워도 나중을 위해선 꼭 필요한 과정인 것 같습니다',
  29,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '2 days' + interval '12 hours' + interval '42 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '솔직하게 대답 안 하면 빨간불이라는 거 정말 공감돼요',
  29,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '2 days' + interval '15 hours' + interval '43 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '질문 많이 한다고 다 걸러지는 것도 아니더라고요 입사해봐야 아는 것도 있음',
  41,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '3 days' + interval '14 hours' + interval '53 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1),
  null,
  '복리후생보다 분위기가 더 중요하다는 말 백번 맞는 것 같아요',
  46,
  (select created_at from posts where title = '중소기업 면접에서 물어보면 좋은 것들' limit 1) + interval '1 days' + interval '23 hours' + interval '31 minutes' + interval '2 seconds'
);

-- 중소기업 대표 바뀌면 다 바뀌나요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '저도 재직 중에 대표가 바뀌는 걸 겪어봤는데 정말 방향이 확 달라지더라고요. 새 대표님이 오시고 나서 기존에 하던 프로젝트들이 다 재검토되고, 조직개편도 몇 번 있었어요. 다행히 저는 잘 적응했지만 안 맞아서 나가신 분들도 꽤 있었습니다. 마음의 준비는 하시는 게 좋을 것 같아요',
  32,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '2 days' + interval '4 hours' + interval '59 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '저도 겪어봤는데 진짜 많이 바뀌더라고요',
  36,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '3 days' + interval '16 hours' + interval '16 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '꼭 나쁜 쪽으로만 바뀌는 건 아니에요 저는 오히려 좋아진 케이스라',
  14,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '0 days' + interval '13 hours' + interval '37 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1),
  null,
  '일단 지켜보고 판단하는 게 맞는 것 같아요',
  48,
  (select created_at from posts where title = '중소기업 대표 바뀌면 다 바뀌나요?' limit 1) + interval '1 days' + interval '4 hours' + interval '30 minutes' + interval '2 seconds'
);

-- 매출 100억 이하 회사 복지 현실
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '저도 비슷한 규모 회사 다니고 있는데 4대보험 외에는 딱히 복지랄 게 없어요. 식대도 카드로 나오긴 하는데 한도가 낮아서 크게 체감은 안 되고요. 처음 취업하시는 거면 이게 표준이라고 생각하지 마시고 여러 회사 조건을 좀 더 비교해보시는 걸 추천드려요',
  17,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '3 days' + interval '21 hours' + interval '22 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '4대보험만 있어도 감사한 곳 많다는 말 진짜예요',
  6,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '4 days' + interval '3 hours' + interval '15 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '식대 현금으로 주는 거면 나쁘지 않은 편 아닌가요 저희는 그것도 없어요',
  38,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '0 days' + interval '1 hours' + interval '50 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '매출 100억 이하 회사 복지 현실' limit 1),
  null,
  '규모 작을수록 복지 기대는 낮추는 게 마음 편해요',
  39,
  (select created_at from posts where title = '매출 100억 이하 회사 복지 현실' limit 1) + interval '1 days' + interval '23 hours' + interval '33 minutes' + interval '2 seconds'
);

-- 스타트업 스톡옵션 실제로 받은 분 계신가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '저 스톡옵션 받아봤는데 결론부터 말하면 회사가 잘 안 되면 그냥 종이쪼가리예요. 행사가격이랑 베스팅 기간이 계약서에 명확히 안 적혀있으면 더 의심하셔야 하고요. 구두로만 약속받은 경우엔 나중에 흐지부지되는 경우를 여러 번 봤습니다. 스톡옵션은 보너스 개념으로만 생각하시는 게 정신건강에 좋아요',
  49,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '4 days' + interval '18 hours' + interval '2 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '구두 약속은 진짜 믿으면 안 되는 것 같아요',
  9,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '3 days' + interval '1 hours' + interval '38 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '그래도 상장 성공하면 인생 바뀌는 케이스도 있으니 너무 비관적으로만 볼 필요는 없을 듯',
  29,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '3 days' + interval '19 hours' + interval '9 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1),
  null,
  '행사가격 명시 안 되어있으면 위험 신호 맞아요',
  35,
  (select created_at from posts where title = '스타트업 스톡옵션 실제로 받은 분 계신가요' limit 1) + interval '1 days' + interval '21 hours' + interval '16 minutes' + interval '2 seconds'
);

-- 시리즈 A 받은 스타트업 입사해도 될까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '시리즈 A는 아직 초기 단계라 안정적이라고 보긴 어려워요. 제가 예전에 시리즈 A 단계 스타트업에 들어갔었는데 1년도 안 돼서 자금 사정이 어려워지는 걸 직접 봤습니다. 입사하기 전에 런웨이가 얼마나 남았는지, 투자사가 어디인지 꼭 확인해보시길 추천드려요',
  31,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '2 days' + interval '4 hours' + interval '49 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '런웨이 확인하라는 말 진짜 중요한 것 같아요',
  16,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '1 days' + interval '9 hours' + interval '47 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '요즘같이 투자 어려운 시기에 시리즈 A 받은 거면 오히려 검증된 거 아닐까요',
  1,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '2 days' + interval '9 hours' + interval '56 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1),
  null,
  '대표 이력도 같이 보시는 게 좋아요',
  3,
  (select created_at from posts where title = '시리즈 A 받은 스타트업 입사해도 될까요' limit 1) + interval '4 days' + interval '3 hours' + interval '40 minutes' + interval '2 seconds'
);

-- 스타트업에서 1년 만에 팀장됐습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '저도 스타트업에서 입사 1년 반 만에 팀장을 맡았었는데, 그때는 그게 영광인 줄로만 알았어요. 근데 막상 해보니 경험 없이 사람 관리하는 게 정말 힘들더라고요. 물어볼 선배도 없고 혼자 시행착오를 다 겪어야 했어요. 그래도 그 경험 덕분에 지금은 확실히 성장한 느낌입니다',
  45,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '1 days' + interval '22 hours' + interval '28 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '물어볼 선배가 없다는 게 제일 힘든 부분인 것 같아요',
  27,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '4 days' + interval '11 hours' + interval '58 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '빠른 승진이 꼭 좋은 것만은 아니라고 봐요 준비 안 된 상태에서 부담만 커질 수도',
  40,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '4 days' + interval '4 hours' + interval '19 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1),
  null,
  '1년차에 팀장이면 이력서에는 확실히 도움될 것 같네요',
  15,
  (select created_at from posts where title = '스타트업에서 1년 만에 팀장됐습니다' limit 1) + interval '4 days' + interval '15 hours' + interval '22 minutes' + interval '2 seconds'
);

-- 스타트업 갑작스러운 구조조정 경험담
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '저도 작년에 비슷한 일을 겪었어요. 정말 아무 예고도 없이 금요일 오후에 통보받았습니다. 그때는 너무 당황해서 아무 생각도 안 났는데, 나중에 알아보니 해고예고수당은 꼭 받아야 하는 거더라고요. 실업급여도 바로 신청하시고, 무엇보다 본인 탓이 아니라는 것부터 기억하셨으면 좋겠어요',
  22,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '4 days' + interval '22 hours' + interval '7 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '고생 많으셨겠어요 갑작스러운 통보는 정말 힘들죠',
  26,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '3 days' + interval '21 hours' + interval '3 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '스타트업이면 어느 정도 각오는 하고 들어가는 게 맞는 것 같기도 해요',
  36,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '1 days' + interval '13 hours' + interval '5 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1),
  null,
  '해고예고수당 꼭 챙기세요 법적 권리예요',
  4,
  (select created_at from posts where title = '스타트업 갑작스러운 구조조정 경험담' limit 1) + interval '4 days' + interval '5 hours' + interval '31 minutes' + interval '2 seconds'
);

-- 스타트업 창업자 마인드셋이 싫어요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '저도 딱 이런 회사 다니다가 얼마 전에 나왔어요. 주인의식을 강조하면서 정작 지분은 전혀 나눠주지 않는 곳들이 생각보다 많더라고요. 야근은 당연시하면서 연봉은 시장가에도 못 미치고요. 나오고 나서야 그게 얼마나 이상한 구조였는지 깨달았습니다',
  20,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '2 days' + interval '8 hours' + interval '8 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '주인의식 강요하면서 지분은 안 주는 곳 진짜 많죠',
  20,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '3 days' + interval '18 hours' + interval '50 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '대표 입장에서는 회사가 자기 자식같은 거라 그런 마인드가 나올 수도 있다고 봐요',
  12,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '4 days' + interval '21 hours' + interval '33 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1),
  null,
  '시장가보다 낮으면 그냥 나가는 게 맞는 것 같아요',
  42,
  (select created_at from posts where title = '스타트업 창업자 마인드셋이 싫어요' limit 1) + interval '0 days' + interval '23 hours' + interval '14 minutes' + interval '2 seconds'
);

-- 직장인 여행 어디로 가세요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '저는 연차 3일 정도 붙여서 다낭 자주 가요. 항공권도 저렴하고 물가도 싸서 가성비가 정말 좋더라고요. 예전엔 유럽도 가봤는데 이동 시간이 길어서 오히려 피곤했던 기억이 있어요. 짧은 연차로 확실히 쉬고 싶으면 동남아가 제일 무난한 것 같습니다',
  18,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '2 days' + interval '5 hours' + interval '5 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '다낭 진짜 가성비 최고예요 저도 자주 가요',
  38,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '4 days' + interval '23 hours' + interval '9 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '동남아 말고 국내도 나쁘지 않아요 이동시간 짧은 게 장점',
  39,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '2 days' + interval '6 hours' + interval '16 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 여행 어디로 가세요?' limit 1),
  null,
  '연차 붙여서 유럽 한 번 가보는 것도 추천드려요',
  24,
  (select created_at from posts where title = '직장인 여행 어디로 가세요?' limit 1) + interval '0 days' + interval '16 hours' + interval '58 minutes' + interval '2 seconds'
);

-- 직장인이 보는 드라마 추천
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '저는 요즘 오피스 배경 드라마를 즐겨 보는데 공감되는 장면이 많아서 오히려 스트레스가 더 쌓일 때도 있어요 ㅋㅋ 그래도 미생은 시간 지나서 다시 봐도 명작이더라고요. 출퇴근길엔 짧은 예능 클립 보는 게 부담 없이 좋고요',
  3,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '2 days' + interval '10 hours' + interval '40 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '미생 다시보기 진짜 명작이죠 몇 번을 봐도 좋아요',
  39,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '0 days' + interval '13 hours' + interval '20 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '저는 오히려 직장 드라마 보면 더 피곤해져서 그냥 판타지물 봐요',
  7,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '2 days' + interval '13 hours' + interval '22 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인이 보는 드라마 추천' limit 1),
  null,
  '출퇴근길엔 짧은 예능이 최고예요',
  35,
  (select created_at from posts where title = '직장인이 보는 드라마 추천' limit 1) + interval '0 days' + interval '8 hours' + interval '58 minutes' + interval '2 seconds'
);

-- 30대 초반 직장인 재테크 시작법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '저도 30대 초반에 재테크 처음 시작했는데 일단 예적금으로 종잣돈부터 모았어요. 그러고 나서 여유자금 생기면 ETF 적립식으로 넘어갔습니다. 처음부터 개별주 투자하는 건 위험 부담이 커서 추천 안 드려요. 청약통장은 무조건 기본으로 만들어두시고요',
  44,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '2 days' + interval '8 hours' + interval '55 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '청약통장부터 만들라는 말 진짜 기본이죠',
  10,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '3 days' + interval '7 hours' + interval '6 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '예적금만으로는 물가상승률도 못 따라가서 저는 처음부터 ETF로 시작했어요',
  13,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '1 days' + interval '13 hours' + interval '24 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '30대 초반 직장인 재테크 시작법' limit 1),
  null,
  '소액으로 경험 쌓는 게 먼저인 것 같아요',
  42,
  (select created_at from posts where title = '30대 초반 직장인 재테크 시작법' limit 1) + interval '2 days' + interval '18 hours' + interval '35 minutes' + interval '2 seconds'
);

-- 직장인 점심 추천 (혼자 먹기 좋은)
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '저는 원래 혼밥이 어색했는데 요즘은 오히려 이 시간이 제일 힐링돼요. 회사 근처 일본식 정식집에 카운터 자리가 있어서 거기서 조용히 먹고 옵니다. 편의점 도시락도 요즘 퀄리티가 많이 좋아져서 부담 없이 이용하기 좋더라고요',
  34,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '1 days' + interval '17 hours' + interval '33 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '혼밥이 오히려 힐링된다는 말 완전 공감돼요',
  49,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '2 days' + interval '14 hours' + interval '14 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '저는 아직도 혼밥 눈치 보여요 다들 무리지어 다니는 분위기라',
  39,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '0 days' + interval '3 hours' + interval '39 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1),
  null,
  '카운터 자리 있는 식당이 혼밥하기 편해요',
  42,
  (select created_at from posts where title = '직장인 점심 추천 (혼자 먹기 좋은)' limit 1) + interval '0 days' + interval '5 hours' + interval '20 minutes' + interval '2 seconds'
);

-- 직장 다니면서 사이드 프로젝트 하시는 분
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '저는 주말마다 소소하게 외주를 받아서 하고 있어요. 수익이 크진 않지만 본업이랑 다른 종류의 일이라 오히려 스트레스 해소가 되더라고요. 다만 체력 관리가 안 되면 금방 번아웃 오니까 무리하지 않는 선에서 하시는 걸 추천드려요',
  6,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '3 days' + interval '8 hours' + interval '38 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '본업에 지장 없는 선에서 하는 게 제일 중요한 것 같아요',
  1,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '3 days' + interval '22 hours' + interval '28 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '저는 사이드로 시작한 게 커져서 결국 퇴사하고 창업했어요 케바케인 듯',
  40,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '4 days' + interval '15 hours' + interval '55 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1),
  null,
  '체력 관리가 관건이에요 저도 번아웃 와서 잠깐 쉬는 중',
  3,
  (select created_at from posts where title = '직장 다니면서 사이드 프로젝트 하시는 분' limit 1) + interval '3 days' + interval '19 hours' + interval '9 minutes' + interval '2 seconds'
);

-- 프리랜서 시작 1년 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '저도 프리랜서 2년차인데 1년차 때 느꼈던 불안감이 아직도 완전히 사라지진 않았어요. 다만 그 불안감을 안고서도 수입이 늘었다는 건 확실히 잘 하고 계신 거예요. 저는 프로젝트 파이프라인을 여러 개로 나눠서 관리하는 게 불안감 줄이는 데 도움이 됐습니다',
  24,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '4 days' + interval '11 hours' + interval '1 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '1년차 불안감 진짜 공감돼요 저도 아직 그래요',
  30,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '1 days' + interval '3 hours' + interval '50 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '수입 늘어난 것만으로도 이미 성공적인 시작이라고 봐요 너무 걱정 마세요',
  42,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '4 days' + interval '7 hours' + interval '2 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1),
  null,
  '비상금 3개월치는 꼭 마련해두세요',
  25,
  (select created_at from posts where title = '프리랜서 시작 1년 솔직 후기' limit 1) + interval '1 days' + interval '18 hours' + interval '15 minutes' + interval '2 seconds'
);

-- 프리랜서 세금 신고 어떻게 하세요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '저는 첫해엔 세무사한테 맡겼다가 다음 해부터는 직접 홈택스로 했어요. 유튜브에 관련 영상 많아서 따라하니까 생각보다 어렵지 않더라고요. 경비처리를 꼼꼼히 하는 게 세금 줄이는 핵심이라 영수증은 무조건 다 모아두시는 걸 추천드립니다',
  17,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '1 days' + interval '10 hours' + interval '13 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '경비처리 꼼꼼히 하라는 말 진짜 중요한 것 같아요',
  5,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '2 days' + interval '10 hours' + interval '27 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '처음부터 직접 하는 건 좀 위험할 수 있어서 저는 계속 세무사 씁니다',
  5,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '2 days' + interval '14 hours' + interval '9 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1),
  null,
  '종소세 첫해는 세무사 추천드려요',
  36,
  (select created_at from posts where title = '프리랜서 세금 신고 어떻게 하세요?' limit 1) + interval '0 days' + interval '5 hours' + interval '16 minutes' + interval '2 seconds'
);

-- 프리랜서 단가 협상 어떻게 하시나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '저는 예전엔 낮은 단가도 그냥 받아들였는데 그게 결국 저를 더 낮게 취급받게 만들더라고요. 지금은 시장 단가 리서치를 먼저 하고 포트폴리오로 근거를 보여주면서 협상해요. 확실히 자신감 있게 부를수록 결과도 좋아졌습니다',
  34,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '0 days' + interval '16 hours' + interval '55 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '낮은 단가는 그냥 거절하는 게 맞는 것 같아요',
  40,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '2 days' + interval '8 hours' + interval '28 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '너무 세게 나가면 클라이언트 놓칠 수도 있어서 저는 좀 조심스럽게 접근해요',
  43,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '1 days' + interval '2 hours' + interval '12 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1),
  null,
  '포트폴리오 보여주면서 협상하면 잘 먹히더라고요',
  10,
  (select created_at from posts where title = '프리랜서 단가 협상 어떻게 하시나요' limit 1) + interval '0 days' + interval '1 hours' + interval '2 minutes' + interval '2 seconds'
);

-- 프리랜서 국민연금 안 내도 되나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '저도 프리랜서 전향하고 국민연금 고지서 보고 깜짝 놀랐어요. 소득 신고 전이면 최저 등급으로 조정 신청할 수 있으니 공단에 전화해보시는 걸 추천드립니다. 완전히 안 낼 수는 없지만 조정으로 부담을 꽤 줄일 수 있어요',
  37,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '3 days' + interval '1 hours' + interval '49 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '매달 아까운 거 저도 공감돼요',
  47,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '0 days' + interval '5 hours' + interval '45 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '나중에 연금 받는 거 생각하면 그냥 내는 게 맞다고 봐요',
  4,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '3 days' + interval '4 hours' + interval '50 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1),
  null,
  '소득 없다고 증빙하면 줄일 수 있어요',
  6,
  (select created_at from posts where title = '프리랜서 국민연금 안 내도 되나요' limit 1) + interval '3 days' + interval '16 hours' + interval '1 minutes' + interval '2 seconds'
);

-- 클라이언트가 갑자기 계약 파기했어요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '저도 비슷한 일을 겪었는데 계약서가 있었던 덕분에 위약금을 청구할 수 있었어요. 내용증명부터 보내고 그래도 안 되면 소액소송까지 가는 경우도 봤습니다. 시간은 좀 걸리지만 계약서만 제대로 있으면 승산은 있는 것 같아요. 다음부턴 계약금을 미리 받는 게 제일 확실한 예방책이에요',
  39,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '0 days' + interval '14 hours' + interval '18 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '계약금 미리 받는 게 진짜 중요한 것 같아요',
  43,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '3 days' + interval '16 hours' + interval '43 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '소송까지 가는 건 시간과 비용이 너무 많이 들어서 저는 그냥 포기했어요',
  22,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '3 days' + interval '19 hours' + interval '47 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1),
  null,
  '무료 법률 상담 한 번 받아보세요',
  34,
  (select created_at from posts where title = '클라이언트가 갑자기 계약 파기했어요' limit 1) + interval '0 days' + interval '13 hours' + interval '51 minutes' + interval '2 seconds'
);

-- 연봉 실수령액 계산 방법 정리해드려요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '이런 정리 정말 유용하네요. 저도 처음 취업했을 때 실수령액 보고 세금이 이렇게 많이 나가는 줄 몰라서 놀랐던 기억이 있어요. 4대보험 비율이 회사마다 조금씩 다를 수 있다는 점도 참고하시면 좋을 것 같아요',
  13,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '0 days' + interval '16 hours' + interval '30 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '실수령액 보면 항상 현타 오는 거 맞아요',
  39,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '2 days' + interval '8 hours' + interval '0 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '부양가족 있으면 공제가 또 달라져서 이 계산이 딱 맞는 건 아닐 수도 있어요',
  40,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '2 days' + interval '9 hours' + interval '14 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1),
  null,
  '3000만원대 계산도 부탁드려요',
  45,
  (select created_at from posts where title = '연봉 실수령액 계산 방법 정리해드려요' limit 1) + interval '1 days' + interval '6 hours' + interval '34 minutes' + interval '2 seconds'
);

-- 연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '저는 복지 좋은 곳에서 1년 다녀보고 그다음 연봉 높은 곳으로 옮겨봤는데, 결론은 복지는 금방 익숙해져서 잘 안 쓰게 되더라고요. 반면 현금은 계속 남는 느낌이라 개인적으로는 연봉 높은 쪽을 추천드려요. 다만 식대나 교통비처럼 실질적인 복지는 계산해보면 차이가 꽤 클 수 있어요',
  29,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '0 days' + interval '23 hours' + interval '19 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '복지는 잘 안 써진다는 말 완전 공감돼요',
  35,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '3 days' + interval '5 hours' + interval '56 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '식대 교통비 다 더하면 200 가까이 차이날 수도 있어서 무조건 연봉이 답은 아닌 것 같아요',
  43,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '0 days' + interval '20 hours' + interval '51 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1),
  null,
  '저라면 그냥 연봉 높은 곳 갈 듯',
  50,
  (select created_at from posts where title = '연봉 5천 vs 4천 복지 좋은 곳 어느 게 나은가요' limit 1) + interval '4 days' + interval '7 hours' + interval '25 minutes' + interval '2 seconds'
);

-- 포괄임금제 야근 수당 없는 게 맞나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '저도 예전에 포괄임금제 회사에서 일했는데, 고정 OT 시간을 넘겨도 추가 수당을 전혀 안 줘서 나중에 노동청에 상담을 받아봤어요. 최저임금 미달 여부를 계산해보라고 하시더라고요. 포괄임금제 자체는 합법이지만 악용하는 회사가 많은 게 문제인 것 같습니다',
  45,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '3 days' + interval '10 hours' + interval '16 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '이거 불법인 경우 많다는 거 저도 들었어요 상담 받아보세요',
  10,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '0 days' + interval '20 hours' + interval '9 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '저희 회사도 포괄임금인데 야근이 거의 없어서 그냥 잘 다니고 있어요 회사 by 회사인 듯',
  45,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '4 days' + interval '14 hours' + interval '39 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1),
  null,
  '최저임금 미달이면 불법이니 계산해보세요',
  27,
  (select created_at from posts where title = '포괄임금제 야근 수당 없는 게 맞나요' limit 1) + interval '4 days' + interval '5 hours' + interval '20 minutes' + interval '2 seconds'
);

-- 연봉 협상 매년 하는 건가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '저희 회사는 매년 1월에 그냥 인상률 공지만 오고 개인별 협상이라는 개념 자체가 없어요. 협상이라기보단 그냥 통보에 가깝습니다. 이직할 때 오퍼 협상이 사실상 유일하게 제 목소리를 낼 수 있는 순간이더라고요',
  2,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '2 days' + interval '18 hours' + interval '17 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '협상이라기보단 통보인 곳이 대부분인 것 같아요',
  32,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '0 days' + interval '16 hours' + interval '17 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '저희는 그래도 개인 고과에 따라 차등 협상 가능해요 회사마다 다른 듯',
  33,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '1 days' + interval '20 hours' + interval '16 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 협상 매년 하는 건가요' limit 1),
  null,
  '이직 아니면 협상력 거의 없다고 보시면 돼요',
  24,
  (select created_at from posts where title = '연봉 협상 매년 하는 건가요' limit 1) + interval '4 days' + interval '18 hours' + interval '2 minutes' + interval '2 seconds'
);

-- 직군별 연봉 현실 공유 (IT 개발자)
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '저는 프론트엔드 5년차 중견기업 다니는데 말씀하신 것보다는 좀 낮은 편이에요. 직군별 차이가 확실히 크다는 걸 이런 글 볼 때마다 느낍니다. ML이나 백엔드 쪽이 확실히 높게 형성되어 있는 것 같아요',
  15,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '4 days' + interval '14 hours' + interval '27 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '직군별 차이 진짜 크다는 거 체감돼요',
  44,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '2 days' + interval '23 hours' + interval '7 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '대기업 8000이 낮은 편이라는 말엔 좀 동의 못하겠어요 충분히 높은 수준 아닌가요',
  47,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '1 days' + interval '19 hours' + interval '30 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1),
  null,
  '저도 공유합니다 QA 3년차 5000이요',
  33,
  (select created_at from posts where title = '직군별 연봉 현실 공유 (IT 개발자)' limit 1) + interval '1 days' + interval '13 hours' + interval '35 minutes' + interval '2 seconds'
);

-- 직장 상사가 저만 싫어하는 것 같아요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '저도 예전에 똑같은 경험 했었어요. 알고 보니 그 상사가 원래 신입들한테만 유독 차갑게 대하는 스타일이었더라고요. 시간이 지나고 나서야 그게 제 문제가 아니었다는 걸 알게 됐어요. 너무 자책하지 마시고 편하게 지내는 다른 동료분들이랑 시간 보내세요',
  38,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '2 days' + interval '19 hours' + interval '43 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '너무 신경쓰지 마세요 모두에게 사랑받을 필요는 없어요',
  26,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '3 days' + interval '12 hours' + interval '38 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '그래도 혹시 모르니 예전에 실수한 게 있었는지 한번 곰곰히 생각해보시는 것도 좋을 것 같아요',
  2,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '4 days' + interval '21 hours' + interval '46 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1),
  null,
  '다른 팀원한테 넌지시 물어보는 것도 방법이에요',
  40,
  (select created_at from posts where title = '직장 상사가 저만 싫어하는 것 같아요' limit 1) + interval '3 days' + interval '19 hours' + interval '5 minutes' + interval '2 seconds'
);

-- 회식 문화 없애고 싶은데 방법이 있나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '저희 팀은 익명 설문을 돌려서 회식 빈도를 줄이는 데 성공했어요. 혼자 말 꺼내기 부담스러우시면 몇 명이서 같이 의견을 모아보시는 것도 좋은 방법인 것 같아요. 요즘은 회식 대신 점심 회식으로 바꾸는 분위기도 많이 늘었더라고요',
  4,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '1 days' + interval '8 hours' + interval '54 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '혼자 말 꺼내기 힘들면 동료랑 같이 얘기해보는 게 좋을 것 같아요',
  15,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '4 days' + interval '17 hours' + interval '34 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '회식도 어느 정도는 팀워크에 필요하다고 생각해서 완전히 없애는 것보단 줄이는 쪽으로 얘기해보세요',
  21,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '1 days' + interval '5 hours' + interval '34 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1),
  null,
  '익명 설문 방식 추천드려요',
  15,
  (select created_at from posts where title = '회식 문화 없애고 싶은데 방법이 있나요' limit 1) + interval '3 days' + interval '7 hours' + interval '22 minutes' + interval '2 seconds'
);

-- 칼퇴하는데 눈치 안 보이는 법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '저도 처음엔 눈치 보느라 자리에 남아있곤 했는데, 어느 순간부터 그냥 할 일 다 끝나면 인사하고 나가기 시작했어요. 처음이 어렵지 막상 해보면 아무도 신경 안 쓰더라고요. 오히려 제가 눈치 보는 게 스스로를 더 힘들게 만들고 있었다는 걸 깨달았습니다',
  7,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '2 days' + interval '21 hours' + interval '18 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '일 다 끝냈으면 당당하게 나가도 되는 거 맞아요',
  43,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '3 days' + interval '10 hours' + interval '19 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '그래도 팀 분위기에 따라 다르니까 처음엔 조금 조심스럽게 접근하는 게 좋을 것 같아요',
  6,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '1 days' + interval '17 hours' + interval '24 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1),
  null,
  '습관 들이면 아무도 신경 안 써요',
  13,
  (select created_at from posts where title = '칼퇴하는데 눈치 안 보이는 법' limit 1) + interval '4 days' + interval '21 hours' + interval '16 minutes' + interval '2 seconds'
);

-- 직장 내 괴롭힘 신고하면 어떻게 되나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '저도 예전에 신고했었는데 조사가 시작되기까지 시간은 좀 걸렸지만 결국 보호는 받았어요. 증거 자료부터 최대한 많이 모아두시는 게 중요합니다. 녹음이나 메시지 캡처 같은 게 제일 확실한 증거가 되더라고요. 절대 혼자 참지 마세요',
  44,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '1 days' + interval '14 hours' + interval '45 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '혼자 참지 마시고 꼭 신고하세요',
  38,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '4 days' + interval '10 hours' + interval '56 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '회사 내부 신고보다 외부 기관이 훨씬 더 확실하게 처리해주더라고요',
  41,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '4 days' + interval '3 hours' + interval '49 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1),
  null,
  '언어폭력이면 녹취 증거가 제일 중요해요',
  14,
  (select created_at from posts where title = '직장 내 괴롭힘 신고하면 어떻게 되나요' limit 1) + interval '3 days' + interval '2 hours' + interval '14 minutes' + interval '2 seconds'
);

-- 점심 혼밥 어떻게 생각하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '저도 새로운 팀 왔을 때 혼밥이 눈치 보였는데 몇 주 지나니까 오히려 이 시간이 제일 편해지더라고요. 요즘은 혼밥 이상하게 보는 사람 거의 없는 것 같아요. 같이 먹자는 얘기 없으면 그냥 편하게 혼자 드세요',
  41,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '4 days' + interval '12 hours' + interval '8 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '혼밥이 오히려 힐링되는 시간인 것 같아요',
  1,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '3 days' + interval '1 hours' + interval '40 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '그래도 팀 분위기에 따라 눈치 보이는 곳도 있어서 무조건 편하다곤 못할 것 같아요',
  23,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '2 days' + interval '10 hours' + interval '33 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1),
  null,
  '전혀 이상한 거 아니니 편하게 하세요',
  43,
  (select created_at from posts where title = '점심 혼밥 어떻게 생각하세요' limit 1) + interval '4 days' + interval '7 hours' + interval '53 minutes' + interval '2 seconds'
);

-- 취업 준비 2년만에 대기업 합격했습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '68번이면 정말 대단하신 거예요. 저도 지금 취준 1년째인데 계속 떨어지다 보니 자신감이 많이 떨어졌었거든요. 이 글 보고 다시 힘내서 준비해보려고요. 혹시 자소서나 면접 준비하실 때 특별히 신경 쓰신 부분 있으시면 공유해주실 수 있을까요',
  13,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '1 days' + interval '10 hours' + interval '21 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '포기 안 하신 게 정말 대단해요 저도 힘내야겠어요',
  38,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '2 days' + interval '18 hours' + interval '8 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '68번이면 솔직히 운도 어느 정도 따라준 것 같아요 너무 자책하지 마시고 다들 파이팅하세요',
  18,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '2 days' + interval '15 hours' + interval '59 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1),
  null,
  '축하드려요 진짜 대단하시네요',
  20,
  (select created_at from posts where title = '취업 준비 2년만에 대기업 합격했습니다' limit 1) + interval '4 days' + interval '21 hours' + interval '55 minutes' + interval '2 seconds'
);

-- 이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '저는 정확한 숫자보다 범위로 얘기하는 편이에요. 너무 낮게 말하면 나중에 협상할 때 불리해질 수 있어서 살짝 여유를 두고 말씀드리는 게 좋은 것 같아요. 요즘은 이 질문 자체를 지양하는 회사도 늘고 있다고 들었습니다',
  16,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '0 days' + interval '9 hours' + interval '10 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '너무 낮게 말하면 협상에서 불리해진다는 말 공감돼요',
  38,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '4 days' + interval '13 hours' + interval '10 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '그냥 솔직하게 말하는 게 신뢰 쌓는 데 더 낫다고 생각해요 대신 희망연봉을 확실히 말씀드리세요',
  43,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '3 days' + interval '14 hours' + interval '39 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1),
  null,
  '범위로 말하는 게 안전한 것 같아요',
  50,
  (select created_at from posts where title = '이직 면접에서 "현재 연봉이 얼마세요?" 어떻게 대답하나요' limit 1) + interval '1 days' + interval '5 hours' + interval '8 minutes' + interval '2 seconds'
);

-- 이직 준비 중 현 직장 눈치 어떻게 하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '저는 반차를 여러 번 쪼개서 썼어요. 하루 통으로 연차 쓰면 아무래도 티가 나서 병원 핑계로 반차 내는 게 제일 무난하더라고요. 그래도 너무 자주 쓰면 눈치채는 사람들이 있어서 면접 일정을 최대한 몰아서 잡는 것도 방법이에요',
  10,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '3 days' + interval '15 hours' + interval '47 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '병원 간다고 하고 반차 쓰는 게 제일 무난한 것 같아요',
  29,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '2 days' + interval '14 hours' + interval '24 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '걸려도 어쩔 수 없다고 생각해요 이직은 원래 어느 정도 눈치 보면서 하는 거죠',
  24,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '3 days' + interval '23 hours' + interval '8 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1),
  null,
  '면접 몰아서 잡는 것도 좋은 방법이에요',
  35,
  (select created_at from posts where title = '이직 준비 중 현 직장 눈치 어떻게 하세요' limit 1) + interval '2 days' + interval '6 hours' + interval '8 minutes' + interval '2 seconds'
);

-- 경력직 이직 시 레퍼런스 체크 두렵습니다
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '저도 사이 안 좋은 상사가 있었는데 그냥 같이 일했던 다른 팀 동료를 레퍼런스로 제출했어요. 요즘은 레퍼런스 체크를 형식적으로만 진행하는 회사도 많다고 들었으니 너무 걱정 안 하셔도 될 것 같아요. 설령 그 상사가 안 좋게 말한다 해도 회사에서 그 말만 전적으로 믿진 않을 거예요',
  46,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '0 days' + interval '1 hours' + interval '35 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '친했던 동료 연락처로 제출하는 방법 좋은 것 같아요',
  7,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '4 days' + interval '19 hours' + interval '40 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '그래도 레퍼런스 체크가 당락을 가르는 경우도 있어서 너무 안심하긴 이른 것 같아요',
  26,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '4 days' + interval '2 hours' + interval '10 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1),
  null,
  '요즘은 형식적인 곳도 많으니 너무 걱정 마세요',
  50,
  (select created_at from posts where title = '경력직 이직 시 레퍼런스 체크 두렵습니다' limit 1) + interval '1 days' + interval '13 hours' + interval '16 minutes' + interval '2 seconds'
);

-- 자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '저도 자소서 수십 번 고쳐 쓰다가 결국 첨삭 서비스를 받고 나서야 합격률이 올라갔어요. 직무 관련 키워드가 제대로 들어갔는지 확인해보시는 것도 중요한 것 같아요. 요즘은 서류에서 ATS 필터링을 쓰는 곳도 있다고 하더라고요. 친구나 선배한테 객관적으로 봐달라고 부탁하는 것도 큰 도움이 됐습니다',
  11,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '3 days' + interval '23 hours' + interval '39 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '탈락 사유를 안 알려줘서 더 답답하시겠어요 힘내세요',
  10,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '4 days' + interval '6 hours' + interval '21 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '스펙보다 직무 적합성을 더 본다는 말에는 회사마다 다를 것 같아서 완전히 동의하긴 어려워요',
  41,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '1 days' + interval '10 hours' + interval '31 minutes' + interval '2 seconds'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1),
  null,
  '첨삭 서비스 효과 있다는 말 저도 들었어요',
  8,
  (select created_at from posts where title = '자소서 한달 동안 썼는데 서류 탈락 이유가 뭘까요' limit 1) + interval '0 days' + interval '4 hours' + interval '31 minutes' + interval '2 seconds'
);
