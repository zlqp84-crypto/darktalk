import {mkdirSync,writeFileSync,renameSync} from 'node:fs';
import {HIRA_SOURCE,parseHospitalPage,validateHospitalSnapshot} from './hira.mjs';

const key=process.env.HIRA_API_KEY?.trim();
if(!key) throw Error('HIRA_API_KEY missing');
const checkedOn=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date());
const rows=[],seen=new Set(); let total, size;
try {
 for(let page=1;page<=1000;page++) {
  const url=new URL('https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList');
  url.searchParams.set('ServiceKey',key); url.searchParams.set('numOfRows','1000'); url.searchParams.set('pageNo',String(page));
  let parsed;
  for(let attempt=0;attempt<3;attempt++) {
   try {
    const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(30000)});
    if(!response.ok) throw Error('HTTP failure');
    parsed=parseHospitalPage(await response.text(),page); break;
   } catch { if(attempt===2) throw Error('Hospital page failed'); await new Promise(resolve=>setTimeout(resolve,1000)); }
  }
  total ??= parsed.total; size ??= parsed.size;
  if(total!==parsed.total || size!==parsed.size) throw Error('Hospital list changed during collection');
  for(const row of parsed.rows) { if(seen.has(row.id)) throw Error('Duplicate across hospital pages'); seen.add(row.id); rows.push(row); }
  console.log(JSON.stringify({page,collected:rows.length,total}));
  if(rows.length===total) break;
  await new Promise(resolve=>setTimeout(resolve,150));
 }
 const snapshot=validateHospitalSnapshot({source:HIRA_SOURCE,checkedOn,total,rows});
 mkdirSync('artifacts/companies',{recursive:true});
 const file=`artifacts/companies/hira-${checkedOn}.json`;
 writeFileSync(file+'.tmp',JSON.stringify(snapshot)); renameSync(file+'.tmp',file);
 console.log(JSON.stringify({complete:true,total,types:Object.fromEntries(Object.entries(Object.groupBy(rows,row=>row.kind)).map(([kind,items])=>[kind,items.length]))}));
} catch {
 console.error('Hospital collection stopped; no complete snapshot written. Credentials and raw errors are not logged.'); process.exitCode=1;
}
