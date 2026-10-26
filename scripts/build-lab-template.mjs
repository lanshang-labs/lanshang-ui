import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const result=spawnSync(process.execPath,['node_modules/@tailwindcss/cli/dist/index.mjs','--input','experiments/shadcn-dashboard/template.css','--output','experiments/shadcn-dashboard/template.generated.css','--minify'],{cwd:root,stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;
if(result.status===0){
 const entries=['tailwindcss','tw-animate-css','lucide-react','recharts','class-variance-authority','clsx','tailwind-merge','react-router-dom','@radix-ui/react-avatar','@radix-ui/react-dialog','@radix-ui/react-dropdown-menu','@radix-ui/react-progress','@radix-ui/react-select','@radix-ui/react-separator','@radix-ui/react-slot','@radix-ui/react-tabs','@radix-ui/react-tooltip','@radix-ui/react-collapsible'];
 const seen=new Set(),sections=[];
 function locate(name,from){for(let path=from;;path=dirname(path)){const candidate=join(path,'node_modules',name);if(existsSync(join(candidate,'package.json')))return candidate;if(path===root||dirname(path)===path)break;}throw new Error(`Cannot resolve lab dependency ${name}`);}
 function visit(name,from=root){const path=locate(name,from);if(seen.has(path))return;seen.add(path);const meta=JSON.parse(readFileSync(join(path,'package.json'),'utf8'));
  const files=readdirSync(path).filter(file=>/^licen[cs]e(?:\..*)?$/i.test(file));
  if(meta.name==='victory-vendor')files.push(...readdirSync(join(path,'lib-vendor'),{recursive:true}).filter(file=>/(?:^|\/)LICENSE$/i.test(String(file))).map(file=>join('lib-vendor',String(file))));
  const fallback=meta.name.startsWith('@radix-ui/')?'Radix':meta.name==='react-remove-scroll-bar'?'react-remove-scroll-bar':null;
  const notice=files.map(file=>readFileSync(join(path,file),'utf8')).join('\n')||(fallback?readFileSync(join(root,`experiments/shadcn-dashboard/licenses/${fallback}-LICENSE.txt`),'utf8'):'');
  if(!notice)throw new Error(`Missing license text for ${meta.name}@${meta.version}`);
  sections.push(`=== ${meta.name}@${meta.version} (${meta.license??'see license'}) ===\n\n${notice}`);
  for(const dependency of Object.keys(meta.dependencies??{}))visit(dependency,path);
 }
 for(const entry of entries)visit(entry);
 writeFileSync(join(root,'experiments/shadcn-dashboard/DEPENDENCY_NOTICES.txt'),sections.sort().join('\n\n'));
}
