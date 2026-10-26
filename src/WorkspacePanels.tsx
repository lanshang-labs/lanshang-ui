import {Fragment,useId,useLayoutEffect,useRef,useState,type CSSProperties,type HTMLAttributes,type ReactNode} from 'react';
import {RowActionButton} from './RowActionButton.js';

export interface WorkspacePanelItem {
  /** Unique, non-empty ID. "main" is reserved for the primary workspace. */
  id:string;
  label:string;
  content:ReactNode;
  placement?:'start'|'end';
  header?:ReactNode;
  footer?:ReactNode;
  width?:number;
  defaultWidth?:number;
  minWidth?:number;
  maxWidth?:number;
  collapsed?:boolean;
  defaultCollapsed?:boolean;
  resizable?:boolean;
  onWidthChange?:(width:number)=>void;
  onCollapsedChange?:(collapsed:boolean)=>void;
}
export interface WorkspacePanelsProps extends Omit<HTMLAttributes<HTMLDivElement>,'children'> {
  panels:WorkspacePanelItem[];
  children:ReactNode;
  mainLabel?:string;
  mainHeader?:ReactNode;
  mainFooter?:ReactNode;
  /** Container width, not the browser viewport. Also respects minMainWidth. */
  breakpoint?:number;
  minMainWidth?:number;
  activePanel?:string;
  defaultActivePanel?:string;
  onActivePanelChange?:(id:string)=>void;
  immersive?:boolean;
  defaultImmersive?:boolean;
  onImmersiveChange?:(immersive:boolean)=>void;
}
const finite=(value:number|undefined,fallback:number)=>Number.isFinite(value)?value!:fallback;
function limits(panel:WorkspacePanelItem){const min=Math.max(96,finite(panel.minWidth,160));return {min,max:Math.max(min,finite(panel.maxWidth,400))};}

/** Flat, independently scrolling workspace regions. Layout state never owns business data. */
export function WorkspacePanels({panels,children,mainLabel='工作区',mainHeader,mainFooter,breakpoint=760,minMainWidth=320,activePanel,defaultActivePanel='main',onActivePanelChange,immersive,defaultImmersive=false,onImmersiveChange,className='',onFocusCapture,onBlurCapture,...props}:WorkspacePanelsProps){
  const ids=new Set<string>();
  for(const panel of panels){if(!panel.id||panel.id==='main'||ids.has(panel.id))throw new Error('WorkspacePanels requires unique panel IDs other than "main".');ids.add(panel.id);}
  const [widths,setWidths]=useState<Record<string,number>>({}),[folded,setFolded]=useState<Record<string,boolean>>({});
  const [localActive,setActive]=useState(defaultActivePanel),[localImmersive,setImmersive]=useState(defaultImmersive),[containerWidth,setContainerWidth]=useState(0);
  const root=useRef<HTMLDivElement>(null),regions=useRef(new Map<string,HTMLElement>()),toggles=useRef(new Map<string,HTMLElement>()),immersiveButton=useRef<HTMLButtonElement>(null);
  const focusOwner=useRef<{id:string;element:HTMLElement}>(),drag=useRef<{id:string;x:number;width:number;direction:number}>();
  const prefix=useId(),isImmersive=immersive??localImmersive;
  const width=(panel:WorkspacePanelItem)=>{const {min,max}=limits(panel);return Math.max(min,Math.min(max,finite(panel.width??widths[panel.id]??panel.defaultWidth,220)));};
  const collapsed=(panel:WorkspacePanelItem)=>panel.collapsed??folded[panel.id]??panel.defaultCollapsed??false;
  const openPanels=panels.filter(panel=>!collapsed(panel));
  const required=Math.max(160,finite(minMainWidth,320))+openPanels.reduce((sum,panel)=>sum+width(panel)+(panel.resizable===false?1:9),0);
  const narrow=containerWidth>0&&containerWidth<Math.max(finite(breakpoint,760),required);
  const requested=activePanel??localActive,selected=requested==='main'||ids.has(requested)?requested:'main';
  const visible=(id:string)=>id==='main'?isImmersive||!narrow||selected==='main':!isImmersive&&(narrow?selected===id:!collapsed(panels.find(panel=>panel.id===id)!));
  const visibility=['main',...panels.map(panel=>panel.id)].map(id=>`${id}:${visible(id)}`).join('|');
  const live=useRef({panels,containerWidth,isImmersive,narrow});live.current={panels,containerWidth,isImmersive,narrow};
  useLayoutEffect(()=>{const node=root.current;if(!node||typeof ResizeObserver==='undefined')return;const observer=new ResizeObserver(([entry])=>{drag.current=undefined;if(entry.contentRect.width>0)setContainerWidth(entry.contentRect.width);});observer.observe(node);return()=>observer.disconnect();},[]);
  useLayoutEffect(()=>{
    const previous=focusOwner.current;
    if(previous&&(!previous.element.isConnected||previous.element.closest('[hidden]'))){
      const target=isImmersive?immersiveButton.current:narrow?toggles.current.get(selected):toggles.current.get(previous.id);
      (target??regions.current.get('main')?.querySelector<HTMLElement>('.ls-workspace-pane-scroll'))?.focus();
    }
  },[visibility,isImmersive,narrow,selected]);
  useLayoutEffect(()=>{drag.current=undefined;},[visibility]);
  function select(id:string){if(activePanel===undefined)setActive(id);onActivePanelChange?.(id);}
  function fold(panel:WorkspacePanelItem){const next=!collapsed(panel);if(panel.collapsed===undefined)setFolded(state=>({...state,[panel.id]:next}));panel.onCollapsedChange?.(next);}
  function resize(panel:WorkspacePanelItem,value:number){
    const {min,max}=limits(panel);
    const other=live.current.panels.filter(p=>p.id!==panel.id&&!collapsed(p)).reduce((sum,p)=>sum+width(p)+(p.resizable===false?1:9),0);
    const available=live.current.containerWidth-other-Math.max(160,finite(minMainWidth,320))-9;
    const ceiling=Math.max(min,Math.min(max,available>0?available:max));
    const next=Math.max(min,Math.min(ceiling,Math.round(value)));
    if(panel.width===undefined)setWidths(state=>({...state,[panel.id]:next}));panel.onWidthChange?.(next);
  }
  function pane(id:string,label:string,content:ReactNode,header?:ReactNode,footer?:ReactNode,panel?:WorkspacePanelItem){
    return <section key={id} ref={node=>{if(node)regions.current.set(id,node);else regions.current.delete(id);}} id={`${prefix}-${id}`} aria-label={label} hidden={!visible(id)} data-workspace-pane={id} data-fixed-seam={panel?.resizable===false?(panel.placement??'start'):undefined} className={`ls-workspace-pane${panel?'':' is-main'}`} style={panel?{'--ls-panel-width':`${width(panel)}px`} as CSSProperties:undefined}>
      {(header!==undefined||panel)&&<div className="ls-workspace-pane-header">{header??<strong>{label}</strong>}</div>}
      <div className="ls-workspace-pane-scroll" tabIndex={0}>{content}</div>
      {footer!==undefined&&<div className="ls-workspace-pane-footer">{footer}</div>}
    </section>;
  }
  function separator(panel:WorkspacePanelItem){
    if(narrow||isImmersive||collapsed(panel)||panel.resizable===false)return null;
    const {min,max}=limits(panel),direction=panel.placement==='end'?-1:1;
    return <div key={`${panel.id}-resize`} data-workspace-resize={panel.id} role="separator" aria-label={`调整${panel.label}宽度`} aria-orientation="vertical" aria-controls={`${prefix}-${panel.id}`} aria-valuemin={min} aria-valuemax={Math.max(min,Math.min(max,containerWidth?containerWidth-(required-width(panel)):max))} aria-valuenow={width(panel)} aria-valuetext={`${width(panel)} 像素`} tabIndex={0} className="ls-workspace-panel-resize"
      onKeyDown={event=>{const values:Record<string,number>={Home:min,End:max,ArrowLeft:width(panel)-(event.shiftKey?40:8)*direction,ArrowRight:width(panel)+(event.shiftKey?40:8)*direction};if(event.key in values){event.preventDefault();resize(panel,values[event.key]);}}}
      onPointerDown={event=>{if(event.button!==0)return;event.preventDefault();event.currentTarget.focus();drag.current={id:panel.id,x:event.clientX,width:width(panel),direction};event.currentTarget.setPointerCapture(event.pointerId);}}
      onPointerMove={event=>{const current=drag.current;if(current?.id===panel.id)resize(panel,current.width+(event.clientX-current.x)*current.direction);}}
      onPointerUp={event=>{drag.current=undefined;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}}
      onPointerCancel={()=>{drag.current=undefined;}} onLostPointerCapture={()=>{drag.current=undefined;}}/>;
  }
  return <div {...props} ref={root} className={`ls-workspace-panels ${className}`} data-workspace-panels="" data-narrow={narrow} data-immersive={isImmersive}
    onFocusCapture={event=>{const element=event.target as HTMLElement;if(element.closest('[data-workspace-panels]')===root.current){const owner=element.closest<HTMLElement>('[data-workspace-pane],[data-workspace-toggle],[data-workspace-resize]');focusOwner.current={id:owner?.dataset.workspacePane??owner?.dataset.workspaceToggle??owner?.dataset.workspaceResize??'main',element};}else{for(const [id,node] of regions.current)if(node.contains(element))focusOwner.current={id,element};}onFocusCapture?.(event);}}
    onBlurCapture={event=>{if(event.relatedTarget&&!root.current?.contains(event.relatedTarget as Node))focusOwner.current=undefined;onBlurCapture?.(event);}}>
    <div className="ls-workspace-panel-toolbar" role="group" aria-label="工作区面板">
      {!isImmersive&&(narrow?[{id:'main',label:mainLabel},...panels].map(panel=><RowActionButton key={panel.id} data-workspace-toggle={panel.id} ref={node=>{if(node)toggles.current.set(panel.id,node);else toggles.current.delete(panel.id);}} aria-controls={`${prefix}-${panel.id}`} aria-pressed={selected===panel.id} onClick={()=>select(panel.id)}>{panel.label}</RowActionButton>):panels.map(panel=><RowActionButton key={panel.id} data-workspace-toggle={panel.id} ref={node=>{if(node)toggles.current.set(panel.id,node);else toggles.current.delete(panel.id);}} motionIcon={panel.placement==='end'?'document':'sidebar'} iconActive={!collapsed(panel)} aria-controls={`${prefix}-${panel.id}`} aria-expanded={!collapsed(panel)} onClick={()=>fold(panel)}>{panel.label}</RowActionButton>))}
      <RowActionButton ref={immersiveButton} className="ls-workspace-immersive" motionIcon="fullscreen" aria-label={isImmersive?'退出沉浸模式':'进入沉浸模式'} title={isImmersive?'退出沉浸模式':'进入沉浸模式'} aria-pressed={isImmersive} onClick={()=>{if(immersive===undefined)setImmersive(!isImmersive);onImmersiveChange?.(!isImmersive);}}/>
    </div>
    <div className="ls-workspace-panel-body">
      {panels.filter(panel=>panel.placement!=='end').map(panel=><Fragment key={panel.id}>{pane(panel.id,panel.label,panel.content,panel.header,panel.footer,panel)}{separator(panel)}</Fragment>)}
      {pane('main',mainLabel,children,mainHeader,mainFooter)}
      {panels.filter(panel=>panel.placement==='end').map(panel=><Fragment key={panel.id}>{separator(panel)}{pane(panel.id,panel.label,panel.content,panel.header,panel.footer,panel)}</Fragment>)}
    </div>
  </div>;
}
