import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {OverlayPreview} from '../website/overlay-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
async function tick(ms=600){await act(async()=>vi.advanceTimersByTimeAsync(ms))}
for(const kind of ['Modal','Drawer','Popconfirm'])it(`${kind} retains input on failure, blocks duplicates and restores focus after retry`,async()=>{
 vi.useFakeTimers();render(<OverlayPreview/>);const trigger=screen.getByRole('button',{name:`打开 ${kind}`});trigger.focus();fireEvent.click(trigger);await tick();
 if(kind==='Popconfirm')expect(document.querySelector('.ls-confirm-popover--custom-actions .ant-popover-inner')).toBeTruthy();
 if(kind==='Modal')expect(document.querySelector('.ls-dialog .ant-modal-content')).toBeTruthy();
 if(kind==='Drawer')expect(document.querySelector(':is(.ls-drawer-panel .ant-drawer-content,.ls-drawer-panel.ant-drawer-content)')).toBeTruthy();
 const input=screen.getByRole('textbox',{name:'浮层项目名称'}) as HTMLInputElement;fireEvent.change(input,{target:{value:'保留草稿'}});const submit=screen.getByRole('button',{name:'确认操作'});submit.focus();fireEvent.click(submit);fireEvent.click(submit);expect(screen.getByRole('button',{name:'返回，不执行'}).hasAttribute('disabled')).toBe(true);await tick();expect(screen.getByText('暂未保存').closest('.ls-feedback-panel')?.getAttribute('data-variant')).toBe('inline');expect(screen.getByRole('alert').textContent).toContain('输入保留');expect(input.value).toBe('保留草稿');expect(document.activeElement).toBe(screen.getByRole('button',{name:'重试操作'}));fireEvent.click(screen.getByRole('checkbox',{name:'模拟请求失败'}));screen.getByRole('button',{name:'重试操作'}).focus();fireEvent.click(screen.getByRole('button',{name:'重试操作'}));await tick(1000);expect(screen.queryByRole('textbox',{name:'浮层项目名称'})).toBeNull();expect(document.activeElement).toBe(trigger);
});
