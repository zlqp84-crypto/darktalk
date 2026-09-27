// Immutable preparation bundle for the recurring operator. Does not apply SQL.
import {readdirSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {createHash} from 'node:crypto';
import {buildHospitalRefresh} from './prepare-hospital-refresh.mjs';
export function prepareCycle(baseline,snapshot) {
 if(baseline.kind!=='catalogue_baseline'||baseline.applicationVerified!==true)throw Error('Verified catalogue baseline required');
 const prepared=buildHospitalRefresh(baseline,snapshot,{publishNew:true});
 const counts=prepared.report.counts;
 // A sudden source reset must never automatically replace the live directory.
 if(counts.added+counts.changed>Math.max(100,baseline.total*0.02)||counts.missing>Math.max(100,baseline.total*0.02))throw Error('Large source change requires manual investigation');
 return {...prepared,applySql:buildHospitalRefresh(baseline,snapshot,{publishNew:true,commit:true}).sql};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try {
  const {values}=parseArgs({options:{snapshot:{type:'string'},baseline:{type:'string'},output:{type:'string'}}});
  if(!values.snapshot||!values.output)throw Error('Required snapshot and new output directory');
  const root='artifacts/companies';
  const baselinePath=values.baseline??join(root,readdirSync(root).filter(n=>/^hira-catalogue-baseline-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort().at(-1)??'MISSING_BASELINE');
  const baseline=JSON.parse(readFileSync(baselinePath,'utf8')), snapshot=JSON.parse(readFileSync(values.snapshot,'utf8'));
  const cycle=prepareCycle(baseline,snapshot);
  mkdirSync(values.output); // Fail if a prior run bundle already exists.
  const files={'preflight.sql':cycle.sql,'apply.sql':cycle.applySql,'report.json':JSON.stringify(cycle.report,null,2),'next-baseline.json':JSON.stringify(cycle.nextBaseline)};
  for(const [name,text]of Object.entries(files))writeFileSync(join(values.output,name),text,{flag:'wx'});
  const manifest={status:'prepared_not_applied',baselinePath,snapshotPath:values.snapshot,checkedOn:snapshot.checkedOn,counts:cycle.report.counts,withheldDuplicates:cycle.report.duplicateCandidates.length,hashes:Object.fromEntries(Object.entries(files).map(([name,text])=>[name,createHash('sha256').update(text).digest('hex')]))};
  writeFileSync(join(values.output,'manifest.json'),JSON.stringify(manifest,null,2),{flag:'wx'});
  console.log(JSON.stringify(manifest));
 }catch{console.error('Cycle preparation stopped. Check the verified baseline, complete snapshot, change size and unused output directory. No SQL executed.');process.exitCode=1;}
}
