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
