import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanGif} from '../../lib/imagePrivacy.ts';
test('GIF sanitizing removes comment data and trailing payload without changing frame bytes',()=>{
 const gif=Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==','base64');
 const comment=Buffer.concat([Buffer.from([0x21,0xfe,6]),Buffer.from('SECRET'),Buffer.from([0])]);
 const input=Buffer.concat([gif.subarray(0,19),comment,gif.subarray(19),Buffer.from('TRAILING')]);
 assert.deepEqual(Buffer.from(cleanGif(input)),gif);
 assert.throws(()=>cleanGif(input.subarray(0,24)));
 assert.throws(()=>cleanGif(Buffer.from('not an image')));
});
