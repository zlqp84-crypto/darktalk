# 서버 이미지 정제 전환 절차

현재 상태: 코드와 SQL 준비, 운영 미활성화. 기존 업로드를 끄기 전에 아래 순서를 완료한다.

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

참고: [Supabase 객체 소유권](https://supabase.com/docs/guides/storage/security/ownership), [sharp 메타데이터 기본 제거](https://sharp.pixelplumbing.com/api-output/), [Vercel 요청 크기 제한](https://vercel.com/docs/functions/limitations).
