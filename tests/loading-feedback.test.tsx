import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {Button,Select,Spin} from 'antd';
import {LanshangProvider} from '../src/Provider';
import LoadingLabel from '../src/beautiful-ui/LoadingLabel';
import {ContentState} from '../src/ContentState';
import {LoadingFeedbackPreview,LoadingLifecyclePreview} from '../website/loading-feedback-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('keeps standalone pending feedback outside automatic busy semantics and respects explicit ARIA',()=>{
 const view=render(<ContentState loading title="正在读取记录"/>);
 expect(screen.getAllByRole('status')).toHaveLength(1);
 expect(screen.getByRole('status').textContent).toBe('正在读取记录');
 expect(screen.getByRole('status').closest('[aria-busy="true"]')).toBeNull();
 view.rerender(<ContentState loading title="显式控制" aria-busy="true" aria-live="off"/>);
 expect(screen.getByRole('status').getAttribute('aria-busy')).toBe('true');
 expect(screen.getByRole('status').getAttribute('aria-live')).toBe('off');
 view.rerender(<ContentState role="alert" title="读取失败"/>);
 expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
 expect(document.querySelector('.ls-pixel-loader')).toBeNull();
});
it('reserves decorative pixels for task labels',()=>{
 const {container}=render(<LoadingLabel label="读取记录"/>);expect(screen.getByRole('status').textContent).toBe('读取记录');expect(container.querySelector('.ls-pixel-loader')?.getAttribute('aria-hidden')).toBe('true');
});
it('keeps native control indicators and custom Spin indicators',()=>{
 const {container}=render(<LanshangProvider><Button loading>保存</Button><Select loading/><Spin/><Spin indicator={<span data-testid="custom">自定义</span>}/></LanshangProvider>);expect(container.querySelectorAll('.ls-pixel-loader')).toHaveLength(0);expect(container.querySelectorAll('.anticon-loading svg')).toHaveLength(2);expect(screen.getByTestId('custom')).toBeTruthy();
});
it('runs submission independently, retaining focus and rejecting duplicate starts',()=>{
 vi.useFakeTimers();render(<LanshangProvider><LoadingFeedbackPreview/></LanshangProvider>);const trigger=screen.getByRole('button',{name:'保存修改'});trigger.focus();fireEvent.click(trigger);expect(trigger.querySelector('.ls-motion-icon[data-pending="true"] .ls-icon-save-arc')).toBeTruthy();act(()=>vi.advanceTimersByTime(2400));fireEvent.click(trigger);expect(screen.getByText('项目摘要 · 已有内容')).toBeTruthy();expect(screen.getByRole('combobox',{name:'加载团队选项'}).getAttribute('aria-busy')).toBe('false');expect(document.activeElement).toBe(trigger);act(()=>vi.advanceTimersByTime(2400));expect(screen.getByText('保存成功')).toBeTruthy();expect(trigger.getAttribute('aria-busy')).toBe('false');
});
it('preserves selected team while options refresh and does not start a save',()=>{
 vi.useFakeTimers();render(<LanshangProvider><LoadingFeedbackPreview/></LanshangProvider>);const select=screen.getByRole('combobox',{name:'加载团队选项'});fireEvent.mouseDown(select);fireEvent.click(screen.getByText('研发团队'));fireEvent.click(screen.getByRole('button',{name:'刷新选项'}));expect(select.getAttribute('aria-busy')).toBe('true');expect(screen.getByText('尚未提交')).toBeTruthy();act(()=>vi.advanceTimersByTime(4800));expect(screen.getByText('选项已更新，当前选择保留')).toBeTruthy();expect(document.querySelector('.ant-select-selection-item')?.textContent).toBe('研发团队');
});

it('animates only running activity and actual snapshot refreshes',async()=>{
 const {TaskProgressBlock}=await import('../src/TaskProgressBlock');
 const base={title:'任务',rows:[],progress:{label:'最近状态',status:'running' as const}};
 const view=render(<TaskProgressBlock {...base}/>);expect(document.querySelector('.bui-loading-label')).toBeTruthy();
 for(const status of ['paused','unknown','queued','blocked','failed','success','cancelled'] as const){view.rerender(<TaskProgressBlock {...base} progress={{label:'最近状态',status}}/>);expect(document.querySelector('.bui-loading-label')).toBeNull()}
 view.rerender(<TaskProgressBlock {...base} snapshot/>);expect(document.querySelector('.bui-loading-label')).toBeNull();
 view.rerender(<TaskProgressBlock {...base} snapshot refreshing/>);expect(document.querySelectorAll('.bui-loading-label')).toHaveLength(1);
 view.rerender(<TaskProgressBlock {...base} snapshot/>);expect(document.querySelector('.bui-loading-label')).toBeNull();
});

it('stops waiting immediately on pause, failure and completion and cancels stale completion',()=>{
 vi.useFakeTimers();render(<LoadingLifecyclePreview/>);
 for(const action of ['暂停处理','模拟失败','立即完成']){
 fireEvent.click(screen.getByRole('button',{name:/开始处理|继续处理/}));expect(document.querySelector('.bui-loading-label')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:action}));expect(document.querySelector('.bui-loading-label')).toBeNull();const text=screen.getByRole('status').textContent;
 act(()=>vi.advanceTimersByTime(5000));expect(screen.getByRole('status').textContent).toBe(text);
 }
});
