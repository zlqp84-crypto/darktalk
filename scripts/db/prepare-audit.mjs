import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// This is a deliberately narrow extractor for this repository, not a SQL parser.
// Unknown function syntax fails closed. Results never authorize migration repair.
export function extractFunctions(sql,source){
 const text=sql.replaceAll('\r\n','\n');
 const starts=[...text.matchAll(/^create\s+(?:or\s+replace\s+)?function\s+/gim)];
 const matches=[...text.matchAll(/^create\s+(?:or\s+replace\s+)?function\s+public\.(\w+)\s*\([\s\S]*?\bas\s+(\$\w*\$)([\s\S]*?)\2/gim)];
 if(matches.length!==starts.length)throw Error('Unsupported function syntax: '+source);
 return matches.map(m=>({name:m[1],source,hash:createHash('md5').update(m[3].trim()).digest('hex'),compactHash:createHash('md5').update(m[3].replace(/\s/g,'')).digest('hex')}));
}
export async function prepareAudit(root=process.cwd()){
 const files=(await readdir(resolve(root,'supabase/migrations'))).filter(f=>/^\d{14}_.+\.sql$/.test(f)).sort();
 const ordered=files.flatMap(f=>f==='20260929010000_unreferenced_image_cleanup.sql'?['supabase/sql/activate_server_image_processing.sql','supabase/migrations/'+f]:['supabase/migrations/'+f]);
 if(ordered.filter(f=>f.includes('activate_server')).length!==1)throw Error('Review cutover ordering');
 const functions=new Map(),manifest=[];
 for(const file of ordered){const sql=await readFile(resolve(root,file),'utf8');manifest.push({file,sha256:createHash('sha256').update(sql.replaceAll('\r\n','\n')).digest('hex')});for(const f of extractFunctions(sql,file))functions.set(f.name,f);}
 const quote=s=>"'"+s.replaceAll("'","''")+"'";
 const values=[...functions.values()].map(f=>`(${quote(f.name)},${quote(f.hash)},${quote(f.compactHash)},${quote(f.source)})`).join(',\n');
 const sql=`-- READ ONLY: body comparison is NOT proof of complete migration equivalence.
-- No user data, credential values, or function source returned.
begin read only;
set local statement_timeout='20s';
with expected(name,body_hash,compact_hash,source) as (values ${values}), compared as (
select e.name,e.source,count(p.oid)::int as matches,
 coalesce(bool_and(md5(btrim(replace(p.prosrc,E'\\r\\n',E'\\n'),E' \\t\\r\\n'))=e.body_hash),false) as body_matches,
 -- Heuristic only: whitespace inside strings/comments is also removed.
 coalesce(bool_and(md5(regexp_replace(p.prosrc,'\\s','','g'))=e.compact_hash),false) as compact_matches,
 coalesce(bool_and(p.prosecdef),false) as security_definer
from expected e left join pg_proc p on p.proname=e.name and p.pronamespace='public'::regnamespace
group by e.name,e.source)
select count(*) as expected_functions,
 count(*) filter(where matches=1) as found_once,
 count(*) filter(where body_matches) as exact_bodies,
 count(*) filter(where compact_matches and not body_matches) as whitespace_review_candidates,
 coalesce(jsonb_agg(name) filter(where not compact_matches or matches<>1),'[]') as other_differences
from compared;
rollback;
`;
 const out=resolve(root,'artifacts/db');await mkdir(out,{recursive:true});
 const stamp=new Date().toISOString().replaceAll(':','-');
 const stem=resolve(out,'audit-'+stamp);
 await writeFile(stem+'.sql',sql,{flag:'wx'});
 await writeFile(stem+'.json',JSON.stringify({generatedAt:new Date().toISOString(),scope:'function bodies only; not a backup or migration repair authorization',files:manifest,functions:[...functions.values()]},null,2),{flag:'wx'});
 return {sqlPath:stem+'.sql',manifestPath:stem+'.json',migrations:files.length,functions:functions.size};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(JSON.stringify(await prepareAudit(),null,2));
