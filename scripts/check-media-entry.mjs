import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

// Inspect the actual built public subpath, including its transitive imports.
const root=fileURLToPath(new URL('../',import.meta.url));
const result=await build({entryPoints:['@lanshang-labs/ui/media'],absWorkingDir:root,bundle:true,write:false,metafile:true,format:'esm',platform:'browser',external:['react','react-dom','react/jsx-runtime','antd','iconoir-react'],logLevel:'silent'});
const inputs=Object.keys(result.metafile.inputs);
assert(inputs.some(path=>path.endsWith('/ImageDeck.js')));
assert(inputs.some(path=>path.endsWith('/ImageCard.js')));
assert.deepEqual(inputs.filter(path=>/\/(Provider|theme|Markdown|charts|index)\.js$/.test(path)),[]);
const css=await build({entryPoints:['@lanshang-labs/ui/media.css'],absWorkingDir:root,bundle:true,write:false,metafile:true,logLevel:'silent'});
assert.deepEqual(Object.keys(css.metafile.inputs).map(path=>path.split('/').pop()).sort(),['image-card.css','image-deck.css','media.css']);
console.log('Media entry: independent runtime and three-file CSS closure verified.');
