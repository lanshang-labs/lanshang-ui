import {createContext,useContext,useId,useMemo,useRef,type HTMLAttributes} from 'react';
import {ConfigProvider} from 'antd';
import ReactMarkdown,{type Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {remarkMath,rehypeKatex} from './markdown-math.js';
import type {ElementContent} from 'hast';
import {ImageCard} from './ImageCard.js';
import {SourceCodeBlock,type SourceCodeBlockProps} from './SourceCodeBlock.js';
import type {ControlSize} from './tokens.js';

export interface MarkdownImage {src:string;alt:string;title?:string}
export interface MarkdownProps extends Omit<HTMLAttributes<HTMLDivElement>,'children'|'dangerouslySetInnerHTML'> {
 /** Original Markdown text, never interpreted as executable HTML or JSX. */
 children:string;
 size?:ControlSize;
 /** Enable inline $…$ and block $$…$$ formulas. Default true. */
 math?:boolean;
 /** Preserve paragraph soft line breaks, for prompts and message-like documents. Default false. */
 breaks?:boolean;
 /** Render link labels without navigation for prompt-like content. Default navigate. */
 links?:'navigate'|'text';
 codePreviewLines?:number;
 /** Local accepts only relative/current-origin paths; none does not create image elements. */
 images?:'all'|'local'|'none';
 onImagePreview?:(image:MarkdownImage)=>void;
}
const LinkedImageContext=createContext(false);
const TaskLabelContext=createContext('任务项');
function textContent(node:ElementContent):string{return node.type==='text'?node.value:node.type==='element'?node.children.map(textContent).join(' '):'';}

const languages:Record<string,SourceCodeBlockProps['language']>={js:'javascript',javascript:'javascript',ts:'typescript',typescript:'typescript',jsx:'javascript',tsx:'tsx',json:'json',css:'css',sh:'bash',shell:'bash',bash:'bash',text:'text',txt:'text',plaintext:'text'};
function hasImage(node:ElementContent):boolean{return node.type==='element'&&(node.tagName==='img'||node.children.some(hasImage));}
function isLocalImage(src:string):boolean {
 // Browsers normalize backslashes and ASCII controls before resolving a URL.
 const normalized=src.replace(/[\u0000-\u0020\u007f]/g,'').split('\\').join('/');
 if(/^(?:[a-z][\w+.-]*:|\/\/)/i.test(normalized))return false;
 try{return new URL(normalized,'https://markdown.invalid/').origin==='https://markdown.invalid';}catch{return false;}
}


/** CommonMark + GFM with shared Lanshang code and image presentation. */
export function Markdown({children,size,math=true,breaks=false,links='navigate',codePreviewLines=12,images='all',onImagePreview,className='',...props}:MarkdownProps){
 const {componentSize}=ConfigProvider.useConfig();
 const root=useRef<HTMLDivElement>(null),id=useId();
 const prefix=`ls-md-${id.replace(/[^a-zA-Z0-9_-]/g,'')}-`;
 const components=useMemo<Components>(()=>({
  h2:({node:_,id:headingId,...rest})=><h2 {...rest} id={headingId==='footnote-label'?`${prefix}footnote-label`:headingId}/>,
  pre:({node,children:content})=>{
   const code=node?.children.find(child=>child.type==='element'&&child.tagName==='code');
   if(code?.type!=='element')return <pre>{content}</pre>;
   const name=String(code.properties.className??'').match(/language-([^\s,]+)/)?.[1]??'text';
   const text=code.children.map(child=>child.type==='text'?child.value:'').join('').replace(/\n$/,'');
   return <SourceCodeBlock code={text} filename={name} language={languages[name]??'text'} previewLines={codePreviewLines}/>;
  },
  // A figure cannot be nested in a paragraph; retain native paragraphs for text.
  p:({node,children:content,...rest})=>node?.children.some(hasImage)
   ?<div className="ls-markdown-paragraph">{content}</div>:<p {...rest}>{content}</p>,
  img:({src,alt='',title})=>{
   const linked=useContext(LinkedImageContext);
   if(images==='none'||images==='local'&&src&&!isLocalImage(src))return <span className="ls-markdown-missing-image" role="img" aria-label={`${alt||'图片'}，未加载`}>{alt||'图片'}（未加载）</span>;
   if(!src)return <span className="ls-markdown-missing-image">{alt||'未提供图片'}</span>;
   const image={src,alt,title};
   return <ImageCard {...image} onPreview={onImagePreview&&!linked?()=>onImagePreview(image):undefined}/>;
  },
  a:({node:_,href,children:content,...rest})=>{
   if(!href||links==='text')return <>{content}</>;
   const external=/^https?:\/\//i.test(href??'')||href?.startsWith('//');
   return <LinkedImageContext.Provider value={true}><a {...rest} aria-describedby={rest['aria-describedby']==='footnote-label'?`${prefix}footnote-label`:rest['aria-describedby']} href={href} target={external?'_blank':undefined} rel={external?'noopener noreferrer':undefined} onClick={event=>{
    if(!href?.startsWith('#')||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
    let target:string;try{target=decodeURIComponent(href.slice(1));}catch{return;}
    const anchor=Array.from(root.current?.querySelectorAll<HTMLElement>('[id]')??[]).find(element=>element.id===target);
    if(anchor){event.preventDefault();anchor.scrollIntoView?.({block:'nearest'});anchor.tabIndex=-1;anchor.focus({preventScroll:true});}
   }}>{content}</a></LinkedImageContext.Provider>;
  },
  ul:({node:_,className:listClass='',...rest})=><ul {...rest} className={`ls-markdown-list ${listClass}`}/>,
  ol:({node:_,className:listClass='',...rest})=><ol {...rest} className={`ls-markdown-list ${listClass}`}/>,
  li:({node,children:content,className:itemClass='',...rest})=><TaskLabelContext.Provider value={node?.children.map(textContent).join(' ').trim()||'任务项'}><li {...rest} className={`ls-markdown-list-item ${itemClass}`}>{content}</li></TaskLabelContext.Provider>,
  input:({node:_,...rest})=>{const label=useContext(TaskLabelContext);return <input {...rest} aria-label={label}/>;},
  table:({node:_,children:content,...rest})=><div className="ls-markdown-table-scroll" role="region" aria-label="Markdown 表格" tabIndex={0}><table {...rest}>{content}</table></div>,
 }),[codePreviewLines,onImagePreview,images,links,prefix]);
 return <div {...props} ref={root} className={`ls-markdown ${className}`} data-ls-size={size??componentSize??'middle'}>
  <ReactMarkdown remarkPlugins={[remarkGfm,...(math?[remarkMath]:[]),...(breaks?[remarkBreaks]:[])]} rehypePlugins={math?[[rehypeKatex,{trust:false,strict:'ignore',maxSize:10,maxExpand:1000}]]:[]} remarkRehypeOptions={{clobberPrefix:prefix,footnoteLabel:'注释',footnoteBackLabel:'返回引用'}} skipHtml components={components}>{children}</ReactMarkdown>
 </div>;
}
