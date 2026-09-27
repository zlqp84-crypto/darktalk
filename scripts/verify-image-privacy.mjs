// Local-only browser fixture; no user files, credentials, or production writes.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
import sharp from 'sharp';
const source=await readFile(new URL('../lib/imagePrivacy.ts',import.meta.url),'utf8');
const compiledModule=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const jpeg=await sharp({create:{width:32,height:16,channels:3,background:'#99aabb'}}).jpeg().withExif({IFD0:{Artist:'PRIVATE-TEST',ImageDescription:'PRIVATE-TEST'}}).toBuffer();
const html=`<!doctype html><meta charset="utf-8"><title>Image privacy verification</title><h1>Image privacy verification</h1><button id="run">Run fixture checks</button><pre id="result">Ready</pre><script type="module">
import {preparePrivateImage} from '/imagePrivacy.js';
document.querySelector('#run').onclick=async()=>{try{
 const raw=await(await fetch('/fixture.jpg')).blob();
 const clean=await preparePrivateImage(new File([raw],'fixture.jpg',{type:'image/jpeg'}));
 const bitmap=await createImageBitmap(clean);
 const result=await fetch('/verify',{method:'POST',body:clean});
 document.querySelector('#result').textContent=JSON.stringify({...await result.json(),width:bitmap.width,height:bitmap.height,type:clean.type});bitmap.close();
}catch{document.querySelector('#result').textContent='FAILED';}};
</script>`;
http.createServer(async(req,res)=>{
 if(req.url==='/'){res.setHeader('Content-Type','text/html');res.end(html);}
 else if(req.url==='/imagePrivacy.js'){res.setHeader('Content-Type','text/javascript');res.end(compiledModule);}
 else if(req.url==='/fixture.jpg'){res.setHeader('Content-Type','image/jpeg');res.end(jpeg);}
 else if(req.url==='/verify'&&req.method==='POST'){
  const parts=[];let size=0;for await(const p of req){size+=p.length;if(size>1024*1024){res.writeHead(413);res.end();return;}parts.push(p);}
  try{const metadata=await sharp(Buffer.concat(parts)).metadata();res.setHeader('Content-Type','application/json');res.end(JSON.stringify({passed:!metadata.exif&&!metadata.xmp&&!metadata.iptc,inputHadExif:!!(await sharp(jpeg).metadata()).exif}));}catch{res.writeHead(400);res.end();}
 }else{res.writeHead(404);res.end();}
}).listen(43893,'127.0.0.1',()=>console.log('Local privacy fixture: http://127.0.0.1:43893'));
