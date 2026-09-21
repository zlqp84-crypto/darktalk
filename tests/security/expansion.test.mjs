import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {HIRA_SOURCE,parseHospitalPage,validateHospitalSnapshot} from '../../scripts/companies/hira.mjs';
import {normalizeCertificates} from '../../scripts/companies/mme.mjs';
import {expansionRecords,csv} from '../../scripts/companies/prepare-expansion.mjs';
const item='<item><ykiho>provider-secret-id</ykiho><yadmNm>테스트 &amp; 병원</yadmNm><clCd>21</clCd><clCdNm>병원</clCdNm><sidoCdNm>서울</sidoCdNm><sgguCdNm>강남구</sgguCdNm><telno>PRIVATE</telno><addr>PRIVATE</addr></item>';
const xml=(items=item,total=1,page=1)=>`<response><header><resultCode>00</resultCode></header><body><items>${items}</items><totalCount>${total}</totalCount><pageNo>${page}</pageNo><numOfRows>1000</numOfRows></body></response>`;
const date='2026-09-21';
const certificate=(index,biz='123-45-67890',issue='2026-123',interval='2026-04-01 ~ 2027-03-31')=>[String(index),"Test ' Company",biz,'2026',issue,interval];
const snapshot=()=>({source:HIRA_SOURCE,checkedOn:date,total:1,rows:parseHospitalPage(xml(),1).rows});
test('hospital parser retains only directory data and hashed identity',()=>{
 const row=parseHospitalPage(xml(),1).rows[0];
 assert.equal(row.name,'테스트 & 병원');assert.match(row.id,/^[a-f0-9]{64}$/);
 assert.ok(!JSON.stringify(row).includes('PRIVATE'));assert.ok(!JSON.stringify(row).includes('provider-secret-id'));
 assert.equal(Object.keys(row).length,6);
});
test('hospital parser refuses partial pages, duplicate identities, wrong pages, DTD and API errors',()=>{
 for(const input of [xml(item,2),xml(item+item,2),xml(item,1,2),xml().replace('00','30'),'<!DOCTYPE response>'+xml(),xml().replace('<clCd>21</clCd>','')])assert.throws(()=>parseHospitalPage(input,1));
});
test('snapshot refuses missing/duplicate records and invalid dates',()=>{
 const s=snapshot();assert.throws(()=>validateHospitalSnapshot({...s,total:2}));assert.throws(()=>validateHospitalSnapshot({...s,total:2,rows:[...s.rows,...s.rows]}));assert.throws(()=>validateHospitalSnapshot({...s,checkedOn:'2026-02-30'}));
});
test('MME filters expired/future intervals and keeps latest eligible certificate per business',()=>{
 const rows=[certificate(4),certificate(3,'123-45-67890','2026-125'),certificate(2,'222-22-22222','2026-126','2026-10-01 ~ 2027-09-30'),certificate(1,'333-33-33333','2026-127','2025-04-01 ~ 2026-03-31')];
 const result=normalizeCertificates(rows,date,4);assert.equal(result.length,1);assert.equal(result[0].certificate,'2026-125');assert.ok(!JSON.stringify(result).includes('123-45-67890'));
});
test('MME refuses incomplete order, duplicate certificate IDs and impossible dates',()=>{
 for(const rows of [[certificate(2)],[certificate(2),certificate(1)],[certificate(1,undefined,undefined,'2026-02-30 ~ 2027-03-31')]])assert.throws(()=>normalizeCertificates(rows,date,rows.length));
});
test('CSV preserves commas, quotes and CRLF; deterministic IDs keep links stable',()=>{
 assert.equal(csv(['name'],[{name:'A,"B"'}]),'name\r\n"A,""B"""\r\n');
 const certs=normalizeCertificates([certificate(1)],date,1), a=expansionRecords(snapshot(),certs,date),b=expansionRecords(snapshot(),certs,date);
 assert.deepEqual(a,b);assert.ok(a.companies.every(row=>!row.is_published));
 assert.equal(a.facts.filter(row=>row.value==='mid_sized_certificate').length,1);
 assert.ok(!a.facts.some(row=>['mid_sized','listed','unlisted'].includes(row.value)));
});
test('expansion migration retains RLS, blocks client writes, permits published filters, and preserves existing IDs',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to anon,authenticated,service_role;');
  for(const migration of ['20260918030000_company_directory.sql','20260919020000_listing_provenance.sql','20260921010000_medical_and_mme_sources.sql','20260921020000_company_search_plan.sql'])await db.exec(await readFile('supabase/migrations/'+migration,'utf8'));
  const records=expansionRecords(snapshot(),normalizeCertificates([certificate(1)],date,1),date);
  for(const row of records.companies)await db.query('insert into companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',Object.values(row));
  for(const row of records.facts)await db.query('insert into company_classifications(id,company_id,dimension,value,source_url,reference_date) values($1,$2,$3,$4,$5,$6)',Object.values(row));
  for(const role of ['anon','authenticated']){
   await db.exec(`begin; set local role ${role};`);assert.equal((await db.query('select * from search_companies()')).rows.length,0);await db.exec('rollback');
  }
  await db.exec('update companies set is_published=true');
  for(const role of ['anon','authenticated']){
   await db.exec(`begin; set local role ${role};`);
   assert.equal((await db.query("select * from search_companies(p_type=>'medical',p_region=>'서울',p_industry=>'병원')")).rows.length,1);
   assert.equal((await db.query("select * from search_companies(p_tag=>'mid_sized_certificate')")).rows.length,1);
   assert.equal((await db.query("select * from search_companies(p_type=>'mid_sized')")).rows.length,0);
   await db.exec('rollback');
   for(const table of ['companies','company_classifications'])for(const operation of [`delete from ${table}`,`update ${table} set id=id`,`insert into ${table} default values`]){
    await db.exec(`begin; set local role ${role};`);await assert.rejects(db.exec(operation),e=>e.code==='42501');await db.exec('rollback');
   }
  }
  await db.exec(await readFile('supabase/migrations/20260921010000_medical_and_mme_sources.sql','utf8'));
  assert.deepEqual((await db.query('select id from companies order by id')).rows.map(r=>r.id),records.companies.map(r=>r.id).sort());
 } finally {await db.close();}
});
