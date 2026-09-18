# 기업 리뷰 · 2026-09-19

- 운영 기존 companies/profiles/admin MFA guard를 확인하고 별도 company_reviews 테이블과 RPC 7개를 추가했다.
- company_reviews RLS 활성화. 브라우저 역할은 테이블 권한과 정책 모두 없음. DB 소유자 권한 RPC가 사용자와 열람 기한을 검사하며 작성자 ID를 반환하지 않는다.
- 제출 user_id는 auth.uid()로만 설정. 회사당 1건, 사용자별 24시간 제출 제한. 동시 제출은 사용자별 advisory lock으로 직렬화한다.
- 승인 후 90일 열람. 승인 대기/반려/철회 및 만료 상태는 열람권 없음. 여러 리뷰 중 유효한 승인 건이 하나 이상이면 열람 가능.
- 관리자 검수 조회/처리는 require_admin_aal2()를 호출한다. 본인 리뷰 승인 금지. 승인 반복으로 기간 연장 불가.
- 반려/철회 리뷰는 24시간 제한 이후 재제출 가능. 재제출 시 승인 상태/기한 초기화.
- 본문은 React 텍스트로 렌더링한다. 공개 DTO는 리뷰 ID, 평점, 제목, 장점, 단점, 공개 날짜만 포함한다.
- 별도 서버 로그에 본문/작성자/토큰을 기록하지 않는다. DB에는 중복 제출 방지 및 열람권을 위해 계정 연결을 보관한다. 외부 익명성과 운영 DB에서의 비식별은 다르다.
- 회귀 테스트 233개 통과. TypeScript 및 production build 통과. ESLint 오류 0, 기존 img 경고 3개.
- 평점 집계/연봉, 재직 인증, 리뷰 신고, 세부 관리자 감사 이력은 이번 버전에 포함하지 않았다. 작성자는 직접 경험 여부를 확인하고 제출한다.

## 운영 적용 및 확인

- 2026-09-19 기존 DB에 company_reviews 없음, require_admin_aal2() 존재, 기업 119,376행 및 profiles 컬럼을 재확인 후 SQL Editor로 migration 적용 성공.
- Git 커밋 5c1e306, Vercel 배포 3rCYb7CJqn1XavHbSkqsjpZS3s7m Ready 확인. darktalk.vercel.app 기존 주소 유지.
- 운영 익명 API: raw company_reviews SELECT, list_company_reviews, admin_company_reviews 모두 HTTP 401 / SQLSTATE 42501.
- 운영 비로그인 화면: 삼성전자 상세의 90일 열람 안내 및 잠금 상태, 리뷰 작성 경로의 로그인 안내 확인.
- A/B/관리자 aal1/aal2 테스트는 격리 PGlite 역할/JWT claims 테스트다. 운영 실계정 작성→승인→열람 E2E는 아직 미실행.
