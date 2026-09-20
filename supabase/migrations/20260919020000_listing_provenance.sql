begin;
-- Inspected live constraint on 2026-09-19. Preserve stock-code facts, correct their meaning.
alter table public.company_classifications drop constraint company_classifications_check1;
alter table public.company_classifications add constraint company_classifications_check1 check(dimension <> 'tag' or value in ('startup','foreign_owned','listed','stock_code_registered'));
update public.company_classifications set value='stock_code_registered' where dimension='tag' and value='listed' and source_url='https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018';
commit;
