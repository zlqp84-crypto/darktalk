-- Uses the inspected companies/reviews/classifications/rankings schema.
-- Preserve source rows and slugs: a merge is a reversible alias, not deletion.
begin;
set local lock_timeout = '5s';
create table public.company_merges (
 source_company_id uuid primary key references public.companies(id),
 canonical_company_id uuid not null references public.companies(id),
 evidence_url text not null check(evidence_url ~ '^https://[^/[:space:]]+'),
 evidence_note text not null check(char_length(btrim(evidence_note)) between 20 and 2000),
 merged_at timestamptz not null default now(),
 moved_reviews integer not null check(moved_reviews >= 0),
 check(source_company_id <> canonical_company_id)
);
create index company_merges_canonical_idx on public.company_merges(canonical_company_id);
alter table public.company_merges enable row level security;
revoke all on public.company_merges from public, anon, authenticated, service_role;

create function public.merge_companies(p_source uuid,p_target uuid,p_evidence_url text,p_evidence_note text)
returns integer language plpgsql security definer set search_path='' as $$
declare moved integer; previous_target uuid;
begin
 perform public.require_admin_aal2();
 if p_source is null or p_target is null or p_source=p_target then raise exception 'Invalid merge' using errcode='22023'; end if;
 -- Serialize merges and block concurrent review inserts during conflict checks.
 perform pg_advisory_xact_lock(hashtextextended('darktalk-company-merge',0));
 lock table public.company_reviews in share row exclusive mode;
 perform id from public.companies where id in (p_source,p_target) order by id for update;
 select canonical_company_id into previous_target from public.company_merges where source_company_id=p_source;
 if found then
  if previous_target=p_target then return 0; end if;
  raise exception 'Source already merged' using errcode='22023';
 end if;
 if not exists(select 1 from public.companies where id=p_source)
 or not exists(select 1 from public.companies where id=p_target and is_published)
 then raise exception 'Company unavailable' using errcode='22023'; end if;
 if exists(select 1 from public.company_merges where source_company_id=p_target or canonical_company_id=p_source)
 then raise exception 'Merge chains are not allowed' using errcode='22023'; end if;
 if exists(select 1 from public.company_reviews a join public.company_reviews b on a.user_id=b.user_id where a.company_id=p_source and b.company_id=p_target)
 then raise exception 'Conflicting author reviews require manual review' using errcode='22023'; end if;
 if exists(select 1 from public.company_rankings where company_id=p_source)
 then raise exception 'Source rankings require manual review' using errcode='22023'; end if;
 update public.company_reviews set company_id=p_target where company_id=p_source;
 get diagnostics moved = row_count;
 insert into public.company_merges(source_company_id,canonical_company_id,evidence_url,evidence_note,moved_reviews)
 values(p_source,p_target,p_evidence_url,btrim(p_evidence_note),moved);
 update public.companies set is_published=false where id=p_source;
 return moved;
end $$;
revoke all on function public.merge_companies(uuid,uuid,text,text) from public,anon,authenticated,service_role;
grant execute on function public.merge_companies(uuid,uuid,text,text) to authenticated;

-- Exposes only the published destination slug, never audit notes or reviewer IDs.
create function public.resolve_company_slug(p_slug text)
returns text language sql stable security definer set search_path='' as $$
 select target.slug from public.company_merges m
 join public.companies source on source.id=m.source_company_id
 join public.companies target on target.id=m.canonical_company_id
 where source.slug=p_slug and target.is_published
$$;
revoke all on function public.resolve_company_slug(text) from public,anon,authenticated,service_role;
grant execute on function public.resolve_company_slug(text) to anon,authenticated;
notify pgrst,'reload schema';
commit;
