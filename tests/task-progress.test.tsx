import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {Progress} from '../src/Progress';
import TaskRows from '../src/beautiful-ui/TaskRows';
import {TaskProgressBlock} from '../src/TaskProgressBlock';
import {TaskProgressPreview} from '../website/task-progress-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('distinguishes measured, unknown and completed progress without inferring success',()=>{
 const {rerender}=render(<Progress label="生成" value={100}/>);
 expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toBe('100% · 处理中');
 rerender(<Progress label="生成" value={Infinity} status="paused"/>);
 expect(screen.getByRole('progressbar').hasAttribute('aria-valuenow')).toBe(false);
 expect(document.querySelector('.is-indeterminate')).toBeNull();
 rerender(<Progress label="生成" value={-8}/>);
 expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
 rerender(<Progress label="生成" value={150} status="success" variant="circle"/>);
 expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
 expect(screen.getByRole('progressbar').getAttribute('aria-valuetext')).toContain('已完成');
});
it('keeps task actions independent from expansion and preserves old row data',()=>{
 const toggle=vi.fn(),retry=vi.fn();
 render(<TaskRows onToggleRow={toggle} rows={[{key:'a',label:'生成资源',amount:'12/24',status:'failed',details:[{label:'原因',meta:'网络不可用'}],actions:<button onClick={retry}>重试步骤</button>},{key:'b',label:'旧任务',amount:'完成',status:'done',details:[]}]}/>);
 fireEvent.click(screen.getByRole('button',{name:'重试步骤'}));
 expect(retry).toHaveBeenCalledTimes(1);expect(toggle).not.toHaveBeenCalled();
 const trigger=screen.getByRole('button',{name:/生成资源/});fireEvent.click(trigger);
 expect(trigger.getAttribute('aria-expanded')).toBe('true');expect(toggle).toHaveBeenCalledWith('a',true);
 expect(screen.queryByRole('button',{name:/旧任务/})).toBeNull();
});
it('uses Chinese status labels by default and preserves caller overrides',()=>{
 const rows=[{key:'failed',label:'生成资源',amount:'1/2',status:'failed' as const,details:[]},{key:'done',label:'导出文件',amount:'2/2',status:'done' as const,details:[]}];
 const view=render(<TaskRows rows={rows}/>);
 expect(screen.getByText('失败')).toBeTruthy();
 expect(screen.getByText('完成')).toBeTruthy();
 view.rerender(<TaskRows rows={rows} labels={{completed:'Done',failed:'Error'}}/>);
 expect(screen.getByText('Error')).toBeTruthy();
 expect(screen.getByText('Done')).toBeTruthy();
});
it('retains rows during refresh failures and hides them during initial loading',()=>{
 const props={title:'生成面板',progress:{label:'任务',value:50},rows:[{key:'a',label:'保留的任务',amount:'1/2',status:'paused' as const,details:[]}]};
 const {rerender}=render(<TaskProgressBlock {...props} refreshing error="读取失败" recovery={<button>重新读取</button>}/>);
 expect(screen.getByText('保留的任务')).toBeTruthy();expect(screen.getByRole('alert').textContent).toBe('读取失败');
 rerender(<TaskProgressBlock {...props} loading/>);
 expect(screen.queryByText('保留的任务')).toBeNull();
});
it('cancels stale mock recovery when another scenario is selected',()=>{
 vi.useFakeTimers();render(<TaskProgressPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'失败',exact:true}));
 fireEvent.click(screen.getByRole('button',{name:'重试失败步骤'}));
 fireEvent.click(screen.getByRole('button',{name:'已取消',exact:true}));
 act(()=>vi.advanceTimersByTime(900));
 expect(screen.getByRole('button',{name:'已取消',exact:true}).getAttribute('aria-pressed')).toBe('true');
 expect(screen.queryByRole('button',{name:'暂停任务'})).toBeNull();
});
