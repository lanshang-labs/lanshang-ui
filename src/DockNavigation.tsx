// Adapted from Motion Primitives Dock, MIT, copyright (c) 2024 ibelick.
// Full upstream license: licenses/motion-primitives/LICENSE. Snapshot: experiments/dock/upstream.
import {forwardRef,useRef,useState,useEffect,type ReactNode,type HTMLAttributes,type MouseEvent,type AnchorHTMLAttributes} from 'react';
import {motion,useMotionValue,useTransform,useSpring,type MotionValue} from 'motion/react';

export interface DockItem {
 id:string;
 label:string;
 icon:ReactNode;
 disabled?:boolean;
 /** Native navigation. Omit for an application action or router callback. */
 href?:string;
 target?:AnchorHTMLAttributes<HTMLAnchorElement>['target'];
 rel?:string;
 /** A one-shot action (such as opening settings), not a selectable view. */
 action?:boolean;
}
export interface DockProps extends Omit<HTMLAttributes<HTMLDivElement>,'children'|'onSelect'> {
 items:readonly DockItem[];
 /** The application owns route/selection state. Clicking never adopts a value implicitly. */
 activeId?:string;
 onSelect?:(id:string,item:DockItem,event:MouseEvent<HTMLElement>)=>void;
 label?:string;
 /** A smaller workbench tray; default keeps the original dock scale. */
 size?:"small"|"middle";
 disabled?:boolean;
 /** Distance magnification in sufficiently wide containers. Default true. */
 magnify?:boolean;
 /** Explicitly reduce motion; the system preference always takes precedence. */
 reducedMotion?:boolean;
}
type DockElement=HTMLButtonElement|HTMLAnchorElement;
/** Optional Motion entry. No Provider, global theme mutation, routing or implicit stylesheet import. */
export const Dock=forwardRef<HTMLDivElement,DockProps>(function Dock({items,activeId,onSelect,label='快捷入口',size='middle',disabled=false,magnify=true,reducedMotion=false,className='',onKeyDown,onFocusCapture,...props},forwardedRef){
 const ids=new Set<string>();for(const item of items){if(!item.id||ids.has(item.id))throw new Error('Dock item ids must be non-empty and unique');ids.add(item.id);}
 const host=useRef<HTMLDivElement|null>(null),buttons=useRef(new Map<string,DockElement>());
 const [compact,setCompact]=useState(true),[overflowing,setOverflowing]=useState(false);
 const [systemReduced,setSystemReduced]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const reduced=systemReduced||reducedMotion;
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setSystemReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const mouseX=useMotionValue(Infinity);
 useEffect(()=>{
  const element=host.current;if(!element)return;
  const measureOverflow=()=>setOverflowing(element.scrollWidth>element.clientWidth+1);
  const measure=()=>{setCompact(element.clientWidth<480);measureOverflow();mouseX.set(Infinity)};
  measure();if(typeof ResizeObserver==='undefined')return;
  const observer=new ResizeObserver(entries=>{
   if(entries.some(entry=>entry.target===element))measure();
   // Magnification changes the panel on every frame; it must not reset the pointer.
   else if(element.clientWidth<480)measureOverflow();
  });
  observer.observe(element);if(element.firstElementChild)observer.observe(element.firstElementChild);
  return()=>observer.disconnect();
 },[mouseX,items.length,size,compact]);
 useEffect(()=>{mouseX.set(Infinity)},[magnify,reduced,disabled,mouseX]);
 const reveal=(button:HTMLElement)=>{
  const element=host.current;if(!overflowing||!element)return;
  const viewport=element.getBoundingClientRect(),target=button.getBoundingClientRect();
  if(target.left<viewport.left+8)element.scrollLeft-=viewport.left+8-target.left;
  else if(target.right>viewport.right-8)element.scrollLeft+=target.right-viewport.right+8;
 };
 if(!items.length)return null;
 return <div {...props} ref={element=>{host.current=element;if(typeof forwardedRef==='function')forwardedRef(element);else if(forwardedRef)forwardedRef.current=element}} className={`ls-dock-host ${className}`} data-size={size} data-compact={compact} data-overflow={overflowing} data-reduced={reduced} aria-disabled={disabled||undefined} onFocusCapture={event=>{onFocusCapture?.(event);if(!event.defaultPrevented&&(event.target as HTMLElement).classList.contains('ls-dock-item'))reveal(event.target as HTMLElement)}} onKeyDown={event=>{
   onKeyDown?.(event);if(event.defaultPrevented||disabled||event.altKey||event.ctrlKey||event.metaKey)return;
   const enabled=items.filter(item=>!item.disabled),current=enabled.findIndex(item=>buttons.current.get(item.id)===event.target);
   if(current<0)return;
   let next:number|undefined;
   if(event.key==='ArrowRight')next=(current+1)%enabled.length;
   if(event.key==='ArrowLeft')next=(current-1+enabled.length)%enabled.length;
   if(event.key==='Home')next=0;if(event.key==='End')next=enabled.length-1;
   if(next!==undefined){event.preventDefault();buttons.current.get(enabled[next].id)?.focus({preventScroll:overflowing})}
  }}>
  <nav className="ls-dock-panel" aria-label={label} onPointerMove={event=>{mouseX.set(!disabled&&!compact&&!reduced&&magnify&&event.pointerType==='mouse'?event.clientX:Infinity)}} onPointerLeave={()=>mouseX.set(Infinity)}>
   {items.map(item=><DockButton key={item.id} item={item} active={activeId===item.id} selectable={activeId!==undefined&&!item.action} mouseX={mouseX} size={size} compact={compact} reduced={reduced||!magnify||disabled||!!item.disabled} disabled={disabled||!!item.disabled} onSelect={onSelect} buttonRef={button=>{if(button)buttons.current.set(item.id,button);else buttons.current.delete(item.id)}}/>)}
  </nav>
 </div>;
});
function DockButton({item,active,selectable,mouseX,size,compact,reduced,disabled,onSelect,buttonRef}:{item:DockItem;active:boolean;selectable:boolean;mouseX:MotionValue<number>;size:"small"|"middle";compact:boolean;reduced:boolean;disabled:boolean;onSelect:DockProps['onSelect'];buttonRef:(button:DockElement|null)=>void}){
 const ref=useRef<DockElement|null>(null),base=size==='small'?(compact?32:38):(compact?36:44),peak=size==='small'?60:72;
 const distance=useTransform(mouseX,value=>{const rect=ref.current?.getBoundingClientRect();return rect?value-rect.x-rect.width/2:Infinity});
 const targetSize=useTransform(distance,[-140,0,140],[base,peak,base]);
 const animated=useSpring(targetSize,{mass:.1,stiffness:150,damping:12});
 const common={ref:(element:DockElement|null)=>{ref.current=element;buttonRef(element)},className:'ls-dock-item',style:{width:compact||reduced?base:animated,height:compact||reduced?base:animated},'aria-label':item.label,'data-active':active&&!item.action||undefined,onClick:(event:MouseEvent<HTMLElement>)=>{
  if(disabled){event.preventDefault();return;}
  if(item.href!==undefined&&(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey))return;
  onSelect?.(item.id,item,event);
 }};
 const content=<><span className="ls-dock-label" aria-hidden="true">{item.label}</span><span className="ls-dock-icon" aria-hidden="true">{item.icon}</span><span className="ls-dock-current" aria-hidden="true"/></>;
 return item.href!==undefined?<motion.a {...common} href={disabled?undefined:item.href} target={item.target} rel={item.target==='_blank'?`${item.rel??''} noopener noreferrer`.trim():item.rel} aria-current={active&&!item.action?'page':undefined} aria-disabled={disabled||undefined} tabIndex={disabled?-1:undefined}>{content}</motion.a>:<motion.button {...common} type="button" aria-pressed={selectable?active:undefined} disabled={disabled}>{content}</motion.button>;
}
