import {supabase} from './supabase';

export async function uploadPrivateImage(file:File, serverMode:boolean):Promise<string>{
 if(!serverMode){
  const extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'} as Record<string,string>)[file.type];
  if(!extension)throw Error('Unsupported image');
  const path=`public/${crypto.randomUUID()}.${extension}`;
  const {error}=await supabase.storage.from('post-images').upload(path,file);
  if(error)throw Error('Upload failed');return path;
 }
 const {data:id,error:reserveError}=await supabase.rpc('reserve_post_image');
 if(reserveError||typeof id!=='string')throw Error('Upload reservation failed');
 try{
  const {error}=await supabase.storage.from('post-image-staging').upload(id,file,{upsert:false});
  if(error)throw Error('Private upload failed');
  const {data}=await supabase.auth.getSession();
  if(!data.session)throw Error('Authentication required');
  const response=await fetch('/api/images',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify({id})});
  if(!response.ok)throw Error('Image processing failed');
  const result=await response.json();
  if(typeof result.path!=='string'||!/^public\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(result.path))throw Error('Invalid result');
  return result.path;
 }finally{
  // Successful server processing also deletes this; repeated deletion is safe.
  await supabase.storage.from('post-image-staging').remove([id]);
 }
}
