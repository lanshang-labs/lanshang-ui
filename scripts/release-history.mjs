import {readdirSync,readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join,basename} from 'node:path';
import {createHash} from 'node:crypto';
export const digest = data => createHash('sha256').update(data).digest('hex');
export function restoreHistory(output,root='releases') {
 const versions=[];
 for(const version of readdirSync(root)) {
  if(!/^\d+\.\d+\.\d+$/.test(version))throw new Error(`Invalid release directory: ${version}`);
  const dir=join(root,version),manifest=JSON.parse(readFileSync(join(dir,'manifest.json'),'utf8'));
  if(manifest.version!==version)throw new Error('Release version mismatch');
  for(const [name,sha] of Object.entries(manifest.files)) {
   if(basename(name)!==name)throw new Error('Invalid archive path');
   const data=readFileSync(join(dir,name));
   if(digest(data)!==sha)throw new Error(`History changed: ${version}/${name}`);
   const target=name.endsWith('.tgz')?join(output,'packages',name):join(output,'r',`v${version}`,name);
   mkdirSync(join(target,'..'),{recursive:true});
   const content=name.endsWith('.json')?data.toString().replaceAll('/r/lanshang-provider.json',`/r/v${version}/lanshang-provider.json`):data;
   writeFileSync(target,content);
  }
  versions.push(version);
 }
 return versions;
}
