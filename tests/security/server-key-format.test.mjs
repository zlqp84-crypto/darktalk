import test from 'node:test';
import assert from 'node:assert/strict';
import {serverImageKeyHasValidFormat} from '../../lib/server/imageClients.ts';
test('server key format check rejects masked and partial values without exposing them',()=>{
 const previous=process.env.SUPABASE_SERVICE_ROLE_KEY;
 try{
  for(const value of ['', '••••••••', 'eyJpartial', 'SUPABASE_SERVICE_ROLE_KEY=abc', 'abc.def.ghi\nwrong']){
   process.env.SUPABASE_SERVICE_ROLE_KEY=value;assert.equal(serverImageKeyHasValidFormat(),false);
  }
  for(const value of ['abc.def.ghi',' sb_secret_example-test_123 ']){
   process.env.SUPABASE_SERVICE_ROLE_KEY=value;assert.equal(serverImageKeyHasValidFormat(),true);
  }
 }finally{if(previous===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=previous;}
});
