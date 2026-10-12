import {it,expect} from 'vitest';
import {mkdtempSync,cpSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {restoreHistory} from '../scripts/release-history.mjs';
it('retains package bytes and pins archived registry dependencies',()=>{
 const out=mkdtempSync(join(tmpdir(),'lanshang-history-test-'));
 try {
  expect(restoreHistory(out)).toContain('0.2.2');
  const name='lanshang-labs-ui-0.2.2-839c09b79a48.tgz';
  expect(readFileSync(join(out,'packages',name))).toEqual(readFileSync(`releases/0.2.2/${name}`));
  const block=JSON.parse(readFileSync(join(out,'r/v0.2.2/lanshang-blocks.json'),'utf8'));
  expect(block.registryDependencies[0]).toContain('/r/v0.2.2/lanshang-provider.json');
 } finally {rmSync(out,{recursive:true,force:true})}
});
it('fails closed on modified historical bytes',()=>{
 const temp=mkdtempSync(join(tmpdir(),'lanshang-history-corrupt-'));
 try {
  cpSync('releases',join(temp,'archive'),{recursive:true});
  writeFileSync(join(temp,'archive/0.2.2/lanshang-provider.json'),'{}');
  expect(()=>restoreHistory(join(temp,'out'),join(temp,'archive'))).toThrow('History changed');
 } finally {rmSync(temp,{recursive:true,force:true})}
});
