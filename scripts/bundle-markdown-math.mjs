import {build} from 'esbuild';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import {dirname,resolve,relative} from 'node:path';
const result=await build({entryPoints:['src/markdown-math.ts'],outfile:'dist/markdown-math.js',bundle:true,format:'esm',platform:'neutral',mainFields:['module','main'],target:'es2020',legalComments:'eof',metafile:true});
const packages=new Map();
for(const input of Object.keys(result.metafile.inputs)){
 if(!input.includes('node_modules/'))continue;
 let folder=dirname(resolve(input));
 while(folder!==dirname(folder)){
  try{const pkg=JSON.parse(await readFile(`${folder}/package.json`,'utf8'));if(pkg.name){packages.set(pkg.name,{folder,pkg});break}}catch{}
  folder=dirname(folder);
 }
}
if(packages.get('katex')?.pkg.version!=='0.19.0')throw new Error('Markdown math must use the verified KaTeX 0.19.0 engine');
const sections=[];
for(const [name,{folder,pkg}] of [...packages].sort(([a],[b])=>a.localeCompare(b))){
 const license=(await readdir(folder)).find(file=>/^licen[cs]e(?:\..*)?$/i.test(file));
 let text;
 if(license)text=await readFile(`${folder}/${license}`,'utf8');
 else if(['remark-math','rehype-katex','mdast-util-math'].includes(name))text=await readFile('src/licenses/remark-math/LICENSE','utf8');
 else throw new Error(`Bundled Markdown dependency needs a license: ${name}`);
 sections.push(`=== ${name}@${pkg.version} (${pkg.license}) ===\n\n${text}`);
}
await mkdir('dist/math',{recursive:true});
await writeFile('dist/math/THIRD_PARTY_NOTICES.txt',sections.join('\n\n'));
await writeFile('dist/math/runtime-versions.json',JSON.stringify(Object.fromEntries([...packages].map(([name,{pkg}])=>[name,pkg.version])),null,2)+'\n');
console.log(`Markdown math bundle: ${packages.size} licensed packages; KaTeX 0.19.0.`);
