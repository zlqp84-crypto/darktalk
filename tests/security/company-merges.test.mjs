import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {before,after,test} from 'node:test';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002',ADMIN='10000000-0000-4000-8000-000000000003';
const SOURCE='20000000-0000-4000-8000-000000000001',TARGET='20000000-0000-4000-8000-000000000002';
const evidence='Official records match address, telephone, opening date and institution type.';
before(async()=>{
 for(const file of ['tests/security/observed-schema.sql',...['20260917120000_p0_content_privacy_and_permissions.sql','20260918030000_company_directory.sql','20260919010000_company_reviews.sql','20260927020000_company_merges.sql'].map(n=>'supabase/migrations/'+n)])await db.exec(await readFile(file,'utf8'));
 for(const [id,n,admin] of [[A,'a',false],[B,'b',false],[ADMIN,'admin',true]]){await db.query('insert into auth.users values($1)',[id]);await db.query('insert into profiles(id,nickname,is_admin) values($1,$2,$3)',[id,n,admin]);}
 for(const [id,slug] of [[SOURCE,'source-company'],[TARGET,'target-company']])await db.query("insert into companies(id,slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published) values($1,$2,'Test','verified_manual',$2,'https://example.org','2026-09-27','2026-09-27',true)",[id,slug]);
 await db.query("insert into company_reviews(company_id,user_id,rating,title,pros,cons,status,approved_at,access_until) values($1,$2,4,'Review title',repeat('good ',10),repeat('bad ',10),'approved',now(),now()+interval '90 days')",[SOURCE,A]);
});
after(()=>db.close());
async function as(id,aal,fn){await db.exec('begin');await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:id,aal})]);await db.exec(`set local role ${id?'authenticated':'anon'}`);try{return await fn();}finally{await db.exec('rollback');}}
const merge=()=>db.query('select merge_companies($1,$2,$3,$4) moved',[SOURCE,TARGET,'https://www.data.go.kr/data/15001698/openapi.do',evidence]);
for(const [label,id,aal] of [['anon',null,'aal1'],['user A',A,'aal2'],['user B',B,'aal2'],['admin without MFA',ADMIN,'aal1']]){
 test(`${label} cannot merge`,()=>assert.rejects(as(id,aal,merge),e=>e.code==='42501'));
}
for(const [label,id,aal] of [['anon',null,'aal1'],['A',A,'aal2'],['admin',ADMIN,'aal2']])test(`${label} cannot read merge evidence or directly mutate aliases`,async()=>{
 for(const sql of ['select * from company_merges','delete from company_merges','insert into company_merges default values'])await assert.rejects(as(id,aal,()=>db.exec(sql)),e=>e.code==='42501');
});
test('MFA administrator merges without losing review identity, approval or access',async()=>{
 const old=(await db.query('select id,status,approved_at,access_until from company_reviews')).rows[0];
 await as(ADMIN,'aal2',async()=>{
  assert.equal((await merge()).rows[0].moved,1);
  assert.equal((await merge()).rows[0].moved,0);
  assert.equal((await db.query("select resolve_company_slug('source-company') slug")).rows[0].slug,'target-company');
  await db.exec('reset role');
  const updated=(await db.query('select id,status,approved_at,access_until,company_id from company_reviews')).rows[0];
  assert.deepEqual(updated,{...old,company_id:TARGET});
  assert.equal((await db.query('select count(*)::int n from companies')).rows[0].n,2);
  assert.equal((await db.query('select is_published from companies where id=$1',[SOURCE])).rows[0].is_published,false);
  await db.exec('set local role anon');
  assert.equal((await db.query("select resolve_company_slug('source-company') slug")).rows[0].slug,'target-company');
  assert.equal((await db.query('select slug from companies')).rows.length,1);
  await db.exec('reset role');await db.query('update companies set is_published=false where id=$1',[TARGET]);await db.exec('set local role anon');
  assert.equal((await db.query("select resolve_company_slug('source-company') slug")).rows[0].slug,null);
 });
});
test('same-author review collision aborts without deleting either review',async()=>{
 await db.query("insert into company_reviews(company_id,user_id,rating,title,pros,cons) values($1,$2,3,'Other title',repeat('good ',10),repeat('bad ',10))",[TARGET,A]);
 await assert.rejects(as(ADMIN,'aal2',merge),/Conflicting author/);
 assert.equal((await db.query('select count(*)::int n from company_reviews')).rows[0].n,2);
 await db.query('delete from company_reviews where company_id=$1',[TARGET]);
});
test('invalid evidence rolls back review moves; self merge and alias chains are refused',async()=>{
 await assert.rejects(as(ADMIN,'aal2',()=>db.query('select merge_companies($1,$2,$3,$4)',[SOURCE,TARGET,'javascript:bad','short'])));
 assert.equal((await db.query('select company_id from company_reviews')).rows[0].company_id,SOURCE);
 await assert.rejects(as(ADMIN,'aal2',()=>db.query('select merge_companies($1,$1,$2,$3)',[SOURCE,'https://example.org',evidence])),/Invalid merge/);
 await assert.rejects(as(ADMIN,'aal2',async()=>{await merge();await db.query('select merge_companies($1,$2,$3,$4)',[TARGET,SOURCE,'https://example.org',evidence]);}));
});
