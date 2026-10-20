import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {RemoteTaskQueuePreview,remoteViewKey} from '../website/remote-task-queue-preview';
import {changeSelectedTasks,fetchQueue,fetchQueueReceipt,sendQueueCommand,remoteQueueKey} from '../website/remote-task-queue-source';
afterEach(()=>{cleanup();sessionStorage.removeItem(remoteViewKey);sessionStorage.removeItem(remoteQueueKey);vi.useRealTimers()});
async function tick(){await act(async()=>{await vi.advanceTimersByTimeAsync(400)})}
it('pages and filters at the source and clamps a page after filtering',async()=>{
 vi.useFakeTimers();const pending=fetchQueue({search:'任务 001',status:'',page:12});await vi.advanceTimersByTimeAsync(400);const page=await pending;expect(page.total).toBe(1);expect(page.page).toBe(1);expect(page.items[0].id).toBe('task-0');
});
it('returns skipped IDs and deduplicates retries across response loss',async()=>{
 vi.useFakeTimers();const result=sendQueueCommand('retry-1',['task-3','task-0','missing'],'retry',true).catch(()=>null);await vi.advanceTimersByTimeAsync(400);await result;
 const second=sendQueueCommand('retry-1',['task-3','task-0','missing'],'retry');await vi.advanceTimersByTimeAsync(400);expect((await second).skipped).toEqual(['task-0','missing']);
 const query=fetchQueue({search:'任务 004',status:'',page:1});await vi.advanceTimersByTimeAsync(400);expect((await query).items[0].attempt).toBe(2);
});
it('preserves selection through pagination, filtering and remount',async()=>{
 vi.useFakeTimers();const app=render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择远程 任务 001 · 生成预览'}));fireEvent.click(screen.getByRole('button',{name:'远程下一页'}));await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择远程 任务 011 · 校验素材'}));fireEvent.change(screen.getByRole('textbox',{name:'服务端搜索任务'}),{target:{value:'不存在'}});await tick();expect(screen.getByText('没有匹配的任务')).toBeTruthy();app.unmount();render(<RemoteTaskQueuePreview/>);await tick();expect(screen.getByRole('textbox',{name:'服务端搜索任务'}).getAttribute('value')).toBe('不存在');expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected).toHaveLength(2);fireEvent.click(screen.getByRole('button',{name:'批量暂停'}));await tick();expect(screen.getByText(/回执已确认：已执行 2 项/)).toBeTruthy();
});
it('restores a timed-out command without sending again and reads its receipt',async()=>{
 vi.useFakeTimers();const app=render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择远程 任务 004 · 生成预览'}));fireEvent.click(screen.getByRole('checkbox',{name:'模拟命令响应超时'}));fireEvent.click(screen.getByRole('button',{name:'批量重试'}));app.unmount();render(<RemoteTaskQueuePreview/>);await tick();expect(screen.getByRole('button',{name:'批量重试'}).hasAttribute('disabled')).toBe(true);fireEvent.click(screen.getByRole('button',{name:'核对服务端回执'}));await tick();await tick();expect(JSON.parse(sessionStorage.getItem(remoteQueueKey)!).receipts).toHaveLength(1);expect(JSON.parse(sessionStorage.getItem(remoteQueueKey)!).tasks[3].attempt).toBe(2);expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).pending).toBeNull();
});
it('keeps selection on read failure and recovers without a mutation',async()=>{
 vi.useFakeTimers();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择当前页'}));fireEvent.click(screen.getByRole('checkbox',{name:'模拟读取失败'}));await tick();expect(screen.getByText(/模拟读取失败，请重新读取/)).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'重新读取任务'}));await tick();expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected).toHaveLength(10);expect(sessionStorage.getItem(remoteQueueKey)).toBeNull();
});
it('uses exact cross-page targets for cancellation and Escape preserves selection',async()=>{
 vi.useFakeTimers();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择远程 任务 001 · 生成预览'}));fireEvent.click(screen.getByRole('button',{name:'远程下一页'}));await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择远程 任务 011 · 校验素材'}));fireEvent.click(screen.getByRole('button',{name:'批量取消'}));expect(screen.getByRole('group',{name:'服务端取消确认'}).textContent).toContain('任务 001');fireEvent.keyDown(screen.getByRole('button',{name:'返回选择'}),{key:'Escape'});expect(screen.queryByRole('group',{name:'服务端取消确认'})).toBeNull();expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected).toHaveLength(2);fireEvent.click(screen.getByRole('button',{name:'批量取消'}));fireEvent.click(screen.getByRole('button',{name:'确认批量取消'}));await tick();const db=JSON.parse(sessionStorage.getItem(remoteQueueKey)!);expect(db.tasks.filter((t:{status:string})=>t.status==='cancelled').map((t:{id:string})=>t.id)).toEqual(['task-0','task-10']);
});
it('ignores a stale response after search changes',async()=>{
 vi.useFakeTimers();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.change(screen.getByRole('textbox',{name:'服务端搜索任务'}),{target:{value:'任务 001'}});await act(async()=>{await vi.advanceTimersByTimeAsync(200)});fireEvent.change(screen.getByRole('textbox',{name:'服务端搜索任务'}),{target:{value:'任务 012'}});await tick();expect(screen.queryByRole('checkbox',{name:'选择远程 任务 001 · 生成预览'})).toBeNull();expect(screen.getByRole('checkbox',{name:'选择远程 任务 012 · 导出交付'})).toBeTruthy();
});

it('classifies changed, missing and temporary failures and deduplicates partial receipts',async()=>{
 vi.useFakeTimers();changeSelectedTasks(['task-0','task-10']);
 const ids=['task-0','task-10','task-1','task-2'];
 const first=sendQueueCommand('partial-1',ids,'pause',true,true).catch(()=>null);await vi.advanceTimersByTimeAsync(400);await first;
 const receipt=fetchQueueReceipt('partial-1');await vi.advanceTimersByTimeAsync(400);const result=(await receipt)!;
 expect(result.results?.map(x=>x.outcome)).toEqual(['ineligible','missing','applied','failed']);
 const duplicate=sendQueueCommand('partial-1',ids,'pause');await vi.advanceTimersByTimeAsync(400);expect(await duplicate).toEqual(result);
 const retry=sendQueueCommand('partial-2',['task-2'],'pause');await vi.advanceTimersByTimeAsync(400);expect((await retry).applied).toEqual(['task-2']);
});
it('restores partial receipts and explicitly selects only retryable failures',async()=>{
 vi.useFakeTimers();const app=render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择当前页'}));fireEvent.click(screen.getByRole('button',{name:'模拟所选任务状态变化与失效'}));await tick();fireEvent.click(screen.getByRole('checkbox',{name:'模拟部分执行失败'}));fireEvent.click(screen.getByRole('checkbox',{name:'模拟命令响应超时'}));fireEvent.click(screen.getByRole('button',{name:'批量暂停'}));app.unmount();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('button',{name:'核对服务端回执'}));await tick();await tick();
 const saved=JSON.parse(sessionStorage.getItem(remoteViewKey)!);const failed=saved.lastReceipt.results.filter((x:{outcome:string})=>x.outcome==='failed').map((x:{id:string})=>x.id);expect(failed.length).toBeGreaterThan(0);expect(saved.selected.some((x:{id:string})=>saved.lastReceipt.applied.includes(x.id))).toBe(false);
 fireEvent.click(screen.getByRole('button',{name:'仅选择可重试失败项'}));expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected.map((x:{id:string})=>x.id)).toEqual(failed);fireEvent.click(screen.getByRole('button',{name:'批量暂停'}));await tick();expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected).toEqual([]);expect(JSON.parse(sessionStorage.getItem(remoteQueueKey)!).receipts).toHaveLength(2);
});
function restoredPartial(){sessionStorage.setItem(remoteViewKey,JSON.stringify({query:{search:'',status:'',page:1},selected:[{id:'gone',title:'已失效任务'},{id:'task-2',title:'任务 003 · 导出交付'}],pending:null,lastReceipt:{id:'old',action:'pause',ids:['gone','task-2'],applied:[],skipped:['gone','task-2'],results:[{id:'gone',title:'已失效任务',outcome:'missing',reason:'任务已失效'},{id:'task-2',title:'任务 003 · 导出交付',outcome:'failed',reason:'明确未执行，可重试'}]}}))}
it('moves focus from exhausted cleanup to the live summary and preserves other selections',async()=>{
 vi.useFakeTimers();restoredPartial();render(<RemoteTaskQueuePreview/>);await tick();const button=screen.getByRole('button',{name:'移除失效与不适用选择'});button.focus();fireEvent.click(button);expect(button.hasAttribute('disabled')).toBe(true);expect(document.activeElement?.textContent).toContain('已移除失效');expect(JSON.parse(sessionStorage.getItem(remoteViewKey)!).selected.map((x:{id:string})=>x.id)).toEqual(['task-2']);
});
it('focuses the matching operation after retry selection then returns to summary when exhausted',async()=>{
 vi.useFakeTimers();restoredPartial();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('button',{name:'仅选择可重试失败项'}));expect(document.activeElement).toBe(screen.getByRole('button',{name:'批量暂停'}));fireEvent.click(screen.getByRole('button',{name:'批量暂停'}));await tick();expect(document.activeElement?.textContent).toContain('回执已确认');
});
it('does not steal focus after the user moves outside a pending command',async()=>{
 vi.useFakeTimers();render(<><button>其他区域</button><RemoteTaskQueuePreview/></>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择当前页'}));const submit=screen.getByRole('button',{name:'批量暂停'});submit.focus();fireEvent.click(submit);screen.getByRole('button',{name:'其他区域'}).focus();await tick();expect(document.activeElement).toBe(screen.getByRole('button',{name:'其他区域'}));
});
it('opens cancellation on the safe action and Escape returns to its trigger',async()=>{
 vi.useFakeTimers();render(<RemoteTaskQueuePreview/>);await tick();fireEvent.click(screen.getByRole('checkbox',{name:'选择当前页'}));const trigger=screen.getByRole('button',{name:'批量取消'});trigger.focus();fireEvent.click(trigger);const back=screen.getByRole('button',{name:'返回选择'});expect(document.activeElement).toBe(back);fireEvent.keyDown(back,{key:'Escape'});expect(document.activeElement).toBe(trigger);
});
