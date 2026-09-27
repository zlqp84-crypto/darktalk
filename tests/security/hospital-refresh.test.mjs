import test from 'node:test';
import assert from 'node:assert/strict';
import {compareHospitals} from '../../scripts/companies/compare-hospitals.mjs';
import {HIRA_SOURCE} from '../../scripts/companies/hira.mjs';
import {buildHospitalRefresh} from '../../scripts/companies/prepare-hospital-refresh.mjs';
import {expansionRecords} from '../../scripts/companies/prepare-expansion.mjs';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';

const row = (n, name = '병원') => ({id: n.toString(16).padStart(64, '0'), name, kind: '병원', kindCode: '21', region: '서울', district: '강남구'});
const snapshot = (rows, checkedOn = '2026-09-27') => ({source: HIRA_SOURCE, checkedOn, total: rows.length, rows});

test('refresh distinguishes renamed identity from same-name separate institutions', () => {
  const result = compareHospitals(snapshot([row(1), row(2)]), snapshot([row(1, '새 병원명'), row(3)]));
  assert.deepEqual(result.counts, {previous: 2, current: 2, added: 1, changed: 1, missing: 1, unchanged: 0});
  assert.equal(result.changed[0].id, row(1).id);
  assert.deepEqual(result.changed[0].changes.name, {before: '병원', after: '새 병원명'});
  assert.equal(result.missingMeansClosed, false);
  assert.equal(result.applied, false);
});
test('unchanged snapshot produces no changes and omits unexpected private fields', () => {
  const original = snapshot([row(1)]);
  assert.equal(compareHospitals(original, original).counts.unchanged, 1);
  const result = compareHospitals(original, snapshot([row(1), {...row(2), phone: 'private'}]));
  assert.equal('phone' in result.added[0], false);
});
test('incomplete, duplicate, invalid and stale snapshots fail closed', () => {
  const valid = snapshot([row(1)]);
  for (const invalid of [{...valid, total: 2}, snapshot([row(1), row(1)]), snapshot([{...row(1), id: 'bad'}]), snapshot([row(1)], '2026-09-26')]) {
    assert.throws(() => compareHospitals(valid, invalid));
  }
});

test('SQL refresh preserves editorial state, review links, missing institutions and other-source facts', async () => {
  const db = new PGlite();
  const previous = snapshot([row(1),row(2)], '2026-09-21');
  const current = snapshot([{...row(1,"병원 ' 새이름"), district:'서초구'},row(3,'신규 병원'),row(4)]);
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    for (const file of ['20260918030000_company_directory.sql','20260921010000_medical_and_mme_sources.sql']) await db.exec(await readFile('supabase/migrations/'+file,'utf8'));
    const original = expansionRecords(previous, [], previous.checkedOn);
    for (const company of original.companies) await db.query('insert into companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',Object.values(company));
    for (const fact of original.facts) await db.query('insert into company_classifications(id,company_id,dimension,value,source_url,reference_date) values($1,$2,$3,$4,$5,$6)',Object.values(fact));
    const id = original.companies[0].id;
    await db.query("update companies set slug='custom-hospital',website_url='https://example.com' where id=$1",[id]);
    await db.exec('create table review_link(company_id uuid references companies(id));');
    await db.query('insert into review_link values($1)',[id]);
    await db.query("insert into company_classifications(company_id,dimension,value,source_url,reference_date) values($1,'region','수동분류','https://example.com','2026-09-21')",[id]);
    const preflight = buildHospitalRefresh(previous,current,{publishNew:true}).sql;
    await db.query("update companies set name='운영에서 수정함' where id=$1",[id]);
    await assert.rejects(db.exec(preflight),/baseline mismatch/);
    await db.exec('rollback');
    await db.query("update companies set name='병원' where id=$1",[id]);
    await db.query("update company_classifications set value='다른구' where company_id=$1 and value='서울 강남구'",[id]);
    await assert.rejects(db.exec(preflight),/classifications differ/);
    await db.exec('rollback');
    await db.query("update company_classifications set value='서울 강남구' where company_id=$1 and value='다른구'",[id]);
    await db.exec(preflight);
    assert.equal((await db.query('select count(*)::int n from companies')).rows[0].n,2);
    assert.equal((await db.query('select name from companies where id=$1',[id])).rows[0].name,'병원');
    const apply = buildHospitalRefresh(previous,current,{publishNew:true,commit:true}).sql;
    await db.exec(apply);
    assert.deepEqual((await db.query('select id,slug,name,is_published,website_url from companies where id=$1',[id])).rows[0],{id,slug:'custom-hospital',name:"병원 ' 새이름",is_published:false,website_url:'https://example.com'});
    assert.equal((await db.query('select company_id from review_link')).rows[0].company_id,id);
    assert.equal((await db.query('select count(*)::int n from companies')).rows[0].n,4);
    assert.equal((await db.query("select is_published from companies where source_id=$1",[row(3).id])).rows[0].is_published,true);
    assert.equal((await db.query("select is_published from companies where source_id=$1",[row(4).id])).rows[0].is_published,false);
    const values = (await db.query('select value from company_classifications where company_id=$1',[id])).rows.map(r=>r.value);
    assert.ok(values.includes('서울 서초구')); assert.ok(!values.includes('서울 강남구')); assert.ok(values.includes('수동분류'));
    await assert.rejects(db.exec(apply),/baseline mismatch/);
    await db.exec('rollback');
    assert.equal((await db.query('select count(*)::int n from companies')).rows[0].n,4);
    const baseline = buildHospitalRefresh(previous,current).nextBaseline;
    assert.equal(baseline.total,4);
    assert.equal(baseline.applicationVerified,false);
    // Retained missing rows must not make the next refresh baseline fail.
    await db.exec(buildHospitalRefresh(baseline,current).sql);
  } finally {await db.close();}
});
