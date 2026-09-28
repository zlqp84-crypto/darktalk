import {test} from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {sanitizeImage,MAX_IMAGE_BYTES} from '../../lib/server/sanitizeImage.ts';
import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';

test('server decodes images and removes embedded metadata and trailing payload',async()=>{
 for(const format of ['jpeg','png','webp']){
  const input=await sharp({create:{width:12,height:8,channels:3,background:'red'}}).toFormat(format).withExif({IFD0:{Artist:'PRIVATE_AUTHOR',ImageDescription:'PRIVATE_LOCATION'}}).toBuffer();
  assert.ok((await sharp(input).metadata()).exif);
  const result=await sanitizeImage(Buffer.concat([input,Buffer.from('PRIVATE_TRAILING')]));
  const meta=await sharp(result.bytes).metadata();
  assert.equal(meta.width,12);assert.equal(meta.height,8);
  for(const key of ['exif','xmp','icc','iptc'])assert.equal(meta[key],undefined);
  assert.equal(result.bytes.includes(Buffer.from('PRIVATE_')),false);
 }
});
test('server preserves GIF animation while re-encoding and stripping comments',async()=>{
 const base=await sharp({create:{width:2,height:2,channels:3,background:'red'}}).gif().toBuffer();
 // Use sharp raw pageHeight to produce a real two-frame animation.
 const pixels=Buffer.alloc(2*4*3,128);pixels.fill(0,0,12);
 const animated=await sharp(pixels,{raw:{width:2,height:4,channels:3,pageHeight:2}}).gif({loop:0,delay:[100,200]}).toBuffer();
 assert.equal((await sharp(animated,{animated:true}).metadata()).pages,2);
 const result=await sanitizeImage(animated);
 assert.equal((await sharp(result.bytes,{animated:true}).metadata()).pages,2);
 assert.equal((await sanitizeImage(base)).contentType,'image/gif');
});
test('invalid, oversized, unsupported and excessive-pixel inputs fail closed',async()=>{
 for(const input of [Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'),Buffer.from('not an image'),Buffer.alloc(MAX_IMAGE_BYTES+1)])await assert.rejects(sanitizeImage(input));
 const png=await sharp({create:{width:7000,height:6000,channels:3,background:'white'}}).png().toBuffer();
 await assert.rejects(sanitizeImage(png));
});

test('storage cutover enforces private staging, ownership, quotas and processed post references',async()=>{
 const db=new PGlite();const A='10000000-0000-4000-8000-000000000001',B='10000000-0000-4000-8000-000000000002';
 async function as(id,fn){await db.exec('begin');await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:id,aal:'aal1'})]);await db.exec('set local role '+(id?'authenticated':'anon'));try{return await fn();}finally{await db.exec('rollback');}}
 try{
  await db.exec(await readFile('tests/security/observed-schema.sql','utf8'));
  await db.exec("create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);insert into storage.buckets values('post-images','post-images',true,5242880,null);");
  for(const f of ['20260917120000_p0_content_privacy_and_permissions.sql','20260917121000_p0_image_identity.sql','20260928020000_private_image_processing.sql'])await db.exec(await readFile('supabase/migrations/'+f,'utf8'));
  await db.exec(await readFile('supabase/sql/activate_server_image_processing.sql','utf8'));
  for(const [id,name]of [[A,'a'],[B,'b']]){await db.query('insert into auth.users(id)values($1)',[id]);await db.query('insert into profiles(id,nickname)values($1,$2)',[id,name]);}
  await assert.rejects(as(null,()=>db.query('select reserve_post_image()')));
  for(const actor of [A,B])await assert.rejects(as(actor,()=>db.query('select * from post_image_jobs')));
  await as(A,async()=>{
   const id=(await db.query('select reserve_post_image() id')).rows[0].id;
   await db.query("insert into storage.objects(bucket_id,name,owner_id)values('post-image-staging',$1,$2)",[id,A]);
   assert.equal((await db.query('select * from storage.objects')).rows.length,1);
   await db.query("select set_config('request.jwt.claims',$1,true)",[JSON.stringify({sub:B})]);
   assert.equal((await db.query('select * from storage.objects')).rows.length,0);
   assert.equal((await db.query('delete from storage.objects returning name')).rows.length,0);
  });
  await assert.rejects(as(B,()=>db.query("insert into storage.objects(bucket_id,name,owner_id)values('post-image-staging',gen_random_uuid()::text,$1)",[B])));
  await assert.rejects(as(A,()=>db.query("insert into storage.objects(bucket_id,name,owner_id)values('post-images','public/40000000-0000-4000-8000-000000000001.jpg',$1)",[A])));
  await assert.rejects(as(A,async()=>{for(let i=0;i<6;i++)await db.query('select reserve_post_image()');}),/limit/);
  const path='public/40000000-0000-4000-8000-000000000002.jpg';
  await db.query("insert into post_image_jobs(user_id,status,public_path,staging_removed)values($1,'ready',$2,true)",[A,path]);
  await db.query("insert into storage.objects(bucket_id,name)values('post-images',$1)",[path]);
  const url='https://lvmvadjpzwqoiynoqosy.supabase.co/storage/v1/object/public/post-images/'+path;
  await as(A,async()=>{assert.equal((await db.query('select * from storage.objects')).rows.length,1);await db.query("insert into posts(user_id,title,content,image_urls)values($1,'Title','Body',$2)",[A,[url]]);});
  await assert.rejects(as(B,()=>db.query("insert into posts(user_id,title,content,image_urls)values($1,'Title','Body',$2)",[B,[url]])),/Unprocessed/);
  await assert.rejects(as(A,()=>db.query("insert into posts(user_id,title,content,image_urls)values($1,'Title','Body',$2)",[A,['https://example.org/raw.jpg']])),/Unprocessed/);
  await as(A,async()=>{assert.equal((await db.query('delete from storage.objects returning name')).rows.length,1);});
 }finally{await db.close();}
});
