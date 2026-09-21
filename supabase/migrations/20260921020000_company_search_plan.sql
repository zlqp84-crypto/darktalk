-- SQL-language generic plans evaluated optional filters across the enlarged directory.
-- Build only active predicates, binding every user value, so each search gets its own plan.
begin;
set local lock_timeout='5s';
create or replace function public.search_companies(p_query text default '',p_type text default '',p_tag text default '',p_industry text default '',p_region text default '',p_ranking_year integer default null,p_offset integer default 0)
returns setof public.companies language plpgsql stable security invoker set search_path='' as $$
declare
 query_sql text := 'select c.* from public.companies c where c.is_published';
 name_pattern text := '%' || replace(replace(replace(left(coalesce(p_query,''),100), chr(92), chr(92)||chr(92)), '%', chr(92)||'%'), '_', chr(92)||'_') || '%';
begin
 if coalesce(p_query,'')<>'' then query_sql := query_sql || ' and c.name ilike $1'; end if;
 if coalesce(p_type,'')<>'' then query_sql := query_sql || ' and exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension=''type'' and f.value=$2)'; end if;
 if coalesce(p_tag,'')<>'' then query_sql := query_sql || ' and exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension=''tag'' and f.value=$3)'; end if;
 if coalesce(p_industry,'')<>'' then query_sql := query_sql || ' and exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension=''industry'' and f.value=$4)'; end if;
 if coalesce(p_region,'')<>'' then query_sql := query_sql || ' and exists(select 1 from public.company_classifications f where f.company_id=c.id and f.dimension=''region'' and f.value=$5)'; end if;
 if p_ranking_year is not null then query_sql := query_sql || ' and exists(select 1 from public.company_rankings r where r.company_id=c.id and r.ranking_key=''domestic_top1000'' and r.ranking_year=$6)'; end if;
 return query execute query_sql || ' order by c.name,c.id limit 25 offset $7'
 using name_pattern,p_type,p_tag,p_industry,p_region,p_ranking_year,greatest(0,least(coalesce(p_offset,0),1000000));
end;
$$;
revoke all on function public.search_companies(text,text,text,text,text,integer,integer) from public;
grant execute on function public.search_companies(text,text,text,text,text,integer,integer) to anon,authenticated;
notify pgrst,'reload schema';
commit;
