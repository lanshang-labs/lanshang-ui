import {restoreHistory} from './release-history.mjs';
import {readFileSync, writeFileSync, mkdirSync, renameSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
const base=new URL(process.env.LANSHANG_REGISTRY_BASE || 'http://127.0.0.1:5177/');
if(!['http:','https:'].includes(base.protocol)||base.search||base.hash||base.username||base.password) throw new Error('Registry base must be an HTTP(S) directory URL without credentials/query/hash');
if(!base.pathname.endsWith('/'))base.pathname+='/';
const output=process.env.LANSHANG_REGISTRY_OUT || 'public';
const pkg=JSON.parse(readFileSync('package.json','utf8'));
if(readdirSync('releases').includes(pkg.version))throw new Error('Published version is immutable; bump package version before building');
const history=restoreHistory(output);
for(const dir of [`${output}/r`,`${output}/packages`,'.registry-build'])mkdirSync(dir,{recursive:true});
const packed=JSON.parse(execFileSync('npm',['pack','--ignore-scripts','--json','--pack-destination',`${output}/packages`],{encoding:'utf8'}))[0];
const packedPath=resolve(`${output}/packages`,packed.filename);
const hash=createHash('sha256').update(readFileSync(packedPath)).digest('hex');
const filename=`lanshang-labs-ui-${pkg.version}-${hash.slice(0,12)}.tgz`;
renameSync(packedPath,resolve(`${output}/packages`,filename));
const url=path=>new URL(path,base).href;
const file=(path,target)=>({path,type:'registry:file',target});
const source=readFileSync('website/blocks.tsx','utf8').replaceAll("'../dist/index.js'","'@lanshang-labs/ui'").replaceAll("'../dist/icons.js'","'@lanshang-labs/ui/icons'");
if(source.includes("'../dist/"))throw new Error('Registry blocks retain a repository-local dist import');
writeFileSync('.registry-build/lanshang-blocks.tsx',source);
const items=[
 {name:'lanshang-provider',type:'registry:block',title:'Lanshang Provider',description:'Application theme provider and package stylesheet.',dependencies:[`@lanshang-labs/ui@${url(`packages/${filename}`)}`,'antd@5.22.5'],files:[file('registry/provider.tsx','src/components/lanshang/provider.tsx')]},
 {name:'lanshang-blocks',type:'registry:block',title:'Lanshang Blocks',description:'Project list, edit form, details and sidebar source examples.',registryDependencies:[url('r/lanshang-provider.json')],files:[file('.registry-build/lanshang-blocks.tsx','src/components/lanshang/blocks.tsx')]}
];
writeFileSync('.registry-build/registry.json',JSON.stringify({$schema:'https://ui.shadcn.com/schema/registry.json',name:'lanshang-ui',homepage:'https://lanshang-labs.github.io/lanshang-ui/',items},null,2));
execFileSync(resolve('node_modules/.bin/shadcn'),['build','.registry-build/registry.json','--output',`${output}/r`],{stdio:'inherit'});
writeFileSync(`${output}/r/build-info.json`,JSON.stringify({version:pkg.version,cli:pkg.devDependencies.shadcn,package:url(`packages/${filename}`),sha256:hash},null,2));
// Only copy the current entry files; never nest history snapshots.
for(const name of ['registry.json','lanshang-provider.json','lanshang-blocks.json','build-info.json']){
 mkdirSync(`${output}/r/v${pkg.version}`,{recursive:true});
 let data=readFileSync(`${output}/r/${name}`,'utf8').replaceAll(url('r/lanshang-provider.json'),url(`r/v${pkg.version}/lanshang-provider.json`));
 writeFileSync(`${output}/r/v${pkg.version}/${name}`,data);
}
writeFileSync(`${output}/r/versions.json`,JSON.stringify({current:pkg.version,versions:[...history,pkg.version]},null,2));
console.log(`Registry ready: ${url('r/registry.json')}`);
