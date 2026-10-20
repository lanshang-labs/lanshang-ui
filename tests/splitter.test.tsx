import {SplitterPreview} from '../website/splitter-preview';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,act,cleanup} from '@testing-library/react';
import {Splitter} from '../src/Splitter';
let measure:(entries:unknown[])=>void;
beforeEach(()=>{vi.stubGlobal('ResizeObserver',class{constructor(private callback:typeof measure){}observe(target:Element){if(target.classList.contains('ls-splitter'))measure=this.callback}disconnect(){}})});
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks()});
const content={primary:<input aria-label="列表搜索" defaultValue="保留搜索"/>,secondary:<input aria-label="详情备注" defaultValue="保留备注"/>};
it('clamps keyboard adjustments and restores the prior size after collapsing',()=>{
 const resize=vi.fn();render(<Splitter {...content} onResize={resize}/>);const handle=screen.getByRole('separator');handle.focus();
 fireEvent.keyDown(handle,{key:'ArrowRight'});expect(handle.getAttribute('aria-valuenow')).toBe('40');
 fireEvent.keyDown(handle,{key:'ArrowLeft',shiftKey:true});expect(handle.getAttribute('aria-valuenow')).toBe('30');
 fireEvent.keyDown(handle,{key:'End'});fireEvent.keyDown(handle,{key:'ArrowRight'});expect(handle.getAttribute('aria-valuenow')).toBe('70');
 fireEvent.keyDown(handle,{key:'Home'});expect(handle.getAttribute('aria-valuenow')).toBe('25');
 fireEvent.keyDown(handle,{key:'Enter'});expect(screen.queryByRole('textbox',{name:'列表搜索'})).toBeNull();expect(document.activeElement).toBe(screen.getByRole('button',{name:'展开列表'}));
 fireEvent.click(screen.getByRole('button',{name:'展开列表'}));expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('25');expect(resize).toHaveBeenCalledWith(25);
});
it('preserves both inputs across narrow switches and moves focus out of hidden content',()=>{
 render(<Splitter {...content}/>);const note=screen.getByRole('textbox',{name:'详情备注'});note.focus();
 act(()=>measure([{contentRect:{width:320}}]));expect(document.activeElement).toBe(screen.getByRole('button',{name:'列表'}));expect(screen.queryByRole('separator')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'详情'}));expect(screen.getByRole('textbox',{name:'详情备注'})).toBe(note);expect((note as HTMLInputElement).value).toBe('保留备注');
 act(()=>measure([{contentRect:{width:900}}]));expect(screen.getByRole('textbox',{name:'列表搜索'})).toBeTruthy();expect(screen.getByRole('separator')).toBeTruthy();
});
it('drags within constraints and stops changing after pointer cancellation',()=>{
 vi.stubGlobal('PointerEvent',MouseEvent);const {container}=render(<Splitter {...content}/>);const host=container.querySelector('.ls-splitter')!;vi.spyOn(host,'getBoundingClientRect').mockReturnValue({left:0,width:1000} as DOMRect);
 const handle=screen.getByRole('separator');Object.assign(handle,{setPointerCapture:vi.fn(),releasePointerCapture:vi.fn()});
 fireEvent.pointerDown(handle,{button:0,clientX:380});fireEvent.pointerMove(handle,{clientX:520});expect(handle.getAttribute('aria-valuenow')).toBe('52');
 fireEvent.pointerMove(handle,{clientX:999});expect(handle.getAttribute('aria-valuenow')).toBe('70');fireEvent.pointerCancel(handle);fireEvent.pointerMove(handle,{clientX:100});expect(handle.getAttribute('aria-valuenow')).toBe('70');
});
it('keeps task-specific notes when selecting another task and returning',async()=>{
 render(<SplitterPreview/>);
 fireEvent.change(screen.getByRole('textbox',{name:'核对备注'}),{target:{value:'第一项备注'}});
 fireEvent.click(screen.getByRole('button',{name:'任务 02 · 核对原始素材'}));expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLInputElement).value).toBe('');
 fireEvent.click(screen.getByRole('button',{name:'任务 01 · 生成项目预览'}));expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLInputElement).value).toBe('第一项备注');
});
it('returns focus from removed controls and retains collapsed desktop state across breakpoints',()=>{
 render(<Splitter {...content}/>);const handle=screen.getByRole('separator');handle.focus();fireEvent.keyDown(handle,{key:'ArrowRight',shiftKey:true});fireEvent.keyDown(handle,{key:'Enter'});
 act(()=>measure([{contentRect:{width:320}}]));expect(document.activeElement).toBe(screen.getByRole('button',{name:'列表'}));
 const detail=screen.getByRole('button',{name:'详情'});detail.focus();fireEvent.click(detail);
 act(()=>measure([{contentRect:{width:900}}]));expect(document.activeElement).toBe(screen.getByRole('button',{name:'展开列表'}));expect(screen.queryByRole('textbox',{name:'列表搜索'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'展开列表'}));expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('48');
});
it('does not jump on a stationary pointer release and ignores a cancelled drag after a breakpoint change',()=>{
 vi.stubGlobal('PointerEvent',MouseEvent);const {container}=render(<Splitter {...content}/>);vi.spyOn(container.querySelector('.ls-splitter')!,'getBoundingClientRect').mockReturnValue({left:100,width:1000} as DOMRect);
 let handle=screen.getByRole('separator');Object.assign(handle,{setPointerCapture:vi.fn(),releasePointerCapture:vi.fn()});
 fireEvent.pointerDown(handle,{button:0,clientX:485});fireEvent.pointerUp(handle,{clientX:485});expect(handle.getAttribute('aria-valuenow')).toBe('38');
 fireEvent.pointerDown(handle,{button:0,clientX:485});act(()=>measure([{contentRect:{width:320}}]));act(()=>measure([{contentRect:{width:900}}]));handle=screen.getByRole('separator');fireEvent.pointerMove(handle,{clientX:800});expect(handle.getAttribute('aria-valuenow')).toBe('38');
});
it('uses the visible clamped size for keys after constraints change without stealing external focus',()=>{
 const {rerender}=render(<><button>外部操作</button><Splitter {...content} defaultSize={65}/></>);const outside=screen.getByRole('button',{name:'外部操作'});outside.focus();
 rerender(<><button>外部操作</button><Splitter {...content} defaultSize={65} max={50}/></>);fireEvent.keyDown(screen.getByRole('separator'),{key:'ArrowLeft'});expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('48');
 act(()=>measure([{contentRect:{width:320}}]));expect(document.activeElement).toBe(outside);
});
it('uses vertical drag distance and axis-specific keys with collapse restoration',()=>{
 vi.stubGlobal('PointerEvent',MouseEvent);render(<Splitter {...content} orientation="vertical"/>);const handle=screen.getByRole('separator');expect(handle.getAttribute('aria-orientation')).toBe('horizontal');
 vi.spyOn(handle.parentElement!,'getBoundingClientRect').mockReturnValue({height:500} as DOMRect);Object.assign(handle,{setPointerCapture:vi.fn(),releasePointerCapture:vi.fn()});
 fireEvent.pointerDown(handle,{button:0,clientY:200});fireEvent.pointerMove(handle,{clientY:300});expect(handle.getAttribute('aria-valuenow')).toBe('58');fireEvent.pointerUp(handle,{clientY:900});expect(handle.getAttribute('aria-valuenow')).toBe('70');
 fireEvent.keyDown(handle,{key:'ArrowLeft'});expect(handle.getAttribute('aria-valuenow')).toBe('70');fireEvent.keyDown(handle,{key:'ArrowUp',shiftKey:true});expect(handle.getAttribute('aria-valuenow')).toBe('60');
 fireEvent.keyDown(handle,{key:'Enter'});fireEvent.click(screen.getByRole('button',{name:'展开列表'}));expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('60');
});
it('keeps nested sizes and form data while the parent is collapsed',()=>{
 render(<Splitter primary={<p>目录</p>} secondary={<Splitter orientation="vertical" primaryLabel="预览" secondaryLabel="日志" {...content}/>}/>);
 const inner=screen.getByRole('separator',{name:'调整预览高度'}),outer=screen.getByRole('separator',{name:'调整列表宽度'});fireEvent.keyDown(inner,{key:'ArrowDown'});expect(outer.getAttribute('aria-valuenow')).toBe('38');
 fireEvent.keyDown(inner,{key:'Enter'});expect(document.activeElement).toBe(screen.getByRole('button',{name:'展开预览'}));fireEvent.keyDown(outer,{key:'End'});expect(outer.getAttribute('aria-valuenow')).toBe('70');fireEvent.keyDown(outer,{key:'Enter'});expect(screen.queryByRole('separator',{name:'调整列表宽度'})).toBeNull();fireEvent.click(screen.getByRole('button',{name:'展开列表'}));expect(screen.getByRole('separator',{name:'调整列表宽度'}).getAttribute('aria-valuenow')).toBe('70');
 fireEvent.click(screen.getByRole('button',{name:'展开预览'}));expect(screen.getByRole('separator',{name:'调整预览高度'}).getAttribute('aria-valuenow')).toBe('40');expect((screen.getByRole('textbox',{name:'详情备注'}) as HTMLInputElement).value).toBe('保留备注');
});
it('preserves an inner collapsed panel and its size when the parent hides and restores it',()=>{
 render(<Splitter primaryLabel="工作区" secondaryLabel="记录" primary={<Splitter orientation="vertical" primaryLabel="内层列表" secondaryLabel="内层详情" {...content}/>} secondary={<p>记录</p>}/>);
 fireEvent.change(screen.getByRole('textbox',{name:'详情备注'}),{target:{value:'跨层保留'}});
 const inner=screen.getByRole('separator',{name:'调整内层列表高度'});fireEvent.keyDown(inner,{key:'End'});fireEvent.keyDown(inner,{key:'Enter'});
 fireEvent.click(screen.getByRole('button',{name:'收起工作区'}));expect(screen.queryByRole('button',{name:'展开内层列表'})).toBeNull();expect(screen.queryByRole('textbox',{name:'详情备注'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'展开工作区'}));expect(screen.getByRole('button',{name:'展开内层列表'})).toBeTruthy();expect((screen.getByRole('textbox',{name:'详情备注'}) as HTMLInputElement).value).toBe('跨层保留');
 fireEvent.click(screen.getByRole('button',{name:'展开内层列表'}));expect(screen.getByRole('separator',{name:'调整内层列表高度'}).getAttribute('aria-valuenow')).toBe('70');
});
it('makes visible content keyboard reachable and cancels drags when hidden by an ancestor',()=>{
 vi.stubGlobal('PointerEvent',MouseEvent);const {container}=render(<Splitter {...content}/>);const host=container.querySelector('.ls-splitter')!;vi.spyOn(host,'getBoundingClientRect').mockReturnValue({width:1000} as DOMRect);
 expect(screen.getByRole('region',{name:'列表'}).tabIndex).toBe(0);const handle=screen.getByRole('separator');Object.assign(handle,{setPointerCapture:vi.fn()});fireEvent.pointerDown(handle,{button:0,clientX:380});
 act(()=>measure([{contentRect:{width:0}}]));act(()=>measure([{contentRect:{width:1000}}]));fireEvent.pointerMove(handle,{clientX:800});expect(handle.getAttribute('aria-valuenow')).toBe('38');
 act(()=>measure([{contentRect:{width:320}}]));expect(screen.queryByRole('region',{name:'详情'})).toBeNull();expect(container.querySelector('[hidden]')?.getAttribute('tabindex')).toBe('-1');
});
