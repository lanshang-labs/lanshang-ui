import {lstatSync, rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

// dist is ignored, generated output. Reject links and unexpected targets before removing it.
const target=fileURLToPath(new URL('../dist/',import.meta.url));
let stat;
try { stat=lstatSync(target); } catch (error) {
  if(error.code==='ENOENT')process.exit(0);
  throw error;
}
if(!stat.isDirectory()||stat.isSymbolicLink())throw new Error('Refusing to clean non-directory dist');
rmSync(target,{recursive:true});
