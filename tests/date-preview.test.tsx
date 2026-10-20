import {afterEach,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import dayjs from 'dayjs';
import {DatePreview,rangeError,expiryError,demoDate} from '../website/date-preview';
afterEach(cleanup);
it('leads with the relevant date control while keeping both examples available',()=>{
 const {rerender}=render(<DatePreview primary="single"/>);
 expect(screen.getAllByRole('heading',{level:3}).map(node=>node.textContent)).toEqual(['有效期设置','时间筛选']);
 expect(screen.getByRole('button',{name:'应用筛选'})).toBeTruthy();
 rerender(<DatePreview primary="range"/>);
 expect(screen.getAllByRole('heading',{level:3}).map(node=>node.textContent)).toEqual(['时间筛选','有效期设置']);
 expect(screen.getByRole('button',{name:'保存有效期'})).toBeTruthy();
});
it('validates inclusive date boundaries without converting dates to timestamps',()=>{
 expect(rangeError(null)).toBe('');
 expect(rangeError([demoDate,demoDate])).toBe('');
 expect(rangeError([demoDate,demoDate.add(30,'day')])).toBe('');
 expect(rangeError([demoDate,demoDate.add(31,'day')])).toContain('31');
 expect(rangeError([demoDate,demoDate.subtract(1,'day')])).toContain('早于');
 expect(expiryError(null)).toContain('请选择');
 expect(expiryError(dayjs('invalid'))).toContain('有效日期');
 expect(expiryError(demoDate.subtract(1,'day'))).toContain('早于');
 expect(expiryError(demoDate)).toBe('');
});
it('clears the draft filter separately from the applied filter',()=>{
 render(<DatePreview/>);fireEvent.click(screen.getByRole('button',{name:'应用筛选'}));
 expect(screen.getByText(/已应用：2026-10-07 至 2026-10-13/)).toBeTruthy();
 const clear=screen.getByRole('button',{name:'清空日期范围'});clear.focus();fireEvent.click(clear);
 expect(document.activeElement).toBe(clear);expect(screen.getByText(/已应用：2026-10-07/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'应用筛选'}));expect(screen.getByText(/已应用：不限日期/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'最近 7 天样例'}));expect((screen.getByPlaceholderText('开始日期') as HTMLInputElement).value).toBe('2026-10-07');
});
it('focuses missing expiry and restores the saved value',()=>{
 render(<DatePreview/>);fireEvent.click(screen.getByRole('button',{name:'清空截止日期'}));fireEvent.click(screen.getByRole('button',{name:'保存有效期'}));
 const input=screen.getByLabelText('有效期截止日期（必填）');
 expect(document.activeElement).toBe(input);expect(screen.getByRole('alert').textContent).toContain('请选择');
 fireEvent.click(screen.getByRole('button',{name:'撤销修改'}));expect((input as HTMLInputElement).value).toBe('2026-11-12');expect(screen.queryByRole('alert')).toBeNull();
});
it('selects a calendar day and saves it as the new undo baseline',async()=>{
 render(<DatePreview/>);fireEvent.click(screen.getByLabelText('有效期截止日期（必填）'));
 const cell=await waitFor(()=>{const el=document.querySelector('td[title="2026-10-20"]');expect(el).not.toBeNull();return el!});
 fireEvent.click(cell.querySelector('.ant-picker-cell-inner')!);
 fireEvent.click(screen.getByRole('button',{name:'保存有效期'}));expect(screen.getByText(/已保存截止日期：2026-10-20/)).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'清空截止日期'}));fireEvent.click(screen.getByRole('button',{name:'撤销修改'}));expect((screen.getByLabelText('有效期截止日期（必填）') as HTMLInputElement).value).toBe('2026-10-20');
});
it('keeps input focus when closing the calendar with Escape',async()=>{
 render(<DatePreview/>);const input=screen.getByLabelText('有效期截止日期（必填）');input.focus();fireEvent.click(input);
 await waitFor(()=>expect(document.querySelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)')).not.toBeNull());
 fireEvent.keyDown(input,{key:'Escape',keyCode:27});
 expect(document.activeElement).toBe(input);
 await waitFor(()=>{const popup=document.querySelector('.ant-picker-dropdown');expect(!popup||popup.classList.contains('ant-picker-dropdown-hidden')).toBe(true)});
});
