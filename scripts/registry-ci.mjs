import {createServer} from 'node:http';
import {spawn} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';
import {restoreHistory,digest} from './release-history.mjs';
const output=mkdtempSync(join(tmpdir(),'lanshang-registry-ci-'));
function run(cmd,args,cwd=process.cwd(),env={}) {return new Promise((ok,fail)=>{
 const child=spawn(cmd,args,{cwd,env:{...process.env,...env},stdio:'inherit'});
 child.on('error',fail);child.on('exit',code=>code===0?ok():fail(new Error(`${cmd} exited ${code}`)));
});}
const server=createServer((req,res)=>{
 const path=resolve(output,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!path.startsWith(output+'/')||!existsSync(path)){res.writeHead(404).end();return}
 try {res.setHeader('Content-Type',path.endsWith('.json')?'application/json':'application/octet-stream');res.end(readFileSync(path))}catch{res.writeHead(500).end()}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const base=`http://127.0.0.1:${server.address().port}/`;
const env={LANSHANG_REGISTRY_BASE:base,LANSHANG_REGISTRY_OUT:output,ALL_PROXY:'',all_proxy:'',NO_PROXY:'127.0.0.1,localhost',no_proxy:'127.0.0.1,localhost'};
try {
 const versions=restoreHistory(output);
 const oldConsumers=[];
 for(const version of versions) {
  const info=JSON.parse(readFileSync(`releases/${version}/build-info.json`,'utf8'));
  const name=new URL(info.package).pathname.split('/').pop();
  const oldUrl=base+'packages/'+name;
  const consumer=mkdtempSync(join(tmpdir(),`lanshang-${version}-lock-`));
  writeFileSync(join(consumer,'package.json'),JSON.stringify({private:true,dependencies:{'@lanshang-labs/ui':oldUrl,react:'18.3.1','react-dom':'18.3.1',antd:'5.22.5'}}));
  await run('npm',['install','--ignore-scripts','--no-audit','--no-fund'],consumer,env);
  oldConsumers.push({version,consumer,lock:readFileSync(join(consumer,'package-lock.json'),'utf8')});
 }
 await run('npm',['run','build:registry'],process.cwd(),env);
 for(const {version,consumer,lock} of oldConsumers) {
  const info=JSON.parse(readFileSync(`releases/${version}/build-info.json`,'utf8'));
  const name=new URL(info.package).pathname.split('/').pop();
  assert.equal(digest(readFileSync(join(output,'packages',name))),info.sha256);
  // npm ci removes node_modules; a fresh cache forces downloading each retained URL.
  await run('npm',['ci','--ignore-scripts','--no-audit','--no-fund','--cache',mkdtempSync(join(tmpdir(),'lanshang-empty-cache-'))],consumer,env);
  assert.equal(readFileSync(join(consumer,'package-lock.json'),'utf8'),lock);
 }
 await run('npm',['run','test:registry'],process.cwd(),env);
 const current=JSON.parse(readFileSync('package.json','utf8')).version;
 assert(existsSync(join(output,'r',`v${current}`,'lanshang-blocks.json')));
 console.log(`PASS: archived ${versions.join(', ')} lockfiles survive clean-cache install; new Registry consumer passed.`);
} finally {server.close()}
