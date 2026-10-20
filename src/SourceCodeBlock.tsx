import {useEffect,useLayoutEffect,useId,useMemo,useRef,useState,type ReactNode} from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-bash.js';
import {RowActionButton} from './RowActionButton.js';
import {MenuDropdown} from './ComplexControls.js';
export type SourceCodeBlockProps={code:string;filename?:string;language?:'tsx'|'typescript'|'javascript'|'json'|'css'|'bash'|'text';previewLines?:number;toolbar?:ReactNode;description?:ReactNode;copyOptions?:{label:string;text:string}[]};
function linesFor(code:string,language:string):ReactNode[][]{
 const lines:ReactNode[][]=[[]];
 function visit(value:string|Prism.Token|(string|Prism.Token)[],classes:string[]=[]){
  if(Array.isArray(value)){value.forEach(item=>visit(item,classes));return;}
  if(typeof value!=='string'){visit(value.content,[...classes,value.type]);return;}
  value.split('\n').forEach((part,index)=>{if(index)lines.push([]);lines[lines.length-1].push(<span key={lines[lines.length-1].length} className={classes.map(name=>`token ${name}`).join(' ')}>{part}</span>)});
 }
 visit(language==='text'||code.length>100_000?code:Prism.tokenize(code,Prism.languages[language]||Prism.languages.plain));return lines;
}
/** Code is rendered as React text, never executed or inserted as raw HTML. */
export function SourceCodeBlock({code,filename='example.tsx',language='tsx',previewLines=12,toolbar,description,copyOptions=[]}:SourceCodeBlockProps){
 const [copyOpen,setCopyOpen]=useState(false);
 const [expanded,setExpanded]=useState(false),[wrap,setWrap]=useState(false),[message,setMessage]=useState('');
 const revision=useRef(0),pending=useRef(false),viewport=useRef<HTMLPreElement>(null),id=useId();
 useLayoutEffect(()=>{if(viewport.current){viewport.current.scrollTop=0;viewport.current.scrollLeft=0}},[code,expanded,wrap]);
 useEffect(()=>{revision.current++;pending.current=false;setMessage('');setExpanded(false);return()=>{revision.current++}},[code]);
 const lines=useMemo(()=>linesFor(code,language),[code,language]);
 const limit=Math.max(1,Math.floor(previewLines)||12),collapsible=lines.length>limit;
 async function copy(text=code){
  if(pending.current)return;pending.current=true;const version=revision.current;
  try{await navigator.clipboard.writeText(text);if(version===revision.current)setMessage('已复制完整代码')}
  catch{if(version===revision.current)setMessage('复制失败，请展开后手动选择代码')}
  finally{if(version===revision.current)pending.current=false}
 }
 return <section className="ls-code-block" aria-label={filename}>
  <header><span className="ls-code-filename" title={filename}>{filename}</span>{toolbar&&<div className="ls-code-toolbar">{toolbar}</div>}<span className="ls-code-language">{language}</span><RowActionButton size="middle" className="ls-code-icon-action" motionIcon="wrap" iconActive={wrap} aria-label="换行" title={wrap?'关闭自动换行':'开启自动换行'} aria-pressed={wrap} onClick={()=>setWrap(!wrap)}/><span className="ls-code-copy-actions"><RowActionButton size="middle" className="ls-code-icon-action" motionIcon="copy" aria-label="复制" title="复制完整代码" onClick={()=>void copy()}/>{copyOptions.length>0&&<MenuDropdown open={copyOpen} onOpenChange={setCopyOpen} trigger={['click']} menu={{items:copyOptions.map((option,index)=>({key:String(index),label:option.label})),onClick:({key})=>{setCopyOpen(false);void copy(copyOptions[Number(key)].text)}}}><RowActionButton size="middle" className="ls-code-icon-action" motionIcon="expand" iconActive={copyOpen} aria-label="复制选项" title="更多复制选项" aria-haspopup="menu" aria-expanded={copyOpen}/></MenuDropdown>}</span></header>
  {description&&<div className="ls-code-description">{description}</div>}
  <pre ref={viewport} id={id} tabIndex={0} aria-label={`${filename}代码`} className={wrap?'is-wrapped':''}><code>{(expanded?lines:lines.slice(0,limit)).map((line,index)=><span className="ls-code-line" key={index}><span className="ls-code-number" aria-hidden="true">{index+1}</span><span className="ls-code-text">{line.length?line:'\u00a0'}</span></span>)}</code></pre>
  <footer className={!collapsible&&!message?'is-empty':undefined}>{collapsible&&<RowActionButton size="middle" aria-expanded={expanded} aria-controls={id} onClick={()=>setExpanded(!expanded)}>{expanded?'收起代码':`展开全部 ${lines.length} 行`}</RowActionButton>}<span role="status">{message}</span></footer>
 </section>;
}
