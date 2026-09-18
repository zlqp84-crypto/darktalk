-- Phase 1. Observed public tables on 2026-09-18: comments, likes, posts, profiles.
-- Fail on name collisions; never assume the shape of an existing table.
begin;
set local lock_timeout = '5s';
create table public.companies (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check(slug ~ '^[a-z0-9][a-z0-9-]{1,100}$'),
 name text not null check(length(btrim(name)) between 1 and 200),
 source_system text not null check(source_system in ('dart','alio','government','verified_manual')),
 source_id text not null check(length(btrim(source_id)) between 1 and 100),
 source_url text not null check(source_url ~ '^https://[^/[:space:]]+'),
 source_updated_on date not null, checked_on date not null,
 website_url text check(website_url ~ '^https?://[^/[:space:]]+'),
 is_published boolean not null default false,
 unique(source_system,source_id)
);
create index companies_name_idx on public.companies(name,id) where is_published;
create table public.company_classifications (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 dimension text not null check(dimension in ('type','tag','industry','region')),
 value text not null check(length(btrim(value)) between 1 and 100),
 source_url text not null check(source_url ~ '^https://[^/[:space:]]+'),
 reference_date date not null,
 check(dimension <> 'type' or value in ('large','mid_sized','small','public_enterprise','public_institution','government','other')),
 check(dimension <> 'tag' or value in ('startup','foreign_owned','listed')),
 unique(company_id,dimension,value)
);
create unique index company_one_type on public.company_classifications(company_id) where dimension='type';
create index company_classification_filter on public.company_classifications(dimension,value,company_id);
create table public.company_rankings (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.companies(id) on delete cascade,
 ranking_key text not null check(ranking_key='domestic_top1000'),
 ranking_year integer not null check(ranking_year between 2000 and 2100),
 position integer not null check(position between 1 and 1000),
 basis text not null check(length(btrim(basis)) between 1 and 200),
 publisher text not null check(length(btrim(publisher)) between 1 and 100),
 source_url text not null check(source_url ~ '^https://[^/[:space:]]+'),
 reference_date date not null,
 unique(company_id,ranking_key,ranking_year,publisher,basis)
);
create index company_ranking_filter on public.company_rankings(ranking_key,ranking_year,company_id);
alter table public.companies enable row level security;
alter table public.company_classifications enable row level security;
alter table public.company_rankings enable row level security;
revoke all on public.companies,public.company_classifications,public.company_rankings from public,anon,authenticated;
grant select on public.companies,public.company_classifications,public.company_rankings to anon,authenticated;
-- Trusted import tooling/DB owner only. No client mutation endpoints in phase 1.
grant all on public.companies,public.company_classifications,public.company_rankings to service_role;
create policy companies_published_read on public.companies for select to anon,authenticated using(is_published);
create policy company_classifications_published_read on public.company_classifications for select to anon,authenticated using(exists(select 1 from public.companies c where c.id=company_id and c.is_published));
create policy company_rankings_published_read on public.company_rankings for select to anon,authenticated using(exists(select 1 from public.companies c where c.id=company_id and c.is_published));
create function public.search_companies(p_query text default '',p_type text default '',p_tag text default '',p_industry text default '',p_region text default '',p_ranking_year integer default null,p_offset integer default 0)
returns setof public.companies language sql stable security invoker set search_path='' as $$
 select c.* from public.companies c where c.is_published
 and c.name ilike ('%' || replace(replace(replace(left(coalesce(p_query,''),100), chr(92), chr(92)||chr(92)), '%', chr(92)||'%'), '_', chr(92)||'_') || '%')
 and (coalesce(p_type,'')='' or exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension='type' and f.value=p_type))
 and (coalesce(p_tag,'')='' or exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension='tag' and f.value=p_tag))
 and (coalesce(p_industry,'')='' or exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension='industry' and f.value=p_industry))
 and (coalesce(p_region,'')='' or exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension='region' and f.value=p_region))
 and (p_ranking_year is null or exists(select 1 from public.company_rankings r where r.company_id=c.id and r.ranking_key='domestic_top1000' and r.ranking_year=p_ranking_year))
 order by c.name,c.id limit 25 offset greatest(0,least(coalesce(p_offset,0),1000000))
$$;
revoke all on function public.search_companies(text,text,text,text,text,integer,integer) from public;
grant execute on function public.search_companies(text,text,text,text,text,integer,integer) to anon,authenticated;
notify pgrst, 'reload schema';
commit;
