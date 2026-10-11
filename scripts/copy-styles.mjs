import { readdir, mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
async function copy(dir='src') { for (const e of await readdir(dir,{withFileTypes:true})) { const path=join(dir,e.name); if(e.isDirectory()) { if(e.name!=='upstream') await copy(path); } else if(/\.(css)$/.test(e.name)||e.name==='LICENSE') {const dest=path.replace(/^src/,'dist');await mkdir(dirname(dest),{recursive:true});await copyFile(path,dest);} } }
await copy();
