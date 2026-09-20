import {XMLParser} from 'fast-xml-parser';
import {validDate} from './dart.mjs';
export const KRX_SOURCE='https://kind.krx.co.kr/corpgeneral/corpList.do?method=loadInitPage';
export const ALIO_SOURCE='https://alio.go.kr/organ/organDisclosureList.do';
const text=s=>new XMLParser({parseTagValue:false}).parse('<x>'+s.replace(/<[^>]*>/g,'')+'</x>').x?.trim();
export function parseKind(html){
 const rows=[...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>[...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c=>text(c[1])));
 if(rows[0]?.slice(0,3).join('|')!=='회사명|시장구분|종목코드')throw Error('KRX columns changed');
 const result=rows.slice(1).map(r=>({name:r[0],market:r[1],stock:r[2]}));
 if(!result.length||result.some(r=>!r.name||!['유가','코스닥','코넥스'].includes(r.market)||!/^[A-Z0-9]{6}$/.test(r.stock)))throw Error('Invalid/duplicate KRX record');
 const groups=Object.groupBy(result,r=>r.stock);
 if(Object.values(groups).some(g=>new Set(g.map(r=>r.name+"|"+r.market)).size!==1))throw Error("Conflicting KRX identity");
 return Object.values(groups).map(g=>g[0]);
}
export function matchListed(dart,listed){
 const byStock=Object.groupBy(dart.filter(r=>r.stock),r=>r.stock);
 return listed.map(r=>{const matches=byStock[r.stock];if(matches?.length!==1)throw Error('Missing or ambiguous stock code');return {...r,code:matches[0].code}});
}
export function alioHeadquarters(rows,checkedOn){
 validDate(checkedOn);const result=rows.filter(r=>!r.parent).map(r=>{if(!/^C\d{4}$/.test(r.id)||!r.name||r.name.length>200||!['공기업(시장형)','공기업(준시장형)','준정부기관(기금관리형)','준정부기관(위탁집행형)','기타공공기관'].includes(r.type))throw Error('Invalid ALIO record');let homepage=null;if(r.homepage){const value=r.homepage.match(/^https?:\/\//)?r.homepage:'https://'+r.homepage;const u=new URL(value);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Unsafe homepage');homepage=u.href}return {...r,homepage,classification:r.type.startsWith('공기업(')?'public_enterprise':'public_institution',source:`https://alio.go.kr/organ/organDisclosureDtl.do?apbaId=${r.id}`,checkedOn}});
 if(!result.length||new Set(result.map(r=>r.id)).size!==result.length)throw Error('Empty/duplicate ALIO records');return result;
}
