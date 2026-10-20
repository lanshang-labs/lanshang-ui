import {useRef,useState} from 'react';
import {InfiniteCanvas,arrangeCanvasNodes,MotionButton,Stack,TextInput,type CanvasNode,type CanvasViewport,type InfiniteCanvasRef} from '../dist/index.js';
import './infinite-canvas-preview.css';
const initial=arrangeCanvasNodes< {title:string} >([
 {id:'outline',label:'内容草图',x:0,y:0,width:260,height:220,data:{title:'内容草图'}},
 {id:'review',label:'交互保留',x:0,y:0,width:260,height:220,data:{title:'交互保留'}},
 {id:'notes',label:'自由编排',x:0,y:0,width:260,height:220,data:{title:'自由编排'}},
],{columns:2,gap:24});
export function InfiniteCanvasPreview(){
 const canvas=useRef<InfiniteCanvasRef>(null);
 const [nodes,setNodes]=useState<CanvasNode<{title:string}>[]>(initial);
 const [viewport,setViewport]=useState<CanvasViewport>({x:24,y:24,scale:.9});
 const [message,setMessage]=useState('画布负责位置与视口，卡片内容和数据由应用提供。');
 return <Stack gap="md">
  <InfiniteCanvas ref={canvas} aria-label="自由编排示例" nodes={nodes} viewport={viewport} onNodesChange={setNodes} onViewportChange={setViewport} height={480}
   toolbarExtra={<MotionButton onClick={()=>{setNodes(current=>[...current,{id:`card-${current.length+1}`,x:80+current.length*20,y:60+current.length*20,width:260,height:220,data:{title:`卡片 ${current.length+1}`}}]);}}>添加卡片</MotionButton>}
   renderNode={(node,{dragHandleProps,isDragging})=><article className="docs-canvas-card" data-moving={isDragging||undefined}>
    <div className="docs-canvas-card-title" {...dragHandleProps}><span aria-hidden>⠿</span><strong>{node.data.title}</strong></div>
    <div className="docs-canvas-card-body" data-canvas-interactive>
     <p>拖动标题移动卡片；输入和按钮保留自己的交互。</p>
     <TextInput aria-label={`${node.data.title}备注`} placeholder="在卡片中输入备注"/>
     <MotionButton onClick={()=>setMessage(`已打开「${node.data.title}」，画布位置保持不变。`)}>打开内容</MotionButton>
    </div>
   </article>}/>
  <p className="docs-muted" role="status">{message}</p>
 </Stack>;
}
