import {readdirSync,readFileSync} from 'node:fs';
import {join} from 'node:path';
import ts from 'typescript';
import {expect,it} from 'vitest';
import {pages} from '../website/catalog';
function sources(root:string):string[]{return readdirSync(root,{withFileTypes:true}).flatMap(entry=>entry.name==='registry-consumer'?[]:entry.isDirectory()?sources(join(root,entry.name)):/\.tsx?$/.test(entry.name)?[join(root,entry.name)]:[])}
it('routes website and live example controls through the package',()=>{
 const violations:string[]=[];
 for(const path of [...sources('website'),...sources('examples')]){
  const source=ts.createSourceFile(path,readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true);
  for(const statement of source.statements)if(ts.isImportDeclaration(statement)&&ts.isStringLiteral(statement.moduleSpecifier)){
   const dependency=statement.moduleSpecifier.text;
   if(path.startsWith('website/')&&dependency.startsWith('../src/'))violations.push(`${path}: source import`);
   if(dependency.startsWith('../dist/')&&!['../dist/index.js','../dist/icons.js','../dist/styles.css'].includes(dependency))violations.push(`${path}: package deep import`);
   if(dependency==='antd'||dependency.startsWith('antd/'))violations.push(`${path}: upstream control import`);
   if(dependency==='iconoir-react')violations.push(`${path}: upstream icon import`);
  }
  const inspect=(node:ts.Node):void=>{
   if(ts.isJsxOpeningElement(node)||ts.isJsxSelfClosingElement(node)){
    const tag=node.tagName.getText(source);
    if(['button','input','select','textarea','details','table'].includes(tag)){
     violations.push(`${path}: native ${tag} control`);
    }
   }
   ts.forEachChild(node,inspect);
  };
  inspect(source);
 }
 expect(violations).toEqual([]);
});

it('keeps the Studio consumer on the package boundary',()=>{
 for(const path of ['website/style-study.tsx','website/style-study-entry.tsx']){
  const source=readFileSync(path,'utf8');
  expect(source).not.toMatch(/from ['"]\.\.\/src\//);
  expect(source).not.toMatch(/from ['"]antd['"]/);
  expect(source).not.toMatch(/from ['"]iconoir-react['"]/);
  expect(source).not.toMatch(/<(?:select|button|input|textarea|table|details)\b/);
 }
 expect(readFileSync('website/style-study-entry.tsx','utf8')).toContain("../dist/styles.css");
});

it('shows the package icon entrypoint in the workspace example',()=>{
 const code=pages.find(page=>page.id==='components/workspace-layout')?.code;
 expect(code).toContain("from '@lanshang-labs/ui/icons'");
 expect(code).not.toContain('../dist/icons.js');
});

it('shows public package imports in copyable examples',()=>{
 const localImports=pages.flatMap(page=>[
  ...[page.code,...(page.assets?.map(asset=>asset.code)||[])].filter((source):source is string=>!!source)
   .filter(source=>/from\s*['"]\.\.\/(?:dist|src)\//.test(source))
   .map(()=>page.id),
 ]);
 expect(localImports).toEqual([]);
});

it('keeps displayed TSX examples parseable',()=>{
 const invalid=pages.flatMap(page=>{
  const code=page.code?.trim();
  if(!code||(!code.startsWith('<')&&!code.startsWith('import ')&&!code.startsWith('const ')&&!code.startsWith('function ')))return [];
  const source=ts.createSourceFile(`${page.id}.tsx`,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  // Usage pages may show several independent JSX examples, separated by newlines.
  return source.parseDiagnostics.filter(diagnostic=>diagnostic.code!==2657).map(diagnostic=>`${page.id}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText,' ')}`);
 });
 expect(invalid).toEqual([]);
});

it('includes local helpers used by composed examples',()=>{
 const assets=(id:string)=>pages.find(page=>page.id===id)?.assets?.map(asset=>asset.filename);
 expect(assets('patterns/save-feedback')).toEqual(expect.arrayContaining(['blocks.tsx','mock-project-source.ts']));
 expect(assets('patterns/overlay-recovery')).toEqual(expect.arrayContaining(['overlay-popup-container.ts']));
});

it('uses shared field primitives in the two visual reference pages',()=>{
 for(const path of ['website/control-group-preview.tsx','website/motion-preview.tsx']){
  const source=readFileSync(path,'utf8');
  expect(source).not.toMatch(/from ['"]antd['"]/);
  expect(source).toContain('TextInput');
 }
 expect(readFileSync('website/motion-preview.tsx','utf8')).toContain('ToggleSwitch');
 const controlSource=readFileSync('website/control-previews.tsx','utf8');
 expect(controlSource).not.toMatch(/<(?:Button|Input(?:\.TextArea)?|Switch)\b/);
 for(const name of ['TextInput','TextArea','ToggleSwitch','MotionButton'])expect(controlSource).toContain(`<${name}`);
 const formSource=readFileSync('website/form-foundations-preview.tsx','utf8');
 expect(formSource).toContain("import {RadioGroup,RadioOption as Radio} from '../dist/index.js'");
 expect(formSource).toContain("import {Form} from '../dist/index.js'");
 for(const name of ['Checkbox','TextInput','TextArea','ToggleSwitch','MotionButton'])expect(formSource).toContain(`<${name}`);
 for(const path of ['website/number-slider-preview.tsx','website/date-preview.tsx','website/size-preview.tsx']){
  expect(readFileSync(path,'utf8')).not.toMatch(/from ['"]antd['"]/);
 }
});
