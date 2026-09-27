import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('profile recovery requires confirmed identity, ignores privilege metadata and preserves existing accounts',async()=>{
 const db=new PGlite();
 const a='10000000-0000-0000-0000-000000000001', b='10000000-0000-0000-0000-000000000002';
 try {
  await db.exec(await readFile('tests/security/observed-schema.sql','utf8'));
  await db.exec('alter table auth.users add column raw_user_meta_data jsonb, add column email_confirmed_at timestamptz, add column deleted_at timestamptz;');
  await db.query(`insert into auth.users values ($1,$3::jsonb,now(),null),($2,$3::jsonb,null,null)`,[a,b,JSON.stringify({nickname:'same',company:'test',is_admin:true,is_verified:true})]);
  const sql=await readFile('supabase/migrations/20260922010000_profile_creation.sql','utf8');
  await db.exec(sql);
  async function run(role,id){
   await db.exec(`begin; set local role ${role};`);
   await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id]);
   try {await db.exec('select public.ensure_my_profile()');await db.exec('commit');}
   catch(e){await db.exec('rollback');throw e;}
  }
  await assert.rejects(run('anon',''),e=>e.code==='42501');
  await assert.rejects(run('authenticated',b),e=>e.code==='42501');
  await run('authenticated',a);
  assert.deepEqual((await db.query('select nickname,is_admin,is_verified from profiles')).rows,[{nickname:'same',is_admin:false,is_verified:false}]);
  await db.query('update auth.users set email_confirmed_at=now() where id=$1',[b]);
  await run('authenticated',b);
  assert.equal((await db.query('select count(*)::int n from profiles')).rows[0].n,2);
  assert.match((await db.query('select nickname from profiles where id=$1',[b])).rows[0].nickname,/^회원_[a-f0-9]{32}$/);
  await db.query('update profiles set is_admin=true where id=$1',[a]);
  await run('authenticated',a);
  assert.equal((await db.query('select is_admin from profiles where id=$1',[a])).rows[0].is_admin,true);
  await db.exec(sql);
 } finally {await db.close();}
});
