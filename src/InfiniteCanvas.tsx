import {forwardRef,useCallback,useEffect,useId,useImperativeHandle,useRef,useState,type CSSProperties,type HTMLAttributes,type ReactElement,type ReactNode,type Ref,type PointerEvent as ReactPointerEvent} from 'react';
import {MotionButton} from './MotionButton.js';
import {AppstoreOutlined,ExpandOutlined,ReloadOutlined,ZoomInOutlined,ZoomOutOutlined} from './icons.js';
import {arrangeCanvasNodes,clampCanvasScale,defaultCanvasViewport,fitCanvasViewport,validateCanvasNodes,zoomCanvasAt,type CanvasArrangeOptions,type CanvasFitOptions,type CanvasNode,type CanvasSize,type CanvasViewport} from './canvas-geometry.js';

export interface CanvasChangeDetails { reason:'pan'|'zoom'|'fit'|'reset'|'drag'|'keyboard'|'arrange'|'cancel'; nodeId?:string }
export interface CanvasDragHandleProps extends HTMLAttributes<HTMLElement> { 'data-canvas-drag-handle':string }
export interface CanvasNodeRenderContext { dragHandleProps:CanvasDragHandleProps; isDragging:boolean }
export interface InfiniteCanvasRef {
 fitView(options?:CanvasFitOptions):void;
 zoomIn():void;
 zoomOut():void;
 resetView():void;
 arrange(options?:CanvasArrangeOptions):void;
 focus():void;
 getViewportSize():CanvasSize;
}
export interface InfiniteCanvasProps<T=unknown> extends Omit<HTMLAttributes<HTMLDivElement>,'children'> {
 nodes:readonly CanvasNode<T>[];
 viewport:CanvasViewport;
 onViewportChange:(next:CanvasViewport,details:CanvasChangeDetails)=>void;
 onNodesChange:(next:CanvasNode<T>[],details:CanvasChangeDetails)=>void;
 renderNode:(node:CanvasNode<T>,context:CanvasNodeRenderContext)=>ReactNode;
 minScale?:number;
 maxScale?:number;
 resetViewport?:CanvasViewport;
 height?:CSSProperties['height'];
 controls?:boolean;
 toolbarExtra?:ReactNode;
 emptyState?:ReactNode;
}
const interactive='button,input,textarea,select,a,summary,video,audio,[contenteditable]:not([contenteditable="false"]),[role="dialog"],[role="menu"],[role="slider"],[role="combobox"],[role="listbox"],[role="textbox"],[data-canvas-interactive]';
const viewportKeys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','0','f','F'];
function isInteractive(target:EventTarget|null,handle?:Element){const match=target instanceof Element?target.closest(interactive):null;return !!match&&match!==handle;}
interface Gesture { pointerId:number; startX:number; startY:number; view:CanvasViewport; nodeId?:string; position?:{x:number;y:number} }

function Canvas<T>({nodes,viewport,onViewportChange,onNodesChange,renderNode,minScale=.05,maxScale=4,resetViewport=defaultCanvasViewport,height=560,controls=true,toolbarExtra,emptyState,className='',style,'aria-label':label='无限画布','aria-describedby':describedBy,...props}:InfiniteCanvasProps<T>,ref:Ref<InfiniteCanvasRef>){
 validateCanvasNodes(nodes);
 zoomCanvasAt(viewport,viewport.scale,{x:0,y:0},{minScale,maxScale});
 zoomCanvasAt(resetViewport,resetViewport.scale,{x:0,y:0},{minScale,maxScale});
 const surface=useRef<HTMLDivElement>(null),gesture=useRef<Gesture|null>(null);
 const [dragging,setDragging]=useState<string|null>(null),[panning,setPanning]=useState(false),[keyboardNode,setKeyboardNode]=useState<string|null>(null);
 const keyboardOrigin=useRef<{id:string;x:number;y:number}|null>(null);
 const state=useRef({nodes,viewport,onViewportChange,onNodesChange,minScale,maxScale,resetViewport});
 state.current={nodes,viewport,onViewportChange,onNodesChange,minScale,maxScale,resetViewport};
 const helpId=useId(),statusId=useId();
 const size=useCallback(()=>({width:surface.current?.clientWidth??0,height:surface.current?.clientHeight??0}),[]);
 // Callback values are proposals; only a new render accepts controlled state.
 const emitView=useCallback((next:CanvasViewport,details:CanvasChangeDetails)=>{state.current.onViewportChange(next,details);},[]);
 const emitNodes=useCallback((next:CanvasNode<T>[],details:CanvasChangeDetails)=>{state.current.onNodesChange(next,details);},[]);
 const moveNode=useCallback((id:string,x:number,y:number,reason:CanvasChangeDetails['reason'])=>{
  const current=state.current.nodes;if(!current.some(node=>node.id===id))return;
  emitNodes(current.map(node=>node.id===id?{...node,x,y}:node),{reason,nodeId:id});
 },[emitNodes]);
 const fit=useCallback((options:CanvasFitOptions={})=>{
  const dimensions=size();if(dimensions.width<=0||dimensions.height<=0)return;
  const current=state.current;
  emitView(fitCanvasViewport(current.nodes,dimensions,{...options,minScale:Math.max(current.minScale,options.minScale??current.minScale),maxScale:Math.min(current.maxScale,options.maxScale??Math.max(1,current.minScale))}),{reason:'fit'});
 },[emitView,size]);
 const zoom=useCallback((factor:number)=>{const current=state.current,dimensions=size();emitView(zoomCanvasAt(current.viewport,current.viewport.scale*factor,{x:dimensions.width/2,y:dimensions.height/2},current),{reason:'zoom'});},[emitView,size]);
 const reset=useCallback(()=>{const current=state.current;emitView({...current.resetViewport,scale:clampCanvasScale(current.resetViewport.scale,current)},{reason:'reset'});},[emitView]);
 const arrange=useCallback((options:CanvasArrangeOptions={})=>{
  emitNodes(arrangeCanvasNodes(state.current.nodes,options),{reason:'arrange'});
 },[emitNodes]);
 useImperativeHandle(ref,()=>({fitView:fit,zoomIn:()=>zoom(1.2),zoomOut:()=>zoom(1/1.2),resetView:reset,arrange,focus:()=>surface.current?.focus({preventScroll:true}),getViewportSize:size}),[fit,zoom,reset,arrange,size]);

 const finish=useCallback((cancel=false)=>{
  const current=gesture.current;gesture.current=null;setDragging(null);setPanning(false);
  if(current){
   if(cancel){if(current.nodeId&&current.position)moveNode(current.nodeId,current.position.x,current.position.y,'cancel');else emitView(current.view,{reason:'cancel'});}
   const el=surface.current;if(el?.hasPointerCapture?.(current.pointerId))el.releasePointerCapture(current.pointerId);
  }
 },[emitView,moveNode]);
 useEffect(()=>{
  const el=surface.current;if(!el)return;
  const wheel=(event:WheelEvent)=>{
   if(event.defaultPrevented||isInteractive(event.target))return;
   event.preventDefault();if(gesture.current)return;
   const current=state.current,rect=el.getBoundingClientRect();
   const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?Math.max(el.clientHeight,1):1);
   const factor=Math.exp(Math.max(-2,Math.min(2,-pixels*.0015)));
   emitView(zoomCanvasAt(current.viewport,current.viewport.scale*factor,{x:event.clientX-rect.left-el.clientLeft,y:event.clientY-rect.top-el.clientTop},current),{reason:'zoom'});
  };
  el.addEventListener('wheel',wheel,{passive:false});
  // Dimensions are read for each operation, so resize never resets the user's view.
  return()=>{el.removeEventListener('wheel',wheel);const current=gesture.current;gesture.current=null;if(current&&el.hasPointerCapture?.(current.pointerId))el.releasePointerCapture(current.pointerId);};
 },[emitView]);
 useEffect(()=>{if(gesture.current?.nodeId&&!nodes.some(node=>node.id===gesture.current?.nodeId))finish();if(keyboardNode&&!nodes.some(node=>node.id===keyboardNode)){keyboardOrigin.current=null;setKeyboardNode(null);}},[nodes,keyboardNode,finish]);

 function begin(event:ReactPointerEvent<HTMLElement>,nodeId?:string){
  if(event.defaultPrevented||event.button!==0||gesture.current||isInteractive(event.target,nodeId?event.currentTarget:undefined))return;
  const el=surface.current;if(!el)return;
  const node=nodeId?state.current.nodes.find(item=>item.id===nodeId):undefined;
  if(nodeId&&!node)return;
  // A new pointer operation commits any accepted keyboard movement first.
  keyboardOrigin.current=null;setKeyboardNode(null);
  event.preventDefault();event.stopPropagation();event.currentTarget.focus({preventScroll:true});
  gesture.current={pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,view:{...state.current.viewport},nodeId,position:node?{x:node.x,y:node.y}:undefined};
  el.setPointerCapture?.(event.pointerId);setDragging(nodeId??null);setPanning(!nodeId);
 }
 function move(event:ReactPointerEvent){
  const current=gesture.current;if(!current||current.pointerId!==event.pointerId)return;
  const dx=event.clientX-current.startX,dy=event.clientY-current.startY;
  if(current.nodeId&&current.position)moveNode(current.nodeId,current.position.x+dx/current.view.scale,current.position.y+dy/current.view.scale,'drag');
  else emitView({...current.view,x:current.view.x+dx,y:current.view.y+dy},{reason:'pan'});
 }
 function handle(node:CanvasNode<T>):CanvasDragHandleProps{return {
  role:'button',tabIndex:0,'aria-label':`移动 ${node.label??node.id}`,'aria-pressed':keyboardNode===node.id,'aria-describedby':helpId,'data-canvas-drag-handle':'',
  onPointerDown:event=>begin(event,node.id),
  onBlur:()=>{if(keyboardOrigin.current?.id===node.id){keyboardOrigin.current=null;setKeyboardNode(null);}},
  onKeyDown:event=>{
   if(event.target!==event.currentTarget||event.altKey||event.ctrlKey||event.metaKey)return;
   if(gesture.current){if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(true);}else if(viewportKeys.includes(event.key)||event.key===' '||event.key==='Enter')event.preventDefault();return;}
   if(event.key===' '||event.key==='Enter'){
    event.preventDefault();event.stopPropagation();
    if(keyboardOrigin.current?.id===node.id){keyboardOrigin.current=null;setKeyboardNode(null);}
    else {const current=state.current.nodes.find(item=>item.id===node.id);if(current){keyboardOrigin.current={id:node.id,x:current.x,y:current.y};setKeyboardNode(node.id);}}
   } else if(event.key==='Escape'&&keyboardOrigin.current?.id===node.id){
    event.preventDefault();event.stopPropagation();const origin=keyboardOrigin.current;keyboardOrigin.current=null;setKeyboardNode(null);moveNode(node.id,origin.x,origin.y,'cancel');
   } else if(event.key.startsWith('Arrow')){
    event.preventDefault();event.stopPropagation();const current=state.current.nodes.find(item=>item.id===node.id);if(!current)return;
    const step=event.shiftKey?64:16;moveNode(node.id,current.x+(event.key==='ArrowLeft'?-step:event.key==='ArrowRight'?step:0),current.y+(event.key==='ArrowUp'?-step:event.key==='ArrowDown'?step:0),'keyboard');
   }
  }
 };}
 return <div {...props} className={`ls-infinite-canvas ${className}`} style={style}>
  {(controls||toolbarExtra)&&<div className="ls-canvas-toolbar">{controls&&<div className="ls-canvas-controls" role="group" aria-label="画布操作">
   <MotionButton title="缩小画布" aria-label="缩小画布" icon={<ZoomOutOutlined/>} disabled={viewport.scale<=minScale} onClick={()=>zoom(1/1.2)}/>
   <output className="ls-canvas-scale" aria-label="画布缩放比例">{Math.round(viewport.scale*100)}%</output>
   <MotionButton title="放大画布" aria-label="放大画布" icon={<ZoomInOutlined/>} disabled={viewport.scale>=maxScale} onClick={()=>zoom(1.2)}/>
   <span className="ls-canvas-toolbar-divider"/>
   <MotionButton title="适应全部" aria-label="适应全部" icon={<ExpandOutlined/>} onClick={()=>fit()}/>
   <MotionButton title="原始视图" aria-label="原始视图" icon={<ReloadOutlined/>} onClick={reset}/>
   <MotionButton title="自动排布" aria-label="自动排布" icon={<AppstoreOutlined/>} disabled={!nodes.length} onClick={()=>arrange()}/>
  </div>}{toolbarExtra}</div>}
  <p className="ls-canvas-sr" id={helpId}>拖动空白平移，滚轮以指针为中心缩放。画布方向键平移，加减号缩放，F 适应全部，0 原始视图。卡片移动柄方向键移动，按住 Shift 加速；空格或 Enter 开始或完成键盘移动，Escape 取消。</p>
  <div ref={surface} className="ls-canvas-surface" role="region" aria-label={label} aria-describedby={[helpId,describedBy].filter(Boolean).join(' ')} tabIndex={0} data-gesture={dragging?'node':panning?'pan':''}
   style={{height,backgroundSize:`${24*viewport.scale}px ${24*viewport.scale}px`,backgroundPosition:`${viewport.x}px ${viewport.y}px`}}
   onPointerDown={event=>{if(!(event.target instanceof Element)||!event.target.closest('[data-canvas-node],.ls-canvas-empty'))begin(event);}}
   onPointerMove={move} onPointerUp={event=>{if(gesture.current?.pointerId===event.pointerId)finish();}} onPointerCancel={event=>{if(gesture.current?.pointerId===event.pointerId)finish(true);}}
   onLostPointerCapture={event=>{if(gesture.current?.pointerId===event.pointerId)finish();}}
   onKeyDown={event=>{
    if(event.key==='Escape'&&gesture.current){event.preventDefault();finish(true);return;}
    if(event.target!==event.currentTarget||event.altKey||event.ctrlKey||event.metaKey)return;
    const key=event.key;if(!viewportKeys.includes(key))return;event.preventDefault();if(gesture.current)return;
    if(key==='+'||key==='=')zoom(1.2);else if(key==='-')zoom(1/1.2);else if(key==='0')reset();else if(key.toLowerCase()==='f')fit();
    else {const step=event.shiftKey?120:40,current=state.current.viewport;emitView({...current,x:current.x+(key==='ArrowLeft'?step:key==='ArrowRight'?-step:0),y:current.y+(key==='ArrowUp'?step:key==='ArrowDown'?-step:0)},{reason:'keyboard'});}
   }}>
   <div className="ls-canvas-pan-target" aria-hidden="true"/>
   {!nodes.length&&<div className="ls-canvas-empty">{emptyState??<span>添加内容，开始自由排布</span>}</div>}
   <div className="ls-canvas-world" style={{transform:`translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`}}>
    {nodes.map(node=><div key={node.id} className="ls-canvas-node" data-canvas-node={node.id} data-dragging={dragging===node.id||keyboardNode===node.id||undefined} style={{left:node.x,top:node.y,width:node.width,height:node.height}}>{renderNode(node,{dragHandleProps:handle(node),isDragging:dragging===node.id||keyboardNode===node.id})}</div>)}
   </div>
  </div>
  <span id={statusId} className="ls-canvas-sr" role="status" aria-live="polite">{keyboardNode?`正在移动 ${nodes.find(node=>node.id===keyboardNode)?.label??keyboardNode}`:''}</span>
 </div>;
}
export const InfiniteCanvas=forwardRef(Canvas) as <T=unknown>(props:InfiniteCanvasProps<T>&{ref?:Ref<InfiniteCanvasRef>})=>ReactElement;
