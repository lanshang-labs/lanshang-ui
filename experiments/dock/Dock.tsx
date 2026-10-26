// Adapted from Motion Primitives Dock, MIT, copyright (c) 2024 ibelick.
// Pinned source and full license: ./upstream/.
import {useRef,useState,useEffect,type ReactNode} from 'react';
import {motion,useMotionValue,useTransform,useSpring,type MotionValue} from 'motion/react';
import './dock.css';

export type DockItem={id:string;label:string;icon:ReactNode;disabled?:boolean};
export function Dock({items,activeId,onSelect,label='快捷入口'}:{items:readonly DockItem[];activeId?:string;onSelect:(id:string)=>void;label?:string}){
 const host=useRef<HTMLDivElement>(null),buttons=useRef(new Map<string,HTMLButtonElement>());
 const [compact,setCompact]=useState(true);
 const [reduced,setReduced]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 const mouseX=useMotionValue(Infinity);
 useEffect(()=>{const element=host.current;if(!element)return;const measure=()=>{setCompact(element.clientWidth<480);mouseX.set(Infinity)};measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect()},[mouseX]);
 return <div ref={host} className="ls-dock-host" data-compact={compact} data-reduced={!!reduced}>
  <nav className="ls-dock-panel" aria-label={label} onPointerMove={event=>{if(!compact&&!reduced&&event.pointerType==='mouse')mouseX.set(event.clientX)}} onPointerLeave={()=>mouseX.set(Infinity)} onKeyDown={event=>{
   if(event.altKey||event.ctrlKey||event.metaKey)return;
   const enabled=items.filter(item=>!item.disabled),current=enabled.findIndex(item=>buttons.current.get(item.id)===event.target);
   if(current<0)return;
   let next:number|undefined;
   if(event.key==='ArrowRight')next=(current+1)%enabled.length;
   if(event.key==='ArrowLeft')next=(current-1+enabled.length)%enabled.length;
   if(event.key==='Home')next=0;if(event.key==='End')next=enabled.length-1;
   if(next!==undefined){event.preventDefault();buttons.current.get(enabled[next].id)?.focus()}
  }}>
   {items.map(item=><DockButton key={item.id} item={item} active={activeId===item.id} mouseX={mouseX} compact={compact} reduced={!!reduced} onSelect={onSelect} buttonRef={button=>{if(button)buttons.current.set(item.id,button);else buttons.current.delete(item.id)}}/>)}
  </nav>
 </div>;
}
function DockButton({item,active,mouseX,compact,reduced,onSelect,buttonRef}:{item:DockItem;active:boolean;mouseX:MotionValue<number>;compact:boolean;reduced:boolean;onSelect:(id:string)=>void;buttonRef:(button:HTMLButtonElement|null)=>void}){
 const ref=useRef<HTMLButtonElement|null>(null),base=compact?36:44;
 const distance=useTransform(mouseX,value=>{const rect=ref.current?.getBoundingClientRect();return rect?value-rect.x-rect.width/2:Infinity});
 const size=useTransform(distance,[-140,0,140],[base,72,base]);
 const animated=useSpring(size,{mass:.1,stiffness:150,damping:12});
 return <motion.button ref={button=>{ref.current=button;buttonRef(button)}} type="button" className="ls-dock-item" style={{width:compact||reduced?base:animated,height:compact||reduced?base:animated}} aria-label={item.label} aria-pressed={active} disabled={item.disabled} onClick={()=>onSelect(item.id)}>
  <span className="ls-dock-label" aria-hidden="true">{item.label}</span>
  <span className="ls-dock-icon" aria-hidden="true">{item.icon}</span>
  <span className="ls-dock-current" aria-hidden="true"/>
 </motion.button>;
}
