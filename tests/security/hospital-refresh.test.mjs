import test from 'node:test';
import assert from 'node:assert/strict';
import {compareHospitals} from '../../scripts/companies/compare-hospitals.mjs';
import {HIRA_SOURCE} from '../../scripts/companies/hira.mjs';

const row = (n, name = '병원') => ({id: n.toString(16).padStart(64, '0'), name, kind: '병원', kindCode: '21', region: '서울', district: '강남구'});
const snapshot = (rows, checkedOn = '2026-09-27') => ({source: HIRA_SOURCE, checkedOn, total: rows.length, rows});

test('refresh distinguishes renamed identity from same-name separate institutions', () => {
  const result = compareHospitals(snapshot([row(1), row(2)]), snapshot([row(1, '새 병원명'), row(3)]));
  assert.deepEqual(result.counts, {previous: 2, current: 2, added: 1, changed: 1, missing: 1, unchanged: 0});
  assert.equal(result.changed[0].id, row(1).id);
  assert.deepEqual(result.changed[0].changes.name, {before: '병원', after: '새 병원명'});
  assert.equal(result.missingMeansClosed, false);
  assert.equal(result.applied, false);
});
test('unchanged snapshot produces no changes and omits unexpected private fields', () => {
  const original = snapshot([row(1)]);
  assert.equal(compareHospitals(original, original).counts.unchanged, 1);
  const result = compareHospitals(original, snapshot([row(1), {...row(2), phone: 'private'}]));
  assert.equal('phone' in result.added[0], false);
});
test('incomplete, duplicate, invalid and stale snapshots fail closed', () => {
  const valid = snapshot([row(1)]);
  for (const invalid of [{...valid, total: 2}, snapshot([row(1), row(1)]), snapshot([{...row(1), id: 'bad'}]), snapshot([row(1)], '2026-09-26')]) {
    assert.throws(() => compareHospitals(valid, invalid));
  }
});
