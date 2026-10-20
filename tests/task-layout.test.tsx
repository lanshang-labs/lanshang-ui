import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {LayoutPreview} from '../website/layout-preview';
import {queueJournalKey} from '../website/task-queue-preview';
afterEach(()=>{cleanup();sessionStorage.removeItem(queueJournalKey);vi.useRealTimers()});
function chooseLayout(label:string){fireEvent.mouseDown(screen.getByRole('combobox',{name:'布局示例切换'}));fireEvent.click(screen.getByText(label,{selector:'.ant-select-item-option-content'}));}
it('preserves a confirmed queue operation when navigating layout examples',()=>{
 vi.useFakeTimers();render(<LayoutPreview/>);
 chooseLayout('任务队列');
 fireEvent.click(screen.getByRole('button',{name:'暂停',exact:true}));
 act(()=>vi.advanceTimersByTime(500));
 expect(screen.getByRole('button',{name:'恢复',exact:true})).toBeTruthy();
 chooseLayout('任务进度');
 chooseLayout('任务队列');
 expect(screen.getByRole('button',{name:'恢复',exact:true})).toBeTruthy();
 expect(screen.queryByRole('button',{name:'暂停',exact:true})).toBeNull();
});
it('keeps cancellation safe and returns focus after leaving the inline confirmation',()=>{
 vi.useFakeTimers();render(<LayoutPreview/>);
 chooseLayout('任务队列');
 fireEvent.click(screen.getByRole('checkbox',{name:'选择全部可操作任务'}));
 const cancel=screen.getByRole('button',{name:'批量取消 (2)'});cancel.focus();fireEvent.click(cancel);
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'返回队列'}));
 fireEvent.keyDown(document.activeElement!,{key:'Escape'});
 expect(document.activeElement).toBe(cancel);
 expect(screen.queryByRole('group',{name:'取消任务确认'})).toBeNull();
 expect(screen.getByRole('button',{name:'暂停',exact:true})).toBeTruthy();
});
