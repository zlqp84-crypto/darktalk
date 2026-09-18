# P0 수정 내용 및 권한 검증

## 적용 상태

2026-09-18(KST) 운영 Supabase에 두 migration을 적용하고 Vercel 운영 배포로 전환했다.
격리 DB 테스트 168개와 운영 익명 HTTP 권한 검증을 통과했다.
후속 검증에서 관리자 계정 로그인·OTP 성공을 사용자 확인 및 Auth 로그로 검증하고,
실제 이미지 업로드·비로그인 공개 표시·테스트 데이터 정리를 완료했다.
배포 근거와 검증 범위는 `p0-deployment.md`에 기록했다.

실제 스키마 확인 근거는 `p0-schema-snapshot.md`에 기록했다.
새 운영 테이블/컬럼 없이 현재 구조의 RLS·컬럼 권한·RPC를 변경한다.
P1 카운터 조작 방지, 가입 후 프로필 생성, 신고/탈퇴, EXIF 제거, 로그 개선은 범위에서 제외했다.

## 변경 파일

| 파일 | 변경 |
|---|---|
| lib/publicContent.ts | 공개 SELECT 허용 목록, 타입, 식별 필드를 제거하는 명시적 DTO |
| app/page.tsx | 홈 조회 및 클라이언트 props에서 전체 행 전달 제거 |
| app/board/[category]/page.tsx | 게시판 전체 컬럼 조회 제거 |
| app/(main)/post/[id]/page.tsx | 상세/관련 글/댓글/댓글 INSERT 응답의 프로필 조인 및 전체 행 제거. 작성자는 익명 표시 |
| lib/authorDisplay.ts | 원본 닉네임을 받은 뒤 마스킹하던 미사용 파일 삭제 |
| app/admin/page.tsx | 목록·통계를 보호된 RPC로 변경. 삭제 RPC 이름 유지 |
| app/write/page.tsx | 이미지 경로를 계정 UUID 폴더에서 public/랜덤UUID.확장자로 변경 |
| supabase/migrations/20260917120000_p0_content_privacy_and_permissions.sql | 컬럼 권한, 7개 RLS, 작성자 기본값, 관리자 보호 RPC |
| supabase/migrations/20260917121000_p0_image_identity.sql | 이미지 경로·소유권 RLS, 공개 객체 메타데이터 열람 차단 |
| supabase/sql/add_admin_support.sql | migration 이후 구형 MFA 없는 함수 복구 차단 |
| supabase/sql/grant_admin_with_mfa.sql | migration 이후 보호 RPC 덮어쓰기 차단 |
| supabase/sql/setup_post_images_storage.sql | migration 이후 구형 공개 객체 목록 정책 복구 차단 |
| tests/security/observed-schema.sql | 실제 확인한 public 스키마와 최소 service fixture |
| tests/security/permissions.test.mjs | SQL 권한/우회/회귀 테스트 |
| package.json, package-lock.json | 개발용 PGlite와 test:security 실행 명령 |
| docs/security/p0-schema-snapshot.md | 변경 전 DB 조사 기록 |
| docs/security/p0-remediation.md | 이 보고서 |
| docs/security/p0-deployment.md | 운영 적용 및 검증 기록 |
| .vercelignore | 환경 파일, SQL, 테스트, 문서, 기존 소스 압축 파일을 배포 업로드에서 제외 |

## 변경 SQL과 각 RLS 정책

RLS만으로 컬럼을 숨길 수 없으므로 테이블 전체 권한과 기존 컬럼 권한을 먼저 회수한다.
아래 SELECT 컬럼만 공개 허용한다. `user_id`, `is_anonymous`, 원본 프로필은 포함하지 않는다.

- posts: id, title, content, category, likes_count, comments_count, views_count, created_at, image_urls.
- comments: id, post_id, content, created_at, likes_count.
- profiles: authenticated만 접근 가능하며 RLS로 본인 행만 보인다. 개인 계정 화면/Header와 MFA 진입에 필요한 본인의 is_admin 읽기는 유지한다.

| 정책 | 대상 | 명령/역할 | 조건 |
|---|---|---|---|
| posts_public_read | posts | SELECT anon/authenticated | true. 컬럼 허용 목록으로 정보 제한 |
| posts_insert_own | posts | INSERT authenticated | auth.uid() IS NOT NULL AND user_id=auth.uid() |
| comments_public_read | comments | SELECT anon/authenticated | true. 컬럼 허용 목록으로 정보 제한 |
| comments_insert_own | comments | INSERT authenticated | auth.uid() IS NOT NULL AND user_id=auth.uid() |
| profiles_select_own | profiles | SELECT authenticated | id=auth.uid() |
| profiles_insert_own | profiles | INSERT authenticated | id=auth.uid() AND is_admin=false AND is_verified=false |
| profiles_update_own | profiles | UPDATE authenticated | USING 및 WITH CHECK 모두 id=auth.uid() |
| post_images_insert_own | storage.objects | INSERT authenticated | post-images 버킷, owner_id=auth.uid()::text, public/UUID.허용확장자 경로 |
| post_images_select_own | storage.objects | SELECT authenticated | post-images 버킷, owner_id=auth.uid()::text |
| post_images_delete_own | storage.objects | DELETE authenticated | post-images 버킷, owner_id=auth.uid()::text |

추가 컬럼 권한:

- posts INSERT: user_id, title, content, category, image_urls만.
- comments INSERT: post_id, user_id, content만.
- profiles INSERT: id, nickname, company, job_title만.
- profiles UPDATE: nickname, company, job_title만.
- is_admin/is_verified는 INSERT·UPDATE·UPSERT로 설정 불가.
- 일반 API의 posts/comments UPDATE·DELETE는 기존처럼 허용하지 않는다. 기존 관리자 삭제 RPC는 유지한다.
- posts/comments.user_id 기본값은 auth.uid(). 명시적으로 타인 ID 또는 NULL을 보내면 RLS에서 거부한다.
- 기존 user_id=NULL 샘플 행은 그대로 읽을 수 있다. 스키마/데이터 파괴를 피하려고 NOT NULL 변경이나 기존 행 소유자 추정을 하지 않았다.

## 관리자 RPC

다음 모든 진입점에서 `require_admin_aal2()`를 호출한다.

- admin_get_stats()
- admin_list_posts()
- admin_list_comments()
- admin_list_profiles()
- admin_delete_post(uuid)
- admin_delete_comment(uuid)

공통 검증: auth.uid() 존재 + 저장된 profiles.is_admin=true + JWT aal='aal2'.
사용자가 수정 가능한 user_metadata의 관리자 값은 신뢰하지 않는다.
모든 SECURITY DEFINER 함수에 빈 search_path와 명시적 스키마 이름을 사용한다.
관리자 RPC는 PUBLIC/anon 실행권한을 회수하고 authenticated에게만 EXECUTE를 준다.
내부 guard는 authenticated에서도 직접 실행할 수 없다.
관리자도 profiles 직접 SELECT에서는 본인 행만 보며, 전체 회원 목록은 보호된 RPC로만 얻는다.
기존 관리자 계정 지정 값은 바꾸지 않는다.

## 권한 테스트 결과

실행 환경: Node 24 + PGlite(PostgreSQL WASM), 실제 조사한 public 스키마 복제본.
각 테스트는 anon/authenticated role과 테스트 JWT claims를 지정한다. 사용자 A/B와 관리자는
로컬 fixture 계정이며, 운영 Auth 계정을 만들거나 로그인한 결과가 아니다.
각 변경 테스트는 트랜잭션 ROLLBACK으로 종료한다.

| 검증 | anon | user A | user B | admin aal1 | admin aal2 |
|---|---|---|---|---|---|
| 식별 필드 없는 글/댓글 조회 | 허용 | 허용 | 허용 | 허용 | 허용 |
| user_id / SELECT * / 전체 행 JSON | 차단 | 차단 | 차단 | 차단 | 차단 |
| user_id 필터로 작성자 추론 / 원본 프로필 조인 | 차단 | 차단 | 차단 | 차단 | 차단 |
| 프로필 직접 조회 | 차단 | 본인만 | 본인만 | 본인만 | 본인만 |
| 관리자 목록·통계 RPC | 차단 | 차단 | 차단 | 차단 | 허용 |
| 관리자 글/댓글 삭제 RPC | 차단 | 차단 | 차단 | 차단 | 허용 |
| Storage 객체 메타데이터 | 없음 | 본인만 | 본인만 | 본인만 | 본인만 |

A/B 각각 확인: 본인 명의 글·댓글 작성 및 안전한 RETURNING 성공,
타인 명의/NULL 작성 거부, 작성자 생략 시 DB가 auth.uid() 할당,
타인 프로필 열람·수정 불가, 본인 일반 필드 수정 가능,
is_admin/is_verified 직접 변경·UPSERT 승격 불가, 프로필 ID 변경/삭제 불가.
추가 확인: 신규 본인 프로필 생성 시 권한 false 유지, INSERT 권한 승격 거부,
MFA를 마친 일반 사용자의 위조 user_metadata 거부, 관리자 aal 누락 거부,
글 삭제 시 댓글 삭제, 기존 카운터 호출 유지, 구형 SQL 재실행 차단, migration 재실행 가능.

실행 명령:

```sh
npm run test:security
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

확인 결과:

- 권한/회귀/사전검증 테스트: 168개 통과, 실패 0개.
- TypeScript: 통과.
- ESLint: 오류 0개, 기존 이미지 경고 3개.
- 프로덕션 빌드: 통과.
- 실제 운영 Supabase에 새 공개 컬럼 목록으로 읽기 전용 GET: posts/comments 모두 HTTP 200,
  반환 필드에 user_id/nickname/profiles 없음. migration 적용 후에도 확인했다.
- 운영 익명 HTTP에서 식별 컬럼, 전체 컬럼, 작성자 필터, 프로필 조인/조회,
  관리자 통계·회원 목록 RPC 접근은 HTTP 401 / PostgreSQL 42501로 차단됐다.

후속 운영 검증에서 관리자 계정의 실제 로그인·OTP 성공 로그와 이미지 업로드·공개 표시를 확인했다.
일반 사용자 A/B의 실계정 E2E 및 Storage 타인 소유권 우회 HTTP 검증은 미실행이다.
Storage 소유권 분리 테스트는 최소 service fixture에서 수행했다.
공개 버킷 파일 다운로드는 Supabase가 SELECT RLS를 우회해 제공하므로 객체 목록을 비공개로 바꾸어도 파일 공개 표시는 유지하는 설계다.

## 적용 절차와 호환성

1. 배포 직전 현재 스키마/정책과 기존 관리자 지정 상태를 다시 확인한다. migration은 미확인 정책/컬럼 타입 변경을 발견하면 중단한다.
2. 변경된 앱과 두 migration을 하나의 조정된 배포로 적용한다. 공개 컬럼 차단 후 기존 앱의 `select('*')`는 의도적으로 실패하고, 새 앱의 관리자 RPC/이미지 업로드는 migration 적용 전에는 동작하지 않는다. 무중단 롤링 호환 배포용 변경은 아니다.
3. migration을 파일명 순서대로 적용하고 수정된 앱으로 전환한다. 기존 앱을 계속 서비스하는 상태에서 DB만 먼저 강화하지 않는다.
4. 과거 식별 필드가 포함됐을 수 있는 페이지/ISR 캐시를 무효화한다.
5. 스테이징에서 실제 A/B 로그인, 관리자 MFA 전/후, PostgREST 직접 요청과 이미지 업로드/공개 다운로드를 확인한 뒤 공개한다.
6. 기존 UID 이미지 경로가 새로 생겼다면 두 번째 migration이 중단된다. 객체 이동과 URL 갱신을 먼저 별도로 검토한다. 보안 정책을 구버전 SQL로 되돌리는 방식으로 해결하지 않는다.

## 참고

- [Supabase 컬럼 권한](https://supabase.com/docs/guides/database/postgres/column-level-security)
- [Supabase Storage 소유권](https://supabase.com/docs/guides/storage/security/ownership)
- [공개 버킷 다운로드와 RLS](https://supabase.com/docs/guides/storage/buckets/fundamentals)
