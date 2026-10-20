import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {LazyTreeTablePreview} from '../website/lazy-tree-table-preview';
import {CrossSpanTablePreview} from '../website/cross-span-table-preview';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('lazy load finishing after collapse does not reopen the node',()=>{
 vi.useFakeTimers();render(<LazyTreeTablePreview/>);
 fireEvent.click(screen.getAllByRole('button',{name:'加载或展开节点'})[0]);
 fireEvent.click(screen.getByRole('button',{name:'折叠节点'}));
 act(()=>vi.advanceTimersByTime(700));
 expect(screen.queryByText('项目组 1 / 子项目 1')).toBeNull();
 fireEvent.click(screen.getAllByRole('button',{name:'加载或展开节点'})[0]);
 expect(screen.getByText('项目组 1 / 子项目 1')).toBeTruthy();
});
it('lazy failures retry and reset cancels stale pending writes',()=>{
 vi.useFakeTimers();render(<LazyTreeTablePreview/>);
 fireEvent.click(screen.getByLabelText('模拟节点加载失败'));
 fireEvent.click(screen.getAllByRole('button',{name:'加载或展开节点'})[0]);
 act(()=>vi.advanceTimersByTime(700));expect(screen.getByRole('button',{name:'重试 项目组 1'})).toBeTruthy();
 fireEvent.click(screen.getByLabelText('模拟节点加载失败'));fireEvent.click(screen.getByRole('button',{name:'重试 项目组 1'}));
 act(()=>vi.advanceTimersByTime(700));expect(screen.getByText('项目组 1 / 子项目 1')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'重置树形样例'}));
 fireEvent.click(screen.getAllByRole('button',{name:'加载或展开节点'})[0]);
 fireEvent.click(screen.getByRole('button',{name:'重置树形样例'}));act(()=>vi.advanceTimersByTime(700));
 expect(screen.queryByText('项目组 1 / 子项目 1')).toBeNull();
 expect(screen.getByRole('status').textContent).toContain('加载中 0');
});
it('cross-screen spans retain their group when the anchor leaves the window',()=>{
 render(<CrossSpanTablePreview/>);
 const holder=document.querySelector('.ant-table-tbody-virtual-holder')!;
 fireEvent.scroll(holder,{target:{scrollTop:250}});
 expect(screen.getByText('分组 1')).toBeTruthy();
 expect(document.querySelectorAll('.ant-table-row').length).toBeLessThan(400);
 fireEvent.click(screen.getByLabelText('每 20 行合并分组'));
 expect(screen.getAllByText('分组 1').length).toBeGreaterThan(1);
});
it('large virtual lists keep selection while recycling distant rows',async()=>{
 const {VirtualTablePreview}=await import('../website/virtual-table-preview');
 render(<VirtualTablePreview/>);
 fireEvent.click(screen.getByLabelText('选择记录 1'));
 const holder=document.querySelector('.docs-virtual-table .ant-table-tbody-virtual-holder')!;
 fireEvent.scroll(holder,{target:{scrollTop:200000}});
 expect(document.querySelectorAll('.docs-virtual-table .ant-table-row').length).toBeLessThan(100);
 expect(screen.getByRole('status').textContent).toContain('已选择 1 条');
 fireEvent.scroll(holder,{target:{scrollTop:0}});
 expect((screen.getByLabelText('选择记录 1') as HTMLInputElement).checked).toBe(true);
},15000);
