import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,act} from '@testing-library/react';
import {SplitterPreview} from '../website/splitter-preview';
import {Splitter} from '../src/Splitter';
import {freshLayout,parseLayout,splitterMemoryKey} from '../website/splitter-memory';
let measure:(entries:unknown[])=>void;
beforeEach(()=>{localStorage.removeItem(splitterMemoryKey);vi.stubGlobal('ResizeObserver',class{constructor(private callback:typeof measure){}observe(target:Element){if(target.classList.contains('ls-splitter'))measure=this.callback}disconnect(){}})});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals();localStorage.removeItem(splitterMemoryKey)});
it('restores saved vertical size and collapse on remount without narrow switches overwriting them',()=>{
 let view=render(<SplitterPreview/>);fireEvent.click(screen.getByRole('button',{name:'上下分隔'}));fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});fireEvent.keyDown(screen.getByRole('separator'),{key:'Enter'});
 const saved=localStorage.getItem(splitterMemoryKey);view.unmount();view=render(<SplitterPreview/>);expect(screen.getByRole('button',{name:'上下分隔'}).getAttribute('aria-pressed')).toBe('true');expect(screen.getByRole('button',{name:'展开任务队列'})).toBeTruthy();
 act(()=>measure([{contentRect:{width:320}}]));fireEvent.click(screen.getByRole('button',{name:'任务详情',exact:true}));expect(localStorage.getItem(splitterMemoryKey)).toBe(saved);
 act(()=>measure([{contentRect:{width:900}}]));fireEvent.click(screen.getByRole('button',{name:'展开任务队列'}));expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('70');
});
it('resets only layout preferences and preserves the current note and reset focus',()=>{
 render(<SplitterPreview/>);fireEvent.change(screen.getByRole('textbox',{name:'核对备注'}),{target:{value:'不要丢失'}});fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});
 localStorage.setItem('splitter-test-other','untouched');const reset=screen.getByRole('button',{name:'重置布局'});reset.focus();fireEvent.click(reset);
 expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('38');expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLInputElement).value).toBe('不要丢失');expect(document.activeElement).toBe(reset);expect(localStorage.getItem(splitterMemoryKey)).toBeNull();expect(localStorage.getItem('splitter-test-other')).toBe('untouched');localStorage.removeItem('splitter-test-other');
});
it('rejects corrupt/versioned records until explicitly reset and reports failed writes',()=>{
 localStorage.setItem(splitterMemoryKey,'broken');render(<SplitterPreview/>);expect(screen.getByRole('alert').textContent).toContain('无法读取');fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});expect(localStorage.getItem(splitterMemoryKey)).toBe('broken');fireEvent.click(screen.getByRole('button',{name:'重置布局'}));expect(screen.queryByRole('alert')).toBeNull();
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('denied')});fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});expect(screen.getByRole('alert').textContent).toContain('保存失败');expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('70');
 expect(()=>parseLayout(JSON.stringify({...freshLayout(),version:2}))).toThrow();
});
it('does not mutate controlled values without the caller accepting callbacks',()=>{
 const resize=vi.fn(),collapse=vi.fn();render(<Splitter primary="列表" secondary="详情" size={42} collapsed={false} onResize={resize} onCollapsedChange={collapse}/>);fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});expect(resize).toHaveBeenCalledWith(70);expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('42');fireEvent.click(screen.getByRole('button',{name:'收起列表'}));expect(collapse).toHaveBeenCalledWith(true);expect(screen.getByRole('separator')).toBeTruthy();
});
it('restores independent nested layers from a versioned record',()=>{
 const record=freshLayout();record.mode='folded';record.panels.folded={size:65,collapsed:true};record.panels['folded-inner']={size:70,collapsed:true};localStorage.setItem(splitterMemoryKey,JSON.stringify(record));
 const view=render(<SplitterPreview/>);expect(screen.getByRole('button',{name:'展开核对工作区'})).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'展开核对工作区'}));expect(screen.getByRole('button',{name:'展开任务队列'})).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'展开任务队列'}));expect(screen.getByRole('separator',{name:'调整任务队列高度'}).getAttribute('aria-valuenow')).toBe('70');expect(screen.getByRole('separator',{name:'调整核对工作区宽度'}).getAttribute('aria-valuenow')).toBe('65');view.unmount();render(<SplitterPreview/>);expect(screen.getAllByRole('separator')).toHaveLength(2);
});
it('resets a narrow secondary view to the first panel while keeping reset focus',()=>{
 render(<SplitterPreview/>);act(()=>measure([{contentRect:{width:320}}]));fireEvent.click(screen.getByRole('button',{name:'任务详情',exact:true}));fireEvent.change(screen.getByRole('textbox',{name:'核对备注'}),{target:{value:'窄屏备注'}});
 const reset=screen.getByRole('button',{name:'重置布局'});reset.focus();fireEvent.click(reset);act(()=>measure([{contentRect:{width:320}}]));
 expect(screen.getByRole('button',{name:'任务队列',exact:true}).getAttribute('aria-pressed')).toBe('true');expect(document.activeElement).toBe(reset);expect(screen.queryByRole('textbox',{name:'核对备注'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'任务详情',exact:true}));expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLInputElement).value).toBe('窄屏备注');
});
it('keeps stored nested state and focus when reset fails, then clears every layer on retry',()=>{
 const saved=freshLayout();saved.mode='folded';saved.panels.folded={size:65,collapsed:true};saved.panels['folded-inner']={size:70,collapsed:true};localStorage.setItem(splitterMemoryKey,JSON.stringify(saved));render(<SplitterPreview/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));const reset=screen.getByRole('button',{name:'重置布局'});reset.focus();fireEvent.click(reset);
 expect(screen.getByRole('alert').textContent).toContain('无法清除');expect(document.activeElement).toBe(reset);expect(localStorage.getItem(splitterMemoryKey)).toBe(JSON.stringify(saved));expect(screen.getByRole('button',{name:'展开核对工作区'})).toBeTruthy();
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));reset.focus();fireEvent.click(reset);expect(screen.queryByRole('alert')).toBeNull();expect(document.activeElement).toBe(reset);expect(localStorage.getItem(splitterMemoryKey)).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'多层折叠'}));expect(screen.getByRole('separator',{name:'调整核对工作区宽度'}).getAttribute('aria-valuenow')).toBe('65');expect(screen.getByRole('separator',{name:'调整任务队列高度'}).getAttribute('aria-valuenow')).toBe('38');
});
it('allows saving again after storage recovers without reverting the in-memory layout',()=>{
 render(<SplitterPreview/>);fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});expect(localStorage.getItem(splitterMemoryKey)).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));fireEvent.keyDown(screen.getByRole('separator'),{key:'ArrowLeft'});expect(parseLayout(localStorage.getItem(splitterMemoryKey)).panels.horizontal.size).toBe(68);expect(screen.queryByRole('alert')).toBeNull();
});
function externalLayout(raw:string|null){
 if(raw===null)localStorage.removeItem(splitterMemoryKey);else localStorage.setItem(splitterMemoryKey,raw);
 act(()=>window.dispatchEvent(new StorageEvent('storage',{key:splitterMemoryKey,storageArea:localStorage,newValue:raw})));
}
it('defers external changes without stealing focus and applies the latest nested record',()=>{
 render(<SplitterPreview/>);const note=screen.getByRole('textbox',{name:'核对备注'});note.focus();fireEvent.change(note,{target:{value:'保留备注'}});
 const first=freshLayout();first.mode='vertical';externalLayout(JSON.stringify(first));
 expect(document.activeElement).toBe(note);expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
 const latest=freshLayout();latest.mode='folded';latest.panels['folded-inner']={size:68,collapsed:true};externalLayout(JSON.stringify(latest));
 const apply=screen.getByRole('button',{name:'应用其他标签页布局'});apply.focus();fireEvent.click(apply);
 expect(document.activeElement).toBe(apply);expect(apply.getAttribute('aria-disabled')).toBe('true');expect(screen.getByRole('button',{name:'展开任务队列'})).toBeTruthy();expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLTextAreaElement).value).toBe('保留备注');
 expect(localStorage.getItem(splitterMemoryKey)).toBe(JSON.stringify(latest));
});
it('ignores stale event payloads after rapid switching and repeated resets',()=>{
 render(<SplitterPreview/>);
 for(let i=0;i<3;i++){fireEvent.click(screen.getByRole('button',{name:'嵌套工作台'}));fireEvent.click(screen.getByRole('button',{name:'上下分隔'}));fireEvent.click(screen.getByRole('button',{name:'重置布局'}))}
 const reset=screen.getByRole('button',{name:'重置布局'});reset.focus();
 act(()=>window.dispatchEvent(new StorageEvent('storage',{key:splitterMemoryKey,storageArea:localStorage,newValue:JSON.stringify({...freshLayout(),mode:'nested'})})));
 expect(screen.getByRole('button',{name:'应用其他标签页布局'}).getAttribute('aria-disabled')).toBe('true');
 expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('38');expect(localStorage.getItem(splitterMemoryKey)).toBeNull();expect(document.activeElement).toBe(reset);
});
it('applies an external reset in narrow view and preserves toolbar focus',()=>{
 render(<SplitterPreview/>);fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});act(()=>measure([{contentRect:{width:320}}]));fireEvent.click(screen.getByRole('button',{name:'任务详情',exact:true}));
 externalLayout(null);const apply=screen.getByRole('button',{name:'应用其他标签页布局'});apply.focus();fireEvent.click(apply);act(()=>measure([{contentRect:{width:320}}]));
 expect(screen.getByRole('button',{name:'任务队列',exact:true}).getAttribute('aria-pressed')).toBe('true');expect(document.activeElement).toBe(apply);expect(localStorage.getItem(splitterMemoryKey)).toBeNull();
});
it('retains layout on corrupt external data and recovers without echo writes',()=>{
 render(<SplitterPreview/>);externalLayout('broken');const apply=screen.getByRole('button',{name:'应用其他标签页布局'});apply.focus();fireEvent.click(apply);
 expect(screen.getByRole('alert').textContent).toContain('无法应用');expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('38');expect(document.activeElement).toBe(apply);
 const saved=freshLayout();saved.panels.horizontal.size=64;externalLayout(JSON.stringify(saved));const write=vi.spyOn(Storage.prototype,'setItem');fireEvent.click(apply);
 expect(write).not.toHaveBeenCalled();expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('64');expect(screen.queryByRole('alert')).toBeNull();
});
it('detects an external write before its event arrives and keeps the local draft',()=>{
 render(<SplitterPreview/>);const remote=freshLayout();remote.mode='vertical';localStorage.setItem(splitterMemoryKey,JSON.stringify(remote));
 fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});
 expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('70');expect(localStorage.getItem(splitterMemoryKey)).toBe(JSON.stringify(remote));
 const save=screen.getByRole('button',{name:'保存本页布局并覆盖外部布局'});save.focus();fireEvent.click(save);
 expect(parseLayout(localStorage.getItem(splitterMemoryKey)).panels.horizontal.size).toBe(70);expect(document.activeElement).toBe(save);
});
it('retries a failed nested draft after storage recovers without losing collapse or focus',()=>{
 render(<SplitterPreview/>);fireEvent.click(screen.getByRole('button',{name:'多层折叠'}));
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));
 fireEvent.keyDown(screen.getByRole('separator',{name:'调整任务队列高度'}),{key:'End'});
 fireEvent.click(screen.getByRole('button',{name:'收起任务队列'}));
 expect(parseLayout(localStorage.getItem(splitterMemoryKey)).panels['folded-inner'].collapsed).toBe(false);
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));const save=screen.getByRole('button',{name:'重试保存本页布局'});save.focus();fireEvent.click(save);
 expect(parseLayout(localStorage.getItem(splitterMemoryKey)).panels['folded-inner']).toEqual({size:70,collapsed:true});expect(document.activeElement).toBe(save);expect(save.getAttribute('aria-disabled')).toBe('true');
});
it('explicitly discards a failed draft when applying external nested collapse and keeps notes',()=>{
 render(<SplitterPreview/>);fireEvent.change(screen.getByRole('textbox',{name:'核对备注'}),{target:{value:'本页备注'}});
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));fireEvent.keyDown(screen.getByRole('separator'),{key:'End'});
 const remote=freshLayout();remote.mode='folded';remote.panels['folded-inner']={size:62,collapsed:true};externalLayout(JSON.stringify(remote));
 let apply=screen.getByRole('button',{name:'放弃未保存布局并应用外部布局'});apply.focus();fireEvent.click(apply);
 expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('70');expect(document.activeElement).toBe(apply);
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟布局存储失败'}));apply.focus();fireEvent.click(apply);
 expect(document.activeElement).toBe(apply);expect(screen.getByRole('button',{name:'展开任务队列'})).toBeTruthy();expect((screen.getByRole('textbox',{name:'核对备注'}) as HTMLTextAreaElement).value).toBe('本页备注');
 expect(localStorage.getItem(splitterMemoryKey)).toBe(JSON.stringify(remote));
});
