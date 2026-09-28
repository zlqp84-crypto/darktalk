import {timingSafeEqual} from 'node:crypto';
import {imageClients, imagesEnabled} from '@/lib/server/imageClients';
export const runtime='nodejs';
export const maxDuration=60;
export async function GET(request:Request){
 const secret=process.env.CRON_SECRET;
 const received=Buffer.from(request.headers.get('authorization')??'');
 const expected=Buffer.from(`Bearer ${secret??''}`);
 if(!secret||received.length!==expected.length||!timingSafeEqual(received,expected))return new Response(null,{status:401});
 if(!imagesEnabled())return new Response(null,{status:503});
 const {service}=imageClients('unused');
 try{
  const {data:jobs,error}=await service.from('post_image_jobs').select('id,status,public_path').eq('staging_removed',false).lt('created_at',new Date(Date.now()-24*60*60_000).toISOString()).limit(100);
  if(error)throw Error();
  for(const job of jobs??[]){
   const {error:removeError}=await service.storage.from('post-image-staging').remove([job.id]);if(removeError)throw Error();
   if(job.status!=='ready'&&job.public_path){const {error:e}=await service.storage.from('post-images').remove([job.public_path]);if(e)throw Error();}
   const {error:e}=await service.from('post_image_jobs').update({staging_removed:true,...(job.status!=='ready'?{status:'failed'}:{})}).eq('id',job.id);if(e)throw Error();
  }
  return Response.json({removed:jobs?.length??0},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Cleanup failed'},{status:500});}
}
