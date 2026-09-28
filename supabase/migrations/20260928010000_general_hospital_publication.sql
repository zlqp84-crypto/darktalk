-- Hide out-of-scope HIRA institutions; retain identities, facts and all reviews.
-- Existing private rows are never republished. No schema or RLS changes.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
lock table public.companies, public.company_classifications in share row exclusive mode;
update public.companies c set is_published=false
where c.source_system='hira' and c.is_published and not exists (
 select 1 from public.company_classifications f where f.company_id=c.id
 and f.source_url='https://www.data.go.kr/data/15001698/openapi.do'
 and f.dimension='industry' and f.value in ('상급종합','종합병원')
);
commit;
