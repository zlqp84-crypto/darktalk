import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { before, after, test } from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { zipSync, strToU8 } from 'fflate';
import { parseDart, buildImportSql } from '../../scripts/companies/dart.mjs';
import { safeExternalUrl } from '../../lib/companies.ts';
const db = new PGlite();
const A = '10000000-0000-4000-8000-000000000001';
const B = '10000000-0000-4000-8000-000000000002';
const source = 'https://example.org/official';
const xml = (name = 'Test &amp; Co', stock='012345', date='20260917') => `<result><list><corp_code>00123456</corp_code><corp_name>${name}</corp_name><stock_code>${stock}</stock_code><modify_date>${date}</modify_date></list></result>`;
before(async () => {
 await db.exec("create role anon; create role authenticated; create role service_role bypassrls; grant usage on schema public to anon,authenticated,service_role;");
 await db.exec(await readFile(new URL('../../supabase/migrations/20260918030000_company_directory.sql',import.meta.url),'utf8'));
 await db.query("insert into public.companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) values ($1,'fixture-public','Fixture 100% Corp','verified_manual','one',$3,'2026-09-17','2026-09-18',true),($2,'fixture-draft','Private draft','verified_manual','two',$3,'2026-09-17','2026-09-18',false)",[A,B,source]);
 await db.query("insert into public.company_classifications(company_id,dimension,value,source_url,reference_date) values ($1,'type','mid_sized',$3,'2026-09-17'),($1,'tag','listed',$3,'2026-09-17'),($2,'type','government',$3,'2026-09-17')",[A,B,source]);
 await db.query("insert into public.company_rankings(company_id,ranking_key,ranking_year,position,basis,publisher,source_url,reference_date) values ($1,'domestic_top1000',2025,10,'revenue','Fixture publisher',$3,'2026-09-17'),($2,'domestic_top1000',2025,11,'revenue','Fixture publisher',$3,'2026-09-17')",[A,B,source]);
});
after(()=>db.close());
async function asRole(role, callback) {
 await db.exec(`begin; set local role ${role}`);
 try { await callback(); } finally { await db.exec('rollback'); }
}
for(const role of ['anon','authenticated']) {
 test(`${role}: only published directory and classification/ranking facts visible`,()=>asRole(role,async()=>{
   for(const table of ['companies','company_classifications','company_rankings']) {
     const {rows}=await db.query(`select * from public.${table}`);
     assert.equal(rows.length,table==='company_classifications'?2:1);
     assert.ok(!JSON.stringify(rows).includes(B));
   }
 }));
 for(const table of ['companies','company_classifications','company_rankings']) {
   for(const operation of [`delete from public.${table}`,`update public.${table} set id=id`,`insert into public.${table} default values`]) {
     test(`${role}: blocks ${operation}`,()=>asRole(role,()=>assert.rejects(db.exec(operation),e=>e.code==='42501')));
   }
 }
 test(`${role}: RPC respects RLS and combined filters`,()=>asRole(role,async()=>{
   assert.equal((await db.query("select * from public.search_companies(p_type=>'mid_sized',p_tag=>'listed',p_ranking_year=>2025)")).rows.length,1);
   assert.equal((await db.query("select * from public.search_companies(p_type=>'government')")).rows.length,0);
   assert.equal((await db.query("select * from public.search_companies(p_ranking_year=>2024)")).rows.length,0);
   assert.equal((await db.query("select * from public.search_companies(p_query=>'%')")).rows.length,1);
   assert.equal((await db.query("select * from public.search_companies(p_query=>'_')")).rows.length,0);
   assert.equal((await db.query("select * from public.search_companies(p_query=>''' OR true --')")).rows.length,0);
 }));
}
test('source provenance mandatory and one primary company type',async()=>{
 await assert.rejects(db.query("insert into public.company_classifications(company_id,dimension,value,reference_date) values ($1,'tag','startup','2026-09-17')",[A]),e=>e.code==='23502');
 await assert.rejects(db.query("insert into public.company_classifications(company_id,dimension,value,source_url,reference_date) values ($1,'type','large',$2,'2026-09-17')",[A,source]),e=>e.code==='23505');
 await assert.rejects(db.query("insert into public.company_classifications(company_id,dimension,value,source_url,reference_date) values ($1,'tag','top1000',$2,'2026-09-17')",[A,source]),e=>e.code==='23514');
});
test('DART XML and ZIP retain leading zero IDs and entity text',()=>{
 const plain=parseDart(strToU8(xml()));
 assert.deepEqual(parseDart(zipSync({'CORPCODE.xml':strToU8(xml())})),plain);
 assert.equal(plain[0].code,'00123456'); assert.equal(plain[0].name,'Test & Co');
});
test('invalid XML, DTD, dates and DART error are rejected',()=>{
 for(const input of ['<result>', '<!DOCTYPE foo><result/>', xml('x','123'),xml('x','012345','20260230'),'<result><status>010</status><message>invalid key</message></result>']) assert.throws(()=>parseDart(strToU8(input)));
});
test('import is draft by default, safely quotes names, idempotent, preserves curated classification',async()=>{
 const records=parseDart(strToU8(xml("O&apos;Reilly \\ Test")));
 const sql=buildImportSql(records,'2026-09-18');
 await db.exec(sql); await db.exec(sql);
 const {rows}=await db.query("select * from public.companies where source_system='dart'");
 assert.equal(rows.length,1); assert.equal(rows[0].is_published,false); assert.equal(rows[0].name,"O'Reilly \\ Test");
 await db.query("insert into public.company_classifications(company_id,dimension,value,source_url,reference_date) values ($1,'type','small',$2,'2026-09-18')",[rows[0].id,source]);
 await db.exec(buildImportSql(parseDart(strToU8(xml('Renamed','', '20260918'))),'2026-09-18',true));
 assert.equal((await db.query("select is_published from public.companies where source_system='dart'")).rows[0].is_published,false);
 assert.equal((await db.query("select value from public.company_classifications where company_id=$1",[rows[0].id])).rows[0].value,'small');
 await db.exec(sql); // older snapshot must not undo rename or reintroduce listed flag.
 assert.equal((await db.query("select name from public.companies where source_system='dart'")).rows[0].name,'Renamed');
 assert.equal((await db.query("select count(*)::int n from public.company_classifications where company_id=$1",[rows[0].id])).rows[0].n,1);
});
test('search has stable pages and a hard 25-row response cap',async()=>{
 await db.exec(`insert into public.companies(slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) select 'paging-'||n,'Paging '||lpad(n::text,3,'0'),'verified_manual','paging-'||n,'${source}','2026-09-17','2026-09-18',true from generate_series(1,30) n`);
 await asRole('anon',async()=>{
   const first=(await db.query("select id from public.search_companies(p_query=>'Paging')")).rows;
   const next=(await db.query("select id from public.search_companies(p_query=>'Paging',p_offset=>24)")).rows;
   assert.equal(first.length,25); assert.equal(next.length,6); assert.equal(first[24].id,next[0].id);
 });
});
test('website links reject script schemes and embedded credentials',()=>{
 for(const value of ['javascript:alert(1)','data:text/html,hello','https://user:secret@example.org']) assert.equal(safeExternalUrl(value),null);
 assert.equal(safeExternalUrl('https://example.org'),'https://example.org/');
});
