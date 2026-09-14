-- 웹 검색으로 조사한 블라인드/잡플래닛/클리앙 등 직장인 커뮤니티 실제 논의를
-- 사실관계는 유지하되 표현을 재창작해서 작성한 댓글 시드 데이터.
-- add_comments_likes_count.sql 을 먼저 실행한 뒤 이 파일을 실행하세요.

-- 대기업 10년차 솔직한 소감
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 10년차 솔직한 소감' limit 1),
  null,
  '저도 딱 10년차인데 진짜 공감... 안정적인 건 맞는데 뭔가 정체된 느낌 강함. 승진해도 크게 달라지는 것도 없고 그냥 다람쥐 쳇바퀴 도는 기분이에요. 40대 넘어가면 이 안정성이 발목 잡을 수도 있다는 생각도 들고 고민 많이 됩니다',
  35,
  (select created_at from posts where title = '대기업 10년차 솔직한 소감' limit 1) + interval '1 days' + interval '3 hours' + interval '8 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 10년차 솔직한 소감' limit 1),
  null,
  '성장이 느껴지는 회사는 원래 드물어요 다 그런 듯',
  43,
  (select created_at from posts where title = '대기업 10년차 솔직한 소감' limit 1) + interval '2 days' + interval '18 hours' + interval '34 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 10년차 솔직한 소감' limit 1),
  null,
  '정체됐다고 느끼는 건 본인이 안주해서 그런 거 아닐까요 스스로 프로젝트 찾아서 해봐요',
  39,
  (select created_at from posts where title = '대기업 10년차 솔직한 소감' limit 1) + interval '3 days' + interval '17 hours' + interval '30 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 10년차 솔직한 소감' limit 1),
  null,
  '40대 고민 진짜 다들 하는 거 같아요 저희 팀 부장님도 요즘 그런 얘기 자주 하심',
  24,
  (select created_at from posts where title = '대기업 10년차 솔직한 소감' limit 1) + interval '4 days' + interval '4 hours' + interval '55 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 10년차 솔직한 소감' limit 1),
  null,
  '그래도 안정성이 최고의 복지라는 말 있잖아요 ㅋㅋ 저는 만족합니다',
  21,
  (select created_at from posts where title = '대기업 10년차 솔직한 소감' limit 1) + interval '2 days' + interval '3 hours' + interval '19 minutes' + interval '1 second'
);

-- 카카오 최근 분위기 어때요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '카카오 최근 분위기 어때요?' limit 1),
  null,
  '블라인드 평점 보니까 3점대 중반이던데 팀바팀이라는 말이 젤 많이 보이더라고요. 어느 팀 가느냐에 따라 천지차이인 듯',
  44,
  (select created_at from posts where title = '카카오 최근 분위기 어때요?' limit 1) + interval '0 days' + interval '6 hours' + interval '17 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '카카오 최근 분위기 어때요?' limit 1),
  null,
  '작년보다는 좀 나아진 걸로 들었어요 영업이익도 개선됐다고 하고',
  37,
  (select created_at from posts where title = '카카오 최근 분위기 어때요?' limit 1) + interval '4 days' + interval '0 hours' + interval '30 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '카카오 최근 분위기 어때요?' limit 1),
  null,
  '수직적인 분위기 있다는 얘기 많이 봤어요 영어 이름 쓴다고 다 수평은 아니더라구요',
  10,
  (select created_at from posts where title = '카카오 최근 분위기 어때요?' limit 1) + interval '2 days' + interval '17 hours' + interval '25 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '카카오 최근 분위기 어때요?' limit 1),
  null,
  '이직 고려중이면 팀 리더 평판부터 알아보세요 팀바팀이 진짜 큼',
  45,
  (select created_at from posts where title = '카카오 최근 분위기 어때요?' limit 1) + interval '0 days' + interval '15 hours' + interval '7 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '카카오 최근 분위기 어때요?' limit 1),
  null,
  '저 다니는 사람인데 계열사마다도 완전 달라요. 본사는 그래도 안정적인 편인데 일부 계열사는 아직도 삐걱거리는 느낌이에요. 이직 고민이면 어느 팀인지 구체적으로 알아보고 오시는 게 좋을 것 같아요',
  12,
  (select created_at from posts where title = '카카오 최근 분위기 어때요?' limit 1) + interval '3 days' + interval '2 hours' + interval '33 minutes' + interval '1 second'
);

-- 대기업 입사 3개월차 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1),
  null,
  '저도 신입 때 똑같았어요 회의실만 들어가면 심장 쿵쾅거려서 말이 안 나오더라고요',
  29,
  (select created_at from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1) + interval '2 days' + interval '4 hours' + interval '31 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1),
  null,
  '원래 초반엔 다 그래요 6개월 정도 지나면 좀 나아짐 조급해하지 마세요',
  23,
  (select created_at from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1) + interval '3 days' + interval '17 hours' + interval '41 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1),
  null,
  '의견 안 내도 괜찮아요 일단 듣고 배우는 시기라고 생각하세요',
  22,
  (select created_at from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1) + interval '1 days' + interval '8 hours' + interval '13 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1),
  null,
  '저는 아직도 3년차인데 회의 때 긴장돼요 ㅋㅋㅋ 성격 문제인 듯',
  28,
  (select created_at from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1) + interval '1 days' + interval '5 hours' + interval '11 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1),
  null,
  '저도 완전 소심했는데 회의 전에 할 말 미리 메모해가는 습관 들이니까 좀 나아지더라고요. 갑자기 발표력이 느는 건 아니고 준비를 많이 하는 수밖에 없는 것 같아요. 시간이 약이에요',
  41,
  (select created_at from posts where title = '대기업 입사 3개월차 솔직 후기' limit 1) + interval '2 days' + interval '18 hours' + interval '34 minutes' + interval '1 second'
);

-- 네이버 vs 카카오 처우 비교
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '네이버 vs 카카오 처우 비교' limit 1),
  null,
  '요즘 네이버 성과급 많이 깎였다는 얘기 계속 나오던데 그 부분도 고려하세요',
  49,
  (select created_at from posts where title = '네이버 vs 카카오 처우 비교' limit 1) + interval '2 days' + interval '6 hours' + interval '29 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '네이버 vs 카카오 처우 비교' limit 1),
  null,
  '카카오는 계열사마다 인센티브 천차만별이에요 어느 계열사인지가 중요함',
  46,
  (select created_at from posts where title = '네이버 vs 카카오 처우 비교' limit 1) + interval '2 days' + interval '13 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '네이버 vs 카카오 처우 비교' limit 1),
  null,
  '기본급 비슷하면 그냥 워라밸이랑 조직문화로 결정하는 게 나을 듯',
  34,
  (select created_at from posts where title = '네이버 vs 카카오 처우 비교' limit 1) + interval '4 days' + interval '10 hours' + interval '3 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '네이버 vs 카카오 처우 비교' limit 1),
  null,
  '네이버가 그래도 처우는 좀 더 안정적이라고 들었어요 개인 의견입니다',
  10,
  (select created_at from posts where title = '네이버 vs 카카오 처우 비교' limit 1) + interval '2 days' + interval '20 hours' + interval '12 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '네이버 vs 카카오 처우 비교' limit 1),
  null,
  '인센티브 구조 다르다고 너무 고민 마세요 결국 실적이 좋아야 둘 다 잘 받는 거예요',
  34,
  (select created_at from posts where title = '네이버 vs 카카오 처우 비교' limit 1) + interval '2 days' + interval '11 hours' + interval '21 minutes' + interval '1 second'
);

-- 중견기업 대기업 이직 성공기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중견기업 대기업 이직 성공기' limit 1),
  null,
  '30군데면 진짜 대단하시네요 저는 10군데도 못 넣고 지쳤는데 ㅠㅠ',
  29,
  (select created_at from posts where title = '중견기업 대기업 이직 성공기' limit 1) + interval '4 days' + interval '1 hours' + interval '34 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중견기업 대기업 이직 성공기' limit 1),
  null,
  '1년 준비면 짧은 것도 아닌데 꾸준히 하신 게 대단해요 축하드립니다',
  22,
  (select created_at from posts where title = '중견기업 대기업 이직 성공기' limit 1) + interval '1 days' + interval '16 hours' + interval '25 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중견기업 대기업 이직 성공기' limit 1),
  null,
  '포트폴리오 어떻게 준비하셨는지 궁금하네요 공유 가능하실까요',
  40,
  (select created_at from posts where title = '중견기업 대기업 이직 성공기' limit 1) + interval '4 days' + interval '2 hours' + interval '50 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중견기업 대기업 이직 성공기' limit 1),
  null,
  '저도 지금 딱 그 과정 중인데 희망이 생기네요 감사합니다',
  25,
  (select created_at from posts where title = '중견기업 대기업 이직 성공기' limit 1) + interval '4 days' + interval '9 hours' + interval '6 minutes' + interval '1 second'
);

-- 중소기업 팀장 역할 너무 힘들어요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1),
  null,
  '팀장 수당 30만원이면 실질적으로 마이너스 아닌가요 책임만 늘고',
  31,
  (select created_at from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1) + interval '1 days' + interval '7 hours' + interval '3 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1),
  null,
  '저희 회사도 딱 그래요 실무+관리+실적 다 떠안는 구조 진짜 흔한 듯',
  35,
  (select created_at from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1) + interval '0 days' + interval '16 hours' + interval '22 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1),
  null,
  '그정도면 그냥 팀장 직함 반납하고 싶으실 것 같은데... 이직 고려해보세요',
  24,
  (select created_at from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1) + interval '3 days' + interval '10 hours' + interval '23 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1),
  null,
  '중소기업 팀장은 거의 이름만 팀장이고 실상은 중간관리자+실무자 겸직이더라구요',
  18,
  (select created_at from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1) + interval '2 days' + interval '10 hours' + interval '52 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1),
  null,
  '저도 중소에서 팀장 해봤는데 딱 이 상황이었어요. 위에서는 숫자로만 압박하고 밑에는 챙겨야 하고 정작 제 실무는 야근해서 처리하고... 결국 번아웃 와서 퇴사했습니다. 수당이 안 맞으면 진지하게 고민해보시는 게 좋을 것 같아요',
  21,
  (select created_at from posts where title = '중소기업 팀장 역할 너무 힘들어요' limit 1) + interval '4 days' + interval '20 hours' + interval '52 minutes' + interval '1 second'
);

-- 중소기업에서 대기업 이직 팁
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업에서 대기업 이직 팁' limit 1),
  null,
  '직무 언어로 포트폴리오 만드는 거 완전 공감돼요 저도 이 방법으로 성공했어요',
  5,
  (select created_at from posts where title = '중소기업에서 대기업 이직 팁' limit 1) + interval '2 days' + interval '2 hours' + interval '40 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업에서 대기업 이직 팁' limit 1),
  null,
  '재직 중에 준비하신 거죠? 그게 훨씬 유리하다고 들었어요',
  20,
  (select created_at from posts where title = '중소기업에서 대기업 이직 팁' limit 1) + interval '1 days' + interval '8 hours' + interval '54 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업에서 대기업 이직 팁' limit 1),
  null,
  '3년만에 성공이면 빠른 편 아닌가요 대단하시네요',
  46,
  (select created_at from posts where title = '중소기업에서 대기업 이직 팁' limit 1) + interval '1 days' + interval '23 hours' + interval '4 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업에서 대기업 이직 팁' limit 1),
  null,
  '혹시 어떤 직무셨는지 여쭤봐도 될까요 참고하고 싶어요',
  44,
  (select created_at from posts where title = '중소기업에서 대기업 이직 팁' limit 1) + interval '2 days' + interval '13 hours' + interval '24 minutes' + interval '1 second'
);

-- 퇴직금 안 주는 회사 신고 방법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1),
  null,
  '저도 신고해서 받았어요 급여명세서랑 근무기록 첨부하니까 며칠 만에 연락 오더라고요',
  47,
  (select created_at from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1) + interval '3 days' + interval '20 hours' + interval '1 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1),
  null,
  '노동포털에서 온라인으로 진정 넣으시면 돼요 생각보다 절차 간단해요',
  9,
  (select created_at from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1) + interval '3 days' + interval '4 hours' + interval '6 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1),
  null,
  '미지급하면 3년 이하 징역까지 갈 수 있어서 사장님들도 신고 들어가면 대부분 바로 줍니다',
  39,
  (select created_at from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1) + interval '3 days' + interval '11 hours' + interval '33 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1),
  null,
  '저는 신고 접수되니까 다음날 사장이 바로 연락오던데요 ㅋㅋ 무서운가봐요',
  21,
  (select created_at from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1) + interval '3 days' + interval '0 hours' + interval '26 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1),
  null,
  '1년 이상이면 무조건 받을 수 있는 권리예요. 저도 비슷한 일 겪었는데 증거자료(근로계약서, 급여명세서, 출퇴근기록) 최대한 모아서 신고하니까 생각보다 빨리 해결됐어요. 무서워하지 마시고 꼭 신고하세요',
  45,
  (select created_at from posts where title = '퇴직금 안 주는 회사 신고 방법' limit 1) + interval '4 days' + interval '23 hours' + interval '57 minutes' + interval '1 second'
);

-- 중소기업 업무 시스템 너무 구식이에요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1),
  null,
  '대기업 출신이 적응 못하고 나간다는 거 완전 이해돼요 문화충격이 크죠',
  39,
  (select created_at from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1) + interval '3 days' + interval '19 hours' + interval '28 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1),
  null,
  '엑셀로 관리하는 회사 아직도 많아요 저희도 마찬가지입니다',
  38,
  (select created_at from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1) + interval '2 days' + interval '20 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1),
  null,
  '전산화 제안해보세요 의외로 대표님이 관심 있어하실 수도 있어요',
  39,
  (select created_at from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1) + interval '1 days' + interval '6 hours' + interval '33 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1),
  null,
  '저도 전 회사가 그랬는데 결국 적응 못하고 이직했어요',
  44,
  (select created_at from posts where title = '중소기업 업무 시스템 너무 구식이에요' limit 1) + interval '4 days' + interval '3 hours' + interval '27 minutes' + interval '1 second'
);

-- 연봉 3000 중소 vs 3500 스타트업
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1),
  null,
  '성장 가능성은 회사 by 회사라 그냥 안정성 보고 중소 가시는 게 낫지 않을까요',
  36,
  (select created_at from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1) + interval '2 days' + interval '12 hours' + interval '42 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1),
  null,
  '500 차이면 스타트업 가보고 아니다 싶으면 다시 이직해도 될 것 같아요',
  10,
  (select created_at from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1) + interval '2 days' + interval '10 hours' + interval '11 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1),
  null,
  '스타트업 스톡옵션 조건도 같이 보세요 그게 진짜 변수일 수 있어요',
  7,
  (select created_at from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1) + interval '0 days' + interval '13 hours' + interval '44 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1),
  null,
  '저라면 그냥 연봉 높은 곳 갑니다 성장은 어디서든 할 수 있어요',
  46,
  (select created_at from posts where title = '연봉 3000 중소 vs 3500 스타트업' limit 1) + interval '2 days' + interval '8 hours' + interval '0 minutes' + interval '1 second'
);

-- 유니콘 스타트업 다녀봤는데 솔직 후기
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1),
  null,
  '규모 커지면 정치 생기는 거 스타트업이나 대기업이나 똑같은 듯',
  11,
  (select created_at from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1) + interval '3 days' + interval '0 hours' + interval '20 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1),
  null,
  '수평문화 마케팅용인 경우 진짜 많더라고요 저도 겪어봄',
  49,
  (select created_at from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1) + interval '4 days' + interval '21 hours' + interval '3 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1),
  null,
  '유니콘이라고 다 좋은 건 아니네요 현실적인 후기 감사합니다',
  6,
  (select created_at from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1) + interval '4 days' + interval '21 hours' + interval '50 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1),
  null,
  '내부 정치는 규모 문제라기보다 그냥 사람 문제인 것 같기도 해요',
  17,
  (select created_at from posts where title = '유니콘 스타트업 다녀봤는데 솔직 후기' limit 1) + interval '0 days' + interval '20 hours' + interval '45 minutes' + interval '1 second'
);

-- 스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1),
  null,
  '한국은 M&A보다 IPO 쏠림이 심해서 시리즈C부터 진짜 힘들다고 들었어요',
  7,
  (select created_at from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1) + interval '0 days' + interval '5 hours' + interval '17 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1),
  null,
  '코스닥 상장해도 시총 5천억 안팎이 대부분이라던데 너무 큰 기대는 하지 마세요',
  33,
  (select created_at from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1) + interval '3 days' + interval '10 hours' + interval '4 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1),
  null,
  '시리즈C까지 온 것만 해도 잘 크고 있는 거예요 매출 성장세가 제일 중요한 지표인 듯',
  33,
  (select created_at from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1) + interval '1 days' + interval '21 hours' + interval '4 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1),
  null,
  '스톡옵션 행사가격 확인해보세요 상장 안 해도 매각으로 엑싯하는 경우도 있어요',
  13,
  (select created_at from posts where title = '스타트업 시리즈 C인데 IPO 가능성 어떻게 판단하나요' limit 1) + interval '1 days' + interval '21 hours' + interval '27 minutes' + interval '1 second'
);

-- 스타트업 CTO가 너무 독단적이에요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1),
  null,
  '문서로 남기세요 의견 제시한 기록 있으면 나중에 도움됩니다',
  7,
  (select created_at from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1) + interval '0 days' + interval '19 hours' + interval '4 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1),
  null,
  '저도 비슷한 CTO 밑에 있었는데 결국 떠나는 사람만 늘더라고요',
  50,
  (select created_at from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1) + interval '4 days' + interval '22 hours' + interval '31 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1),
  null,
  '직접 얘기해도 안 통하면 그냥 본인 커리어 챙기는 게 나을 수도 있어요',
  49,
  (select created_at from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1) + interval '2 days' + interval '3 hours' + interval '5 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1),
  null,
  '독단적인 리더 밑에서 오래 버티는 거 자체가 손해인 것 같아요',
  6,
  (select created_at from posts where title = '스타트업 CTO가 너무 독단적이에요' limit 1) + interval '4 days' + interval '8 hours' + interval '5 minutes' + interval '1 second'
);

-- 스타트업 vs 대기업 3년 후 비교
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1),
  null,
  '연봉은 대기업 성장은 스타트업이라는 공식 진짜 많이 보이네요',
  45,
  (select created_at from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1) + interval '1 days' + interval '11 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1),
  null,
  '저도 딱 이 패턴으로 이직했는데 스타트업에서 배운 게 대기업에서 제일 도움 됐어요',
  48,
  (select created_at from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1) + interval '1 days' + interval '16 hours' + interval '49 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1),
  null,
  '결국 순서의 문제인 듯 초반엔 성장 나중엔 안정',
  22,
  (select created_at from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1) + interval '3 days' + interval '18 hours' + interval '17 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1),
  null,
  '3년이면 딱 적당한 타이밍인 것 같아요 너무 오래 있으면 오히려 이직 힘들어짐',
  12,
  (select created_at from posts where title = '스타트업 vs 대기업 3년 후 비교' limit 1) + interval '3 days' + interval '21 hours' + interval '23 minutes' + interval '1 second'
);

-- 스타트업 재직 중 이직 타이밍 언제가 좋을까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1),
  null,
  '성장 느려진다 느끼면 이미 늦은 걸 수도 있어요 빨리 움직이세요',
  29,
  (select created_at from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1) + interval '2 days' + interval '18 hours' + interval '53 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1),
  null,
  '2년이면 이력서상으로도 나쁘지 않은 타이밍이에요',
  16,
  (select created_at from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1) + interval '2 days' + interval '7 hours' + interval '19 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1),
  null,
  '재직 중에 준비하는 게 정신건강에 훨씬 나아요 여유 갖고 알아보세요',
  45,
  (select created_at from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1) + interval '0 days' + interval '21 hours' + interval '21 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1),
  null,
  '저도 딱 2년차에 느낌 왔었는데 그때 움직여서 후회 없어요',
  10,
  (select created_at from posts where title = '스타트업 재직 중 이직 타이밍 언제가 좋을까요' limit 1) + interval '1 days' + interval '7 hours' + interval '59 minutes' + interval '1 second'
);

-- 서울 vs 지방 직장인 삶의 질
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1),
  null,
  '지방 내려가니까 출퇴근 시간 확 줄어서 삶의 질 진짜 좋아졌어요',
  23,
  (select created_at from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1) + interval '0 days' + interval '21 hours' + interval '53 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1),
  null,
  '대신 문화생활이나 인프라는 확실히 아쉬워요 트레이드오프인듯',
  22,
  (select created_at from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1) + interval '0 days' + interval '16 hours' + interval '52 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1),
  null,
  '집값 차이가 제일 큰 것 같아요 서울은 월세만 해도 부담',
  29,
  (select created_at from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1) + interval '4 days' + interval '23 hours' + interval '30 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1),
  null,
  '저는 반대로 지방에서 서울 왔는데 기회는 확실히 더 많더라고요',
  21,
  (select created_at from posts where title = '서울 vs 지방 직장인 삶의 질' limit 1) + interval '3 days' + interval '4 hours' + interval '7 minutes' + interval '1 second'
);

-- 직장인 헬스 다니시는 분들
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 헬스 다니시는 분들' limit 1),
  null,
  '저는 출근 전 파예요 퇴근하면 그냥 의지가 사라짐 ㅋㅋ',
  40,
  (select created_at from posts where title = '직장인 헬스 다니시는 분들' limit 1) + interval '4 days' + interval '17 hours' + interval '18 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 헬스 다니시는 분들' limit 1),
  null,
  '퇴근 후에 하는데 루틴 잡히니까 오히려 스트레스 풀려서 좋아요',
  9,
  (select created_at from posts where title = '직장인 헬스 다니시는 분들' limit 1) + interval '1 days' + interval '0 hours' + interval '22 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 헬스 다니시는 분들' limit 1),
  null,
  '아침엔 진짜 못 일어나겠던데 대단하시네요 저는 못함',
  34,
  (select created_at from posts where title = '직장인 헬스 다니시는 분들' limit 1) + interval '2 days' + interval '9 hours' + interval '14 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 헬스 다니시는 분들' limit 1),
  null,
  'PT 받으면 그나마 꾸준히 가게 되더라고요 강제성이 필요한 듯',
  39,
  (select created_at from posts where title = '직장인 헬스 다니시는 분들' limit 1) + interval '4 days' + interval '18 hours' + interval '43 minutes' + interval '1 second'
);

-- 오피스 필수 아이템 공유
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '오피스 필수 아이템 공유' limit 1),
  null,
  '목쿠션이랑 담요 진짜 필수템이에요 에어컨 너무 추움',
  23,
  (select created_at from posts where title = '오피스 필수 아이템 공유' limit 1) + interval '2 days' + interval '17 hours' + interval '47 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '오피스 필수 아이템 공유' limit 1),
  null,
  '블루투스 이어폰 하나는 무조건 있어야 함 집중할 때 좋아요',
  18,
  (select created_at from posts where title = '오피스 필수 아이템 공유' limit 1) + interval '0 days' + interval '23 hours' + interval '14 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '오피스 필수 아이템 공유' limit 1),
  null,
  '핸드크림이랑 텀블러 이거 없으면 하루가 허전함',
  23,
  (select created_at from posts where title = '오피스 필수 아이템 공유' limit 1) + interval '1 days' + interval '3 hours' + interval '38 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '오피스 필수 아이템 공유' limit 1),
  null,
  '무선 마우스 충전기 여분으로 하나 더 두는 거 추천드려요',
  46,
  (select created_at from posts where title = '오피스 필수 아이템 공유' limit 1) + interval '3 days' + interval '18 hours' + interval '19 minutes' + interval '1 second'
);

-- 직장인 취미 뭐 하세요?
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 취미 뭐 하세요?' limit 1),
  null,
  '저는 요즘 클라이밍 하는데 완전 스트레스 풀림 강추해요',
  4,
  (select created_at from posts where title = '직장인 취미 뭐 하세요?' limit 1) + interval '1 days' + interval '12 hours' + interval '0 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 취미 뭐 하세요?' limit 1),
  null,
  '필라테스 다니고 있어요 몸도 좋아지고 정신적으로도 도움됨',
  14,
  (select created_at from posts where title = '직장인 취미 뭐 하세요?' limit 1) + interval '0 days' + interval '7 hours' + interval '26 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 취미 뭐 하세요?' limit 1),
  null,
  '그냥 넷플릭스 정주행이 제 취미입니다 ㅋㅋ 이것도 힐링',
  19,
  (select created_at from posts where title = '직장인 취미 뭐 하세요?' limit 1) + interval '4 days' + interval '15 hours' + interval '34 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 취미 뭐 하세요?' limit 1),
  null,
  '러닝 시작했는데 생각보다 중독성 있어요 한번 해보세요',
  1,
  (select created_at from posts where title = '직장인 취미 뭐 하세요?' limit 1) + interval '0 days' + interval '17 hours' + interval '33 minutes' + interval '1 second'
);

-- 직장인 유튜브 채널 추천
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 유튜브 채널 추천' limit 1),
  null,
  '재테크는 그냥 기본 경제 유튜브부터 시작하시는 걸 추천해요',
  41,
  (select created_at from posts where title = '직장인 유튜브 채널 추천' limit 1) + interval '0 days' + interval '16 hours' + interval '44 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 유튜브 채널 추천' limit 1),
  null,
  '커리어 쪽은 실제 현직자 인터뷰 채널이 도움 많이 됐어요',
  19,
  (select created_at from posts where title = '직장인 유튜브 채널 추천' limit 1) + interval '0 days' + interval '22 hours' + interval '9 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 유튜브 채널 추천' limit 1),
  null,
  '자기계발 채널은 너무 많이 보면 오히려 실천을 안 하게 되더라고요 적당히',
  11,
  (select created_at from posts where title = '직장인 유튜브 채널 추천' limit 1) + interval '0 days' + interval '5 hours' + interval '0 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장인 유튜브 채널 추천' limit 1),
  null,
  '저는 그냥 예능 보면서 머리 비우는 게 낫던데요 사람마다 다른 듯',
  14,
  (select created_at from posts where title = '직장인 유튜브 채널 추천' limit 1) + interval '3 days' + interval '7 hours' + interval '17 minutes' + interval '1 second'
);

-- 프리랜서 개발자 월 수입 공유해드려요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1),
  null,
  '저도 비슷해요 5년차인데 500~600 사이 왔다갔다 해요',
  3,
  (select created_at from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1) + interval '1 days' + interval '20 hours' + interval '54 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1),
  null,
  '세금 떼면 많이 줄어들긴 하죠 그래도 직장보단 확실히 낫네요',
  1,
  (select created_at from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1) + interval '3 days' + interval '11 hours' + interval '17 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1),
  null,
  '단가 어떻게 협상하시는지 궁금하네요 저는 아직 낮게 받는 편이라',
  29,
  (select created_at from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1) + interval '4 days' + interval '16 hours' + interval '35 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1),
  null,
  '부럽습니다 저는 아직 그 정도는 아니에요 목표로 삼을게요',
  10,
  (select created_at from posts where title = '프리랜서 개발자 월 수입 공유해드려요' limit 1) + interval '2 days' + interval '17 hours' + interval '59 minutes' + interval '1 second'
);

-- 프리랜서 계약서 필수 조항이 뭐가 있나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1),
  null,
  '업무 범위 명확하게 안 적으면 나중에 잡무까지 다 떠맡게 돼요 꼭 구체적으로 쓰세요',
  2,
  (select created_at from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1) + interval '3 days' + interval '5 hours' + interval '15 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1),
  null,
  '대금 지급은 착수금/중도금/잔금 비율이랑 지급 날짜까지 못박아야 나중에 안 싸워요',
  14,
  (select created_at from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1) + interval '3 days' + interval '7 hours' + interval '54 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1),
  null,
  '저작권 조항도 중요해요 포트폴리오로 쓸 수 있는지 꼭 확인하세요',
  9,
  (select created_at from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1) + interval '1 days' + interval '5 hours' + interval '10 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1),
  null,
  '해지 조항 없으면 나중에 계약 파기당해도 아무 보상 못 받아요 꼭 넣으세요',
  3,
  (select created_at from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1) + interval '0 days' + interval '2 hours' + interval '14 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1),
  null,
  '표준계약서 양식 찾아서 참고하시고 변호사 검토 한 번 받아보시는 것도 추천드려요',
  1,
  (select created_at from posts where title = '프리랜서 계약서 필수 조항이 뭐가 있나요' limit 1) + interval '2 days' + interval '5 hours' + interval '44 minutes' + interval '1 second'
);

-- 프리랜서 실업급여 받을 수 있나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1),
  null,
  '예술인 고용보험이면 계약 안 끊겨도 14일 연속 일 없으면 신청 가능해요',
  29,
  (select created_at from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1) + interval '4 days' + interval '5 hours' + interval '0 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1),
  null,
  '제도는 있는데 실제로 받기 까다롭다는 얘기 많더라고요 소득 파악이 어려워서',
  49,
  (select created_at from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1) + interval '3 days' + interval '12 hours' + interval '38 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1),
  null,
  '일반 프리랜서(사업소득자)는 대상 아니고 예술인 특례 분야만 되는 걸로 알아요',
  41,
  (select created_at from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1) + interval '0 days' + interval '10 hours' + interval '20 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1),
  null,
  '가입 조건 까다로워요 월 50만원 미만이면 아예 안 될 수도 있으니 확인해보세요',
  24,
  (select created_at from posts where title = '프리랜서 실업급여 받을 수 있나요' limit 1) + interval '2 days' + interval '9 hours' + interval '44 minutes' + interval '1 second'
);

-- 프리랜서 포트폴리오 어떻게 관리하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1),
  null,
  '저는 노션이 제일 편해요 수정도 쉽고 링크 공유도 간편하고',
  16,
  (select created_at from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1) + interval '1 days' + interval '5 hours' + interval '51 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1),
  null,
  '비핸스는 비주얼 작업이면 확실히 좋아요 검색 유입도 있고',
  14,
  (select created_at from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1) + interval '0 days' + interval '22 hours' + interval '31 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1),
  null,
  '개인 사이트 하나 파두면 신뢰도가 확실히 올라가는 느낌이에요',
  18,
  (select created_at from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1) + interval '1 days' + interval '9 hours' + interval '26 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1),
  null,
  '저는 노션+개인사이트 같이 써요 용도가 좀 다르더라고요',
  13,
  (select created_at from posts where title = '프리랜서 포트폴리오 어떻게 관리하세요' limit 1) + interval '0 days' + interval '14 hours' + interval '8 minutes' + interval '1 second'
);

-- 프리랜서 건강보험료 줄이는 법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1),
  null,
  '임의계속가입 신청하세요 퇴사 전 내던 금액만 최대 3년 유지 가능해요',
  9,
  (select created_at from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1) + interval '1 days' + interval '9 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1),
  null,
  '가족 중에 직장가입자 있으면 피부양자로 들어가는 게 제일 확실해요 소득 2천만원 안 넘으면',
  49,
  (select created_at from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1) + interval '4 days' + interval '6 hours' + interval '51 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1),
  null,
  '소득 줄었으면 공단에 전화해서 조정 신청하세요 저는 이걸로 꽤 줄였어요',
  38,
  (select created_at from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1) + interval '3 days' + interval '8 hours' + interval '51 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1),
  null,
  '차량이나 재산도 영향 줘요 소형차로 바꾸는 것도 방법이라고 하더라고요',
  44,
  (select created_at from posts where title = '프리랜서 건강보험료 줄이는 법' limit 1) + interval '3 days' + interval '8 hours' + interval '55 minutes' + interval '1 second'
);

-- 세전 세후 차이 왜 이렇게 크나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1),
  null,
  '연봉 6000이면 누진세 구간 올라가서 그래요 소득세만 해도 꽤 나갑니다',
  14,
  (select created_at from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1) + interval '2 days' + interval '4 hours' + interval '12 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1),
  null,
  '4대보험+소득세+지방소득세 다 합치면 원래 그정도 빠져요 다들 똑같아요',
  8,
  (select created_at from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1) + interval '0 days' + interval '15 hours' + interval '20 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1),
  null,
  '부양가족 있으면 공제 좀 더 받을 수 있어요 연말정산 때 챙기세요',
  21,
  (select created_at from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1) + interval '4 days' + interval '5 hours' + interval '46 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1),
  null,
  '처음 월급 받을 때 다들 이 현타 한 번씩은 온다고 하더라고요',
  31,
  (select created_at from posts where title = '세전 세후 차이 왜 이렇게 크나요' limit 1) + interval '2 days' + interval '1 hours' + interval '45 minutes' + interval '1 second'
);

-- 성과급 기준이 불투명해요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '성과급 기준이 불투명해요' limit 1),
  null,
  '낮은 점수 자체보다 왜 그런지 설명을 안 해주는 게 제일 화나는 거 같아요',
  29,
  (select created_at from posts where title = '성과급 기준이 불투명해요' limit 1) + interval '1 days' + interval '10 hours' + interval '21 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '성과급 기준이 불투명해요' limit 1),
  null,
  '저희 회사도 면담 때 그냥 애매한 말로만 넘어가더라고요 구체적 지표 요구해보세요',
  31,
  (select created_at from posts where title = '성과급 기준이 불투명해요' limit 1) + interval '3 days' + interval '4 hours' + interval '32 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '성과급 기준이 불투명해요' limit 1),
  null,
  '인사평가 기준 문서로 공개하라고 요구할 권리 있어요 안 알려주면 이상한 거예요',
  9,
  (select created_at from posts where title = '성과급 기준이 불투명해요' limit 1) + interval '0 days' + interval '5 hours' + interval '32 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '성과급 기준이 불투명해요' limit 1),
  null,
  '성과급은 원래 회사 마음이라 기준 투명한 곳 찾기가 힘든 것 같아요',
  30,
  (select created_at from posts where title = '성과급 기준이 불투명해요' limit 1) + interval '2 days' + interval '15 hours' + interval '3 minutes' + interval '1 second'
);

-- 직급별 연봉 밴드 공유 (대기업)
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1),
  null,
  '저희는 사원 4000중반, 대리 5000초반, 과장 6000대 정도예요',
  6,
  (select created_at from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1) + interval '1 days' + interval '10 hours' + interval '58 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1),
  null,
  '회사마다 편차 진짜 커서 그냥 참고만 하시는 게 좋을 듯',
  47,
  (select created_at from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1) + interval '0 days' + interval '17 hours' + interval '28 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1),
  null,
  '부장까지 가면 거의 1억 근처인 곳도 있더라고요 부럽습니다',
  42,
  (select created_at from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1) + interval '1 days' + interval '23 hours' + interval '8 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1),
  null,
  '이런 정보 진짜 유용해요 저장해둡니다',
  29,
  (select created_at from posts where title = '직급별 연봉 밴드 공유 (대기업)' limit 1) + interval '1 days' + interval '22 hours' + interval '56 minutes' + interval '1 second'
);

-- 연봉 인상률 물가 상승률도 못 따라가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1),
  null,
  '이거 팩트예요 실질임금 계속 마이너스라는 기사 얼마전에도 봤어요',
  36,
  (select created_at from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1) + interval '0 days' + interval '6 hours' + interval '51 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1),
  null,
  '명목으로는 올랐어도 물가 반영하면 사실상 삭감인 거 맞아요',
  22,
  (select created_at from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1) + interval '2 days' + interval '3 hours' + interval '10 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1),
  null,
  '회사가 인상률 3%면 그냥 동결이나 마찬가지라고 봐야될 듯',
  2,
  (select created_at from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1) + interval '4 days' + interval '13 hours' + interval '20 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1),
  null,
  '이러니 다들 이직으로 연봉 올리려는 거죠 회사 내 인상은 의미가 없어요',
  5,
  (select created_at from posts where title = '연봉 인상률 물가 상승률도 못 따라가요' limit 1) + interval '0 days' + interval '0 hours' + interval '21 minutes' + interval '1 second'
);

-- 퇴직금 중간 정산 하는 게 나을까요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1),
  null,
  '중간정산 사유 엄격하게 제한돼있어서 아무 때나 되는 것도 아니에요 확인해보세요',
  9,
  (select created_at from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1) + interval '2 days' + interval '22 hours' + interval '46 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1),
  null,
  '회사가 해줄 의무는 없어요 법적으로 거부할 수 있는 걸로 알아요',
  25,
  (select created_at from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1) + interval '2 days' + interval '5 hours' + interval '21 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1),
  null,
  '세금도 미리 떼고 받는 거라 나중에 생각보다 덜 받을 수도 있어요',
  47,
  (select created_at from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1) + interval '3 days' + interval '18 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1),
  null,
  '저는 중간정산 했다가 나중에 후회했어요 그냥 안 하는 게 낫다고 봅니다',
  3,
  (select created_at from posts where title = '퇴직금 중간 정산 하는 게 나을까요' limit 1) + interval '2 days' + interval '5 hours' + interval '1 minutes' + interval '1 second'
);

-- 직장에서 친한 친구 사귀기 어렵나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1),
  null,
  '30대 넘으면 원래 새로운 친구 사귀기 힘들어요 직장이든 어디든',
  46,
  (select created_at from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1) + interval '4 days' + interval '20 hours' + interval '7 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1),
  null,
  '저도 그랬는데 그냥 좋은 동료 정도로 만족하기로 했어요',
  25,
  (select created_at from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1) + interval '3 days' + interval '8 hours' + interval '55 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1),
  null,
  '점심 같이 먹는 사람 한둘만 있어도 충분한 것 같아요',
  44,
  (select created_at from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1) + interval '4 days' + interval '5 hours' + interval '46 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1),
  null,
  '너무 친해지려 하지 말고 자연스럽게 두는 것도 방법이에요',
  33,
  (select created_at from posts where title = '직장에서 친한 친구 사귀기 어렵나요' limit 1) + interval '2 days' + interval '4 hours' + interval '26 minutes' + interval '1 second'
);

-- 업무 중 실수하면 어떻게 대처하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1),
  null,
  '바로 보고하고 수습 방법 같이 제시하는 게 제일 중요해요 숨기면 더 커져요',
  16,
  (select created_at from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1) + interval '3 days' + interval '11 hours' + interval '14 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1),
  null,
  '저도 큰 실수 했었는데 빨리 인정하고 사과하니까 오히려 신뢰 회복 빨랐어요',
  14,
  (select created_at from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1) + interval '2 days' + interval '17 hours' + interval '33 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1),
  null,
  '실수 자체보다 대처하는 태도를 더 많이 보는 것 같아요',
  5,
  (select created_at from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1) + interval '0 days' + interval '21 hours' + interval '15 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1),
  null,
  '누구나 한 번씩 하는 거예요 너무 자책하지 마세요',
  40,
  (select created_at from posts where title = '업무 중 실수하면 어떻게 대처하세요' limit 1) + interval '2 days' + interval '17 hours' + interval '41 minutes' + interval '1 second'
);

-- 워라밸 챙기면서도 성과 잘 내는 방법
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1),
  null,
  '워라밸 챙겨야 오히려 집중력이 올라간다는 연구도 있어요 무작정 오래 있는게 답 아님',
  23,
  (select created_at from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1) + interval '1 days' + interval '14 hours' + interval '43 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1),
  null,
  '그 사람들 보면 업무시간에 집중력이 남달라요 잡담 안 하고 바로 일함',
  6,
  (select created_at from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1) + interval '0 days' + interval '11 hours' + interval '25 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1),
  null,
  '우선순위 정리하고 불필요한 회의 줄이는 것만으로도 확실히 시간 절약돼요',
  44,
  (select created_at from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1) + interval '2 days' + interval '5 hours' + interval '41 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1),
  null,
  '저도 야근 안 하려고 노력하는데 오히려 낮 시간에 더 몰입하게 되더라고요',
  2,
  (select created_at from posts where title = '워라밸 챙기면서도 성과 잘 내는 방법' limit 1) + interval '0 days' + interval '18 hours' + interval '36 minutes' + interval '1 second'
);

-- 직장 상사한테 반박하면 안 되나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1),
  null,
  '타이밍이 중요한 것 같아요 회의 중보다 따로 말씀드리는 게 나아요',
  29,
  (select created_at from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1) + interval '2 days' + interval '1 hours' + interval '1 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1),
  null,
  '데이터나 근거 가지고 얘기하면 반박이 아니라 의견 제시로 받아들여지더라고요',
  6,
  (select created_at from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1) + interval '0 days' + interval '12 hours' + interval '20 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1),
  null,
  '저희 팀장님은 반박해도 괜찮은데 회사마다 문화 차이 큰 것 같아요',
  34,
  (select created_at from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1) + interval '4 days' + interval '16 hours' + interval '13 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1),
  null,
  '틀린 걸 알면서도 그냥 넘어가는 게 더 위험할 때도 있어요',
  43,
  (select created_at from posts where title = '직장 상사한테 반박하면 안 되나요' limit 1) + interval '4 days' + interval '2 hours' + interval '42 minutes' + interval '1 second'
);

-- 동료가 내 공을 가로채요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '동료가 내 공을 가로채요' limit 1),
  null,
  '이메일로 미리 아이디어 공유해두세요 나중에 근거자료 됩니다',
  2,
  (select created_at from posts where title = '동료가 내 공을 가로채요' limit 1) + interval '0 days' + interval '11 hours' + interval '39 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '동료가 내 공을 가로채요' limit 1),
  null,
  '회의록에 발언자 남기는 습관 들이면 이런 일 방지할 수 있어요',
  36,
  (select created_at from posts where title = '동료가 내 공을 가로채요' limit 1) + interval '4 days' + interval '3 hours' + interval '0 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '동료가 내 공을 가로채요' limit 1),
  null,
  '상사한테 차분하게 사실관계만 말씀드리세요 감정적으로 대응하면 오히려 불리해요',
  28,
  (select created_at from posts where title = '동료가 내 공을 가로채요' limit 1) + interval '1 days' + interval '11 hours' + interval '8 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '동료가 내 공을 가로채요' limit 1),
  null,
  '저도 겪어봤는데 문서화 안 해두면 증명하기 진짜 힘들어요 꼭 기록 남기세요',
  13,
  (select created_at from posts where title = '동료가 내 공을 가로채요' limit 1) + interval '3 days' + interval '10 hours' + interval '9 minutes' + interval '1 second'
);

-- 면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1),
  null,
  '그냥 이 회사에서 기여하고 싶은 부분 짧게 어필하고 마무리해요',
  37,
  (select created_at from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1) + interval '1 days' + interval '20 hours' + interval '2 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1),
  null,
  '질문 하나 준비해가는 것도 좋아요 관심 있어 보이는 인상 줌',
  27,
  (select created_at from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1) + interval '1 days' + interval '19 hours' + interval '10 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1),
  null,
  '너무 길게 말하면 오히려 마이너스예요 임팩트 있게 짧게 하세요',
  49,
  (select created_at from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1) + interval '0 days' + interval '21 hours' + interval '50 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1),
  null,
  '저는 감사 인사 위주로 하는데 그것만으로도 충분한 것 같아요',
  10,
  (select created_at from posts where title = '면접에서 "마지막으로 하고 싶은 말" 어떻게 하세요' limit 1) + interval '3 days' + interval '7 hours' + interval '27 minutes' + interval '1 second'
);

-- 이직할 때 연봉 30% 올리기 가능한가요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1),
  null,
  '30~40%까지도 가능하다고는 하는데 본인 성과를 숫자로 증명할 수 있어야 해요',
  48,
  (select created_at from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1) + interval '3 days' + interval '12 hours' + interval '16 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1),
  null,
  '저는 8%씩 몇 번 나눠서 결국 30% 채웠어요 한 번에는 힘들더라고요',
  1,
  (select created_at from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1) + interval '2 days' + interval '0 hours' + interval '46 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1),
  null,
  '너무 연봉만 보고 가면 나중에 조직문화나 성장성에서 후회할 수도 있어요',
  43,
  (select created_at from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1) + interval '4 days' + interval '7 hours' + interval '48 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1),
  null,
  '가능은 한데 흔한 케이스는 아니에요 협상력이 있어야 함',
  21,
  (select created_at from posts where title = '이직할 때 연봉 30% 올리기 가능한가요' limit 1) + interval '0 days' + interval '20 hours' + interval '19 minutes' + interval '1 second'
);

-- 취업 공백기 이력서에 어떻게 쓰나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1),
  null,
  '숨기지 말고 그냥 사실대로 쓰세요 어차피 면접에서 물어봐요',
  7,
  (select created_at from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1) + interval '4 days' + interval '11 hours' + interval '32 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1),
  null,
  '공백기간 뭘 했는지보다 뭘 배웠는지로 포장하는 게 포인트예요',
  19,
  (select created_at from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1) + interval '1 days' + interval '11 hours' + interval '29 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1),
  null,
  '너무 길게 설명하면 오히려 변명처럼 들려요 짧고 명확하게',
  29,
  (select created_at from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1) + interval '2 days' + interval '21 hours' + interval '23 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1),
  null,
  '저도 1년 공백 있었는데 그 시간에 자격증 딴 걸로 자연스럽게 넘겼어요',
  4,
  (select created_at from posts where title = '취업 공백기 이력서에 어떻게 쓰나요' limit 1) + interval '3 days' + interval '20 hours' + interval '58 minutes' + interval '1 second'
);

-- 최종면접 탈락 후 피드백 받을 수 있나요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1),
  null,
  '요청하는 거 자체는 실례 아니에요 다만 실제로 답 주는 회사는 별로 없더라고요',
  4,
  (select created_at from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1) + interval '2 days' + interval '5 hours' + interval '8 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1),
  null,
  '감사 인사부터 하고 정중하게 여쭤보면 크게 문제 될 건 없어요',
  8,
  (select created_at from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1) + interval '1 days' + interval '12 hours' + interval '43 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1),
  null,
  '저도 몇 번 요청해봤는데 답 온 적은 딱 한 번뿐이었어요 큰 기대는 마세요',
  3,
  (select created_at from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1) + interval '1 days' + interval '23 hours' + interval '23 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1),
  null,
  '10명 중 1명만 받는다는 통계도 있더라고요 그래도 밑져야 본전이니 물어보세요',
  13,
  (select created_at from posts where title = '최종면접 탈락 후 피드백 받을 수 있나요' limit 1) + interval '2 days' + interval '3 hours' + interval '32 minutes' + interval '1 second'
);

-- 헤드헌터 연락 받으면 어떻게 하세요
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1),
  null,
  '일단 통화라도 해보세요 지금 이직 생각 없어도 나중에 도움될 수 있어요',
  4,
  (select created_at from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1) + interval '1 days' + interval '13 hours' + interval '29 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1),
  null,
  '관심있는 회사나 직무 말해두면 나중에 딱 맞는 자리 연락 오기도 하더라고요',
  16,
  (select created_at from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1) + interval '4 days' + interval '14 hours' + interval '29 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1),
  null,
  '재직중이어도 크게 부담 갖지 말고 정보 얻는다 생각하고 편하게 응대하세요',
  33,
  (select created_at from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1) + interval '1 days' + interval '1 hours' + interval '53 minutes' + interval '1 second'
);
insert into comments (post_id, user_id, content, likes_count, created_at)
values (
  (select id from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1),
  null,
  '저는 그냥 연락처만 남겨두고 나중에 진짜 이직할 때 다시 연락했어요',
  19,
  (select created_at from posts where title = '헤드헌터 연락 받으면 어떻게 하세요' limit 1) + interval '1 days' + interval '21 hours' + interval '23 minutes' + interval '1 second'
);
