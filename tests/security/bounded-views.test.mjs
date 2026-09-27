import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
test('view receipts count once per 24 hours, stay private, and bind to confirmed callers',async()=>{
 const db=new PGlite(),a='10000000-0000-0000-0000-000000000001',b='10000000-0000-0000-0000-000000000002',p='20000000-0000-0000-0000-000000000001';
 try{
  await db.exec(await readFile('tests/security/observed-schema.sql','utf8'));
  await db.exec('alter table auth.users add column email_confirmed_at timestamptz,add column deleted_at timestamptz;');
  await db.query('insert into auth.users values($1,now(),null),($2,null,null)',[a,b]);
  await db.query("insert into posts(id,title,content,views_count) values($1,'test','test',10)",[p]);
  const sql=await readFile('supabase/migrations/20260922012000_bounded_views.sql','utf8');await db.exec(sql);
  async function as(role,id,query='select record_post_view($1) n',args=[p]){
   await db.exec(`begin;set local role ${role}`);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id]);
   try{const r=await db.query(query,args);await db.exec('commit');return r.rows;}catch(e){await db.exec('rollback');throw e;}
  }
  assert.equal((await as('anon',''))[0].n,10);
  assert.equal((await as('authenticated',a))[0].n,11);
  assert.equal((await as('authenticated',a))[0].n,11);
  await assert.rejects(as('authenticated',b),e=>e.code==='42501');
  for(const role of ['anon','authenticated'])for(const q of ['select * from post_view_receipts','delete from post_view_receipts'])await assert.rejects(as(role,a,q,[]),e=>e.code==='42501');
  await db.exec("update post_view_receipts set last_counted_at=now()-interval '25 hours'");
  assert.equal((await as('authenticated',a))[0].n,12);
  await db.exec(sql);
  assert.equal((await as('authenticated',a))[0].n,12);
 }finally{await db.close();}
});
