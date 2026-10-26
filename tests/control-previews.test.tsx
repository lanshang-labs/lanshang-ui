import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
import {Skeleton} from '../src/Skeleton';
import {ButtonPreview, InputPreview, SelectPreview, SkeletonPreview} from '../website/control-previews';
import {MotionButton} from '../src/MotionButton';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('delays placeholders, hides stale content, cancels early completion and restarts delay',()=>{
 vi.useFakeTimers();
 const {rerender}=render(<Skeleton loading delay={150}><button>内容</button></Skeleton>);
 expect(screen.queryByRole('button')).toBeNull();
 expect((document.querySelector('.ls-skeleton-placeholder') as HTMLElement).style.visibility).toBe('hidden');
 act(()=>vi.advanceTimersByTime(100));rerender(<Skeleton loading={false} delay={150}><button>内容</button></Skeleton>);
 act(()=>vi.advanceTimersByTime(100));expect(screen.getByRole('button',{name:'内容'})).toBeTruthy();
 rerender(<Skeleton loading delay={150}><button>内容</button></Skeleton>);
 expect((document.querySelector('.ls-skeleton-placeholder') as HTMLElement).style.visibility).toBe('hidden');
 act(()=>vi.advanceTimersByTime(150));expect((document.querySelector('.ls-skeleton-placeholder') as HTMLElement).style.visibility).toBe('visible');
 expect(screen.getByRole('status').textContent).toBe('正在加载');
});
it('supports a custom static template and immediate display',()=>{
 render(<Skeleton delay={0} label="读取摘要" template={<span>占位结构</span>}/>);
 expect(screen.getByRole('status').textContent).toBe('读取摘要');
 expect(screen.getByText('占位结构').parentElement?.getAttribute('aria-hidden')).toBe('true');
});
it('retains refreshed content and recovers from initial failure',()=>{
 vi.useFakeTimers();render(<SkeletonPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'读取失败'}));fireEvent.click(screen.getByRole('button',{name:'重试读取'}));
 act(()=>vi.advanceTimersByTime(700));expect(screen.getByText('设计系统工作台')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'刷新摘要'}));expect(screen.getByText('设计系统工作台')).toBeTruthy();
 expect((screen.getByRole('button',{name:'刷新摘要'}) as HTMLButtonElement).disabled).toBe(true);
 act(()=>vi.advanceTimersByTime(700));expect(screen.queryByText('正在刷新')).toBeNull();
});
it('blocks repeated submissions and supports failure recovery',()=>{
 vi.useFakeTimers();render(<ButtonPreview/>);
 fireEvent.click(screen.getByRole('switch'));fireEvent.click(screen.getByRole('button',{name:'保存修改'}));
 fireEvent.click(screen.getByRole('button',{name:'保存修改'}));
 act(()=>vi.advanceTimersByTime(700));expect(screen.getByRole('alert').textContent).toContain('保存失败');
 fireEvent.click(screen.getByRole('switch'));fireEvent.click(screen.getByRole('button',{name:'保存修改'}));
 act(()=>vi.advanceTimersByTime(700));expect(screen.getByRole('status').textContent).toBe('保存成功');
});
it('uses the Lanshang save stroke and keeps a pending save focused without submitting again',()=>{
 const save=vi.fn();
 const view=render(<form onSubmit={save}><MotionButton motionIcon="save" htmlType="submit" loading={false} onClick={save}>保存修改</MotionButton></form>);
 const button=screen.getByRole('button',{name:'保存修改'}) as HTMLButtonElement;
 button.focus();
 expect(button.querySelector('.ls-icon-save-check')).toBeTruthy();
 expect(button.type).toBe('submit');
 view.rerender(<form onSubmit={save}><MotionButton motionIcon="save" htmlType="submit" loading onClick={save}>保存修改</MotionButton></form>);
 expect(document.activeElement).toBe(button);
 expect(button.type).toBe('button');
 expect(button.getAttribute('aria-busy')).toBe('true');
 expect(button.querySelector('.ls-motion-icon[data-pending="true"] .ls-icon-save-arc')).toBeTruthy();
 expect(button.querySelector('.ant-btn-loading-icon')).toBeNull();
 fireEvent.click(button);
 expect(save).not.toHaveBeenCalled();
});
it('validates required input, focuses errors, submits and resets',async()=>{
 render(<InputPreview/>);
 expect((screen.getByRole('textbox',{name:'只读标识'}) as HTMLInputElement).readOnly).toBe(true);
 expect((screen.getByRole('textbox',{name:'无权限字段'}) as HTMLInputElement).disabled).toBe(true);
 fireEvent.submit(screen.getByRole('button',{name:'验证输入'}).closest('form')!);
 await screen.findByText('请输入项目名称');await waitFor(()=>expect(document.activeElement).toBe(screen.getByLabelText('项目名称')));
 fireEvent.change(screen.getByLabelText('项目名称'),{target:{value:'Lanshang'}});
 fireEvent.submit(screen.getByRole('button',{name:'验证输入'}).closest('form')!);
 await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('已提交：Lanshang'));
 fireEvent.click(screen.getByRole('button',{name:'重置输入'}));expect((screen.getByLabelText('项目名称') as HTMLInputElement).value).toBe('');
});
it('selects by keyboard, preserves selection on failure and retries',async()=>{
 render(<SelectPreview/>);
 const input=screen.getByRole('combobox',{name:'负责人团队'});fireEvent.keyDown(input,{key:'ArrowDown',keyCode:40});
 await screen.findByRole('listbox');fireEvent.keyDown(input,{key:'Enter',keyCode:13});
 await waitFor(()=>expect(screen.getByText('当前选择：设计团队')).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'选项失败'}));expect((input as HTMLInputElement).disabled).toBe(true);
 expect(screen.getByText('当前选择：设计团队')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'重试选项'}));
 await waitFor(()=>expect((input as HTMLInputElement).disabled).toBe(false),{timeout:1800});
 fireEvent.click(screen.getByRole('button',{name:'无选项'}));expect(screen.getByText('暂无可选团队，请先添加团队。')).toBeTruthy();
});
