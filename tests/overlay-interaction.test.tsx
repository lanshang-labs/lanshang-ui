import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {StateGallery} from '../examples/StateGallery';
afterEach(cleanup);
it('focuses the first invalid field in the page form',async()=>{
 render(<StateGallery/>);
 fireEvent.click(screen.getByRole('button',{name:'验证表单'}));
 await screen.findByText('请填写项目名称');
 await waitFor(()=>expect(document.activeElement).toBe(screen.getByLabelText('项目名称')));
},20000);
it('returns editing focus to the exact row after cancelling',async()=>{
 render(<StateGallery/>);
 const trigger=screen.getAllByRole('button',{name:'编辑'})[1];
 trigger.focus();fireEvent.click(trigger);
 const dialog=await screen.findByRole('dialog');
 fireEvent.click(within(dialog).getByRole('button',{name:'保 存'}));
 await within(dialog).findByText('请填写名称');
 await waitFor(()=>expect(document.activeElement).toBe(within(dialog).getByLabelText('名称')));
 fireEvent.click(within(dialog).getByRole('button',{name:'取 消'}));
 await waitFor(()=>expect(document.activeElement).toBe(trigger));
},20000);
it('returns drawer focus to its original row action',async()=>{
 render(<StateGallery/>);
 const trigger=screen.getAllByRole('button',{name:'详情'})[1];
 trigger.focus();fireEvent.click(trigger);
 const dialog=await screen.findByRole('dialog');
 fireEvent.click(within(dialog).getByRole('button',{name:'关闭抽屉'}));
 await waitFor(()=>expect(document.activeElement).toBe(trigger));
},20000);
