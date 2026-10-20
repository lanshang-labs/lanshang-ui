import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {TaskRecoveryPreview} from '../website/task-recovery-preview';
import {freshRecovery,parseRecovery,reconcile,recoveryKey,type RecoveryRecord} from '../website/task-recovery-store';
afterEach(()=>{cleanup();sessionStorage.removeItem(recoveryKey);vi.useRealTimers();vi.restoreAllMocks()});
function pending(receipt:'applied'|'rejected'|'pending'='applied'):RecoveryRecord{return {...freshRecovery(),operation:{id:'original-command',ids:['task-0'],action:'pause',receipt,phase:'unknown'}}}
it('accepts an empty journal but rejects duplicate task identities and orphan receipts',()=>{
 expect(parseRecovery(JSON.stringify({version:1,tasks:[],operation:null})).tasks).toEqual([]);
 const record=freshRecovery();record.tasks.push({...record.tasks[0]});
 expect(()=>parseRecovery(JSON.stringify(record))).toThrow();
 const orphan=pending();orphan.tasks=[];
 expect(()=>parseRecovery(JSON.stringify(orphan))).toThrow();
});
it('reconciles only the matching receipt once and preserves pending results',()=>{
 const record=pending();expect(reconcile(record,'wrong')).toBe(record);
 const applied=reconcile(record,'original-command');expect(applied.tasks[0].status).toBe('paused');expect(reconcile(applied,'original-command')).toBe(applied);
 expect(reconcile(pending('pending'),'original-command').operation?.phase).toBe('unknown');
 expect(reconcile(pending('rejected'),'original-command').tasks[0].status).toBe('running');
 expect(()=>parseRecovery('{bad')).toThrow();expect(()=>parseRecovery('{"version":2}')).toThrow();
});
it('persists before timeout and restores unknown state without resubmitting',()=>{
 vi.useFakeTimers();const view=render(<TaskRecoveryPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'发送暂停并模拟超时'}));
 const saved=sessionStorage.getItem(recoveryKey)!;expect(parseRecovery(saved).operation?.phase).toBe('unknown');
 view.unmount();render(<TaskRecoveryPreview/>);
 expect(screen.getByRole('button',{name:'发送暂停并模拟超时'}).hasAttribute('disabled')).toBe(true);
 expect(sessionStorage.getItem(recoveryKey)).toBe(saved);
 fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 expect(parseRecovery(sessionStorage.getItem(recoveryKey)).tasks[0].status).toBe('paused');
});
it('query failure does not discard the original command',()=>{
 vi.useFakeTimers();sessionStorage.setItem(recoveryKey,JSON.stringify(pending()));render(<TaskRecoveryPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'模拟回执查询失败'}));fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 expect(parseRecovery(sessionStorage.getItem(recoveryKey)).operation?.phase).toBe('unknown');
 fireEvent.click(screen.getByRole('button',{name:'关闭查询失败模拟'}));fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));act(()=>vi.advanceTimersByTime(450));
 expect(parseRecovery(sessionStorage.getItem(recoveryKey)).operation?.phase).toBe('confirmed');
});
it('blocks corrupt storage and cancels stale query after explicit reset',()=>{
 vi.useFakeTimers();sessionStorage.setItem(recoveryKey,'invalid');const view=render(<TaskRecoveryPreview/>);
 expect(screen.getByRole('button',{name:'发送暂停并模拟超时'}).hasAttribute('disabled')).toBe(true);view.unmount();
 sessionStorage.setItem(recoveryKey,JSON.stringify(pending()));render(<TaskRecoveryPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'核对原命令回执'}));fireEvent.click(screen.getByRole('button',{name:'重置恢复样例'}));act(()=>vi.advanceTimersByTime(800));
 expect(parseRecovery(sessionStorage.getItem(recoveryKey)).operation).toBeNull();
});
