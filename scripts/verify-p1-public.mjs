// Production-safe anonymous probes: reads and requests expected to be denied.
// No credentials, response bodies, account IDs or content are logged.
import assert from 'node:assert/strict';
const base=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!base||!key)throw new Error('Public Supabase configuration missing');
async function call(path,body){
 const response=await fetch(new URL('/rest/v1/'+path,base),{method:body?'POST':'GET',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000)});
 return {status:response.status,data:await response.json()};
}
const zero='00000000-0000-0000-0000-000000000000';
try{
 for(const table of ['likes','post_view_receipts','content_reports','account_deletion_requests']){
  const r=await call(table+'?select=*&limit=1');assert.ok([401,403].includes(r.status));console.log(`${table}: anonymous read denied`);
 }
 for(const [fn,body] of [['ensure_my_profile',{}],['set_post_like',{p_post_id:zero,p_liked:true}],['increment_post_likes',{p_post_id:zero,p_delta:99999}],['submit_content_report',{p_target_type:'post',p_target_id:zero,p_reason:'spam'}],['request_account_deletion',{}],['admin_content_reports',{}],['admin_account_deletion_requests',{}]]){
  const r=await call('rpc/'+fn,body);assert.ok([401,403].includes(r.status));console.log(`${fn}: anonymous call denied`);
 }
 const posts=await call('posts?select=id,views_count&limit=1');assert.equal(posts.status,200);
 if(posts.data.length){const p=posts.data[0];const r=await call('rpc/record_post_view',{p_post_id:p.id});assert.equal(r.status,200);assert.equal(r.data,p.views_count??0);console.log('anonymous view: readable without increment');}
 console.log('P1 public probes passed');
}catch{console.error('P1 public probe failed; inspect permissions without logging secrets or response contents.');process.exitCode=1;}
