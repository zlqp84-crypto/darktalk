# P0 변경 전 실제 스키마 확인 기록

- 확인일: 2026-09-17
- 대상: Supabase `darktalk`, project ref `lvmvadjpzwqoiynoqosy`, main / PRODUCTION.
- 방법: 로그인된 Supabase SQL Editor에서 시스템 카탈로그를 읽기 전용 조회.
- 확인을 마친 뒤 코드와 migration을 작성했다. 운영 DB DDL/DML은 실행하지 않았다.
- 저장소: `supabase/sql/` 수동 스크립트만 있었고 `supabase/migrations/`는 없었다.
- 실제 DB: `to_regclass('supabase_migrations.schema_migrations')` 결과 NULL. 버전 migration 이력 테이블 없음.
- 개인정보/회원 행은 이 기록에 포함하지 않는다.

## public 테이블

`?`는 NULL 허용. 표에 없는 기본값은 NULL/기본값 없음.

| 테이블 | 실제 컬럼과 타입 | 기본값 |
|---|---|---|
| profiles | id uuid NOT NULL, nickname text NOT NULL, company text?, job_title text?, is_verified bool?, created_at timestamptz?, is_admin bool NOT NULL | is_verified=false, created_at=now(), is_admin=false |
| posts | id uuid NOT NULL, user_id uuid?, title text NOT NULL, content text NOT NULL, category text?, likes_count int4?, comments_count int4?, views_count int4?, is_anonymous bool?, created_at timestamptz?, image_urls text[] NOT NULL | id=gen_random_uuid(), counts=0, is_anonymous=true, created_at=now(), image_urls='{}'::text[] |
| comments | id uuid NOT NULL, post_id uuid?, user_id uuid?, content text NOT NULL, is_anonymous bool?, created_at timestamptz?, likes_count int4 NOT NULL | id=gen_random_uuid(), is_anonymous=true, created_at=now(), likes_count=0 |

확인된 제약:

- profiles: PK(id), UNIQUE(nickname), FK(id) → auth.users(id).
- posts: PK(id), FK(user_id) → profiles(id).
- comments: PK(id), FK(post_id) → posts(id) ON DELETE CASCADE, FK(user_id) → profiles(id).
- 세 테이블 모두 RLS enabled=true, forced=false.
- 세 테이블과 auth.users에 사용자 정의 트리거 없음.
- public view 없음. public 테이블의 publication 등록 없음.

## 기존 RLS와 권한

| 테이블 | 정책명 | 명령 | 대상 role | USING / WITH CHECK |
|---|---|---|---|---|
| posts | 게시글 공개 읽기 | SELECT | PUBLIC | true / 없음 |
| posts | 본인 게시글 작성 | INSERT | PUBLIC | 없음 / auth.uid() = user_id |
| comments | 댓글 공개 읽기 | SELECT | PUBLIC | true / 없음 |
| comments | 본인 댓글 작성 | INSERT | PUBLIC | 없음 / auth.uid() = user_id |
| profiles | 프로필 본인만 수정 | ALL | PUBLIC | auth.uid() = id / 명시값 없음 |

세 테이블 모두 anon/authenticated/service_role/postgres에 SELECT, INSERT, UPDATE,
DELETE, TRUNCATE, REFERENCES, TRIGGER 테이블 권한이 있었다.
따라서 본인 profiles 행에서 is_admin/is_verified UPDATE를 막는 컬럼 권한이 없었다.

## 기존 public 함수

확인된 함수는 아래 5개뿐이며 모두 SECURITY DEFINER / search_path=public이었다.
실행 ACL에는 PUBLIC, anon, authenticated, service_role, postgres가 있었다.

- increment_post_views(uuid)
- increment_post_likes(uuid, integer)
- increment_post_comments_count(uuid, integer)
- admin_delete_post(uuid)
- admin_delete_comment(uuid)

관리자 삭제 함수는 profiles.is_admin=true와 JWT aal2를 모두 검사했다.
테스트 fixture는 이 실제 정의와 일치하는 저장소 SQL을 읽어 기존 상태를 재현한다.

## Storage

확인한 storage.objects 컬럼: id uuid(default gen_random_uuid()), bucket_id text,
name text, owner uuid, owner_id text. 후자의 4개는 기본값 없음.

| 기존 정책 | 명령 | 조건 |
|---|---|---|
| post-images: authenticated users upload own folder | INSERT authenticated | bucket_id='post-images' AND foldername(name)[1]=auth.uid()::text |
| post-images: public read | SELECT PUBLIC | bucket_id='post-images' |
| post-images: users delete own files | DELETE authenticated | bucket_id='post-images' AND foldername(name)[1]=auth.uid()::text |

전체 DB 집계 결과: 이미지가 연결된 posts 0건, post-images Storage 객체 0건.
적용 전 새 이미지가 생기는 경우 migration은 구형 경로를 발견하면 중단한다.
기존 이미지나 게시글을 자동 삭제하거나 임의로 경로 변경하지 않는다.

## 테스트 재현 범위

`tests/security/observed-schema.sql`의 public 테이블은 위 실제 컬럼·타입·NULL·기본값·FK·정책을 재현한다.
auth.users와 storage.objects는 조회에서 확인한 필수 컬럼만 담은 테스트용 service fixture다.
Supabase Auth 서버, PostgREST, Storage HTTP 서비스 전체를 복제한 것은 아니다.
auth.uid()/auth.jwt()는 실제 DB에서 조회한 함수 정의를 사용한다.
운영 migration은 새 테이블/컬럼을 만들지 않는다.
