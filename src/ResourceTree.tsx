import {forwardRef,useRef,useState,useEffect,useImperativeHandle,type ComponentRef,type ReactNode} from 'react';
import {Tree, type TreeProps} from 'antd';
import {HintTooltip} from './ComplexControls.js';
export type ResourceIconKind='database'|'folder'|'table';
/** Optical size 14px inside a fixed 18px slot; decorative next to node text. */
export function ResourceIcon({kind}:{kind:ResourceIconKind}){
 return <span className="bui-resource-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
 {kind==='database'? <><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/></>:kind==='folder'?<path d="M2 5V3.5h4l1.5 2H14v7H2V5Z"/>:<><rect x="2.5" y="2.5" width="11" height="11" rx="2"/><path d="M2.5 6.5h11M6.5 6.5v7"/></>}
 </svg></span>;
}
export function ResourceChevron({expanded=false}:{expanded?:boolean}){
 return <span className="bui-resource-chevron" data-expanded={expanded} aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="m4.5 2.5 3.5 3.5-3.5 3.5"/></svg></span>;
}
export function ResourceName({text,children,keyboardOpen=false}:{text:string;children?:ReactNode;keyboardOpen?:boolean}){
 const label=useRef<HTMLSpanElement>(null),[buttonFocused,setButtonFocused]=useState(false);
 useEffect(()=>{const button=label.current?.closest('button');if(!button)return;
 const focus=()=>setButtonFocused(true),blur=()=>setButtonFocused(false),key=(e:KeyboardEvent)=>{if(e.key==='Escape')setButtonFocused(false);};
 button.addEventListener('focus',focus);button.addEventListener('blur',blur);button.addEventListener('keydown',key);
 return()=>{button.removeEventListener('focus',focus);button.removeEventListener('blur',blur);button.removeEventListener('keydown',key);};},[]);
 return <HintTooltip title={text} trigger={['hover','focus']} open={keyboardOpen||buttonFocused?true:undefined} mouseEnterDelay={0.3}>
 <span ref={label} className="bui-resource-name" aria-label={text}>{children??text}</span>
 </HintTooltip>;
}
export type ResourceTreeRef=ComponentRef<typeof Tree>;
export type ResourceTreeProps=TreeProps & {getNodeLabel?:(node:NonNullable<TreeProps['treeData']>[number])=>string};
export const ResourceTree=forwardRef<ResourceTreeRef,ResourceTreeProps>(function ResourceTree({className='',getNodeLabel,titleRender,onActiveChange,onFocus,onBlur,onKeyDown,...props},ref){
 const tree=useRef<ResourceTreeRef>(null);
 const [active,setActive]=useState<React.Key|null>(null),[focused,setFocused]=useState(false);
 useImperativeHandle(ref,()=>tree.current!);
 useEffect(()=>{const key=props.selectedKeys?.[0];if(key===undefined)return;
 const frame=requestAnimationFrame(()=>tree.current?.scrollTo({key}));
 return()=>cancelAnimationFrame(frame);
 },[props.selectedKeys?.[0], props.treeData]);
 return <Tree {...props} ref={tree} showIcon blockNode className={`bui-resource-tree ${className}`} switcherIcon={<ResourceChevron/>}
 onActiveChange={key=>{setActive(key);onActiveChange?.(key);}}
 onFocus={e=>{setFocused(true);onFocus?.(e);}}
 onBlur={e=>{setFocused(false);onBlur?.(e);}}
 onKeyDown={e=>{if(e.key==='Escape')setFocused(false);else if(e.key.startsWith('Arrow'))setFocused(true);onKeyDown?.(e);}}
 titleRender={node=>{
 const title=titleRender?titleRender(node):typeof node.title==='function'?node.title(node):node.title;
 const fullName=getNodeLabel?getNodeLabel(node):typeof node.title==='string'?node.title:typeof node.title==='number'?String(node.title):undefined;
 return fullName?<ResourceName text={fullName} keyboardOpen={focused&&active===node.key}>{title}</ResourceName>:title;
 }}/>;
});
