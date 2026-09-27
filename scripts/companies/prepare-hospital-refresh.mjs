// Generates reviewable SQL only; no credentials or database connection.
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {compareHospitals} from './compare-hospitals.mjs';
import {HIRA_SOURCE} from './hira.mjs';
import {stableId} from './prepare-expansion.mjs';

const quote = value => "'" + String(value).replaceAll("'", "''") + "'";
const facts = row => [['type','medical'], ['industry',row.kind], ['region',row.region], ['region',row.region+' '+row.district]].map(([dimension,value]) => ({dimension,value}));
export function hospitalNameHash(rows) {
  return createHash('md5').update(rows.map(row=>row.id+'|'+row.name).sort().join('\n')).digest('hex');
}
export function buildHospitalRefresh(previous, current, {publishNew = false, commit = false} = {}) {
  const report = compareHospitals(previous, current);
  if (current.checkedOn > new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date())) throw Error('Future snapshot');
  const before = new Map(previous.rows.map(row=>[row.id,row]));
  const identityHint = row => JSON.stringify([row.name.normalize('NFKC').replace(/\s/g,''),row.region,row.district]);
  const existingHints = new Set(previous.rows.map(identityHint));
  const currentHints = new Map();
  for (const row of current.rows) currentHints.set(identityHint(row),(currentHints.get(identityHint(row))??0)+1);
  const duplicateCandidates = current.rows.filter(row=>!before.has(row.id) && (existingHints.has(identityHint(row)) || currentHints.get(identityHint(row))>1)).map(row=>row.id);
  const withheld = new Set(duplicateCandidates);
  report.duplicateCandidates = duplicateCandidates;
  const selected = new Set([...report.added, ...report.changed].map(row=>row.id));
  const rows = current.rows.filter(row=>selected.has(row.id)).map(row=>({
    source_id: row.id, id: stableId('hira:'+row.id), name: row.name, publish_new: publishNew && !withheld.has(row.id),
    old_facts: before.has(row.id) ? facts(before.get(row.id)) : null, new_facts: facts(row),
  }));
  for (const row of rows) if (row.new_facts.some(f=>f.value.length>100)) throw Error('Classification exceeds schema limit');
  const expectedNames = new Map(previous.rows.map(row=>[row.id,row]));
  for (const row of current.rows) expectedNames.set(row.id,row);
  const expectedFacts = createHash('md5').update(rows.flatMap(row=>row.new_facts.map(f=>row.source_id+'|'+f.dimension+'|'+f.value)).sort().join('\n')).digest('hex');
  const sql = `begin;
set local standard_conforming_strings = on;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
lock table public.companies, public.company_classifications in share row exclusive mode;
create temporary table hospital_refresh on commit drop as
select * from jsonb_to_recordset(${quote(JSON.stringify(rows))}::jsonb)
as x(source_id text,id uuid,name text,publish_new boolean,old_facts jsonb,new_facts jsonb);
alter table hospital_refresh enable row level security;
do $guard$
begin
 if (select count(*) from public.companies where source_system='hira') <> ${previous.total}
 or (select md5(string_agg(source_id||'|'||name,E'\\n' order by source_id collate "C")) from public.companies where source_system='hira') <> ${quote(hospitalNameHash(previous.rows))}
 then raise exception 'Hospital baseline mismatch; collect and review again'; end if;
 if exists(select 1 from public.companies where source_system='hira' and (checked_on > ${quote(previous.checkedOn)}::date or source_updated_on > ${quote(current.checkedOn)}::date))
 then raise exception 'Newer database data exists'; end if;
 if exists(select 1 from hospital_refresh r join public.companies c on c.source_system='hira' and c.source_id=r.source_id
 where r.old_facts is null or c.source_url <> ${quote(HIRA_SOURCE)}
 or (select coalesce(jsonb_agg(jsonb_build_object('dimension',f.dimension,'value',f.value) order by f.dimension,f.value),'[]'::jsonb) from public.company_classifications f where f.company_id=c.id and f.source_url=${quote(HIRA_SOURCE)})
 <> (select jsonb_agg(v order by v->>'dimension',v->>'value') from jsonb_array_elements(r.old_facts) v))
 then raise exception 'Hospital classifications differ from baseline'; end if;
end $guard$;
insert into public.companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published)
select id,'hira-'||source_id,name,'hira',source_id,${quote(HIRA_SOURCE)},${quote(current.checkedOn)}::date,${quote(current.checkedOn)}::date,publish_new from hospital_refresh
on conflict(source_system,source_id) do update set name=excluded.name, source_updated_on=excluded.source_updated_on, checked_on=excluded.checked_on;
-- Existing IDs, slugs, website URLs and publication decisions are never overwritten.
-- Remove only obsolete HIRA facts for changed institutions, not other sources.
delete from public.company_classifications f using public.companies c,hospital_refresh r
where f.company_id=c.id and c.source_system='hira' and c.source_id=r.source_id and f.source_url=${quote(HIRA_SOURCE)}
and not exists(select 1 from jsonb_to_recordset(r.new_facts) as n(dimension text,value text) where n.dimension=f.dimension and n.value=f.value);
insert into public.company_classifications(company_id,dimension,value,source_url,reference_date)
select c.id,n.dimension,n.value,${quote(HIRA_SOURCE)},${quote(current.checkedOn)}::date
from hospital_refresh r join public.companies c on c.source_system='hira' and c.source_id=r.source_id
cross join lateral jsonb_to_recordset(r.new_facts) as n(dimension text,value text)
on conflict(company_id,dimension,value) do update set reference_date=excluded.reference_date
where company_classifications.source_url=excluded.source_url;
do $verify$
begin
 if (select count(*) from public.companies where source_system='hira') <> ${previous.total+report.counts.added}
 or (select md5(string_agg(source_id||'|'||name,E'\\n' order by source_id collate "C")) from public.companies where source_system='hira') <> ${quote(hospitalNameHash([...expectedNames.values()]))}
 or exists(select 1 from hospital_refresh r left join public.companies c on c.source_system='hira' and c.source_id=r.source_id where c.id is null or c.name <> r.name)
 then raise exception 'Hospital refresh verification failed'; end if;
 if (select md5(coalesce(string_agg(c.source_id||'|'||f.dimension||'|'||f.value,E'\\n' order by (c.source_id||'|'||f.dimension||'|'||f.value) collate "C"),''))
 from public.company_classifications f join public.companies c on c.id=f.company_id join hospital_refresh r on r.source_id=c.source_id
 where c.source_system='hira' and f.source_url=${quote(HIRA_SOURCE)}) <> ${quote(expectedFacts)}
 then raise exception 'Hospital fact hash mismatch'; end if;
end $verify$;
${commit ? 'commit;' : 'rollback;'}
select ${quote(commit ? 'HOSPITAL_REFRESH_APPLIED' : 'HOSPITAL_REFRESH_PREFLIGHT_OK')} as result;
`;
  // Includes retained missing institutions; this is a catalogue baseline, not
  // a claim that every institution still appears in the current source feed.
  const nextBaseline = {source:HIRA_SOURCE,checkedOn:current.checkedOn,total:expectedNames.size,rows:[...expectedNames.values()],kind:'catalogue_baseline',applicationVerified:false};
  return {sql, report, nextBaseline};
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const {values} = parseArgs({options: {before:{type:'string'},after:{type:'string'},output:{type:'string'},commit:{type:'boolean',default:false},'publish-new':{type:'boolean',default:false}}});
    if (!values.before || !values.after || !values.output) throw Error('Missing input');
    const result = buildHospitalRefresh(JSON.parse(readFileSync(values.before,'utf8')),JSON.parse(readFileSync(values.after,'utf8')), {commit:values.commit,publishNew:values['publish-new']});
    mkdirSync(dirname(values.output),{recursive:true});
    writeFileSync(values.output,result.sql,{flag:'wx'});
    console.log(JSON.stringify({generated:true,applied:false,commit:values.commit,...result.report.counts,withheldDuplicates:result.report.duplicateCandidates.length}));
  } catch {
    console.error('Refresh preparation failed. Check snapshots and a new output path. No SQL was executed.'); process.exitCode=1;
  }
}
