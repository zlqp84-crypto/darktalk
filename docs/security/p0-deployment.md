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
운영 테스트용 계정/게시글/댓글은 생성하지 않았다.

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
운영에서는 익명 읽기/차단 검증을 수행했으며 실제 로그인, OTP 인증 및 Storage 파일 업로드 E2E는 미실행이다.
세부 권한 결과와 각 RLS 정책은 `p0-remediation.md`에 기록했다.

## 사용 및 후속 배포 주의

이미 열려 있던 사이트는 새로고침해 새 앱 코드를 불러와야 한다.
구버전 앱의 전체 컬럼 조회는 강화된 DB 정책에서 거부된다.
보안 정책을 되돌려 구버전 앱에 맞추지 않는다.

최초 앱 배포는 로컬 작업 트리에서 Vercel CLI로 직접 수행했다.
동일한 코드·migration·테스트·적용 기록을 Git에도 반영한다.
이후 Git 자동 배포에서도 이 보안 변경을 유지해야 한다. DB migration은 이미 적용했으므로
앱 배포와 별개로 무조건 재실행하지 않는다.
