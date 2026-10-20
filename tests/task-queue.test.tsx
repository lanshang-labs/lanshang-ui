import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {initialTasks,applyCommand,applyBatch,startNext} from '../website/task-queue-model';
import {queueJournalKey,TaskQueuePreview} from '../website/task-queue-preview';
afterEach(()=>{cleanup();sessionStorage.removeItem(queueJournalKey);vi.useRealTimers()});
it('pauses and resumes the same stage without starting successors',()=>{
 let tasks=initialTasks();tasks=applyCommand(tasks,'task-1','pause');
 expect(tasks.map(t=>t.status)).toEqual(['done','paused','queued']);
 expect(applyCommand(tasks,'task-1','complete')).toBe(tasks);
 tasks=applyCommand(tasks,'task-1','resume');expect(tasks.map(t=>t.status)).toEqual(['done','running','queued']);
});
it('retries only a failed task and completes the queue explicitly',()=>{
 let tasks=applyCommand(initialTasks(),'task-1','fail');
 tasks=applyCommand(tasks,'task-1','retry');
 expect(tasks.map(t=>t.attempt)).toEqual([1,2,1]);
 expect(applyCommand(tasks,'task-1','retry')).toBe(tasks);
 tasks=applyCommand(tasks,'task-1','complete');expect(tasks.map(t=>t.status)).toEqual(['done','done','running']);
 tasks=applyCommand(tasks,'task-2','complete');expect(tasks.every(t=>t.status==='done')).toBe(true);
});
it('waits for acknowledgement, rejects duplicate commands and resumes',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 const pause=screen.getByRole('button',{name:'暂停',exact:true});fireEvent.click(pause);fireEvent.click(pause);
 expect(screen.queryByRole('button',{name:'恢复',exact:true})).toBeNull();
 act(()=>vi.advanceTimersByTime(450));
 fireEvent.click(screen.getByRole('button',{name:'恢复',exact:true}));
 act(()=>vi.advanceTimersByTime(450));expect(screen.getByRole('button',{name:'暂停',exact:true})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'模拟当前步骤失败'}));act(()=>vi.advanceTimersByTime(450));
 fireEvent.click(screen.getByRole('button',{name:'重试失败任务'}));act(()=>vi.advanceTimersByTime(450));
 expect(screen.getByText('第 2 次执行')).toBeTruthy();
});
it('cancels stale acknowledgements when switching examples or resetting',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('button',{name:'暂停',exact:true}));
 fireEvent.click(screen.getByRole('button',{name:'重置样例'}));act(()=>vi.advanceTimersByTime(500));
 expect(screen.queryByRole('button',{name:'恢复',exact:true})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'模拟当前步骤失败'}));
 fireEvent.click(screen.getByRole('button',{name:'重置样例'}));act(()=>vi.advanceTimersByTime(500));
 expect(screen.queryByRole('button',{name:'重试失败任务'})).toBeNull();
 expect(screen.getByRole('button',{name:'暂停',exact:true})).toBeTruthy();
});

it('batch operations preserve terminal tasks and respect paused predecessors',()=>{
 let tasks=initialTasks(true);
 tasks=applyBatch(tasks,tasks.map(t=>t.id),'pause');expect(tasks.every(t=>t.status==='paused')).toBe(true);
 tasks=applyBatch(tasks,['task-2'],'resume');expect(tasks.map(t=>t.status)).toEqual(['paused','paused','queued']);
 tasks=applyBatch(tasks,['task-0','task-1'],'resume');expect(tasks.map(t=>t.status)).toEqual(['running','queued','queued']);
 tasks=applyBatch(tasks,['task-0'],'cancel');expect(tasks[1].status).toBe('queued');
 tasks=startNext(tasks);expect(tasks[1].status).toBe('running');
 expect(applyBatch(tasks,['task-0'],'retry')[0].status).toBe('cancelled');
});
it('requires cancellation confirmation and preserves completed results',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'选择全部可操作任务'}));
 fireEvent.click(screen.getByRole('button',{name:'批量取消 (2)'}));
 expect(screen.getByText('确认取消 2 项任务？')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'返回队列'}));expect(screen.queryByText('队列已结束')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'批量取消 (2)'}));
 fireEvent.click(screen.getByRole('button',{name:'确认取消'}));act(()=>vi.advanceTimersByTime(450));
 expect(screen.getByText(/队列已结束/)).toBeTruthy();expect(screen.getAllByText('已取消').length).toBeGreaterThan(0);
 expect(screen.getByText('检查输入素材')).toBeTruthy();
});
it('retains rejected batch targets and retries without changing completed tasks',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'选择全部可操作任务'}));
 fireEvent.click(screen.getByRole('checkbox',{name:'下一次管理操作模拟失败'}));
 fireEvent.click(screen.getByRole('button',{name:'批量暂停 (2)'}));act(()=>vi.advanceTimersByTime(450));
 expect(screen.getByRole('alert').textContent).toContain('任务未修改');
 expect(screen.getByText('已选择 2 项')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'重试原操作'}));act(()=>vi.advanceTimersByTime(450));
 expect(screen.queryByRole('alert')).toBeNull();expect(screen.getAllByRole('button',{name:'恢复',exact:true})).toHaveLength(2);
 expect(screen.getByText('已选择 0 项')).toBeTruthy();
});

it.each(['cancel','pause','retry'] as const)('restores %s receipts and applies each original command once across refreshes',(action)=>{
 vi.useFakeTimers();const tasks=initialTasks(true);if(action==='retry')tasks[0].status='failed';
 sessionStorage.setItem(queueJournalKey,JSON.stringify({version:1,queue:true,tasks,operation:{id:'same-command',ids:action==='retry'?['task-0']:['task-0','task-1'],action,receipt:'applied',phase:'unknown'}}));
 const first=render(<TaskQueuePreview/>);
 expect(screen.getByRole('button',{name:'串行任务队列'}).hasAttribute('disabled')).toBe(true);
 const before=sessionStorage.getItem(queueJournalKey);first.unmount();const second=render(<TaskQueuePreview/>);
 expect(sessionStorage.getItem(queueJournalKey)).toBe(before);
 fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 const after=JSON.parse(sessionStorage.getItem(queueJournalKey)!);
 expect(after.operation.id).toBe('same-command');expect(after.operation.phase).toBe('confirmed');
 expect(after.tasks[0].status).toBe(action==='cancel'?'cancelled':action==='pause'?'paused':'running');
 expect(after.tasks[0].attempt).toBe(action==='retry'?2:1);
 second.unmount();render(<TaskQueuePreview/>);expect(JSON.parse(sessionStorage.getItem(queueJournalKey)!)).toEqual(after);
 expect(screen.queryByRole('button',{name:'核对原命令回执'})).toBeNull();
});
it('journals an actual retry before acknowledgement and restores without resend',()=>{
 vi.useFakeTimers();let view=render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('button',{name:'模拟当前步骤失败'}));act(()=>vi.advanceTimersByTime(450));
 fireEvent.click(screen.getByRole('button',{name:'重试失败任务'}));
 const original=JSON.parse(sessionStorage.getItem(queueJournalKey)!);expect(original.operation.action).toBe('retry');expect(original.tasks[1].attempt).toBe(1);
 view.unmount();view=render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 expect(JSON.parse(sessionStorage.getItem(queueJournalKey)!).tasks[1].attempt).toBe(2);
});
it('focuses the safe cancel choice and returns to the invoking button with Escape',()=>{
 render(<TaskQueuePreview/>);
 const origin=screen.getAllByRole('button',{name:'取消任务'})[0];origin.focus();fireEvent.click(origin);
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'返回队列'}));
 fireEvent.keyDown(screen.getByRole('group',{name:'取消任务确认'}),{key:'Escape'});
 expect(screen.queryByRole('group',{name:'取消任务确认'})).toBeNull();expect(document.activeElement).toBe(origin);
});
it('returns focus to a stable result when cancellation removes the original action',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 const origin=screen.getAllByRole('button',{name:'取消任务'})[0];origin.focus();fireEvent.click(origin);
 const confirm=screen.getByRole('button',{name:'确认取消'});confirm.focus();fireEvent.click(confirm);act(()=>vi.advanceTimersByTime(450));
 expect(document.activeElement).toBe(screen.getByRole('status',{name:'队列操作结果'}));
});
it('focuses error recovery and restores the original action after a successful retry',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'下一次管理操作模拟失败'}));
 const pause=screen.getByRole('button',{name:'暂停',exact:true});pause.focus();fireEvent.click(pause);act(()=>vi.advanceTimersByTime(450));
 const retry=screen.getByRole('button',{name:'重试原操作'});expect(document.activeElement).toBe(retry);
 fireEvent.click(retry);act(()=>vi.advanceTimersByTime(450));
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'恢复',exact:true}));
});
it('does not steal focus when the user moves away while awaiting a receipt',()=>{
 vi.useFakeTimers();render(<TaskQueuePreview/>);
 const pause=screen.getByRole('button',{name:'暂停',exact:true});pause.focus();fireEvent.click(pause);
 const reset=screen.getByRole('button',{name:'重置样例'});reset.focus();act(()=>vi.advanceTimersByTime(450));
 expect(document.activeElement).toBe(reset);
});
it('bounds rendered tasks and retains selection across pages and filters',()=>{
 render(<TaskQueuePreview/>);fireEvent.click(screen.getByRole('button',{name:'120 项任务'}));
 expect(screen.getAllByRole('checkbox',{name:/^选择 任务/})).toHaveLength(10);
 fireEvent.click(screen.getByRole('checkbox',{name:'选择 任务 001 · 生成预览'}));
 fireEvent.click(screen.getByRole('button',{name:'下一页任务'}));
 expect(screen.getAllByRole('checkbox',{name:/^选择 任务/})).toHaveLength(10);
 expect(screen.getByText('已选择 1 项')).toBeTruthy();
 fireEvent.change(screen.getByRole('textbox',{name:'筛选任务'}),{target:{value:'没有这样的任务'}});
 expect(screen.getByText('没有匹配的任务')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'批量取消 (1)'}));
 expect(screen.getByLabelText('待取消任务名单').textContent).toContain('任务 001');
});
it('shows an empty queue without claiming completion and can add sample tasks',()=>{
 render(<TaskQueuePreview/>);fireEvent.click(screen.getByRole('button',{name:'空队列样例'}));
 expect(screen.getByText('队列中暂无任务')).toBeTruthy();expect(screen.queryByText(/所有任务已完成/)).toBeNull();
 expect(screen.getByRole('checkbox',{name:'选择全部可操作任务'}).hasAttribute('disabled')).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'添加模拟任务'}));expect(screen.getByRole('button',{name:'暂停',exact:true})).toBeTruthy();
});
it('recovers a 120-task batch receipt without duplicating or losing targets',()=>{
 vi.useFakeTimers();const first=render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('button',{name:'120 项任务'}));fireEvent.click(screen.getByRole('checkbox',{name:'选择全部可操作任务'}));
 fireEvent.click(screen.getByRole('button',{name:'批量暂停 (120)'}));first.unmount();render(<TaskQueuePreview/>);
 fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 const saved=JSON.parse(sessionStorage.getItem(queueJournalKey)!);expect(saved.tasks).toHaveLength(120);expect(saved.tasks.every((t:{status:string})=>t.status==='paused')).toBe(true);
});
