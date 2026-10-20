import {Children,isValidElement,useState,useRef,useLayoutEffect,type ReactNode} from 'react';
import {ConfigProvider} from 'antd';
import {Pin,NavArrowUp,NavArrowDown} from 'iconoir-react';
import {ActionPopover} from './ActionPopover.js';
import {MotionButton} from './MotionButton.js';
import {RowActionButton} from './RowActionButton.js';
import {controlSizes} from './tokens.js';
export type ToolbarItemProps={id:string;label:string;group?:'filter'|'action';defaultPinned?:boolean;active?:boolean;children:ReactNode};
/** Declarative slot; keep input state controlled by the consumer when moving slots. */
export function ToolbarItem({children}:ToolbarItemProps){return <>{children}</>}
type Preference={id:string;pinned:boolean};
function defaults(items:ToolbarItemProps[]):Preference[]{return items.map(i=>({id:i.id,pinned:i.defaultPinned!==false}))}
function restore(items:ToolbarItemProps[],key:string):Preference[]{
 try{const data=JSON.parse(localStorage.getItem(key)||'null');if(data?.version!==1||!Array.isArray(data.items))return defaults(items);
 const known=new Set(items.map(i=>i.id)),seen=new Set<string>();const valid:Preference[]=[];
 for(const p of data.items){if(p&&known.has(p.id)&&!seen.has(p.id)&&typeof p.pinned==='boolean'){seen.add(p.id);valid.push({id:p.id,pinned:p.pinned})}}
 return [...valid,...defaults(items).filter(p=>!seen.has(p.id))];
 }catch{return defaults(items)}
}
export function CustomizableToolbar(props:{storageKey:string;children:ReactNode;settings?:ReactNode}){return <ToolbarState key={props.storageKey} {...props}/>}
function ToolbarState({storageKey,children,settings}:{storageKey:string;children:ReactNode;settings?:ReactNode}){
 const root=useRef<HTMLDivElement>(null),lastFocus=useRef<HTMLElement|null>(null);
 const {componentSize}=ConfigProvider.useConfig();
 const iconSize=controlSizes[componentSize??'middle'].icon;
 useLayoutEffect(()=>{if(lastFocus.current&&!lastFocus.current.isConnected&&document.activeElement===document.body){root.current?.querySelector<HTMLButtonElement>('.ls-toolbar-settings-trigger button[aria-haspopup]')?.focus();lastFocus.current=null}});
 const items=Children.toArray(children).filter(isValidElement<ToolbarItemProps>).map(child=>child.props);
 const [preferences,setPreferences]=useState(()=>restore(items,storageKey));const [open,setOpen]=useState(false),[warning,setWarning]=useState('');
 const known=new Map(items.map(i=>[i.id,i]));const order=[...preferences.filter(p=>known.has(p.id)),...defaults(items).filter(p=>!preferences.some(v=>v.id===p.id))];
 const update=(next:Preference[])=>{setPreferences(next);try{localStorage.setItem(storageKey,JSON.stringify({version:1,items:next}));setWarning('')}catch{setWarning('浏览器无法保存布局，本次调整仍有效。')}};
 const hiddenActive=order.filter(p=>!p.pinned&&(known.get(p.id)?.group??'filter')==='filter'&&known.get(p.id)?.active).map(p=>known.get(p.id)!);
 const groupOf=(id:string)=>known.get(id)?.group??'filter';
 const peers=(id:string)=>order.filter(p=>groupOf(p.id)===groupOf(id));
 const move=(id:string,offset:number)=>{const list=peers(id),other=list[list.findIndex(p=>p.id===id)+offset];if(!other)return;const next=[...order],index=next.findIndex(p=>p.id===id),target=next.findIndex(p=>p.id===other.id);[next[index],next[target]]=[next[target],next[index]];update(next)};
 return <div ref={root} className="ls-custom-toolbar" onFocusCapture={e=>{lastFocus.current=e.target as HTMLElement}}><div className="ls-custom-toolbar-items">{(['filter','action'] as const).map(group=>{const pinned=order.filter(p=>p.pinned&&groupOf(p.id)===group);return pinned.length>0?<div key={group} className={group==='filter'?'ls-toolbar-fields':'ls-toolbar-actions'}>{pinned.map(p=><div className="ls-toolbar-slot" data-toolbar-id={p.id} key={p.id}>{known.get(p.id)!.children}</div>)}</div>:null})}</div>
 <div className="ls-toolbar-settings-trigger">{hiddenActive.length>0&&<RowActionButton className="ls-toolbar-active-summary" onClick={()=>setOpen(true)} aria-label={`隐藏筛选仍生效：${hiddenActive.map(i=>i.label).join("、")}`}>{hiddenActive.length} 项筛选生效</RowActionButton>}<ActionPopover label={`工具栏设置${hiddenActive.length?' · 有筛选生效':''}`} motionIcon="settings" open={open} onOpenChange={setOpen} width={360}>
 <p className="ls-toolbar-hint">图钉决定是否固定在页面；上下移动调整顺序。仅记忆布局，不保存输入。</p>
 {(['filter','action'] as const).map(group=><section key={group} className="ls-toolbar-settings-group"><strong>{group==='filter'?'筛选选项':'操作按钮'}</strong>{order.map(p=>{const item=known.get(p.id)!;return (item.group??'filter')===group?<div className="ls-toolbar-setting-row" key={p.id}><span>{item.label}{item.active&&<small> · 已启用</small>}</span><RowActionButton aria-label={`固定${item.label}`} aria-pressed={p.pinned} onClick={()=>update(order.map(v=>v.id===p.id?{...v,pinned:!v.pinned}:v))} icon={<Pin width={iconSize} height={iconSize} strokeWidth={2.4} aria-hidden="true"/>}/><RowActionButton aria-label={`上移${item.label}`} disabled={peers(p.id)[0]?.id===p.id} onClick={()=>move(p.id,-1)} icon={<NavArrowUp width={iconSize} height={iconSize} strokeWidth={2.4} aria-hidden="true"/>}/><RowActionButton aria-label={`下移${item.label}`} disabled={peers(p.id)[peers(p.id).length-1]?.id===p.id} onClick={()=>move(p.id,1)} icon={<NavArrowDown width={iconSize} height={iconSize} strokeWidth={2.4} aria-hidden="true"/>}/></div>:null})}</section>)}
 {order.some(p=>!p.pinned)&&<section className="ls-toolbar-settings-group"><strong>未固定选项</strong>{order.filter(p=>!p.pinned).map(p=><div key={p.id} className="ls-toolbar-unpinned"><label>{known.get(p.id)!.label}</label>{known.get(p.id)!.children}</div>)}</section>}
 {settings&&<section className="ls-toolbar-settings-group"><strong>显示偏好</strong>{settings}</section>}
 {warning&&<p role="status">{warning}</p>}
 <MotionButton onClick={()=>update(defaults(items))}>重置布局</MotionButton>
 </ActionPopover></div></div>;
}
