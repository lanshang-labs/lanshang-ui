import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {DataTable} from '../src/DataTable';
import {TreeTablePreview} from '../website/tree-table-preview';
import {GroupedTablePreview} from '../website/grouped-table-preview';
import {MergedTablePreview} from '../website/merged-table-preview';
import {SummaryTablePreview} from '../website/summary-table-preview';
import {EditableTablePreview} from '../website/editable-table-preview';
afterEach(cleanup);
it('uses the standard medium table while allowing explicit compact API tables',()=>{
 const props={rowKey:'id',dataSource:[{id:'row',name:'项目'}],columns:[{dataIndex:'name',title:'项目'}],pagination:false} as const;
 const view=render(<DataTable {...props}/>);
 expect(document.querySelector('.ds-data-table .ant-table-middle')).toBeTruthy();
 view.rerender(<DataTable {...props} size="small"/>);
 expect(document.querySelector('.ds-data-table .ant-table-small')).toBeTruthy();
});
it('virtual tree selection survives collapsing descendants',()=>{
 render(<TreeTablePreview virtualized/>);
 expect(document.querySelector('.ant-table-tbody-virtual')).toBeTruthy();
 fireEvent.click(screen.getByText('全部展开'));expect(screen.getByText('部署 Agent')).toBeTruthy();
 fireEvent.click(screen.getByLabelText('父子独立选择'));
 const checkboxes=document.querySelectorAll('.ant-table-tbody-virtual input[type="checkbox"]');
 fireEvent.click(checkboxes[0]);expect(screen.getByRole('status').textContent).toContain('4 个节点');
 fireEvent.click(screen.getByText('全部收起'));expect(screen.queryByText('部署 Agent')).toBeNull();
 expect(screen.getByRole('status').textContent).toContain('4 个节点');
});
it('virtual grouped headers preserve sorting',()=>{
 render(<GroupedTablePreview virtualized/>);
 expect(screen.getByRole('columnheader',{name:'任务统计'}).getAttribute('colspan')).toBe('2');
 const header=screen.getByRole('columnheader',{name:'已完成'});
 fireEvent.click(header);fireEvent.click(header);
 expect(header.getAttribute('aria-sort')).toBe('descending');
 expect(document.querySelector('.ant-table-tbody-virtual .ant-table-row')?.textContent).toContain('部署服务');
});
it('virtual merged cells can return to unmerged rendering',()=>{
 render(<MergedTablePreview virtualized/>);
 expect(screen.getAllByText('基础平台')).toHaveLength(1);
 fireEvent.click(screen.getByLabelText('合并相邻分组及说明行'));
 expect(screen.getAllByText('基础平台')).toHaveLength(2);
 expect(screen.getByText('当前数据仅用于展示相邻分组的合并规则。')).toBeTruthy();
});
it('virtual summary totals follow the page instead of the visible window',()=>{
 render(<SummaryTablePreview virtualized/>);
 expect(document.querySelector('.ant-table-summary')?.textContent).toBe('当前页合计 · 5 条209');
 fireEvent.click(screen.getByTitle('Next Page'));
 expect(document.querySelector('.ant-table-summary')?.textContent).toBe('当前页合计 · 5 条4510');
});
it('virtual editing validates, retains failed input and returns focus after cancellation',async()=>{
 render(<EditableTablePreview virtualized/>);
 expect(screen.getByRole('button',{name:'编辑项目工作台'}).classList.contains('ant-btn-sm')).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'编辑项目工作台'}));
 expect(screen.getByLabelText('编辑项目名称').classList.contains('ant-input-sm')).toBe(true);
 expect(screen.getByRole('button',{name:'保存'}).classList.contains('ant-btn-sm')).toBe(true);
 fireEvent.change(screen.getByLabelText('编辑项目名称'),{target:{value:''}});
 fireEvent.click(screen.getByRole('button',{name:'保存'}));
 await screen.findByText('请输入项目名称');
 fireEvent.change(screen.getByLabelText('编辑项目名称'),{target:{value:'新的草稿'}});
 fireEvent.click(screen.getByLabelText('模拟保存失败'));
 fireEvent.click(screen.getByRole('button',{name:'保存'}));
 await screen.findByText('保存失败，输入已保留，请关闭失败模拟后重试。');
 expect((screen.getByLabelText('编辑项目名称') as HTMLInputElement).value).toBe('新的草稿');
 fireEvent.click(screen.getByRole('button',{name:'取消'}));
 await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole('button',{name:'编辑项目工作台'})));
},15000);

it('expanded details retain their record and caller actions when collapsed and reopened',()=>{
 const record={id:'parent',name:'父记录'};
 const renderDetail=vi.fn((row:typeof record,index:number,indent:number,expanded:boolean)=><button onClick={()=>action(row.id)}>{`${row.name}详情 ${index} ${indent} ${expanded}`}</button>);
 const action=vi.fn();
 render(<DataTable rowKey="id" dataSource={[record]} columns={[{dataIndex:'name',title:'名称'}]} pagination={false} locale={{expand:'展开详情',collapse:'收起详情'}} expandable={{expandedRowRender:renderDetail}}/>);
 fireEvent.click(screen.getByRole('button',{name:'展开详情'}));
 expect(renderDetail).toHaveBeenCalledWith(record,0,1,true);
 fireEvent.click(screen.getByRole('button',{name:'父记录详情 0 1 true'}));
 expect(action).toHaveBeenCalledWith('parent');
 fireEvent.click(screen.getByRole('button',{name:'收起详情'}));
 expect(screen.queryByRole('button',{name:'父记录详情 0 1 true'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'展开详情'}));
 expect(screen.getByRole('button',{name:'父记录详情 0 1 true'})).toBeTruthy();
});
