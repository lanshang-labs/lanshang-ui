// Release gate: never replace Pages unless the currently published package is archived.
import {readFileSync} from 'node:fs';
import {digest} from './release-history.mjs';
const base='https://lanshang-labs.github.io/lanshang-ui/';
const response=await fetch(base+'r/build-info.json',{signal:AbortSignal.timeout(30000)});
if(!response.ok)throw new Error(`Cannot establish published version: HTTP ${response.status}`);
const info=await response.json();
if(!/^\d+\.\d+\.\d+$/.test(info.version))throw new Error('Invalid published version');
const name=new URL(info.package).pathname.split('/').pop();
if(digest(readFileSync(`releases/${info.version}/${name}`))!==info.sha256)throw new Error('Published package is missing or changed in release archive');
console.log(`Published ${info.version} is retained. Safe to replace Pages.`);
