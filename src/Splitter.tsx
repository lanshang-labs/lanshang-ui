import {ButtonGroup} from './ControlGroup.js';
import {RowActionButton} from './RowActionButton.js';
import {useId,useRef,useState,useEffect,useLayoutEffect,type ReactNode} from 'react';
export type SplitterProps={orientation?:'horizontal'|'vertical';primary:ReactNode;secondary:ReactNode;primaryLabel?:string;secondaryLabel?:string;size?:number;collapsed?:boolean;onCollapsedChange?:(collapsed:boolean)=>void;defaultSize?:number;min?:number;max?:number;breakpoint?:number;onResize?:(percent:number)=>void};
/** Two-panel workspace. Children remain mounted when collapsed or viewed on narrow screens. */
export function Splitter({primary,secondary,primaryLabel='列表',secondaryLabel='详情',orientation='horizontal',size:controlledSize,collapsed:controlledCollapsed,onCollapsedChange,defaultSize=38,min=25,max=70,breakpoint=600,onResize}:SplitterProps){
 const vertical=orientation==='vertical';
 const lower=Math.max(10,Math.min(80,Number.isFinite(min)?min:25)),upper=Math.max(lower,Math.min(90,Number.isFinite(max)?max:70));
 const clamp=(n:number)=>Math.max(lower,Math.min(upper,Number.isFinite(n)?n:38));
 const [localSize,setSize]=useState(()=>clamp(defaultSize)),[localCollapsed,setLocalCollapsed]=useState(false),[narrow,setNarrow]=useState(false),[view,setView]=useState<'primary'|'secondary'>('primary');
 const size=controlledSize??localSize,collapsed=controlledCollapsed??localCollapsed;
 function setCollapsed(next:boolean){if(controlledCollapsed===undefined)setLocalCollapsed(next);onCollapsedChange?.(next)}
 const host=useRef<HTMLDivElement>(null),first=useRef<HTMLDivElement>(null),second=useRef<HTMLDivElement>(null),primarySwitch=useRef<HTMLButtonElement>(null),secondarySwitch=useRef<HTMLButtonElement>(null),collapse=useRef<HTMLButtonElement>(null),dragging=useRef<{x:number;size:number;width:number}|null>(null),focusAfterLayout=useRef(false);const id=useId();
 const layout=useRef({narrow,view,collapsed});layout.current={narrow,view,collapsed};
 useEffect(()=>{const el=host.current;if(!el)return;const observer=new ResizeObserver(([entry])=>{
  if(entry.contentRect.width<=0){dragging.current=null;return;}
  const next=entry.contentRect.width<breakpoint,current=layout.current;
  if(next!==current.narrow){
   const active=document.activeElement;
   focusAfterLayout.current=!!active&&el.contains(active)&&!!((active.closest('.ls-splitter')===el&&active.closest('.ls-splitter-toolbar,.ls-splitter-handle'))||(first.current?.contains(active)&&(next?current.view!=='primary':current.collapsed))||(second.current?.contains(active)&&next&&current.view!=='secondary'));
   dragging.current=null;setNarrow(next);
  }
 });observer.observe(el);return()=>observer.disconnect()},[breakpoint]);
 const hiddenFirst=narrow?view!=='primary':collapsed,hiddenSecond=narrow&&view!=='secondary';
 useLayoutEffect(()=>{if(host.current?.closest('[hidden]')){focusAfterLayout.current=false;return;}const active=document.activeElement;if(focusAfterLayout.current||(hiddenFirst&&first.current?.contains(active))||(hiddenSecond&&second.current?.contains(active))){(narrow?(view==='primary'?primarySwitch:secondarySwitch):collapse).current?.focus()}focusAfterLayout.current=false},[hiddenFirst,hiddenSecond,narrow,view]);
 useEffect(()=>{dragging.current=null},[orientation]);
 function resize(value:number){const next=clamp(value);if(controlledSize===undefined)setSize(next);onResize?.(next)}
 function pointer(clientX:number){const drag=dragging.current;if(drag&&drag.width>0)resize(drag.size+(clientX-drag.x)/drag.width*100)}
 return <div ref={host} className="ls-splitter" data-narrow={narrow} data-orientation={orientation}>
  <div className="ls-splitter-toolbar">{narrow?<ButtonGroup aria-label="面板视图"><RowActionButton ref={primarySwitch} htmlType="button" aria-pressed={view==='primary'} aria-controls={`${id}-primary`} onClick={()=>setView('primary')}>{primaryLabel}</RowActionButton><RowActionButton ref={secondarySwitch} htmlType="button" aria-pressed={view==='secondary'} aria-controls={`${id}-secondary`} onClick={()=>setView('secondary')}>{secondaryLabel}</RowActionButton></ButtonGroup>:<RowActionButton ref={collapse} htmlType="button" aria-expanded={!collapsed} aria-controls={`${id}-primary`} onClick={()=>setCollapsed(!collapsed)}>{collapsed?'展开':'收起'}{primaryLabel}</RowActionButton>}</div>
  <div className="ls-splitter-panels">
   <div ref={first} id={`${id}-primary`} role="region" tabIndex={hiddenFirst?-1:0} aria-label={primaryLabel} hidden={hiddenFirst} className="ls-splitter-panel" style={{flexBasis:narrow?'100%':`calc((100% - 9px) * ${clamp(size)/100})`}}>{primary}</div>
   {!narrow&&!collapsed&&<div role="separator" tabIndex={0} aria-label={`调整${primaryLabel}${vertical?'高度':'宽度'}`} aria-controls={`${id}-primary`} aria-orientation={vertical?'horizontal':'vertical'} aria-valuemin={lower} aria-valuemax={upper} aria-valuenow={clamp(size)} aria-valuetext={`${Math.round(clamp(size))}%`} className="ls-splitter-handle"
    onKeyDown={e=>{const step=e.shiftKey?10:2;const values:Record<string,number>={Home:lower,End:upper,...(vertical?{ArrowUp:clamp(size)-step,ArrowDown:clamp(size)+step}:{ArrowLeft:clamp(size)-step,ArrowRight:clamp(size)+step})};if(e.key in values){e.preventDefault();resize(values[e.key])}if(e.key==='Enter'){e.preventDefault();setCollapsed(true);collapse.current?.focus()}}}
    onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.focus();dragging.current={x:vertical?e.clientY:e.clientX,size:clamp(size),width:vertical?e.currentTarget.parentElement!.getBoundingClientRect().height-e.currentTarget.offsetHeight:host.current!.getBoundingClientRect().width-e.currentTarget.offsetWidth};e.currentTarget.setPointerCapture(e.pointerId)}}
    onPointerMove={e=>{if(dragging.current)pointer(vertical?e.clientY:e.clientX)}} onPointerUp={e=>{if(dragging.current){pointer(vertical?e.clientY:e.clientX);dragging.current=null;e.currentTarget.releasePointerCapture(e.pointerId)}}} onPointerCancel={()=>{dragging.current=null}} onLostPointerCapture={()=>{dragging.current=null}}/>}
   <div ref={second} id={`${id}-secondary`} role="region" tabIndex={hiddenSecond?-1:0} aria-label={secondaryLabel} hidden={hiddenSecond} className="ls-splitter-panel ls-splitter-secondary">{secondary}</div>
  </div>
 </div>;
}
