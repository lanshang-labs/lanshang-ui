import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {RemoteSelectPreview} from '../website/remote-select-preview';
afterEach(()=>{cleanup();vi.useRealTimers();localStorage.removeItem('lanshang.remote-select.demo.v1')});
async function tick(ms=700){await act(async()=>vi.advanceTimersByTimeAsync(ms))}
async function begin(){vi.useFakeTimers();render(<RemoteSelectPreview/>);fireEvent.click(screen.getByRole('button',{name:'远程搜索与分页'}));await tick();return screen.getByRole('combobox',{name:'远程团队'})}
it('ignores out-of-order search and a stale page after new input',async()=>{
 const select=await begin();fireEvent.click(screen.getByRole('button',{name:'加载更多'}));fireEvent.change(select,{target:{value:'研'}});await tick(260);fireEvent.change(select,{target:{value:'设计'}});await tick(610);expect(screen.getByText('已加载 6 / 12 项')).toBeTruthy();await tick(600);expect(screen.getByText('已加载 6 / 12 项')).toBeTruthy();fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();expect(screen.queryByRole('option',{name:'研发团队 02'})).toBeNull();expect(screen.getByRole('option',{name:'设计团队 01'})).toBeTruthy();
});
it('retries the failed page without duplicate appends and preserves cross-query selection',async()=>{
 const select=await begin();fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();fireEvent.click(screen.getByRole('option',{name:'设计团队 01'}));fireEvent.click(screen.getByRole('checkbox',{name:'下一页模拟失败'}));fireEvent.click(screen.getByRole('button',{name:'加载更多'}));await tick();expect(screen.getByRole('alert').closest('.ls-feedback-panel')?.getAttribute('data-variant')).toBe('inline');const retry=screen.getByRole('button',{name:'重试加载'});fireEvent.click(retry);fireEvent.click(retry);await tick();expect(screen.getByText('已加载 12 / 36 项')).toBeTruthy();fireEvent.change(select,{target:{value:'不存在'}});await tick();expect(screen.getByText('已加载 0 / 0 项')).toBeTruthy();expect(screen.getByText('已选团队：设计团队 01')).toBeTruthy();
});
it('restores selected IDs after remount and clear persists',async()=>{
 const select=await begin();fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();fireEvent.click(screen.getByRole('option',{name:'内容团队 03'}));cleanup();render(<RemoteSelectPreview/>);fireEvent.click(screen.getByRole('button',{name:'远程搜索与分页'}));expect(screen.getByText('已选团队：内容团队 03')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'清空远程选择'}));expect(localStorage.getItem('lanshang.remote-select.demo.v1')).toBe('[]');await tick();expect(screen.getByText('已选团队：暂无选择')).toBeTruthy();
});
it('debounces rapid input and closes only the list on Escape',async()=>{
 const select=await begin();for(const q of ['设','设计','设计团队']){fireEvent.change(select,{target:{value:q}});await tick(80)}await tick();expect(screen.getByText('已加载 6 / 12 项')).toBeTruthy();fireEvent.keyDown(select,{key:'Escape',keyCode:27});await tick();expect(select.getAttribute('aria-expanded')).toBe('false');expect(screen.getByRole('button',{name:'关闭远程搜索'})).toBeTruthy();fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();fireEvent.keyDown(select,{key:'Tab'});await tick();expect(select.getAttribute('aria-expanded')).toBe('false');
});
