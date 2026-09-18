// Downloads official data and emits reviewable SQL; never connects to the DB.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { parseDart, buildImportSql, validDate } from './dart.mjs';

async function main() {
  const { values } = parseArgs({ options: {
    input: { type: 'string' }, output: { type: 'string', default: 'artifacts/companies/dart-import.sql' },
    'checked-on': { type: 'string' }, publish: { type: 'boolean', default: false },
    help: { type: 'boolean' },
  }});
  if (values.help) { console.log('npm run companies:prepare -- [--input CORPCODE.xml|zip --checked-on YYYY-MM-DD] [--output file.sql] [--publish]\nNo input: download using OPENDART_API_KEY. Default: draft records. SQL is not executed.'); return; }
  let bytes;
  let checkedOn;
  if (values.input) {
    if (!values['checked-on']) throw new Error('Offline input requires --checked-on (actual acquisition date)');
    checkedOn = validDate(values['checked-on']);
    bytes = new Uint8Array(await readFile(values.input));
  } else {
    const key = process.env.OPENDART_API_KEY;
    if (!key || !/^[a-fA-F0-9]{40}$/.test(key)) throw new Error('Set OPENDART_API_KEY in the local environment (never NEXT_PUBLIC_)');
    const endpoint = new URL('https://opendart.fss.or.kr/api/corpCode.xml');
    endpoint.searchParams.set('crtfc_key', key);
    let response;
    try { response = await fetch(endpoint, { signal: AbortSignal.timeout(60000), redirect: 'error' }); }
    catch { throw new Error('DART download failed; check connection and API access'); }
    if (!response.ok) throw new Error(`DART HTTP ${response.status}`);
    const chunks = []; let size = 0;
    for await (const chunk of response.body) { size += chunk.length; if (size > 30 * 1024 * 1024) { await response.body.cancel().catch(() => {}); throw new Error('Download exceeds 30 MB'); } chunks.push(chunk); }
    bytes = Buffer.concat(chunks);
    checkedOn = new Date().toISOString().slice(0,10);
  }
  if (checkedOn > new Date().toISOString().slice(0,10)) throw new Error('Checked date cannot be in the future');
  const records = parseDart(bytes);
  const sql = buildImportSql(records, checkedOn, values.publish);
  await mkdir(dirname(values.output), { recursive: true });
  await writeFile(values.output, sql, { flag: 'wx' });
  console.log(JSON.stringify({ companies: records.length, listed: records.filter(r=>r.stock).length, publication: values.publish ? 'new records published' : 'draft', output: values.output, applied: false }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
