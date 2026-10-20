// Run the full suite in bounded groups so large jsdom previews cannot retain
// memory across every test file in one Vitest process.
import {spawnSync} from 'node:child_process';
import {readdirSync} from 'node:fs';
import {join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const vitest=fileURLToPath(new URL('../node_modules/vitest/vitest.mjs',import.meta.url));
function collect(dir){
 return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const path=join(dir,entry.name);
  if(entry.isDirectory())return collect(path);
  return entry.isFile()&&/\.test\.[cm]?[jt]sx?$/.test(entry.name)?[relative(root,path)]:[];
 });
}
const files=collect(join(root,'tests')).sort();
if(files.length===0)throw new Error('No test files found');
const batchSize=6;
for(let start=0;start<files.length;start+=batchSize){
 const batch=files.slice(start,start+batchSize);
 console.log(`Test batch ${Math.floor(start/batchSize)+1}/${Math.ceil(files.length/batchSize)} (${batch.length} files)`);
 const result=spawnSync(process.execPath,[vitest,'run',...batch,'--maxWorkers=2','--no-file-parallelism'],{cwd:root,stdio:'inherit'});
 if(result.error)throw result.error;
 if(result.signal)throw new Error(`Vitest stopped by ${result.signal}`);
 if(result.status!==0)process.exit(result.status??1);
}
console.log(`PASS: all ${files.length} test files`);
