// GIF animation frames are retained; comments, plain-text and unknown application
// extensions (including XMP) are excluded. Truncated inputs fail closed.
export function cleanGif(input: Uint8Array): Uint8Array {
  const text = (a:number,b:number) => String.fromCharCode(...input.slice(a,b));
  if (input.length < 14 || !['GIF87a','GIF89a'].includes(text(0,6))) throw new Error('Invalid GIF');
  let pos=13 + ((input[10]&128) ? 3*(2**((input[10]&7)+1)) : 0);
  if(pos>=input.length)throw new Error('Invalid GIF');
  const parts:Uint8Array[]=[input.slice(0,pos)];
  const blocks=()=>{while(true){if(pos>=input.length)throw new Error('Invalid GIF');const n=input[pos++];if(n===0)return;pos+=n;if(pos>input.length)throw new Error('Invalid GIF');}};
  let frames=0;
  while(pos<input.length){
    const start=pos, marker=input[pos++];
    if(marker===0x3b){if(!frames)throw new Error('Invalid GIF');parts.push(input.slice(start,pos));const out=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const p of parts){out.set(p,at);at+=p.length;}return out;}
    if(marker===0x2c){
      if(pos+9>input.length)throw new Error('Invalid GIF');
      const packed=input[pos+8];pos+=9;
      if(packed&128)pos+=3*(2**((packed&7)+1));
      if(pos>=input.length)throw new Error('Invalid GIF');pos++;blocks();frames++;
      parts.push(input.slice(start,pos));
    }else if(marker===0x21){
      if(pos>=input.length)throw new Error('Invalid GIF');
      const label=input[pos++];
      const looping=label===0xff && input[pos]===11 && ['NETSCAPE2.0','ANIMEXTS1.0'].includes(text(pos+1,pos+12));
      blocks();
      if(label===0xf9 || looping)parts.push(input.slice(start,pos));
    }else throw new Error('Invalid GIF');
  }
  throw new Error('Invalid GIF');
}

export async function preparePrivateImage(file:File):Promise<File>{
  if(file.size>5*1024*1024)throw new Error('Image too large');
  if(file.type==='image/gif'){
    const clean=cleanGif(new Uint8Array(await file.arrayBuffer()));
    return new File([clean as Uint8Array<ArrayBuffer>],'image.gif',{type:'image/gif'});
  }
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Unsupported image');
  const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
  try{
    if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>40_000_000)throw new Error('Image dimensions too large');
    const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const context=canvas.getContext('2d');if(!context)throw new Error('Image conversion unavailable');
    context.drawImage(bitmap,0,0);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Image conversion failed')),file.type,0.92));
    if(blob.size>5*1024*1024)throw new Error('Converted image too large');
    return new File([blob],'image.'+({ 'image/jpeg':'jpg','image/png':'png','image/webp':'webp' } as Record<string,string>)[blob.type],{type:blob.type});
  }finally{bitmap.close();}
}
