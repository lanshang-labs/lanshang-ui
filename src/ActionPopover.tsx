import {MotionButton} from "./MotionButton.js";
import type {MotionIconName} from './MotionIcon.js';
import {useRef,useEffect,useState,type ReactNode} from 'react';
import {Popover} from 'antd';
function hasVisibleModal(){return Array.from(document.querySelectorAll('.ant-modal-wrap,.ant-drawer-content-wrapper')).some(el=>{const style=getComputedStyle(el);return style.display!=='none'&&style.visibility!=='hidden'&&el.getClientRects().length>0})}
/** Non-modal anchored controls. Values and applying changes remain owned by the caller. */
export function ActionPopover({label,open,onOpenChange,children,width=360,triggerIcon,motionIcon}:{label:string;open:boolean;onOpenChange:(open:boolean)=>void;children:ReactNode;width?:number;triggerIcon?:ReactNode;motionIcon?:MotionIconName}){
 const trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
 const [nestedVisible,setNestedVisible]=useState(false);
 const lastAction=useRef<HTMLElement|null>(null);
 useEffect(()=>{if(!open)return;let nested=false;const observer=new MutationObserver(()=>{const visible=hasVisibleModal();setNestedVisible(visible);if(nested&&!visible){const active=document.activeElement,action=lastAction.current?.isConnected?lastAction.current:trigger.current;if(action?.isConnected&&action.getClientRects().length&&(active===document.body||active===panel.current||active?.closest('.ant-modal-wrap,.ant-drawer-content-wrapper')))requestAnimationFrame(()=>requestAnimationFrame(()=>{const current=document.activeElement;if(action.isConnected&&(current===document.body||current===panel.current||current?.closest('.ant-modal-wrap,.ant-drawer-content-wrapper')))action.focus()}));}nested=visible;});observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});return()=>observer.disconnect()},[open]);
 const close=()=>{onOpenChange(false);trigger.current?.focus()};
 return <Popover overlayClassName={`ls-action-popover-overlay${nestedVisible?" ls-action-popover-suspended":""}`} trigger="click" placement="bottomRight" arrow={false} open={open} onOpenChange={next=>{if(!next&&hasVisibleModal())return;onOpenChange(next)}}
 afterOpenChange={visible=>{if(visible&&(document.activeElement===trigger.current||document.activeElement===document.body))panel.current?.focus()}}
 content={<div ref={panel} role="dialog" aria-label={label} tabIndex={-1} className="ls-action-popover" style={{width}} onKeyDown={event=>{if(event.key==='Escape'&&!event.defaultPrevented&&panel.current?.contains(event.target as Node)&&!hasVisibleModal()){event.stopPropagation();close()}}}>
 <div className="ls-action-popover-heading"><strong>{label}</strong><MotionButton motionIcon="close" type="text" aria-label={`关闭${label}`} onClick={close}>关闭</MotionButton></div>
 <div className="ls-action-popover-body" onClickCapture={e=>{const target=(e.target as HTMLElement).closest<HTMLElement>('button');if(target&&panel.current?.contains(target))lastAction.current=target}}>{children}</div>
 <div className="ls-action-popover-footer"><MotionButton onClick={close}>完成</MotionButton></div>
 </div>}><MotionButton ref={trigger} motionIcon={motionIcon} icon={triggerIcon} aria-label={label} title={label} aria-haspopup="dialog" aria-expanded={open}>{triggerIcon||motionIcon?null:label}</MotionButton></Popover>;
}
