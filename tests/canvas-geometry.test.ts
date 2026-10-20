import {expect,it} from 'vitest';
import {arrangeCanvasNodes,fitCanvasViewport,getCanvasBounds,zoomCanvasAt,type CanvasNode} from '../src/canvas-geometry';
const nodes:CanvasNode<string>[]=[{id:'a',x:-200,y:100,width:120,height:80,data:'first'},{id:'b',x:80,y:-90,width:260,height:150,data:'second'},{id:'c',x:0,y:0,width:180,height:240,data:'third'}];
it('keeps the same world point under the zoom anchor, including clamped zoom',()=>{
 const view={x:-30,y:60,scale:.4},anchor={x:410,y:230};
 for(const scale of [1.2,.001,999]){
  const next=zoomCanvasAt(view,scale,anchor,{minScale:.1,maxScale:3});
  expect((anchor.x-next.x)/next.scale).toBeCloseTo((anchor.x-view.x)/view.scale);
  expect((anchor.y-next.y)/next.scale).toBeCloseTo((anchor.y-view.y)/view.scale);
  expect(next.scale).toBeGreaterThanOrEqual(.1);expect(next.scale).toBeLessThanOrEqual(3);
 }
});
it('fits variable sized nodes with negative coordinates inside the requested padding',()=>{
 const size={width:500,height:330},view=fitCanvasViewport(nodes,size,{padding:24}),bounds=getCanvasBounds(nodes)!;
 expect(bounds).toEqual({x:-200,y:-90,width:540,height:330});
 for(const node of nodes){expect(view.x+node.x*view.scale).toBeGreaterThanOrEqual(24-1e-8);expect(view.y+node.y*view.scale).toBeGreaterThanOrEqual(24-1e-8);expect(view.x+(node.x+node.width)*view.scale).toBeLessThanOrEqual(size.width-24+1e-8);expect(view.y+(node.y+node.height)*view.scale).toBeLessThanOrEqual(size.height-24+1e-8);}
 expect(fitCanvasViewport([],size)).toEqual({x:24,y:24,scale:1});
 expect(fitCanvasViewport(nodes,{width:0,height:0}).scale).toBe(1);
});
it('arranges heterogeneous node sizes without overlap and preserves ids and business data',()=>{
 const before=structuredClone(nodes),next=arrangeCanvasNodes(nodes,{columns:2,gap:20,origin:{x:-10,y:30}});
 expect(next.map(({id,data})=>({id,data}))).toEqual(nodes.map(({id,data})=>({id,data})));
 expect(next[1].x).toBe(next[0].x+180+20);
 expect(next[2].y).toBe(next[0].y+150+20);
 expect(nodes).toEqual(before);
 const many=arrangeCanvasNodes(Array.from({length:1001},(_,i)=>({id:String(i),x:0,y:0,width:10,height:20,data:i})));
 expect(many).toHaveLength(1001);expect(new Set(many.map(node=>`${node.x}:${node.y}`)).size).toBe(1001);
});
it('rejects ambiguous identities and non-finite geometry before producing transforms',()=>{
 expect(()=>getCanvasBounds([nodes[0],nodes[0]])).toThrow('unique');
 expect(()=>getCanvasBounds([{...nodes[0],width:0}])).toThrow('positive');
 expect(()=>zoomCanvasAt({x:0,y:0,scale:0},2,{x:0,y:0})).toThrow('positive');
 expect(()=>zoomCanvasAt({x:0,y:0,scale:1},Infinity,{x:0,y:0})).toThrow('finite');
 expect(()=>arrangeCanvasNodes(nodes,{columns:1.5})).toThrow('integer');
});
