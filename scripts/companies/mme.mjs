import {createHash} from 'node:crypto';
import {validDate} from './dart.mjs';
export const MME_SOURCE='https://www.mme.or.kr/PGPC0010.do';

export function normalizeCertificates(rows,checkedOn,expectedCount) {
 validDate(checkedOn);
 if(!Number.isSafeInteger(expectedCount)||expectedCount<1||rows.length!==expectedCount) throw Error('Incomplete MME list');
 const seen=new Set(),byBusiness=new Map();
 for(const [index,row] of rows.entries()) {
  if(row.length!==6||row[0]!==String(expectedCount-index)||!row[1]?.trim()||row[1].length>200||/[\u0000-\u001f]/.test(row[1])||!/^\d{3}-\d{2}-\d{5}$/.test(row[2])||!/^20\d{2}$/.test(row[3])||!new RegExp('^'+row[3]+'-\\d+$').test(row[4])||seen.has(row[4])) throw Error('Invalid MME record');
  seen.add(row[4]);
  const dates=row[5].split(' ~ ');
  if(dates.length!==2) throw Error('Invalid certificate interval');
  const [from,to]=dates.map(validDate);
  if(from>to) throw Error('Reversed certificate interval');
  if(from>checkedOn||to<checkedOn) continue;
  const id=createHash('sha256').update(row[2].replaceAll('-','')).digest('hex');
  const record={id,name:row[1].trim(),issuedYear:row[3],certificate:row[4],validFrom:from,validTo:to};
  const prior=byBusiness.get(id);
  // Same business can have renewed certificates. Keep the newest issue number.
  if(!prior||Number(record.certificate.split('-')[1])>Number(prior.certificate.split('-')[1])) byBusiness.set(id,record);
 }
 if(!byBusiness.size) throw Error('No eligible certificates');
 return [...byBusiness.values()];
}
