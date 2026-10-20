import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {AsyncActionDemo} from '../examples/AsyncActionDemo';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('keeps input through failure, blocks duplicate submits, then recovers',()=>{
 vi.useFakeTimers();render(<AsyncActionDemo/>);
 const input=screen.getByRole('textbox',{name:'异步项目名称'}) as HTMLInputElement;
 fireEvent.change(input,{target:{value:'保留草稿'}});
 const form=screen.getByRole('form',{name:'异步保存示例'});
 fireEvent.submit(form);const scheduled=vi.getTimerCount();fireEvent.submit(form);
 expect(vi.getTimerCount()).toBe(scheduled);
 expect(form.getAttribute('aria-busy')).toBe('true');expect(input.disabled).toBe(true);
 act(()=>vi.advanceTimersByTime(900));
 expect(screen.getByRole('alert').textContent).toContain('保存失败');expect(input.value).toBe('保留草稿');expect(input.disabled).toBe(false);
 fireEvent.click(screen.getByRole('switch',{name:'模拟请求失败'}));fireEvent.submit(form);
 expect(screen.queryByRole('alert')).toBeNull();
 act(()=>vi.advanceTimersByTime(900));expect(screen.getByRole('status').textContent).toContain('已保存：保留草稿');
});
