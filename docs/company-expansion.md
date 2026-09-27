# 의료기관·중견기업 발급 이력 추가 (2026-09-21)

## 자료와 범위

- 건강보험심사평가원 병원정보서비스: https://www.data.go.kr/data/15001698/openapi.do
  - 공식 Swagger의 HTTPS hospInfoServicev2/getHospBasisList 명세 확인 후 호출.
  - 80페이지, 총 79,858기관. 페이지 번호·총수·중복 식별자·필수 필드 검증.
  - 병원, 의원, 치과, 한방, 보건기관, 조산원을 포함한다. 약국 자료는 포함하지 않는다.
  - 저장 항목: 기관명, 종별, 시도·시군구, 출처, 조회일, 암호화 요양기호의 SHA-256.
  - 전화, 상세 주소, 좌표, 인력 현황, 원본 요양기호 및 인증키를 결과에 저장하지 않는다.
  - 출처표시(공공누리 제1유형)를 상세 화면에 표시한다.
- 중견기업정보마당: https://www.mme.or.kr/PGPC0010.do
  - 공개 화면의 2026년 발급 기록 3,987행, 300행씩 14페이지를 확인했다.
  - 확인일이 표기 유효기간에 포함되는 3,842행을 사업자 기준으로 중복 제거해 3,840기업.
  - 공식 안내에 발급 취소 기업이 포함될 수 있다고 명시되어 있다.
  - 따라서 `mid_sized` 유형이나 상장/비상장 태그를 추정하지 않고 `mid_sized_certificate` 발급 이력 태그만 부여한다.
  - 전체 중견기업 명부나 비상장기업 전수 목록으로 주장하지 않는다. 이전 연도 발급분은 이번 범위에 포함하지 않았다.
  - 사업자번호는 공개 DB에 넣지 않으며 SHA-256을 출처 식별자로 쓴다.

## 식별자와 기존 기능 보존

동일 이름만으로 기존 DART/ALIO 회사와 자동 병합하지 않는다. 원천 식별자별 안정적인 UUID와 slug를 사용한다.
따라서 운영 법인/병원, 또는 여러 출처의 같은 회사가 별도 항목일 수 있다. 기존 회사 ID, URL, 리뷰 연결은 바꾸지 않는다.
자료 수집일을 법적 변경일로 표시하지 않는다. HIRA/MME 상세 화면은 '출처 조회일'을 표시한다.

Migration은 기존 테이블의 출처·유형·태그 CHECK 허용값만 확장한다. 컬럼이나 테이블은 만들지 않는다.
기존 SELECT RLS(공개된 회사 및 관련 분류만), 클라이언트 INSERT/UPDATE/DELETE 금지, 관리자 MFA/RPC는 유지한다.

## 실행 및 검증

인증키는 Git 및 배포에서 제외된 `.env.hira.local`의 `HIRA_API_KEY`에 저장한다.

```powershell
node --env-file=.env.hira.local scripts/companies/check-hira.mjs
node --env-file=.env.hira.local scripts/companies/collect-hospitals.mjs
node scripts/companies/prepare-expansion.mjs 2026-09-21
npm run test:security
npm run build
```

CSV는 최초 적재용이며 기존 항목을 덮어쓰지 않는다. 실패한 부분 적재는 DB의 ID 목록과 비교해 누락분만 다시 생성한다.
정기 갱신/폐업 자동 반영 기능은 이번에 추가하지 않았다. 미래 갱신은 기존 공개 여부·리뷰 ID를 보존하는 별도 검토가 필요하다.

예상 기본정보 83,698행, 분류 323,272행. 최초 CSV는 모두 비공개다.
기본정보의 `id|name`을 정렬하고 LF로 연결한 MD5: `a2e3086333d0b77d59e7cb0dc178bbc0`.
원천 파일과 적재 CSV는 `artifacts/companies` 아래에 두며 Git/배포에서 제외한다.

검증: 보안·자료 처리 248개 테스트 통과, Next production build/TypeScript 통과.
## 운영 반영 및 확인

- `20260921010000_medical_and_mme_sources.sql` 운영 적용 완료.
- HIRA 79,858기관, MME 3,840기업 공개 완료. 기존 DART 119,376 및 ALIO 342항목 유지: 총 203,416항목.
- 새 분류 323,272행 연결 확인: 의료기관별 유형 1개·종별 1개·지역 2개, MME별 발급 이력 태그 1개.
- Supabase 대량 CSV 적재에서 UTF-8 문자열 일부가 깨졌다. 원천과 DB 전체 MD5 대조로 탐지하고, 공개 전에 병원명 11건·분류 17건을 원본으로 복구했다.
- 기본정보 MD5는 위 값과 일치. 분류의 `id|company_id|dimension|value|source_url|reference_date`를 ID 순으로 LF 연결한 MD5는 `e1a45b42255ae3d878da989b5f6edc4a`와 일치했다.
- 공개 전에는 anon으로 새 출처 조회 0건을 확인했다. 공개 후 anon으로 HIRA 79,858, MME 3,840건을 확인했다.
- 데이터 증가 후 SQL 함수의 공통 실행 계획 때문에 복합 검색이 약 3.8초 소요됐다. `20260921020000_company_search_plan.sql`은 활성 필터만 포함하는 바인딩 쿼리로 바꾸며 SECURITY INVOKER, RLS, 결과 25건 제한, 정렬, 와일드카드 이스케이프를 유지한다.
- 개선 후 운영 API: 의료기관 목록 25건/90ms, 발급 이력 목록 25건/77ms, 삼성서울병원+서울+상급종합 1건/33ms, 기존 삼성전자 상장 필터 1건/74ms. 단일 검증 시점의 네트워크 포함 관측값이며 성능 보장은 아니다.
- 검색 계획 변경 후에도 보안 테스트 248개 통과.
- UI 코드 커밋 `2f77d5c`의 Vercel Production Ready 및 기존 `darktalk.vercel.app` 주소 연결 확인.
- 운영 브라우저에서 의료기관 바로가기, 삼성서울병원+서울+상급종합 검색, 병원 상세 출처/리뷰 잠금, 중견기업 발급 이력 바로가기 및 2페이지 이동을 확인했다.

CSV 가져오기 완료 메시지나 건수만으로 공개하지 않는다. 원본과 기본정보·분류 해시가 일치하고, 기관별 분류 연결이 완전한지 확인하는 SQL 조건을 통과한 뒤 공개했다.
추후 적재도 같은 전체 대조를 수행해야 한다. 실행용 검증·수정·공개 SQL은 로컬 `artifacts/companies/expansion-2026-09-21` 및 관련 감사 파일에 보관한다.

## 2026-09-27 병원 자료 갱신

- 공식 API 80페이지, 79,874건 완전 수집. 기존 원천 대비 추가 36건, 변경 9건, 누락 20건, 동일 79,829건.
- 누락 20건은 폐업으로 판단하거나 삭제하지 않았다. 새로운 식별자 중 기존 이름(공백·Unicode 정규화)과 시도·시군구가 같은 8건은 중복 후보로 비공개 보관했다. 같은 기관이라는 확정이나 자동 병합은 하지 않았다.
- 신규 공개 28건, 기존 명칭/지역 갱신 9건. 운영 HIRA 전체 79,894건 중 공개 79,886건, 비공개 8건. 전체 출처 합계 203,452건 중 공개 203,444건. 이는 출처별 등록 항목 수이며 고유 기업 수가 아니다.
- 적용 전 운영 컬럼·출처·건수 확인 → 격리 DB 검사 → 운영 트랜잭션 롤백 검증 → 적용 순서로 진행했다. `HOSPITAL_REFRESH_APPLIED` 결과 확인.
- 전체 HIRA `source_id|name` MD5는 `0a96dee623d9b739961864985c8bc22f`. 변경 대상 45기관의 HIRA 분류 `source_id|dimension|value` MD5는 `7ff0161ab710f4ba6ed8abcb4069f3cd`. SQL 트랜잭션 안에서 원문과 대조 후 커밋했다.
- 공개 API에서 변경/신규 37건의 이름·기존 slug 일치 및 중복 후보 8건 미노출 확인. DART/ALIO/MME 건수 유지.
- 보안 및 데이터 테스트 258개 통과. 갱신 도구 lint 통과. UI 변경은 없으며 DB 반영은 기존 운영 주소에 즉시 적용된다.

### 다음 갱신 절차

`prepare-hospital-refresh.mjs`는 SQL 생성기이며 DB에 직접 접속하지 않는다. 기본값은 신규 비공개·트랜잭션 롤백이다. 검토 후 `--publish-new`를 사용해도 동명·동지역 후보는 비공개다. 기존 회사 ID, slug, website_url, 공개 상태는 유지한다. 운영 명칭/분류가 기준과 다르거나 더 최신이면 중단한다. 변경 없는 항목의 DB checked_on은 갱신하지 않는다.

```powershell
node --env-file=.env.hira.local scripts/companies/collect-hospitals.mjs
node scripts/companies/prepare-hospital-refresh.mjs --before artifacts/companies/hira-catalogue-baseline-2026-09-27.json --after artifacts/companies/hira-NEW.json --output artifacts/companies/hira-preflight-NEW.sql --publish-new
# 검토 및 롤백 검증 후에만 --commit 옵션을 추가해 별도 적용 SQL 생성
```

현재 원천 파일은 `hira-2026-09-27.json`, 적용 후 누적 기준은 `hira-catalogue-baseline-2026-09-27.json`이다. 누락 기관을 보존하므로 다음 SQL 생성 시 직전 원천 파일만 기준으로 쓰면 DB 건수 검사가 실패한다. `buildHospitalRefresh` 반환값의 `nextBaseline`은 예상 누적 기준이며 기본 `applicationVerified:false`다. 실제 적용·검증 성공 후에만 적용된 기준으로 보관한다. 이번 누적 기준은 적용 완료를 확인하고 저장했다.

검토 보고서, 중복 후보 ID, preflight/apply-v2 SQL, 공개 API 검증 결과는 `artifacts/companies`에 보관하며 Git에서 제외한다. 정기 스케줄 실행, 후보 통합, 폐업 자동 반영은 아직 활성화하지 않았다.
