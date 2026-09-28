import {randomUUID} from 'node:crypto';
import {imageClients, imagesEnabled} from '@/lib/server/imageClients';
import {sanitizeImage} from '@/lib/server/sanitizeImage';

export const runtime = 'nodejs';
export const maxDuration = 60;
const reply = (body: object, status = 200) => Response.json(body, {status, headers: {'Cache-Control':'no-store'}});
// A missing secret must not silently downgrade an enabled deployment to direct uploads.
export function GET() { return reply({enabled: process.env.SERVER_IMAGE_UPLOAD_ENABLED === 'true'}); }
export async function POST(request: Request) {
  if (!imagesEnabled()) return reply({error:'Image processing unavailable'},503);
  const header = request.headers.get('authorization') ?? '';
  if (!/^Bearer [A-Za-z0-9._-]+$/.test(header)) return reply({error:'Unauthorized'},401);
  if (Number(request.headers.get('content-length') ?? 0) > 1024) return reply({error:'Invalid request'},400);
  const {user,service} = imageClients(header.slice(7));
  let claimedId: string | undefined;
  let publicPath: string | undefined;
  try {
    const {data: auth,error: authError} = await user.auth.getUser();
    if (authError || !auth.user || !auth.user.email_confirmed_at) return reply({error:'Unauthorized'},401);
    // Read a small bounded JSON request; file bytes travel through the private bucket.
    const reader=request.body?.getReader(); if(!reader)return reply({error:'Invalid request'},400);
    let total=0;const chunks:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>1024){await reader.cancel();return reply({error:'Invalid request'},400);}chunks.push(value);}
    const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if(typeof body.id!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(body.id))return reply({error:'Invalid request'},400);
    const {data:job,error:claimError}=await service.from('post_image_jobs').update({status:'processing'}).eq('id',body.id).eq('user_id',auth.user.id).eq('status','pending').gt('created_at',new Date(Date.now()-15*60_000).toISOString()).select('id').maybeSingle();
    if(claimError||!job)return reply({error:'Upload expired or already processed'},409);
    claimedId=job.id;
    const {data:original,error:downloadError}=await service.storage.from('post-image-staging').download(job.id);
    if(downloadError||!original)throw new Error('Download failed');
    const clean=await sanitizeImage(new Uint8Array(await original.arrayBuffer()));
    publicPath=`public/${randomUUID()}.${clean.extension}`;
    // Record the destination before upload so interrupted jobs can be cleaned up.
    const {error:recordError}=await service.from('post_image_jobs').update({public_path:publicPath}).eq('id',job.id).eq('status','processing');
    if(recordError)throw new Error('Record failed');
    const {error:uploadError}=await service.storage.from('post-images').upload(publicPath,clean.bytes,{contentType:clean.contentType,upsert:false});
    if(uploadError)throw new Error('Upload failed');
    const {error:removeError}=await service.storage.from('post-image-staging').remove([job.id]);
    if(removeError)throw new Error('Staging cleanup failed');
    const {error:readyError}=await service.from('post_image_jobs').update({status:'ready',staging_removed:true}).eq('id',job.id).eq('status','processing');
    if(readyError)throw new Error('Finalize failed');
    return reply({path:publicPath,url:service.storage.from('post-images').getPublicUrl(publicPath).data.publicUrl});
  }catch{
    if(claimedId){
      const publicRemoval=publicPath?await service.storage.from('post-images').remove([publicPath]):{error:null};
      const {error}=await service.storage.from('post-image-staging').remove([claimedId]);
      await service.from('post_image_jobs').update({status:'failed',staging_removed:!error&&!publicRemoval.error}).eq('id',claimedId);
    }
    // Do not log file bytes, URLs, credentials or raw service/decoder errors.
    return reply({error:'Image processing failed'},422);
  }
}
