import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {HIRA_SOURCE,validateHospitalSnapshot} from './hira.mjs';
import {MME_SOURCE,normalizeCertificates} from './mme.mjs';

export function stableId(value) {
 const hex=createHash('sha256').update('darktalk-directory-v1:'+value).digest('hex');
 return `${hex.slice(0,8)}-${hex.slice(8,12)}-5${hex.slice(13,16)}-a${hex.slice(17,20)}-${hex.slice(20,32)}`;
}
export function csv(headers,rows) {
 const cell=value=>{const text=value==null?'':String(value);return /[",\r\n]/.test(text)?'"'+text.replaceAll('"','""')+'"':text;};
 return [headers,...rows.map(row=>headers.map(key=>row[key]))].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
export function expansionRecords(hospitalSnapshot,certificates,checkedOn) {
 validateHospitalSnapshot(hospitalSnapshot);
 const companies=[],facts=[];
 const add=(source,row,url,classifications)=>{
  const id=stableId(source+':'+row.id);
  companies.push({id,slug:source+'-'+row.id,name:row.name,source_system:source,source_id:row.id,source_url:url,source_updated_on:checkedOn,checked_on:checkedOn,is_published:false});
  for(const [dimension,value] of classifications) facts.push({id:stableId(id+':'+dimension+':'+value),company_id:id,dimension,value,source_url:url,reference_date:checkedOn});
 };
 for(const row of hospitalSnapshot.rows) add('hira',row,HIRA_SOURCE,[['type','medical'],['industry',row.kind],['region',row.region],['region',row.region+' '+row.district]]);
 // A certificate history entry is not proof of current legal size or listing status.
 for(const row of certificates) add('mme',row,MME_SOURCE,[['tag','mid_sized_certificate']]);
 return {companies,facts};
}
if(process.argv[1]?.endsWith('prepare-expansion.mjs')) {
 const date=process.argv[2];
 const hospitals=validateHospitalSnapshot(JSON.parse(readFileSync(`artifacts/companies/hira-${date}.json`,'utf8')));
 const raw=JSON.parse(readFileSync(`artifacts/companies/mme-${date}.json`,'utf8'));
 const certificates=normalizeCertificates(raw,date,3987);
 const {companies,facts}=expansionRecords(hospitals,certificates,date);
 const dir=`artifacts/companies/expansion-${date}`;mkdirSync(dir,{recursive:true});
 for(const source of ['hira','mme']) {
  const subset=companies.filter(row=>row.source_system===source),ids=new Set(subset.map(row=>row.id));
  writeFileSync(`${dir}/${source}-companies.csv`,csv(Object.keys(subset[0]),subset));
  writeFileSync(`${dir}/${source}-classifications.csv`,csv(Object.keys(facts[0]),facts.filter(row=>ids.has(row.company_id))));
 }
 const manifest={date,companies:companies.length,classifications:facts.length,hospitals:hospitals.total,certificateRows:raw.length,certificateCompanies:certificates.length,hash:createHash('md5').update(companies.map(row=>row.id+'|'+row.name).sort().join('\n')).digest('hex')};
 writeFileSync(`${dir}/manifest.json`,JSON.stringify(manifest,null,2));
 writeFileSync(`${dir}/mme-normalized.json`,JSON.stringify(certificates));
 console.log(JSON.stringify(manifest));
}
