import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
test('reactions are idempotent, identity-bound and private; comment counts follow committed rows',async()=>{
 const db=new PGlite(), a='10000000-0000-0000-0000-000000000001',b='10000000-0000-0000-0000-000000000002',post='20000000-0000-0000-0000-000000000001';
 const file=p=>readFile(p,'utf8');
 try {
  await db.exec(await file('tests/security/observed-schema.sql'));
  await db.exec(`create table public.likes(id uuid primary key default gen_random_uuid(),post_id uuid references posts(id) on delete cascade,user_id uuid references profiles(id),created_at timestamptz default now(),unique(post_id,user_id));grant all on likes to anon,authenticated; alter table auth.users add column raw_user_meta_data jsonb,add column email_confirmed_at timestamptz,add column deleted_at timestamptz;`);
  await db.exec(await file('supabase/sql/increment_counters.sql'));
  await db.exec(await file('supabase/migrations/20260917120000_p0_content_privacy_and_permissions.sql'));
  await db.exec(await file('supabase/migrations/20260922010000_profile_creation.sql'));
  await db.query('insert into auth.users(id) values($1),($2)',[a,b]);
  await db.query("insert into profiles(id,nickname) values($1,'A'),($2,'B')",[a,b]);
  await db.query("insert into posts(id,title,content,likes_count) values($1,'test','test',10)",[post]);
  const migration=await file('supabase/migrations/20260922011000_trusted_reactions.sql');await db.exec(migration);
  async function as(role,id,query,args=[]){
   await db.exec(`begin;set local role ${role}`);await db.query("select set_config('request.jwt.claim.sub',$1,true)",[id]);
   try {const r=await db.query(query,args);await db.exec('commit');return r.rows;}catch(e){await db.exec('rollback');throw e;}
  }
  const like=(id,value)=>as('authenticated',id,'select set_post_like($1,$2) result',[post,value]);
  await assert.rejects(as('anon','','select set_post_like($1,true)',[post]),e=>e.code==='42501');
  for(const id of [a,b]){
   await assert.rejects(as('authenticated',id,'select * from likes'),e=>e.code==='42501');
   await assert.rejects(as('authenticated',id,'insert into likes(post_id,user_id) values($1,$2)',[post,a]),e=>e.code==='42501');
  }
  assert.equal((await like(a,true))[0].result.likes_count,11);
  assert.equal((await like(a,true))[0].result.likes_count,11);
  assert.equal((await like(b,false))[0].result.likes_count,11);
  assert.equal((await like(b,true))[0].result.likes_count,12);
  assert.equal((await like(a,false))[0].result.likes_count,11);
  assert.equal((await like(a,false))[0].result.likes_count,11);
  await assert.rejects(as('authenticated',a,'select increment_post_likes($1,99999)',[post]),e=>e.code==='22023');
  await as('authenticated',a,"insert into comments(post_id,user_id,content) values($1,$2,'test')",[post,a]);
  await as('authenticated',a,'select increment_post_comments_count($1,99999)',[post]);
  assert.equal((await db.query('select comments_count from posts')).rows[0].comments_count,1);
  await db.exec('delete from comments');
  assert.equal((await db.query('select comments_count from posts')).rows[0].comments_count,0);
  await db.exec(migration);
  assert.equal((await db.query('select likes_count from posts')).rows[0].likes_count,11);
 }finally{await db.close();}
});
