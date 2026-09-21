// Never print the request URL, key, raw response, or transport exception.
import {XMLParser} from 'fast-xml-parser';

const key = process.env.HIRA_API_KEY?.trim();
if (!key) {
 console.error('HIRA_API_KEY is missing. Save it in .env.hira.local.');
 process.exitCode = 1;
} else {
 try {
  // Verified against the official data.go.kr dataset 15001698 Swagger UI.
  const url = new URL('https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList');
  url.searchParams.set('ServiceKey', key);
  url.searchParams.set('numOfRows', '1');
  url.searchParams.set('pageNo', '1');
  const response = await fetch(url, {redirect: 'error', signal: AbortSignal.timeout(20000)});
  const data = new XMLParser({parseTagValue: false}).parse(await response.text());
  const result = data.response;
  const code = result?.header?.resultCode;
  const total = Number(result?.body?.totalCount);
  const item = result?.body?.items?.item;
  if (!response.ok || code !== '00' || !Number.isSafeInteger(total) || total < 1 || !item?.ykiho || !item?.yadmNm) {
   console.error(JSON.stringify({ok: false, http: response.status, resultCode: /^\d{2}$/.test(code ?? '') ? code : null}));
   process.exitCode = 1;
  } else {
   console.log(JSON.stringify({ok: true, total, requiredFieldsPresent: ['ykiho','yadmNm','clCd','clCdNm','sidoCdNm','sgguCdNm'].every(field => typeof item[field] === 'string')}));
  }
 } catch {
  console.error('HIRA connection or response validation failed. No credentials or raw response were logged.');
  process.exitCode = 1;
 }
}
