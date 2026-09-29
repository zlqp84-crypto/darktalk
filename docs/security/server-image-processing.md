# 서버 이미지 정제 전환 절차

현재 상태(2026-09-29): 서버 키 검증 및 운영 이미지 정제 전환 완료. `SERVER_IMAGE_UPLOAD_ENABLED=true` 배포와 최종 업로드 차단 SQL을 적용했다. 사용자 확인 후 검증 게시글 1개와 공개 이미지 5개를 삭제했으며 DB 조회로 해당 게시글·파일 및 임시 원본 모두 0개임을 확인했다. 할당량·처리 이력용 job 기록은 유지한다.

## 운영 검증 결과

- 커밋 `4ad0d90` push 및 운영 반영. `/api/images`는 enabled=true, 인증된 `/api/images/cleanup` 호출은 HTTP 200, removed=0.
- 실제 로그인 세션으로 테스트 게시글 1개에 JPEG 2장, PNG·WebP·GIF 각 1장 등록 성공. 공개 파일 5개 모두 HTTP 200으로 로드됐고 EXIF/XMP/ICC/IPTC가 없었다. GIF는 2프레임 유지.
- `post_image_jobs` 5건 모두 ready 및 staging_removed=true. 비공개 임시 객체는 0개.
- 테스트 정리: 관리자 화면의 JavaScript 확인창 제어가 실패해 ID·제목이 일치하는 테스트 게시글 한 건만 SQL로 삭제하고, Storage 화면에서 파일명으로 확인한 이미지 5개를 삭제했다. 이번 정리는 앱의 관리자 삭제 기능 E2E 성공으로 계산하지 않는다.
- `activate_server_image_processing.sql` 롤백 사전 검증 후 커밋 적용. 제한적 Storage INSERT/UPDATE 정책 2개 존재 확인.
- 적용 후 운영 DB 롤백 트랜잭션에서 정상 이미지 참조와 이미지 없는 글 허용, 미정제 외부 URL 거부 확인. 운영 A/B 계정 간 공격 흐름은 재실행하지 않았다.
- 격리 DB 권한·이미지 변환 등을 포함한 전체 보안 테스트 279개 통과. 운영 업로드에서는 기존 클라이언트 정제도 거치므로 서버 자체 EXIF 제거는 별도 변환 테스트로 검증했다.
- Vercel Cron 활성화 및 `/api/images/cleanup` 등록 확인. UTC 18:00, 한국시간 다음 날 03:00 기준이며 Hobby 실행 시간은 1시간 범위 내 변동 가능. 예약 시각의 실제 실행 성공은 별도 로그 확인 대상이다.

## 관찰한 운영 스키마 (2026-09-28)

- storage.objects: bucket_id, name, owner_id 모두 text.
- storage.buckets: id/name text, public bool, file_size_limit int8, allowed_mime_types text[].
- post-images: public=true, file_size_limit=5242880.
- 정책: post_images_insert_own, post_images_select_own, post_images_delete_own. 본인 owner_id 기준이며 INSERT는 public/UUID.확장자 경로만 허용.
- post_image_jobs와 post-image-staging 버킷은 없었다. 이번 변경에서 새로 도입하는 대상이다.

## 동작

1. 로그인 사용자가 reserve_post_image RPC로 본인 작업을 예약한다. 24시간 30건, 15분 내 대기·처리 중 5건까지 허용한다.
2. 원본은 비공개 post-image-staging에 업로드한다. 이름은 예약 UUID이며 타인은 조회·삭제·덮어쓰기를 할 수 없다.
3. /api/images는 Bearer 토큰을 Supabase Auth getUser로 검증하고 이메일 확인을 요구한다. 본인 pending 작업만 한 번 processing 상태로 가져온다.
4. 서버는 파일을 디코딩하고 sharp로 재인코딩한다. JPEG/PNG/WebP/GIF만 허용하며 EXIF/XMP/ICC/IPTC와 뒤에 붙은 데이터를 보존하지 않는다. 최대 5 MiB, 전체 프레임 합계 4천만 픽셀, 200프레임, 변환 시간 15초 제한. 애니메이션 GIF 유지.
5. 무작위 공개 경로로 정제본을 저장하고 비공개 원본을 지운 뒤 ready 처리한다. 오류 시 원본과 미완성 결과를 정리하고 실패로 기록한다. 중단된 요청은 정기 정리 대상이다.
6. 기존 이미지 owner_id 정책과 새 작업 소유권 정책을 함께 사용한다. service role로 올린 객체의 owner_id가 비어 있어도 본인만 메타데이터 조회와 삭제가 가능하다.

사진에 직접 보이는 얼굴·문자·주소 등은 제거하지 않는다. 기존 공개 이미지의 소급 정제는 이 변경에 포함하지 않는다.

## 배포 순서

1. 서버 전용 환경변수 `SUPABASE_SERVICE_ROLE_KEY`와 정리 작업용 무작위 `CRON_SECRET`을 Vercel Production에 설정한다. NEXT_PUBLIC_ 접두사는 사용하지 않는다. 키는 채팅·소스·로그에 남기지 않는다.
2. `20260928020000_private_image_processing.sql`을 롤백 검증 후 적용한다. 기존 직접 업로드는 아직 유지된다. 예상하지 못한 기존 테이블/버킷/정책이 있으면 적용을 중단한다.
3. 새 코드를 배포하고 임시 저장소 → 서버 정제 → 공개 파일 다운로드를 실제 테스트 계정으로 검증한다. `SERVER_IMAGE_UPLOAD_ENABLED=true`를 설정한 배포에서 새 경로를 사용한다. false/미설정은 전환 전 호환 모드다. true인데 비밀키가 빠지면 설정 오류로 업로드가 실패해야 하며 기존 직접 업로드로 자동 되돌리지 않는다.
4. 정리 작업을 매일 호출하도록 Vercel Cron을 구성한다. `docs/security/image-cleanup-vercel.example.json`을 기존 vercel.json과 병합하고 배포한다. `/api/images/cleanup`은 CRON_SECRET Bearer 인증을 요구한다. 24시간 지난 미정리 작업을 최대 100건씩 처리한다. 실패 또는 처리량 초과 시 수동 재호출/모니터링이 필요하다. 정기 정리 확인 전 최종 전환하지 않는다.
5. `supabase/sql/activate_server_image_processing.sql`을 롤백 검증 후 적용한다. 공개 버킷 INSERT/UPDATE는 anon/authenticated 모두 거부하고, 새 게시글 이미지는 본인 ready 작업의 실제 객체만 참조할 수 있다. 이 SQL은 자동 migration 경로 밖에 두어 조기 차단을 방지한다.
6. 직접 업로드·덮어쓰기·타인 예약 처리·미정제 URL 첨부 거부, 정상 5장 업로드·게시글 작성·본인 정리·GIF 동작, 비로그인 원본 접근 거부를 운영에서 확인한다. 이 단계 전에는 서버 강제 완료라고 보고하지 않는다.

## 운영 주의

- 요청 본문에는 UUID만 전달하여 Vercel 4.5 MB 요청 제한과 기존 5 MiB 이미지 제한이 충돌하지 않게 한다.
- 미완성 원본은 즉시 삭제를 시도하고 중단된 작업은 정기 정리 시 삭제한다. 정리 실패 시 보관 시간이 늘 수 있으므로 실행 결과를 확인한다.
- job 기록은 계정 소유권·삭제 권한·할당량에 사용한다. 탈퇴 실제 처리 시 함께 처리해야 한다.
- 전환 후에는 설정을 끄는 것만으로 롤백하지 않는다. 기존 Storage 차단 정책이 남아 직접 업로드가 실패하기 때문이다. 정제 경로 장애는 실패 상태를 유지하고 원인을 수정한다.

## 게시글 삭제·게시 실패 후 남은 이미지 정리

`20260929010000_unreferenced_image_cleanup.sql`은 기존 job 기록을 재시도 대기열로 사용한다. 새 테이블·컬럼·RLS 정책은 추가하지 않는다. `claim_unreferenced_post_images` 실행 권한은 service_role만 가지며 일반 사용자·익명 호출은 거부한다.

운영 적용(2026-09-29): 롤백 사전 검증 후 migration 적용, 커밋 `4ed7709`의 Vercel 배포 `4M8H7KMnySCg3XY2uaaUdHorsfpk`가 Ready 및 운영 도메인 연결됨을 확인했다. 운영 RPC 실행 권한은 anon=false/authenticated=false/service_role=true. 삭제 대상 0건을 읽기 전용 조회한 후 인증된 정리 API의 HTTP 200/removed=0을 확인했다. 실제 파일이 있는 대상의 정기 삭제와 재시도는 향후 실행 확인 대상이다.

- 일일 정리 API가 업로드 후 24시간이 지난 ready 작업 중 어떤 게시글에서도 참조하지 않는 이미지 최대 100건을 선점한다. 게시글 삭제뿐 아니라 업로드 성공 후 게시 실패로 남은 이미지도 포함한다.
- 사용 중인 이미지와 24시간 이내 이미지는 보존한다. job 행을 잠근 뒤 별도 SQL 문장의 최신 스냅샷에서 참조 여부를 다시 확인한다. 게시글 이미지 검증도 같은 행을 잠가 정리 선점 후 새 게시글에 붙일 수 없게 한다. READ COMMITTED 외 격리 수준에서는 정리를 거부한다.
- 선점된 작업은 failed/staging_removed=false로 전환하여 기존 Storage API 정리 경로가 삭제한다. 파일 삭제 실패 시 다음 호출에서 재시도한다. DB에서 Storage 객체 행만 지우는 방식은 사용하지 않는다.
- 일일 예약과 24시간 유예 때문에 즉시 삭제를 보장하지 않는다. 업로드 직후 삭제한 글은 통상 24~48시간대에 정리되며 Hobby 실행 시간 변동·실패·대기량에 따라 더 늦어질 수 있다. 예전 직접 업로드 이미지(job 기록 없음)는 자동 정리 대상이 아니다.
- 참조 검색용 GIN 인덱스 추가. 격리 테스트에서 다중 게시글 참조 보존, 마지막 참조 삭제 후 선점, 유예 기간, 권한 차단, 재첨부 거부, 이미지 없는 글을 검증했다. 전체 테스트 280개 통과, 빌드 성공, lint 오류 0개(기존 경고 3개). 실제 동시 연결 경쟁 테스트는 별도 미실행이다.

참고: [Supabase 객체 소유권](https://supabase.com/docs/guides/storage/security/ownership), [sharp 메타데이터 기본 제거](https://sharp.pixelplumbing.com/api-output/), [Vercel 요청 크기 제한](https://vercel.com/docs/functions/limitations).
