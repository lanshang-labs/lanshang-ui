import {useEffect,useId,useLayoutEffect,useRef,useState,type CSSProperties,type HTMLAttributes,type ReactNode} from 'react';
import {MotionButton} from './MotionButton.js';
import {ImageCard} from './ImageCard.js';
import {HintTooltip} from './ComplexControls.js';
import {ChevronLeftOutlined,ChevronRightOutlined,CompressOutlined,ExpandOutlined} from './icons.js';
const useMeasureEffect=typeof window==='undefined'?useEffect:useLayoutEffect;

export interface ImageDeckItem {id:string;src:string;alt:string;title?:string;thumbnailSrc?:string;fallbackSrc?:string}
export interface ImageDeckProps extends Omit<HTMLAttributes<HTMLDivElement>,'children'> {
 items:readonly ImageDeckItem[];
 activeId?:string;
 defaultActiveId?:string;
 onActiveChange?:(id:string,item:ImageDeckItem)=>void;
 expanded?:boolean;
 defaultExpanded?:boolean;
 onExpandedChange?:(expanded:boolean)=>void;
 onImageClick?:(item:ImageDeckItem,index:number)=>void;
 cardWidth?:number;
 aspectRatio?:number;
 objectFit?:CSSProperties['objectFit'];
 emptyState?:ReactNode;
 disabled?:boolean;
}

/** A controlled or self-contained image stack. Image resources and preview actions belong to the consumer. */
export function ImageDeck({items,activeId,defaultActiveId,onActiveChange,expanded,defaultExpanded=false,onExpandedChange,onImageClick,cardWidth=240,aspectRatio=3/4,objectFit='cover',emptyState='暂无图片',disabled=false,className='',style,'aria-label':label='图片叠卡',...props}:ImageDeckProps){
 if(!Number.isFinite(cardWidth)||cardWidth<=0||!Number.isFinite(aspectRatio)||aspectRatio<=0)throw new RangeError('ImageDeck dimensions must be finite and positive');
 const ids=new Set<string>();for(const item of items){if(ids.has(item.id))throw new Error(`Duplicate ImageDeck id: ${item.id}`);ids.add(item.id);}
 const [localId,setLocalId]=useState(defaultActiveId??items[0]?.id),[localExpanded,setLocalExpanded]=useState(defaultExpanded),[width,setWidth]=useState(0);
 const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),toggle=useRef<HTMLButtonElement>(null),opener=useRef<HTMLButtonElement>(null);
 const lastFocus=useRef<HTMLElement|null>(null);
 const panelId=useId(),helpId=useId();
 const selected=activeId??localId,index=Math.max(0,items.findIndex(item=>item.id===selected)),current=items[index];
 const open=expanded??localExpanded;
 const state=useRef({items,index,open,disabled,activeId,onActiveChange,onExpandedChange,expanded});
 state.current={items,index,open,disabled,activeId,onActiveChange,onExpandedChange,expanded};
 const wheel=useRef({delta:0,time:0,lastStep:0});
 function select(next:number){
  const s=state.current;if(s.disabled||s.items.length<2)return;
  const item=s.items[(next+s.items.length)%s.items.length];
  if(s.activeId===undefined)setLocalId(item.id);
  s.onActiveChange?.(item.id,item);
 }
 function setOpen(next:boolean){
  const s=state.current;if(s.disabled||s.items.length===0||s.open===next)return;
  if(s.expanded===undefined)setLocalExpanded(next);
  s.onExpandedChange?.(next);
 }
 // Use a native non-passive listener only over the collapsed stack. Page scrolling
 // and browser zoom remain available over controls, expanded images and empty decks.
 const actions=useRef({select,setOpen});actions.current={select,setOpen};
 useMeasureEffect(()=>{
  const element=root.current;if(!element)return;
  const measure=()=>setWidth(stage.current?.clientWidth??element.clientWidth);measure();
  const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const element=stage.current;if(!element)return;
  const handle=(event:WheelEvent)=>{
   const s=state.current;
   if(!(event.target instanceof Element)||!event.target.closest('.ls-deck-open'))return;
   if(s.disabled||s.open||s.items.length<2||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY)return;
   event.preventDefault();
   const now=Date.now(),w=wheel.current,delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1);
   if(now-w.time>180||Math.sign(delta)!==Math.sign(w.delta))w.delta=0;
   w.time=now;
   if(now-w.lastStep<240){w.delta=0;return;}
   w.delta+=delta;
   if(Math.abs(w.delta)>=32){actions.current.select(s.index+(w.delta>0?1:-1));w.delta=0;w.lastStep=now;}
  };
  element.addEventListener('wheel',handle,{passive:false});return()=>element.removeEventListener('wheel',handle);
 },[items.length===0]);
 const wasOpen=useRef(open);
 useEffect(()=>{
  if(wasOpen.current!==open){
   const focused=document.activeElement;
   if(focused&&(root.current?.contains(focused)||focused===document.body&&lastFocus.current&&!lastFocus.current.isConnected)){
    if(open)toggle.current?.focus();else opener.current?.focus();
   }
   wheel.current={delta:0,time:0,lastStep:0};
  }
  wasOpen.current=open;
 },[open]);
 const available=width||cardWidth+48,gap=16;
 const columns=Math.max(1,Math.min(4,items.length,Math.floor((available+gap)/(Math.min(cardWidth,120)+gap))));
 const imageWidth=open?Math.min(cardWidth,(available-gap*(columns-1))/columns):Math.min(cardWidth,Math.max(1,available-48));
 const cardHeight=Math.round(Math.max(1,imageWidth-14)/aspectRatio)+37;
 const gridWidth=columns*imageWidth+(columns-1)*gap;
 const rows=Math.ceil(items.length/columns);
 const stageHeight=open?rows*cardHeight+Math.max(0,rows-1)*gap+8:cardHeight+48;
 return <div {...props} ref={root} role={props.role??'group'} aria-label={label} aria-disabled={disabled||undefined} className={`ls-image-deck ${className}`} style={style} data-expanded={open} onFocusCapture={event=>{lastFocus.current=event.target;props.onFocusCapture?.(event);}} onKeyDown={event=>{
  props.onKeyDown?.(event);if(event.defaultPrevented||disabled||event.ctrlKey||event.altKey||event.metaKey)return;
  if(event.key==='Escape'&&open){event.preventDefault();setOpen(false);}
  if(!open&&items.length>1&&event.target===opener.current){
   if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();select(index+1);}
   if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();select(index-1);}
   if(event.key==='Home'){event.preventDefault();select(0);}
   if(event.key==='End'){event.preventDefault();select(items.length-1);}
  }
 }}>
  {items.length===0?<div className="ls-deck-empty">{emptyState}</div>:<>
   <div ref={stage} id={panelId} className="ls-deck-stage" style={{height:stageHeight}}>
    {items.map((item,i)=>{
     const depth=(i-index+items.length)%items.length,visible=open||depth<4;
     const angle=depth===0?0:[0,-5,5,-8][depth%4];
     const x=open?(available-gridWidth)/2+(i%columns)*(imageWidth+gap):(available-imageWidth)/2+(depth%2===0?1:-1)*Math.min(depth,3)*5;
     const y=open?Math.floor(i/columns)*(cardHeight+gap)+4:14+Math.min(depth,3)*7;
     return <ImageCard key={item.id} className="ls-deck-card" src={visible?item.thumbnailSrc??item.src:''} fallbackSrc={item.thumbnailSrc?item.src:item.fallbackSrc} alt={item.alt} title={item.title??item.alt} index={String(i+1).padStart(2,'0')} objectFit={objectFit} loading={depth===0?'eager':'lazy'} disabled={disabled} onPreview={open&&onImageClick?()=>onImageClick(item,i):undefined} aria-hidden={!open||undefined} data-front={!open&&depth===0} data-visible={visible} style={{width:imageWidth,height:cardHeight,zIndex:open?1:items.length-depth,transform:`translate(${Math.round(x)}px,${Math.round(y)}px) rotate(${open?0:angle}deg) scale(${open?1:1-Math.min(depth,3)*.025})`}}/>;
    })}
    {!open&&<button type="button" ref={opener} className="ls-deck-open" disabled={disabled} aria-label={`展开${label}，共 ${items.length} 张`} aria-expanded={false} aria-controls={panelId} aria-describedby={helpId} onClick={()=>setOpen(true)} style={{left:(available-imageWidth)/2,top:10,width:imageWidth,height:cardHeight+24,zIndex:items.length+1}}/>}
   </div>
   <div className="ls-deck-footer">
    <div className="ls-deck-caption"><span className="ls-deck-position" role="status" aria-live="polite" aria-atomic="true">{open?`${items.length} 张图片`:`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`}</span>{!open&&<span className="ls-deck-current-title">{current?.title??current?.alt}</span>}</div>
    <div className="ls-deck-actions">
     {!open&&items.length>1&&<><HintTooltip title="上一张"><MotionButton className="ls-media-control" type="text" aria-label="上一张图片" disabled={disabled} icon={<ChevronLeftOutlined/>} onClick={()=>select(index-1)}/></HintTooltip><HintTooltip title="下一张"><MotionButton className="ls-media-control" type="text" aria-label="下一张图片" disabled={disabled} icon={<ChevronRightOutlined/>} onClick={()=>select(index+1)}/></HintTooltip><span className="ls-deck-divider" aria-hidden/></>}
     <HintTooltip title={open?'收起图片':'展开图片'}><MotionButton className="ls-media-control" ref={toggle} type="text" aria-label={open?'收起图片':'展开图片'} aria-expanded={open} aria-controls={panelId} disabled={disabled} icon={open?<CompressOutlined/>:<ExpandOutlined/>} onClick={()=>setOpen(!open)}/></HintTooltip>
    </div>
   </div>
   <span id={helpId} className="ls-deck-sr">悬停图片后滚动滚轮切换，或使用方向键与上一张、下一张按钮。点击展开，Escape 收起。</span>
  </>}
 </div>;
}
