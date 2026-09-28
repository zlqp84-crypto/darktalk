import {createHash} from 'node:crypto';
import {XMLParser, XMLValidator} from 'fast-xml-parser';
import {validDate} from './dart.mjs';

export const HIRA_SOURCE = 'https://www.data.go.kr/data/15001698/openapi.do';
// Publication scope chosen by the owner; keep full snapshots for identity tracking.
export const isPublicHospital = row => (row.kindCode === '01' && row.kind === '상급종합') || (row.kindCode === '11' && row.kind === '종합병원');
const clean = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max && !/[\u0000-\u001f]/.test(value);
export function parseHospitalPage(xml, expectedPage) {
 if (xml.length > 20_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true) throw Error('Invalid hospital XML');
 const response = new XMLParser({parseTagValue: false, ignoreAttributes: true}).parse(xml).response;
 if (response?.header?.resultCode !== '00') throw Error('Hospital API rejected request');
 const body = response.body;
 const total = Number(body?.totalCount), page = Number(body?.pageNo), size = Number(body?.numOfRows);
 if (![total,page,size].every(Number.isSafeInteger) || total < 1 || total > 200000 || page !== expectedPage || size < 1 || size > 10000) throw Error('Invalid hospital pagination');
 const items = body.items?.item ? (Array.isArray(body.items.item) ? body.items.item : [body.items.item]) : [];
 if (items.length !== Math.min(size, Math.max(0,total-(page-1)*size))) throw Error('Incomplete hospital page');
 const rows = items.map(item => {
  if (!clean(item.ykiho,1000) || !clean(item.yadmNm,200) || !clean(item.clCdNm,100) || !clean(item.sidoCdNm,100) || !clean(item.sgguCdNm,100) || !/^\d{2}$/.test(item.clCd)) throw Error('Invalid hospital record');
  // Retain no telephone, address, personnel counts, coordinates or raw provider ID.
  return {id:createHash('sha256').update(item.ykiho).digest('hex'),name:item.yadmNm.trim(),kind:item.clCdNm.trim(),kindCode:item.clCd,region:item.sidoCdNm.trim(),district:item.sgguCdNm.trim()};
 });
 if (new Set(rows.map(row=>row.id)).size !== rows.length) throw Error('Duplicate hospital identity');
 return {total,page,size,rows};
}

export function validateHospitalSnapshot(snapshot) {
 validDate(snapshot.checkedOn);
 if (snapshot.source !== HIRA_SOURCE || !Number.isSafeInteger(snapshot.total) || snapshot.total < 1 || snapshot.rows?.length !== snapshot.total || new Set(snapshot.rows.map(row=>row.id)).size !== snapshot.total) throw Error('Incomplete hospital snapshot');
 for (const row of snapshot.rows) {
  if (!/^[a-f0-9]{64}$/.test(row.id) || !clean(row.name,200) || !clean(row.kind,100) || !clean(row.region,100) || !clean(row.district,100) || !/^\d{2}$/.test(row.kindCode)) throw Error('Invalid hospital snapshot record');
 }
 return snapshot;
}
