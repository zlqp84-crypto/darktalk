import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareCycle} from '../../scripts/companies/prepare-hospital-cycle.mjs';
import {HIRA_SOURCE} from '../../scripts/companies/hira.mjs';
const row=n=>({id:n.toString(16).padStart(64,'0'),name:'병원'+n,kind:'병원',kindCode:'21',region:'서울',district:'강남구'});
const snapshot=rows=>({source:HIRA_SOURCE,checkedOn:'2026-09-27',total:rows.length,rows});
const baseline=rows=>({...snapshot(rows),kind:'catalogue_baseline',applicationVerified:true});
test('recurring cycle requires an explicitly verified baseline',()=>{
 assert.throws(()=>prepareCycle(snapshot([row(1)]),snapshot([row(1)])),/Verified/);
 assert.throws(()=>prepareCycle({...baseline([row(1)]),applicationVerified:false},snapshot([row(1)])),/Verified/);
});
test('no-change cycle preserves retained missing records and produces no applied claim',()=>{
 const cycle=prepareCycle(baseline([row(1),row(2)]),snapshot([row(1)]));
 assert.equal(cycle.report.counts.added,0);assert.equal(cycle.report.counts.missing,1);
 assert.equal(cycle.nextBaseline.total,2);assert.equal(cycle.nextBaseline.applicationVerified,false);
 assert.match(cycle.sql,/rollback;/);assert.match(cycle.applySql,/commit;/);
});
test('new institutions that collide within the same snapshot are withheld',()=>{
 const cycle=prepareCycle(baseline([row(1)]),snapshot([row(1),{...row(2),name:'새 병원'},{...row(3),name:'새병원'}]));
 assert.deepEqual(cycle.report.duplicateCandidates,[row(2).id,row(3).id]);
 assert.equal((cycle.sql.match(/"publish_new":false/g)||[]).length,2);
});
test('abrupt feed replacement needs manual investigation',()=>{
 assert.throws(()=>prepareCycle(baseline([row(1)]),snapshot(Array.from({length:102},(_,i)=>row(i+1)))),/Large source change/);
 assert.throws(()=>prepareCycle(baseline(Array.from({length:102},(_,i)=>row(i+1))),snapshot([row(1)])),/Large source change/);
});
