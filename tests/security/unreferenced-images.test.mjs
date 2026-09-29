import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';

test('image cleanup preserves live references and grace period, queues only unreferenced images and blocks reattachment',async()=>{
 const db=new PGlite();
 const A='10000000-0000-4000-8000-000000000001';
 const prefix='https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/';
 const paths=[1,2,3].map(n=>`public/40000000-0000-4000-8000-00000000000${n}.jpg`);
 async function claim(){await db.exec('set role service_role');try{return (await db.query('select claim_unreferenced_post_images() n')).rows[0].n;}finally{await db.exec('reset role');}}
 try{
  await db.exec(await readFile('tests/security/observed-schema.sql','utf8'));
  await db.exec("create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);insert into storage.buckets values('post-images','post-images',true,5242880,null);");
  for(const f of ['20260917120000_p0_content_privacy_and_permissions.sql','20260917121000_p0_image_identity.sql','20260928020000_private_image_processing.sql'])await db.exec(await readFile('supabase/migrations/'+f,'utf8'));
  await db.exec(await readFile('supabase/sql/activate_server_image_processing.sql','utf8'));
  await db.exec(await readFile('supabase/migrations/20260929010000_unreferenced_image_cleanup.sql','utf8'));
  await db.query('insert into auth.users values($1)',[A]);
  await db.query("insert into profiles(id,nickname)values($1,'test')",[A]);
  for(let i=0;i<3;i++){
   await db.query("insert into post_image_jobs(user_id,status,public_path,staging_removed,created_at)values($1,'ready',$2,true,now()-($3::int*interval '1 hour'))",[A,paths[i],i===2?1:25]);
   await db.query("insert into storage.objects(bucket_id,name)values('post-images',$1)",[paths[i]]);
  }
  for(let i=0;i<2;i++)await db.query("insert into posts(user_id,title,content,image_urls)values($1,'test','test',$2)",[A,[prefix+paths[0]]]);
  for(const role of ['anon','authenticated']){
   await db.exec('set role '+role);
   await assert.rejects(db.query('select claim_unreferenced_post_images()'),/permission denied/);
   await db.exec('reset role');
  }
  assert.equal(await claim(),1); // Only old unused image; linked and fresh images survive.
  const rows=(await db.query('select public_path,status,staging_removed from post_image_jobs order by public_path')).rows;
  assert.equal(rows[0].status,'ready');assert.equal(rows[1].status,'failed');assert.equal(rows[1].staging_removed,false);assert.equal(rows[2].status,'ready');
  // A failed Storage removal leaves a durable retry job, never ready/attachable.
  assert.equal(await claim(),0);
  await assert.rejects(db.query("insert into posts(user_id,title,content,image_urls)values($1,'test','test',$2)",[A,[prefix+paths[1]]]),/Unprocessed/);
  await db.exec('delete from posts where id=(select id from posts limit 1)');
  assert.equal(await claim(),0); // Second post still uses the image.
  await db.exec('delete from posts');
  assert.equal(await claim(),1);
  await assert.rejects(db.query("insert into posts(user_id,title,content,image_urls)values($1,'test','test',$2)",[A,[prefix+paths[0]]]),/Unprocessed/);
  await db.query("insert into posts(user_id,title,content,image_urls)values($1,'text only','body','{}')",[A]);
  assert.equal((await db.query("select count(*)::int n from storage.objects where bucket_id='post-images'")).rows[0].n,3); // RPC never deletes Storage metadata directly.
 }finally{await db.close();}
});
