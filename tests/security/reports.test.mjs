import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
test('reports enforce login, rate limits, private identities and administrator MFA',async()=>{
 const db=new PGlite(),a='10000000-0000-0000-0000-000000000001',b='10000000-0000-0000-0000-000000000002',admin='10000000-0000-0000-0000-000000000003';
 const file=p=>readFile(p,'utf8');
 try{
  await db.exec(await file('tests/security/observed-schema.sql'));
  await db.exec('alter table auth.users add column raw_user_meta_data jsonb,add column email_confirmed_at timestamptz,add column deleted_at timestamptz;');
  for(const name of ['20260917120000_p0_content_privacy_and_permissions.sql','20260918030000_company_directory.sql','20260919010000_company_reviews.sql','20260922010000_profile_creation.sql','20260922020000_content_reports.sql'])await db.exec(await file('supabase/migrations/'+name));
  await db.query('insert into auth.users(id) values($1),($2),($3)',[a,b,admin]);
  await db.query("insert into profiles(id,nickname,is_admin) values($1,'A',false),($2,'B',false),($3,'Admin',true)",[a,b,admin]);
  const posts=(await db.query("insert into posts(title,content) select 'test','test' from generate_series(1,11) returning id")).rows.map(r=>r.id);
  async function as(role,id,aal,query,args=[]){await db.exec(`begin;set local role ${role}`);await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:id,aal,role})]);try{const r=await db.query(query,args);await db.exec('commit');return r.rows;}catch(e){await db.exec('rollback');throw e;}}
  const submit=(id,p)=>as('authenticated',id,'aal1',"select submit_content_report('post',$1,'privacy','details') id",[p]);
  await assert.rejects(as('anon',null,null,"select submit_content_report('post',$1,'spam','')",[posts[0]]),e=>e.code==='42501');
  const report=(await submit(a,posts[0]))[0].id;
  assert.equal((await submit(a,posts[0]))[0].id,report);
  await submit(b,posts[0]);
  for(const [id,aal] of [[a,'aal2'],[b,'aal1'],[admin,'aal1']]){
   await assert.rejects(as('authenticated',id,aal,'select * from admin_content_reports()'),e=>e.code==='42501');
   await assert.rejects(as('authenticated',id,aal,'select * from content_reports'),e=>e.code==='42501');
  }
  const visible=await as('authenticated',admin,'aal2','select * from admin_content_reports()');
  assert.equal(visible.length,2);assert.ok(!JSON.stringify(visible).includes(a));assert.ok(!Object.keys(visible[0]).includes('reporter_id'));
  await as('authenticated',admin,'aal2',"select resolve_content_report($1,'resolved')",[report]);
  assert.equal((await as('authenticated',admin,'aal2','select * from admin_content_reports()')).length,1);
  for(const p of posts.slice(1,10))await submit(a,p);
  await assert.rejects(submit(a,posts[10]),e=>e.code==='22023');
 }finally{await db.close();}
});
