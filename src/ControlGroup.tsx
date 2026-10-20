import {useLayoutEffect,useRef,useState,type HTMLAttributes,type ReactNode} from 'react';
import {ConfigProvider} from 'antd';
import type {ControlSize} from './tokens.js';
export type ButtonGroupProps=HTMLAttributes<HTMLDivElement>&{size?:ControlSize};
/** Groups related actions without changing each button's keyboard or disabled behavior. */
export function ButtonGroup({className='',children,size,...props}:ButtonGroupProps){
 const root=useRef<HTMLDivElement>(null);
 const [indicator,setIndicator]=useState<{x:number;width:number}|null>(null);
 const {componentSize}=ConfigProvider.useConfig();
 const resolvedSize=size??componentSize??'middle';
 useLayoutEffect(()=>{
  const node=root.current;if(!node)return;
  const measure=()=>{
   const selected=Array.from(node.children).filter((child):child is HTMLButtonElement=>child instanceof HTMLButtonElement&&child.getAttribute('aria-pressed')==='true');
   const next=selected.length===1?{x:selected[0].offsetLeft,width:selected[0].offsetWidth}:null;
   setIndicator(previous=>previous?.x===next?.x&&previous?.width===next?.width?previous:next);
  };
  measure();
  const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
  resize?.observe(node);Array.from(node.children).forEach(child=>resize?.observe(child));
  const mutation=new MutationObserver(measure);
  mutation.observe(node,{subtree:true,attributes:true,attributeFilter:['aria-pressed'],childList:true});
  return ()=>{resize?.disconnect();mutation.disconnect();};
 },[children]);
 return <ConfigProvider componentSize={resolvedSize}><div ref={root} role="group" {...props} data-ls-size={resolvedSize} className={`ls-button-group ${indicator?'ls-button-group--sliding':''} ${className}`}>
  {indicator&&<span aria-hidden="true" className="ls-button-group-indicator" style={{width:indicator.width,transform:`translateX(${indicator.x}px)`}}/>}
  {children}
 </div></ConfigProvider>;
}
export interface InputGroupProps extends HTMLAttributes<HTMLDivElement>{
 control:ReactNode;
 actions:ReactNode;
 size?:ControlSize;
}
/** One input/select and its adjacent actions share a surface and a divider. */
export function InputGroup({control,actions,size,className='',...props}:InputGroupProps){
 const {componentSize}=ConfigProvider.useConfig();
 const resolvedSize=size??componentSize??'middle';
 return <ConfigProvider componentSize={resolvedSize}><div role="group" {...props} data-ls-size={resolvedSize} className={`ls-input-group ${className}`}>
  <div className="ls-input-group-control">{control}</div>
  <div className="ls-input-group-actions">{actions}</div>
 </div></ConfigProvider>;
}
