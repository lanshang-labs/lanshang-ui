import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {FeedbackPanel} from '../src/FeedbackPanel';
import {FeedbackPreview} from '../website/feedback-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('avoids duplicate state labels and leaves historical feedback silent without stealing focus',()=>{
 render(<><button>原焦点</button><FeedbackPanel type="warning" message="部分成功" description="保留失败项"/></>);screen.getByRole('button').focus();expect(screen.queryByText('需关注')).toBeNull();expect(screen.queryByRole('alert')).toBeNull();expect(screen.queryByRole('status')).toBeNull();expect(document.activeElement).toBe(screen.getByRole('button'));
});
it('announces only when requested and preserves action controls',()=>{
 const retry=vi.fn();render(<FeedbackPanel type="error" role="alert" message="读取失败" action={<button onClick={retry}>重新读取</button>}/>);expect(screen.getByRole('alert').textContent).not.toContain('出错');fireEvent.click(screen.getByRole('button'));expect(retry).toHaveBeenCalledOnce();
});
it('moves focus from an unmounted retry to its successful result',async()=>{
 render(<FeedbackPreview/>);
 const retry=screen.getByRole('button',{name:'模拟重试成功'});retry.focus();fireEvent.click(retry);
 await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole('region',{name:'重试结果'})));
 expect(screen.getByRole('status').textContent).toBe('重试已成功，原内容保留');
 expect(screen.queryByRole('button',{name:'模拟重试成功'})).toBeNull();
});
it('does not steal unrelated focus when a retry is triggered without owning it',()=>{
 render(<FeedbackPreview/>);
 const other=screen.getByRole('button',{name:'打开确认示例'});other.focus();
 fireEvent.click(screen.getByRole('button',{name:'模拟重试成功'}));
 expect(document.activeElement).toBe(other);
});
it('opens inline confirmation on the safe action and Escape restores its trigger',async()=>{
 vi.useFakeTimers();render(<FeedbackPreview/>);const trigger=screen.getByRole('button',{name:'打开确认示例'});trigger.focus();fireEvent.click(trigger);expect(document.activeElement).toBe(screen.getByRole('button',{name:'返回，不执行'}));fireEvent.keyDown(document.activeElement!,{key:'Escape'});await act(async()=>vi.advanceTimersByTimeAsync(30));expect(screen.queryByRole('group',{name:'中性确认示例'})).toBeNull();expect(document.activeElement).toBe(trigger);
});
