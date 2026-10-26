import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {OverlayPreview} from '../website/overlay-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
async function tick(ms=600){await act(async()=>vi.advanceTimersByTimeAsync(ms))}
for(const kind of ['Modal','Drawer','Popconfirm'])it(`${kind} retains input on failure, blocks duplicates and restores focus after retry`,async()=>{
 vi.useFakeTimers();render(<OverlayPreview/>);fireEvent.click(screen.getByRole('checkbox',{name:'展示长内容'}));const trigger=screen.getByRole('button',{name:`打开 ${kind}`});trigger.focus();fireEvent.click(trigger);await tick();
 expect(screen.getByRole('region',{name:'项目核对说明'}).textContent).toContain('核对项 16');
 if(kind==='Popconfirm')expect(document.querySelector('.ls-confirm-popover--custom-actions .ant-popover-inner')).toBeTruthy();
 if(kind==='Modal')expect(document.querySelector('.ls-dialog .ant-modal-content')).toBeTruthy();
 if(kind==='Drawer')expect(document.querySelector(':is(.ls-drawer-panel .ant-drawer-content,.ls-drawer-panel.ant-drawer-content)')).toBeTruthy();
 const input=screen.getByRole('textbox',{name:'浮层项目名称'}) as HTMLInputElement;fireEvent.change(input,{target:{value:'保留草稿'}});const submit=screen.getByRole('button',{name:'确认操作'});submit.focus();fireEvent.click(submit);fireEvent.click(submit);expect(screen.getByRole('button',{name:'返回，不执行'}).hasAttribute('disabled')).toBe(true);await tick();expect(screen.getByText('暂未保存').closest('.ls-feedback-panel')?.getAttribute('data-variant')).toBe('inline');expect(screen.getByRole('alert').textContent).toContain('输入保留');expect(input.value).toBe('保留草稿');expect(document.activeElement).toBe(screen.getByRole('button',{name:'重试操作'}));fireEvent.click(screen.getByRole('checkbox',{name:'模拟请求失败'}));screen.getByRole('button',{name:'重试操作'}).focus();fireEvent.click(screen.getByRole('button',{name:'重试操作'}));await tick(1000);expect(screen.queryByRole('textbox',{name:'浮层项目名称'})).toBeNull();expect(document.activeElement).toBe(trigger);
});
it('validates the shared long form without discarding its fields',async()=>{
 render(<OverlayPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'查看共享长表单弹窗'}));
 const name=await screen.findByLabelText('交付名称');
 const notes=screen.getByLabelText('交付说明') as HTMLTextAreaElement;
 const draft='这段说明超过三十个字，用来验证字数统计、说明和错误信息仍然各自保持清楚且输入不会丢失。';
 fireEvent.change(notes,{target:{value:draft}});
 fireEvent.click(screen.getByRole('button',{name:'保存设置'}));
 await screen.findByText('请输入交付名称');
 await screen.findByText('请将说明缩短到 30 字以内；输入会保留，修正后再保存。');
 expect(notes.value).toBe(draft);
 await waitFor(()=>expect(document.activeElement).toBe(name));
 fireEvent.change(name,{target:{value:'交付设置'}});
 fireEvent.change(notes,{target:{value:'已核对说明'}});
 fireEvent.click(screen.getByRole('button',{name:'保存设置'}));
 await waitFor(()=>expect(screen.queryByRole('dialog',{name:'项目交付设置'})).toBeNull());
});
