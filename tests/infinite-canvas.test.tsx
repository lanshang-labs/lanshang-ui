import {createRef,useState} from 'react';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {InfiniteCanvas,type CanvasChangeDetails,type InfiniteCanvasRef} from '../src/InfiniteCanvas';
import {type CanvasNode,type CanvasViewport} from '../src/canvas-geometry';
class Pointer extends MouseEvent {pointerId:number;constructor(type:string,init:PointerEventInit={}){super(type,init);this.pointerId=init.pointerId??1;}}
const initial:CanvasNode<string>[]=[{id:'a',label:'Alpha',x:10,y:20,width:200,height:100,data:'A'},{id:'b',x:300,y:250,width:100,height:180,data:'B'}];
let changes:CanvasChangeDetails[],ref:ReturnType<typeof createRef<InfiniteCanvasRef>>;
beforeEach(()=>{vi.stubGlobal('PointerEvent',Pointer);changes=[];ref=createRef<InfiniteCanvasRef>();});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function Harness({nativeHandle=false}:{nativeHandle?:boolean}){
 const [nodes,setNodes]=useState(initial),[view,setView]=useState<CanvasViewport>({x:20,y:30,scale:2});
 return <><button onClick={()=>setNodes([])}>Remove nodes</button><output data-testid="view">{JSON.stringify(view)}</output><output data-testid="nodes">{JSON.stringify(nodes)}</output>
 <InfiniteCanvas ref={ref} aria-label="Test canvas" height={400} nodes={nodes} viewport={view} onViewportChange={(next,detail)=>{setView(next);changes.push(detail);}} onNodesChange={(next,detail)=>{setNodes(next);changes.push(detail);}}
 renderNode={(node,{dragHandleProps})=><>{nativeHandle?<button {...dragHandleProps}>Handle</button>:<div {...dragHandleProps}>Handle</div>}<button onClick={()=>changes.push({reason:'reset'})}>Open {node.id}</button><input aria-label={`Input ${node.id}`}/><div data-canvas-interactive>Scrollable content</div></>}/></>;
}
const value=(id:string)=>JSON.parse(screen.getByTestId(id).textContent!);
function setup(nativeHandle=false){render(<Harness nativeHandle={nativeHandle}/>);const surface=screen.getByRole('region',{name:'Test canvas'});Object.defineProperties(surface,{clientWidth:{configurable:true,value:800},clientHeight:{configurable:true,value:400}});surface.getBoundingClientRect=()=>({left:100,top:50,width:800,height:400,right:900,bottom:450,x:100,y:50,toJSON(){}});surface.setPointerCapture=vi.fn();surface.hasPointerCapture=()=>true;surface.releasePointerCapture=vi.fn();return surface;}
it('pans the background and cancels back to the captured origin without affecting node positions',()=>{
 const surface=setup();fireEvent.pointerDown(surface,{pointerId:1,button:0,clientX:200,clientY:100});fireEvent.pointerMove(surface,{pointerId:2,clientX:999,clientY:999});expect(value('view')).toEqual({x:20,y:30,scale:2});
 fireEvent.pointerMove(surface,{pointerId:1,clientX:260,clientY:140});expect(value('view')).toEqual({x:80,y:70,scale:2});
 fireEvent.keyDown(surface,{key:'Escape'});expect(value('view')).toEqual({x:20,y:30,scale:2});expect(value('nodes')).toEqual(initial);expect(surface.releasePointerCapture).toHaveBeenCalledWith(1);
});
it('moves nodes in world units at non-unit scale and supports native button handles',()=>{
 const surface=setup(true),handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.pointerDown(handle,{pointerId:1,button:0,clientX:200,clientY:100});fireEvent.pointerMove(surface,{pointerId:1,clientX:260,clientY:140});fireEvent.pointerUp(surface,{pointerId:1});
 expect(value('nodes')[0]).toMatchObject({x:40,y:40});expect(value('nodes')[1]).toEqual(initial[1]);expect(value('view').x).toBe(20);expect(changes).toContainEqual({reason:'drag',nodeId:'a'});
});
it('isolates business actions, inputs, nested scrolling and modified keys from canvas gestures',()=>{
 const surface=setup(),button=screen.getByRole('button',{name:'Open a'}),input=screen.getByRole('textbox',{name:'Input a'});
 for(const target of [button,input,screen.getAllByText('Scrollable content')[0]]){fireEvent.pointerDown(target,{pointerId:1,button:0,clientX:1,clientY:1});fireEvent.pointerMove(surface,{pointerId:1,clientX:100,clientY:100});const event=new WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:100});fireEvent(target,event);expect(event.defaultPrevented).toBe(false);}
 fireEvent.change(input,{target:{value:'edited'}});fireEvent.keyDown(input,{key:'+'});fireEvent.keyDown(surface,{key:'+',ctrlKey:true});fireEvent.click(button);
 expect(value('view')).toEqual({x:20,y:30,scale:2});expect(value('nodes')).toEqual(initial);expect(changes).toEqual([{reason:'reset'}]);
});
it('zooms at the pointer anchor and leaves the original world point fixed',()=>{
 const surface=setup(),event=new WheelEvent('wheel',{bubbles:true,cancelable:true,deltaY:-100,clientX:500,clientY:200});fireEvent(surface,event);const next=value('view');
 expect(event.defaultPrevented).toBe(true);expect((400-next.x)/next.scale).toBeCloseTo((400-20)/2);expect((150-next.y)/next.scale).toBeCloseTo((150-30)/2);
});
it('supports keyboard movement, cancellation, and controlled updates',()=>{
 const surface=setup(),handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.keyDown(handle,{key:'Enter'});expect(handle.getAttribute('aria-pressed')).toBe('true');
 fireEvent.keyDown(handle,{key:'ArrowRight',shiftKey:true});expect(value('nodes')[0].x).toBe(74);fireEvent.keyDown(handle,{key:'Escape'});expect(value('nodes')[0].x).toBe(10);expect(handle.getAttribute('aria-pressed')).toBe('false');
 fireEvent.keyDown(surface,{key:'ArrowLeft'});expect(value('view').x).toBe(60);fireEvent.keyDown(surface,{key:'0'});expect(value('view')).toEqual({x:24,y:24,scale:1});
});
it('uses the current viewport size after resize for fit and arrange',()=>{
 const surface=setup();act(()=>ref.current!.fitView());const first=value('view');Object.defineProperty(surface,'clientWidth',{configurable:true,value:300});act(()=>ref.current!.fitView());expect(value('view').scale).toBeLessThan(first.scale);
 act(()=>ref.current!.arrange({columns:1,gap:30}));expect(value('nodes')[1]).toMatchObject({x:0,y:130});expect(changes).toContainEqual({reason:'arrange'});
});
it('does not resurrect a removed node during a drag and releases pointer capture',()=>{
 const surface=setup(),handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.pointerDown(handle,{pointerId:1,button:0,clientX:0,clientY:0});fireEvent.click(screen.getByText('Remove nodes'));fireEvent.pointerMove(surface,{pointerId:1,clientX:100,clientY:100});expect(value('nodes')).toEqual([]);expect(surface.releasePointerCapture).toHaveBeenCalledWith(1);
});
it('rolls back a cancelled node gesture and cleans up an active capture on unmount',()=>{
 const surface=setup(),handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.pointerDown(handle,{pointerId:1,button:0,clientX:0,clientY:0});fireEvent.pointerMove(surface,{pointerId:1,clientX:80,clientY:40});expect(value('nodes')[0].x).toBe(50);fireEvent.pointerCancel(surface,{pointerId:1});expect(value('nodes')[0]).toEqual(initial[0]);
 fireEvent.pointerDown(surface,{pointerId:2,button:0,clientX:0,clientY:0});cleanup();expect(surface.releasePointerCapture).toHaveBeenCalledWith(2);
});
it('derives every proposal from the last accepted controlled props when a parent rejects updates',()=>{
 const onView=vi.fn(),onNodes=vi.fn();render(<InfiniteCanvas ref={ref} nodes={initial} viewport={{x:0,y:0,scale:1}} onNodesChange={onNodes} onViewportChange={onView} renderNode={(_,context)=><div {...context.dragHandleProps}>Handle</div>}/>);
 fireEvent.click(screen.getByRole('button',{name:'放大画布'}));fireEvent.click(screen.getByRole('button',{name:'放大画布'}));expect(onView.mock.calls.map(call=>call[0].scale)).toEqual([1.2,1.2]);
 const handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.keyDown(handle,{key:'ArrowRight'});fireEvent.keyDown(handle,{key:'ArrowRight'});expect(onNodes.mock.calls.map(call=>call[0][0].x)).toEqual([26,26]);expect(screen.getByRole('region').querySelector('.ls-canvas-world')?.getAttribute('style')).toContain('scale(1)');
 onView.mockClear();act(()=>ref.current!.arrange());expect(onView).not.toHaveBeenCalled();
});
it('makes pointer and keyboard movement exclusive so Escape ends the active operation completely',()=>{
 const surface=setup(),handle=screen.getByRole('button',{name:'移动 Alpha'});fireEvent.keyDown(handle,{key:'Enter'});fireEvent.keyDown(handle,{key:'ArrowRight'});expect(value('nodes')[0].x).toBe(26);
 fireEvent.pointerDown(handle,{pointerId:1,button:0,clientX:0,clientY:0});expect(handle.getAttribute('aria-pressed')).toBe('false');fireEvent.pointerMove(surface,{pointerId:1,clientX:80,clientY:0});expect(value('nodes')[0].x).toBe(66);
 fireEvent.keyDown(handle,{key:'Escape'});expect(value('nodes')[0].x).toBe(26);expect(surface.getAttribute('data-gesture')).toBe('');expect(surface.releasePointerCapture).toHaveBeenCalledWith(1);
 fireEvent.pointerMove(surface,{pointerId:1,clientX:200,clientY:0});expect(value('nodes')[0].x).toBe(26);
});
it('blocks viewport shortcuts while a pointer pan is active instead of reverting an accepted zoom',()=>{
 const surface=setup();fireEvent.pointerDown(surface,{pointerId:1,button:0,clientX:0,clientY:0});fireEvent.pointerMove(surface,{pointerId:1,clientX:20,clientY:0});expect(value('view')).toEqual({x:40,y:30,scale:2});
 fireEvent.keyDown(surface,{key:'+'});fireEvent.keyDown(surface,{key:'f'});expect(value('view')).toEqual({x:40,y:30,scale:2});fireEvent.pointerMove(surface,{pointerId:1,clientX:30,clientY:0});expect(value('view')).toEqual({x:50,y:30,scale:2});
 fireEvent.pointerUp(surface,{pointerId:1});fireEvent.keyDown(surface,{key:'+'});expect(value('view').scale).toBeCloseTo(2.4);
});
