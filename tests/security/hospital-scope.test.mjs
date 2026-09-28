import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {HIRA_SOURCE,isPublicHospital} from '../../scripts/companies/hira.mjs';
import {buildHospitalRefresh} from '../../scripts/companies/prepare-hospital-refresh.mjs';
import {expansionRecords} from '../../scripts/companies/prepare-expansion.mjs';
const row=(n,kind='종합병원',kindCode='11')=>({id:n.toString(16).padStart(64,'0'),name:'기관'+n,kind,kindCode,region:'경기',district:'부천오정구'});
const snapshot=rows=>({source:HIRA_SOURCE,checkedOn:'2026-09-27',total:rows.length,rows});
test('publication accepts only matching general and tertiary source types',()=>{
 assert.equal(isPublicHospital(row(1)),true);
 assert.equal(isPublicHospital(row(2,'상급종합','01')),true);
 for(const [kind,code] of [['의원','31'],['병원','21'],['요양병원','28'],['정신병원','29'],['치과병원','41'],['한방병원','92'],['종합병원','31'],['미확인','11']])assert.equal(isPublicHospital(row(3,kind,code)),false);
});
test('migration and refresh hide excluded hospitals while preserving rows, links and private decisions',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon;create role authenticated;create role service_role;');
  for(const f of ['20260918030000_company_directory.sql','20260921010000_medical_and_mme_sources.sql'])await db.exec(await readFile('supabase/migrations/'+f,'utf8'));
  const old=snapshot([row(1),row(2,'상급종합','01'),row(3,'의원','31'),row(4)]);
  const records=expansionRecords(old,[],old.checkedOn);
  for(const c of records.companies)await db.query('insert into companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',Object.values(c));
  for(const f of records.facts)await db.query('insert into company_classifications(id,company_id,dimension,value,source_url,reference_date) values($1,$2,$3,$4,$5,$6)',Object.values(f));
  await db.exec("update companies set is_published=true;create table retained_review(id int,company_id uuid references companies(id),body text);insert into retained_review select 1,id,'preserved review' from companies where name='기관3';update companies set is_published=false where name='기관4';");
  const links=(await db.query('select * from retained_review')).rows;
  await db.exec(await readFile('supabase/migrations/20260928010000_general_hospital_publication.sql','utf8'));
  assert.deepEqual((await db.query('select name from companies where is_published order by name')).rows.map(r=>r.name),['기관1','기관2']);
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   assert.equal((await db.query('select * from companies')).rows.length,2);
   assert.equal((await db.query("select * from search_companies('기관3')")).rows.length,0);
   await db.exec('reset role');
  }
  const fresh=snapshot([row(1,'병원','21'),...old.rows.slice(1),row(5),row(6,'의원','31'),row(7,'상급종합','01')]);
  await db.exec(buildHospitalRefresh(old,fresh,{publishNew:true,commit:true}).sql);
  assert.deepEqual((await db.query('select name from companies where is_published order by name')).rows.map(r=>r.name),['기관2','기관5','기관7']);
  assert.equal((await db.query('select * from companies')).rows.length,7);
  assert.deepEqual((await db.query('select * from retained_review')).rows,links);
 }finally{await db.close();}
});
