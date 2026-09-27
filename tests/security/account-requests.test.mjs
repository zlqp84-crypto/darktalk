import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
test('account requests are private, idempotent, cancellable only before processing, and MFA protected',async()=>{
 const db=new PGlite(),a='10000000-0000-0000-0000-000000000001',b='10000000-0000-0000-0000-000000000002',admin='10000000-0000-0000-0000-000000000003';
 try{
  await db.exec(await readFile('tests/security/observed-schema.sql','utf8'));
  await db.exec('alter table auth.users add column raw_user_meta_data jsonb,add column email_confirmed_at timestamptz,add column deleted_at timestamptz;');
  for(const name of ['20260917120000_p0_content_privacy_and_permissions.sql','20260922010000_profile_creation.sql','20260927010000_account_requests.sql'])await db.exec(await readFile('supabase/migrations/'+name,'utf8'));
  await db.query('insert into auth.users(id) values($1),($2),($3)',[a,b,admin]);
  await db.query("insert into profiles(id,nickname,is_admin) values($1,'A',false),($2,'B',false),($3,'Admin',true)",[a,b,admin]);
  async function as(role,id,aal,q){await db.exec(`begin;set local role ${role}`);await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:id,aal,role})]);try{const r=await db.query(q);await db.exec('commit');return r.rows;}catch(e){await db.exec('rollback');throw e;}}
  await assert.rejects(as('anon',null,null,'select request_account_deletion()'),e=>e.code==='42501');
  await as('authenticated',a,'aal1','select request_account_deletion()');
  await as('authenticated',a,'aal1','select request_account_deletion()');
  assert.equal((await as('authenticated',a,'aal1','select * from my_account_deletion_request()')).length,1);
  assert.equal((await as('authenticated',b,'aal1','select * from my_account_deletion_request()')).length,0);
  for(const [id,aal] of [[a,'aal2'],[admin,'aal1']])await assert.rejects(as('authenticated',id,aal,'select * from admin_account_deletion_requests()'),e=>e.code==='42501');
  await assert.rejects(as('authenticated',admin,'aal2','select request_account_deletion()'),e=>e.code==='42501');
  const rows=await as('authenticated',admin,'aal2','select * from admin_account_deletion_requests()');assert.equal(rows.length,1);assert.ok(!JSON.stringify(rows).includes(a));
  await as('authenticated',b,'aal1','select cancel_account_deletion()');
  assert.equal((await db.query('select count(*)::int n from account_deletion_requests')).rows[0].n,1);
  await as('authenticated',a,'aal1','select cancel_account_deletion()');
  assert.equal((await db.query('select count(*)::int n from account_deletion_requests')).rows[0].n,0);
  await as('authenticated',a,'aal1','select request_account_deletion()');
  await db.exec("update account_deletion_requests set status='processing'");
  await assert.rejects(as('authenticated',a,'aal1','select cancel_account_deletion()'),e=>e.code==='22023');
  for(const role of ['anon','authenticated'])await assert.rejects(as(role,a,'aal2','select * from account_deletion_requests'),e=>e.code==='42501');
 }finally{await db.close();}
});
