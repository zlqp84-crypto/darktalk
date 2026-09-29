import {timingSafeEqual} from 'node:crypto';
import {imageClients, serverImageKeyHasValidFormat} from '@/lib/server/imageClients';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(request:Request){
 const secret=process.env.CRON_SECRET;
 const received=Buffer.from(request.headers.get('authorization')??'');
 const expected=Buffer.from(`Bearer ${secret??''}`);
 if(!secret||received.length!==expected.length||!timingSafeEqual(received,expected))return new Response(null,{status:401});
 if(!serverImageKeyHasValidFormat())return Response.json({error:'Invalid server credential format'},{status:503});
 const {service}=imageClients('unused');
 try{
  // Claim only aged, unreferenced processed images. Database row locks also
  // prevent a concurrent post from attaching an image after this claim.
  const {error:claimError}=await service.rpc('claim_unreferenced_post_images',{p_limit:100});
  if(claimError)return Response.json({error:'Cleanup claim unavailable'},{status:500});
  const {data:jobs,error,status}=await service.from('post_image_jobs').select('id,status,public_path').eq('staging_removed',false).lt('created_at',new Date(Date.now()-24*60*60_000).toISOString()).limit(100);
  if(error){
   const message=(error.message??'').toLowerCase();
   const code=/^[A-Z0-9_]{1,20}$/.test(error.code??'')?error.code:message.includes('invalid api key')?'INVALID_SERVER_KEY':message.includes('fetch failed')?'NETWORK_FAILURE':message.includes('jwt')?'INVALID_SERVER_TOKEN':'UNAVAILABLE';
   return Response.json({error:'Cleanup database access failed',code,upstreamStatus:status},{status:500});
  }
  for(const job of jobs??[]){
   const {error:removeError}=await service.storage.from('post-image-staging').remove([job.id]);if(removeError)throw Error();
   if(job.status!=='ready'&&job.public_path){const {error:e}=await service.storage.from('post-images').remove([job.public_path]);if(e)throw Error();}
   const {error:e}=await service.from('post_image_jobs').update({staging_removed:true,...(job.status!=='ready'?{status:'failed'}:{})}).eq('id',job.id);if(e)throw Error();
  }
  return Response.json({removed:jobs?.length??0},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Cleanup failed'},{status:500});}
}
