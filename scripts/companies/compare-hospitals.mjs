// Offline review only. Never connects to a database or emits mutation SQL.
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {validateHospitalSnapshot} from './hira.mjs';

const fields = ['name', 'kind', 'kindCode', 'region', 'district'];
const safeRow = row => Object.fromEntries(['id', ...fields].map(key => [key, row[key]]));
export function compareHospitals(previous, current) {
  validateHospitalSnapshot(previous);
  validateHospitalSnapshot(current);
  if (current.checkedOn < previous.checkedOn) throw Error('Refusing older snapshot');
  const before = new Map(previous.rows.map(row => [row.id, row]));
  const after = new Map(current.rows.map(row => [row.id, row]));
  const added = [], changed = [], missing = [];
  let unchanged = 0;
  for (const row of current.rows) {
    const old = before.get(row.id);
    if (!old) { added.push(safeRow(row)); continue; }
    const changes = Object.fromEntries(fields.filter(key => old[key] !== row[key]).map(key => [key, {before: old[key], after: row[key]}]));
    if (Object.keys(changes).length) changed.push({id: row.id, changes});
    else unchanged++;
  }
  for (const row of previous.rows) if (!after.has(row.id)) missing.push(safeRow(row));
  for (const rows of [added, changed, missing]) rows.sort((a,b) => a.id.localeCompare(b.id));
  return {
    source: 'hira', previousDate: previous.checkedOn, currentDate: current.checkedOn,
    applied: false, missingMeansClosed: false,
    counts: {previous: previous.total, current: current.total, added: added.length, changed: changed.length, missing: missing.length, unchanged},
    added, changed, missing,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const {values} = parseArgs({options: {before: {type: 'string'}, after: {type: 'string'}, output: {type: 'string'}}});
    if (!values.before || !values.after || !values.output) throw Error('Required: --before snapshot.json --after snapshot.json --output report.json');
    const report = compareHospitals(JSON.parse(readFileSync(values.before, 'utf8')), JSON.parse(readFileSync(values.after, 'utf8')));
    mkdirSync(dirname(values.output), {recursive: true});
    writeFileSync(values.output, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'});
    console.log(JSON.stringify({applied: false, ...report.counts}));
  } catch {
    console.error('Comparison failed. Check complete snapshots, date order and a new output path. No database changes were made.');
    process.exitCode = 1;
  }
}
