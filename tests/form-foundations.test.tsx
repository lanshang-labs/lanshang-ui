import {afterEach,expect,it,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor,act} from '@testing-library/react';
import {FormFoundationPreview,CheckboxFoundationPreview,SwitchFoundationPreview,RadioFoundationPreview} from '../website/form-foundations-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('focuses the first invalid field without saving',async()=>{
 render(<FormFoundationPreview/>);fireEvent.change(screen.getByLabelText('项目名称'),{target:{value:'   '}});fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(document.activeElement).toBe(screen.getByLabelText('项目名称')));
 await waitFor(()=>expect(screen.getByText('请输入名称')).toBeTruthy());expect(screen.queryByText('已保存，基准已更新')).toBeNull();
});
it('retains a failed draft and updates the undo baseline only after success',async()=>{
 render(<FormFoundationPreview/>);const field=screen.getByLabelText('项目名称');fireEvent.change(field,{target:{value:'新项目'}});
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟保存失败'}));fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(screen.getByRole('alert').textContent).toContain('输入已保留'));
 expect((field as HTMLInputElement).value).toBe('新项目');
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟保存失败'}));const retry=screen.getByRole('button',{name:'重试保存'});retry.focus();fireEvent.click(retry);
 await waitFor(()=>expect(screen.getByText('已保存，基准已更新')).toBeTruthy());expect(document.activeElement).toBe(retry);
 fireEvent.change(field,{target:{value:'其他名称'}});fireEvent.click(screen.getByRole('button',{name:'撤销未保存修改'}));expect((field as HTMLInputElement).value).toBe('新项目');
});
it('keeps advanced settings and restores defaults as an unsaved draft',async()=>{
 render(<FormFoundationPreview generation/>);fireEvent.click(screen.getByText('高级设置'));
 fireEvent.click(screen.getByRole('radio',{name:'高质量 Quality'}));fireEvent.click(screen.getByRole('switch',{name:'交付前人工核对'}));fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(screen.getByText('已保存，基准已更新')).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'恢复默认参数'}));
 expect(screen.getByText('有未保存的修改')).toBeTruthy();expect((screen.getByRole('radio',{name:'均衡 Balanced'}) as HTMLInputElement).checked).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'撤销未保存修改'}));
 expect((screen.getByRole('radio',{name:'高质量 Quality'}) as HTMLInputElement).checked).toBe(true);expect(screen.getByRole('switch',{name:'交付前人工核对'}).getAttribute('aria-checked')).toBe('false');
});
it('supports mixed selection, disabled options and independently controlled choices',()=>{
 const view=render(<CheckboxFoundationPreview/>);const all=screen.getByRole('checkbox',{name:'选择全部交付内容'}) as HTMLInputElement;
 expect(all.indeterminate).toBe(true);fireEvent.click(all);expect(screen.getByText(/已选择 2 项/)).toBeTruthy();fireEvent.click(all);expect(screen.getByText(/已选择 0 项/)).toBeTruthy();
 view.unmount();const radio=render(<RadioFoundationPreview/>);fireEvent.click(screen.getByRole('radio',{name:'快速 Fast'}));expect((screen.getByRole('radio',{name:'快速 Fast'}) as HTMLInputElement).checked).toBe(true);expect((screen.getByRole('radio',{name:'未配置'}) as HTMLInputElement).disabled).toBe(true);
 radio.unmount();render(<SwitchFoundationPreview/>);fireEvent.click(screen.getByRole('switch',{name:'显示完成提醒'}));expect(screen.getByRole('status').textContent).toContain('已关闭');
});
it('opens advanced settings and focuses the invalid checkbox group',async()=>{
 render(<FormFoundationPreview generation/>);fireEvent.click(screen.getByText('高级设置'));fireEvent.click(screen.getByRole('checkbox',{name:'预览图片'}));
 const details=screen.getByText('高级设置').closest('details')!;expect(details.classList.contains('ls-filter-disclosure')).toBe(true);details.open=false;
 fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(details.open).toBe(true));
 expect(document.activeElement).toBe(screen.getByRole('checkbox',{name:'预览图片'}));
});
