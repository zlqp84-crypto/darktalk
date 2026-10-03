import {test} from 'node:test';
import assert from 'node:assert/strict';
import {extractFunctions} from '../../scripts/db/prepare-audit.mjs';

test('audit hashes preserve literal contents and accept CRLF and tagged bodies',()=>{
 const sql="create function public.example() returns text language sql as $body$\n select 'a b';\n$body$;";
 const [a]=extractFunctions(sql,'test');
 const [b]=extractFunctions(sql.replaceAll('\n','\r\n'),'test');
 const [different]=extractFunctions(sql.replace("'a b'","'ab'"),'test');
 assert.equal(a.hash,b.hash);
 assert.notEqual(a.hash,different.hash);
 assert.equal(a.compactHash,different.compactHash); // Explicitly NOT semantic proof.
});
test('audit refuses unsupported function syntax instead of silently skipping it',()=>{
 assert.throws(()=>extractFunctions("create function private.example() returns text language sql as $$select 'x'$$;",'test'),/Unsupported/);
 assert.throws(()=>extractFunctions("create function public.example() returns text language sql as 'select 1';",'test'),/Unsupported/);
});
