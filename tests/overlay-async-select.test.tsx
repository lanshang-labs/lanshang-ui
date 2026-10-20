import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {OverlayAsyncSelectPreview} from '../website/overlay-async-select-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
async function tick(ms=700){await act(async()=>vi.advanceTimersByTimeAsync(ms))}
for(const kind of ['Modal','Drawer'])it(`${kind} preserves selection and query through failure, retry, keyboard selection and clear`,async()=>{
 vi.useFakeTimers();render(<OverlayAsyncSelectPreview/>);
 const trigger=screen.getByRole('button',{name:`${kind} 异步多选`});fireEvent.click(trigger);
 expect(screen.getByText('正在读取团队')).toBeTruthy();await tick();expect(screen.getByRole('alert').textContent).toContain('已选项已保留');expect(screen.getByRole('alert').closest('.ls-feedback-panel')?.getAttribute('data-variant')).toBe('inline');
 const select=screen.getByRole('combobox',{name:'协作团队'});fireEvent.change(select,{target:{value:'内容'}});
 const retry=screen.getByRole('button',{name:'重试读取'});retry.focus();fireEvent.click(retry);expect(retry.getAttribute('aria-disabled')).toBe('true');fireEvent.click(retry);await tick();expect(document.activeElement).toBe(retry);expect((select as HTMLInputElement).value).toBe('内容');
 fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();fireEvent.keyDown(select,{key:'Enter',keyCode:13});await tick();expect(screen.getByText('已选 2 个团队：设计团队、内容团队')).toBeTruthy();
 fireEvent.keyDown(select,{key:'Escape',keyCode:27});await tick();expect(select.getAttribute('aria-expanded')).toBe('false');expect(document.activeElement).toBe(select);
 fireEvent.click(screen.getByRole('button',{name:'清空已选团队'}));await tick();expect(screen.getByText('已选 0 个团队：暂无选择')).toBeTruthy();expect(document.activeElement).toBe(select);
 fireEvent.click(screen.getByRole('button',{name:'完成选择'}));await tick();expect(document.activeElement).toBe(trigger);
});
it('distinguishes no matches from loading failure and never selects an archived team',async()=>{
 vi.useFakeTimers();render(<OverlayAsyncSelectPreview/>);fireEvent.click(screen.getByRole('button',{name:'Modal 异步多选'}));await tick();fireEvent.click(screen.getByRole('button',{name:'重试读取'}));await tick();const select=screen.getByRole('combobox',{name:'协作团队'});
 fireEvent.change(select,{target:{value:'不存在'}});await tick();expect(screen.getByText('没有匹配的团队，请修改关键词。')).toBeTruthy();
 fireEvent.change(select,{target:{value:'归档'}});await tick();const disabled=screen.getByRole('option',{name:'归档团队（不可选）'});expect(disabled.getAttribute('aria-disabled')).toBe('true');fireEvent.click(disabled);fireEvent.keyDown(select,{key:'Enter',keyCode:13});await tick();expect(screen.getByText('已选 1 个团队：设计团队')).toBeTruthy();
 fireEvent.keyDown(select,{key:'Tab'});await tick();expect(select.getAttribute('aria-expanded')).toBe('false');
});
it('cancels pending reads on close and starts a fresh session on reopen',async()=>{
 vi.useFakeTimers();render(<OverlayAsyncSelectPreview/>);fireEvent.click(screen.getByRole('button',{name:'Drawer 异步多选'}));await tick(100);fireEvent.click(screen.getByRole('button',{name:'完成选择'}));await tick();expect(screen.queryByRole('alert')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Drawer 异步多选'}));expect(screen.getByText('正在读取团队')).toBeTruthy();await tick();expect(screen.getByRole('alert')).toBeTruthy();
});
it('supports native clear and Backspace without clearing the saved options',async()=>{
 vi.useFakeTimers();const view=render(<OverlayAsyncSelectPreview/>);fireEvent.click(screen.getByRole('button',{name:'Modal 异步多选'}));await tick();fireEvent.click(screen.getByRole('button',{name:'重试读取'}));await tick();const select=screen.getByRole('combobox',{name:'协作团队'});
 fireEvent.keyDown(select,{key:'Backspace',keyCode:8});await tick();expect(screen.getByText('已选 0 个团队：暂无选择')).toBeTruthy();fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});await tick();fireEvent.click(screen.getByRole('option',{name:'内容团队'}));await tick();expect(screen.getByText('已选 1 个团队：内容团队')).toBeTruthy();
 const clear=view.baseElement.querySelector('.ant-select-clear')!;expect(clear).toBeTruthy();fireEvent.mouseDown(clear);await tick();expect(screen.getByText('已选 0 个团队：暂无选择')).toBeTruthy();expect(screen.getByText('团队选项已更新。')).toBeTruthy();
});
