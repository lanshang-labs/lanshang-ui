// Explicitly capture a published version before advancing package.json. Never overwrite an archive.
import {mkdirSync,writeFileSync,existsSync} from 'node:fs';
import {digest} from './release-history.mjs';
const base='https://lanshang-labs.github.io/lanshang-ui/';
async function read(path){const r=await fetch(new URL(path,base),{signal:AbortSignal.timeout(30000)});if(!r.ok)throw new Error(`HTTP ${r.status}: ${path}`);return Buffer.from(await r.arrayBuffer())}
const infoBytes=await read('r/build-info.json'),info=JSON.parse(infoBytes);
if(!/^\d+\.\d+\.\d+$/.test(info.version))throw new Error('Invalid version');
const dir=`releases/${info.version}`;
if(existsSync(dir))throw new Error(`Archive already exists: ${dir}`);
const packageURL=new URL(info.package);
if(packageURL.origin!==new URL(base).origin||!packageURL.pathname.startsWith('/lanshang-ui/packages/'))throw new Error('Unexpected package origin');
const name=packageURL.pathname.split('/').pop(),data=await read(info.package);
if(digest(data)!==info.sha256)throw new Error('Package hash mismatch');
const entries={[name]:data,'build-info.json':infoBytes};
for(const file of ['registry.json','lanshang-provider.json','lanshang-blocks.json'])entries[file]=await read(`r/${file}`);
mkdirSync(dir,{recursive:true});
for(const [file,bytes] of Object.entries(entries))writeFileSync(`${dir}/${file}`,bytes);
writeFileSync(`${dir}/manifest.json`,JSON.stringify({version:info.version,files:Object.fromEntries(Object.entries(entries).map(([file,bytes])=>[file,digest(bytes)]))},null,2)+'\n');
console.log(`Archived ${info.version}. Review and commit releases/ before publishing the next version.`);
