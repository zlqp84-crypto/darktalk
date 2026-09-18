# P0 운영 적용 기록

적용일: 2026-09-18 (Asia/Seoul).

## 적용 대상

- 운영 사이트: https://darktalk.vercel.app
- Supabase 프로젝트: lvmvadjpzwqoiynoqosy
- Vercel 배포 ID: dpl_Bh2Nm5EyB1UQoy5e9mP6HUfPmmvm
- 배포 URL: https://darktalk-q7tahhxbv-darktalk.vercel.app
- SQL: `20260917120000_p0_content_privacy_and_permissions.sql`, `20260917121000_p0_image_identity.sql`

## 적용 과정과 데이터 보존

새 앱을 Vercel production 대상으로 빌드하되 운영 도메인 전환을 보류했다.
운영 DB에서 두 migration을 한 트랜잭션으로 실행하고 사후 권한 조건을 검사한 뒤
ROLLBACK하는 사전 검증을 통과했다. 같은 SQL을 COMMIT한 후 새 배포를 운영 도메인으로 promote했다.
SQL Editor로 적용했으며 Supabase CLI migration 이력 등록은 수행하지 않았다.
향후 CLI 기반 배포를 도입할 때는 실제 DB 정의와 migration 이력을 먼저 대조해야 한다.

적용 직전/직후 posts 80개, comments 327개, profiles 1개가 유지됐다.
기존 관리자 지정은 변경하지 않았다. 적용 직전 기존 이미지 객체와 이미지 포함 게시글은 0개였다.
최초 배포 검증에서는 운영 테스트용 계정/게시글/댓글을 생성하지 않았다.

## 확인 결과

| 항목 | 결과 |
|---|---|
| 로컬 PostgreSQL 권한/회귀 테스트 | 168개 통과, 실패 0개 |
| TypeScript / production build | 통과 |
| ESLint | 오류 0개, 기존 이미지 경고 3개 |
| 운영 posts/comments 공개 허용 컬럼 GET | HTTP 200, 식별 필드 없음 |
| 운영 posts/comments user_id 또는 전체 컬럼 GET | HTTP 401, DB 권한 오류 42501 |
| 운영 user_id 필터 / 원본 프로필 조인 | HTTP 401, DB 권한 오류 42501 |
| 운영 익명 profiles 조회 | HTTP 401, DB 권한 오류 42501 |
| 운영 익명 admin_get_stats / admin_list_profiles | HTTP 401, DB 권한 오류 42501 |
| 홈·게시판·글 상세·로그인·가입·관리자 경로 | HTTP 200 (관리자 권한 허용을 의미하지 않음) |
| 운영 브라우저 자유게시판 | 실제 게시글 10개 로딩 확인 |
| 운영 브라우저 글 상세 | 본문·댓글 4개·관련 글 로딩, 작성자 모두 익명 표시 확인 |

A/B/admin aal1/aal2 권한 검증은 로컬 DB에서 역할과 JWT claims를 지정한 테스트다.
최초 배포 시에는 운영 익명 읽기/차단 검증을 수행했다. 후속 실사용 검증 결과는 아래와 같다.
세부 권한 결과와 각 RLS 정책은 `p0-remediation.md`에 기록했다.

## 후속 실사용 검증

- 기존 로그인 및 OTP 인증 완료 세션에서 관리자 통계, 게시글·댓글·회원 목록 조회 성공.
- 사용자의 테스트 게시/삭제 승인 후 개인정보 없는 480×240 PNG 1개 첨부 및 게시글 저장 성공.
- 게시글 상세 화면에서 이미지 로딩 성공(complete=true, naturalWidth=480, naturalHeight=240).
- 별도 비로그인 브라우저에서도 작성자 익명 표시 및 같은 이미지 로딩 성공.
- 이미지 공개 경로는 계정 UUID 폴더가 아닌 `public/랜덤UUID.png` 형식.
- 테스트 게시글 ID: `238653cf-0477-43ad-8b64-166bdaf4b589`.
- 테스트 객체: `post-images/public/326cdded-1ad0-46d9-9221-58aa36a5277f.png`.
- 테스트 이미지 객체는 Supabase Storage UI에서 삭제 완료(`Successfully deleted 1 file(s)` 확인).
- 테스트 게시글은 관리자가 삭제 확인창을 직접 처리했다. 이후 별도 비로그인 브라우저에서
  새로고침했을 때 '게시글을 찾을 수 없어요.'가 표시되어 삭제 완료를 확인했다.
- 사용자가 새 로그인 후 관리자 진입 시 OTP 표시 및 인증 성공을 확인했다.
- Supabase Auth 로그에서 2026-09-18 10:19:57 KST의 POST `/factors/.../verify` HTTP 200 확인.
  같은 시각 challenge 완료 및 Login 이벤트가 기록됐다. OTP 값과 인증 비밀은 읽거나 기록하지 않았다.
- Chrome 운영 관리자 화면에서 게시글 80개, 댓글 327개, 회원 1개 및 목록 정상 표시 확인.
  도구가 수집한 해당 탭의 브라우저 error/warn 로그는 0건이었다.
- 10:19:46 KST `/user` HTTP 403 `session_not_found` 경고도 확인됐다.
  별도 인앱 브라우저의 로그인 재이동과 관련될 가능성은 있으나 탭별 원인 연결은 확정하지 않았다.
- 사용자 직접 입력과 서버 로그로 로그인·OTP 성공을 확인했으며, 일반 사용자 A/B의 실계정 E2E는 미실행이다.

## 사용 및 후속 배포 주의

이미 열려 있던 사이트는 새로고침해 새 앱 코드를 불러와야 한다.
구버전 앱의 전체 컬럼 조회는 강화된 DB 정책에서 거부된다.
보안 정책을 되돌려 구버전 앱에 맞추지 않는다.

최초 앱 배포는 로컬 작업 트리에서 Vercel CLI로 직접 수행했다.
동일한 코드·migration·테스트·적용 기록을 Git에도 반영한다.
이후 Git 자동 배포에서도 이 보안 변경을 유지해야 한다. DB migration은 이미 적용했으므로
앱 배포와 별개로 무조건 재실행하지 않는다.
