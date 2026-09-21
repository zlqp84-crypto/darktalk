-- Existing constraints inspected in production before this migration.
-- Only source/type/tag allowlists change; privileges, RLS and review IDs stay intact.
begin;
set local lock_timeout = '5s';
alter table public.companies drop constraint companies_source_system_check;
alter table public.companies add constraint companies_source_system_check
 check(source_system in ('dart','alio','government','verified_manual','hira','mme'));
alter table public.company_classifications drop constraint company_classifications_check;
alter table public.company_classifications add constraint company_classifications_check
 check(dimension <> 'type' or value in ('large','mid_sized','small','public_enterprise','public_institution','government','other','medical'));
alter table public.company_classifications drop constraint company_classifications_check1;
alter table public.company_classifications add constraint company_classifications_check1
 check(dimension <> 'tag' or value in ('startup','foreign_owned','listed','stock_code_registered','mid_sized_certificate'));
notify pgrst, 'reload schema';
commit;
