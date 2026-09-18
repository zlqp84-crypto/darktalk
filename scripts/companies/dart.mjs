import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { unzipSync, strFromU8 } from 'fflate';

export const DART_SOURCE = 'https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019018';
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid date');
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== value) throw new Error('Invalid date');
  return value;
}
export function parseDart(input) {
  if (input.length > 30 * 1024 * 1024) throw new Error('DART input exceeds 30 MB');
  let xml;
  if (input[0] === 0x50 && input[1] === 0x4b) {
    const files = unzipSync(input, { filter: file => {
      if (!/(^|\/)CORPCODE\.xml$/i.test(file.name)) return false;
      if (file.originalSize > 100 * 1024 * 1024) throw new Error('DART XML exceeds 100 MB');
      return true;
    }});
    const selected = Object.values(files);
    if (selected.length !== 1) throw new Error('Expected one CORPCODE.xml in archive');
    xml = strFromU8(selected[0]);
  } else xml = new TextDecoder('utf-8', { fatal: true }).decode(input);
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('DTD/entities are not supported');
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid DART XML');
  const parsed = new XMLParser({ parseTagValue: false, ignoreAttributes: true, trimValues: true }).parse(xml);
  if (parsed.result?.status && parsed.result.status !== '000') throw new Error(`DART rejected request (status ${String(parsed.result.status).replace(/[^0-9]/g,'')})`);
  const records = parsed.result?.list;
  if (!records) throw new Error('DART company list is missing');
  const seen = new Set();
  return (Array.isArray(records) ? records : [records]).map(record => {
    const code = record.corp_code;
    const name = record.corp_name;
    const stock = record.stock_code || '';
    const modified = record.modify_date;
    // DART stock codes are six-character strings; live data includes e.g. 0068Y0.
    if (!/^\d{8}$/.test(code) || typeof name !== 'string' || !name.trim() || name.length > 200 || /[\u0000-\u001f]/.test(name) || !/^\d{8}$/.test(modified) || (stock && !/^[A-Z0-9]{6}$/.test(stock))) throw new Error('Invalid DART company record');
    if (seen.has(code)) throw new Error('Duplicate DART company code');
    seen.add(code);
    return { code, name: name.trim(), stock, modified: validDate(`${modified.slice(0,4)}-${modified.slice(4,6)}-${modified.slice(6,8)}`) };
  });
}
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
export function buildImportSql(records, checkedOn, publish = false) {
  validDate(checkedOn);
  if (!records.length) throw new Error('Refusing empty import');
  if (records.some(r => r.modified > checkedOn)) throw new Error('Source date is after checked date');
  const sql = ["begin;", "set local standard_conforming_strings = on;", "set local lock_timeout = '5s';", "create temporary table dart_import (code text primary key, name text not null, modified date not null, stock text not null) on commit drop;"];
  for (let i = 0; i < records.length; i += 250) {
    sql.push('insert into dart_import values ' + records.slice(i, i+250).map(r => `(${quote(r.code)},${quote(r.name)},${quote(r.modified)},${quote(r.stock)})`).join(',\n') + ';');
  }
  sql.push(`insert into public.companies(slug,name,source_system,source_id,source_url,source_updated_on,checked_on,is_published)
select 'dart-'||code,name,'dart',code,${quote(DART_SOURCE)},modified,${quote(checkedOn)}::date,${publish} from dart_import
on conflict(source_system,source_id) do update set name=excluded.name,source_url=excluded.source_url,source_updated_on=excluded.source_updated_on,checked_on=excluded.checked_on
where excluded.source_updated_on >= companies.source_updated_on and excluded.checked_on >= companies.checked_on;
-- Re-import never publishes an existing hidden company or overwrites editorial fields.
-- Remove only this source's outdated listing assertion, never other classifications.
delete from public.company_classifications f using public.companies c,dart_import d
where f.company_id=c.id and c.source_system='dart' and c.source_id=d.code
and f.dimension='tag' and f.value='listed' and f.source_url=${quote(DART_SOURCE)}
and f.reference_date <= ${quote(checkedOn)}::date and c.checked_on <= ${quote(checkedOn)}::date
and c.source_updated_on <= d.modified and d.stock='';
insert into public.company_classifications(company_id,dimension,value,source_url,reference_date)
select c.id,'tag','listed',${quote(DART_SOURCE)},${quote(checkedOn)}::date from public.companies c join dart_import d on c.source_system='dart' and c.source_id=d.code
where d.stock<>'' and c.source_updated_on <= d.modified and c.checked_on <= ${quote(checkedOn)}::date
on conflict(company_id,dimension,value) do update set reference_date=excluded.reference_date
where company_classifications.source_url=excluded.source_url and company_classifications.reference_date<=excluded.reference_date;
commit;`);
  return sql.join('\n');
}
