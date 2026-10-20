import {useEffect,useRef,useState,type ReactNode,type MutableRefObject} from 'react';
import {createPortal} from 'react-dom';
import {MotionButton} from './MotionButton.js';
import {RowActionButton} from './RowActionButton.js';
export type NotificationItem={
 id:string; title:string; description?:ReactNode; type?:'info'|'success'|'warning'|'error';
 /** Milliseconds. Default 5000; 0 keeps the notification until explicitly closed. */
 duration?:number; action?:ReactNode;
};
export type NotificationViewportProps={items:NotificationItem[];onClose:(id:string)=>void;onCloseAll?:()=>void;label?:string;suspended?:boolean};
/** Upsert by ID without moving existing notices. Omitted fields are retained; use undefined to clear them. */
export function mergeNotification(items:NotificationItem[],item:NotificationItem):NotificationItem[]{
 return items.some(row=>row.id===item.id)?items.map(row=>row.id===item.id?{...row,...item}:row):[...items,item];
}
function Notice({item,onClose,returnTo,suspended}:{item:NotificationItem;onClose:(id:string)=>void;returnTo:MutableRefObject<HTMLElement|null>;suspended:boolean}){
 const {id,title,description,type='info',duration=5000,action}=item;
 const root=useRef<HTMLElement>(null);
 const closeRef=useRef(onClose);closeRef.current=onClose;
 const remaining=useRef(duration),[hover,setHover]=useState(false),[focused,setFocused]=useState(false);
 useEffect(()=>{if(suspended){setHover(false);setFocused(false)}},[suspended]);
 useEffect(()=>{remaining.current=duration},[duration]);
 useEffect(()=>{
  if(duration<=0||hover||focused||suspended)return;
  const started=Date.now();const timer=setTimeout(()=>closeRef.current(id),Math.max(0,remaining.current));
  return()=>{clearTimeout(timer);remaining.current=Math.max(0,remaining.current-(Date.now()-started))};
 },[duration,hover,focused,id,suspended]);
 function dismiss(){
  const restore=root.current?.contains(document.activeElement);
  const sibling=root.current?.nextElementSibling??(root.current?.previousElementSibling?.matches('.ls-notification')?root.current.previousElementSibling:null);
  const next=sibling?.querySelector<HTMLButtonElement>('.ls-notification-close');
  closeRef.current(id);
  if(restore){if(next)next.focus();else if(returnTo.current?.isConnected)returnTo.current.focus();}
 }
 return <section ref={root} className="ls-notification" data-tone={type} aria-label={title}
  onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
  onFocusCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){if(event.relatedTarget instanceof HTMLElement&&!event.relatedTarget.closest('.ls-notification-viewport'))returnTo.current=event.relatedTarget;setFocused(true)}}}
  onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setFocused(false)}}
  onKeyDown={event=>{if(event.key==='Escape'){event.stopPropagation();event.preventDefault();dismiss()}}}>
  <div role="status" aria-atomic="true"><header><span className="ls-notification-dot" aria-hidden="true"/><strong>{title}</strong></header>{description&&<div className="ls-notification-description">{description}</div>}</div>
  <MotionButton type="text" motionIcon="close" className="ls-notification-close" aria-label={`关闭通知：${title}`} onClick={dismiss}/>
  {action&&<div className="ls-notification-action">{action}</div>}
 </section>;
}
/** Controlled presentation only: callers own IDs, deduplication, task results and navigation. Mount once below LanshangProvider. */
export function NotificationViewport({items,onClose,onCloseAll,label='全局通知',suspended=false}:NotificationViewportProps){
 const returnTo=useRef<HTMLElement|null>(null),viewport=useRef<HTMLElement>(null);
 if(typeof document==='undefined'||!items.length)return null;
 return createPortal(<aside hidden={suspended} aria-hidden={suspended||undefined} ref={viewport} className="ls-notification-viewport" aria-label={label} onFocusCapture={event=>{if(event.relatedTarget instanceof HTMLElement&&!event.currentTarget.contains(event.relatedTarget))returnTo.current=event.relatedTarget}}>
  {onCloseAll&&<div className="ls-notification-toolbar"><span>{items.length} 条通知</span><RowActionButton motionIcon="close" onClick={()=>{const restore=viewport.current?.contains(document.activeElement);onCloseAll();if(restore&&returnTo.current?.isConnected)returnTo.current.focus()}}>关闭全部通知</RowActionButton></div>}{items.map(item=><Notice key={item.id} item={item} onClose={onClose} returnTo={returnTo} suspended={suspended}/>)}</aside>,document.body);
}
