import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {createRef} from 'react';
import {Table, type RefSelectProps} from 'antd';
import {Select,Pagination} from '../src/control-icons';
import {DataTable} from '../src/DataTable';
import {LanshangProvider} from '../src/Provider';
afterEach(cleanup);
it('forwards Select ref, keyboard selection, clear and explicit suffix overrides',()=>{
 const change=vi.fn(),ref=createRef<RefSelectProps>();
 const view=render(<Select ref={ref} aria-label="团队" allowClear defaultValue="a" onChange={change} options={[{value:'a',label:'A'},{value:'b',label:'B'},{value:'c',label:'C',disabled:true}]}/>);
 expect(view.container.querySelector('.ant-select-clear .ls-motion-icon')).toBeTruthy();
 ref.current?.focus();const input=screen.getByRole('combobox');expect(document.activeElement).toBe(input);
 fireEvent.keyDown(input,{key:'ArrowDown',keyCode:40});fireEvent.keyDown(input,{key:'ArrowDown',keyCode:40});fireEvent.keyDown(input,{key:'Enter',keyCode:13});
 expect(change).toHaveBeenCalledWith('b',expect.objectContaining({value:'b'}));
 fireEvent.mouseDown(view.container.querySelector('.ant-select-clear')!);expect(change).toHaveBeenLastCalledWith(undefined,undefined);
 view.rerender(<Select disabled suffixIcon={<span>Custom</span>}/>);expect(screen.getByText('Custom')).toBeTruthy();expect(screen.getByRole('combobox').hasAttribute('disabled')).toBe(true);
 view.rerender(<Select loading/>);expect(view.container.querySelector('.ant-select-arrow-loading')).toBeTruthy();
});
it('keeps multiple tag removal and caller clear icons',()=>{
 const change=vi.fn();
 const options=[{value:'a',label:'设计团队'},{value:'b',label:'开发团队'}];
 const view=render(<Select aria-label="协作团队" mode="multiple" defaultValue={['a','b']} onChange={change} allowClear options={options}/>);
 expect(view.container.querySelector('.ant-select-selection-item-remove .ls-motion-icon')).toBeTruthy();
 fireEvent.click(view.container.querySelector('.ant-select-selection-item-remove')!);
 expect(change).toHaveBeenCalledWith(['b'],expect.any(Array));
 view.rerender(<Select aria-label="协作团队" defaultValue="a" allowClear={{clearIcon:<span data-testid="caller-clear">×</span>}} options={options}/>);
 expect(screen.getByTestId('caller-clear')).toBeTruthy();
 expect(view.container.querySelector('.ant-select-clear .ls-motion-icon')).toBeNull();
});
it('preserves pagination button semantics, changes and custom rendering',()=>{
 const change=vi.fn();const view=render(<Pagination total={30} defaultCurrent={1} onChange={change}/>);
 const prev=screen.getByRole('button',{name:'上一页'}) as HTMLButtonElement;expect(prev.disabled).toBe(true);
 fireEvent.click(screen.getByTitle('Next Page'));expect(change).toHaveBeenCalledWith(2,10);
 view.rerender(<Pagination total={30} itemRender={(_,type,original)=>type==='next'?<button>Next custom</button>:original}/>);expect(screen.getByText('Next custom')).toBeTruthy();
});
it('uses shared table sort and filter icons while preserving caller overrides',()=>{
 const rows=[{id:'a',name:'甲'},{id:'b',name:'乙'}];
 const columns=[{title:'项目',dataIndex:'name',sorter:(a:typeof rows[number],b:typeof rows[number])=>a.name.localeCompare(b.name),filters:[{text:'甲',value:'甲'}],onFilter:(value:React.Key|boolean,row:typeof rows[number])=>row.name===value}];
 const view=render(<DataTable rowKey="id" columns={columns} dataSource={rows} pagination={false}/>);
 expect(view.container.querySelector('.ls-table-sort-icon')).toBeTruthy();
 expect(view.container.querySelector('.ls-table-filter-icon')).toBeTruthy();
 expect(screen.getByRole('button',{name:'筛选项目'})).toBeTruthy();
 expect(view.container.querySelector('.anticon-caret-up,.anticon-filter')).toBeNull();
 view.rerender(<DataTable rowKey="id" columns={[{...columns[0],sortIcon:()=> <span data-testid="caller-sort">排序</span>,filterIcon:<span data-testid="caller-filter">筛选</span>}]} dataSource={rows} pagination={false}/>);
 expect(screen.getByTestId('caller-sort')).toBeTruthy();
 expect(screen.getByTestId('caller-filter')).toBeTruthy();
});
it('names the select-all checkbox without replacing its selection behavior or caller header',()=>{
 const rows=[{id:'a',name:'甲'},{id:'b',name:'乙'}];
 const change=vi.fn();
 const view=render(<DataTable rowKey="id" columns={[{title:'项目',dataIndex:'name'}]} dataSource={rows} pagination={false} rowSelection={{onChange:change}} locale={{selectAll:'选择本页'}}/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'选择本页'}));
 expect(change).toHaveBeenCalledWith(['a','b'],rows,expect.any(Object));
 view.rerender(<DataTable rowKey="id" columns={[{title:'项目',dataIndex:'name'}]} dataSource={rows} pagination={false} rowSelection={{columnTitle:<span>自定义表头</span>}}/>);
 expect(screen.getByText('自定义表头')).toBeTruthy();
});
it('keeps pagination jump behavior with the shared icon',()=>{
 const change=vi.fn();
 const view=render(<Pagination total={180} pageSize={5} showSizeChanger onChange={change}/>);
 expect(view.container.querySelector('.ant-pagination-jump-next .ls-control-icon')).toBeTruthy();
 expect(view.container.querySelector('.ant-pagination-options .ls-control-icon')).toBeTruthy();
 expect(view.container.querySelector('.ant-pagination-options .anticon-down')).toBeNull();
 fireEvent.click(view.container.querySelector('.ant-pagination-jump-next')!);
 expect(change).toHaveBeenCalled();
 view.rerender(<Pagination total={180} pageSize={5} showSizeChanger={{suffixIcon:<span data-testid="caller-size-arrow">自定义</span>}}/>);
 expect(screen.getByTestId('caller-size-arrow')).toBeTruthy();
});
it('keeps table pagination at the standard size unless the caller requests compact paging',()=>{
 const rows=Array.from({length:6},(_,index)=>({id:index,name:`项目 ${index+1}`}));
 const props={rowKey:'id' as const,columns:[{title:'项目',dataIndex:'name'}],dataSource:rows};
 const view=render(<DataTable {...props} pagination={{pageSize:2,showSizeChanger:true}}/>);
 expect(view.container.querySelector('.ant-pagination-mini')).toBeNull();
 expect(view.container.querySelector('.ant-pagination-options-size-changer.ant-select-sm')).toBeNull();
 fireEvent.click(view.container.querySelector('.ant-pagination-next button')!);
 expect(screen.getByText('项目 3')).toBeTruthy();
 view.rerender(<DataTable {...props} pagination={{pageSize:2,showSizeChanger:true,size:'small'}}/>);
 expect(view.container.querySelector('.ant-pagination-mini')).toBeTruthy();
 expect(view.container.querySelector('.ant-pagination-options-size-changer.ant-select-sm')).toBeTruthy();
});
it('expands exactly once without invoking row click and preserves custom expansion',()=>{
 const expand=vi.fn(),row=vi.fn();const props={rowKey:'id',dataSource:[{id:'a',name:'A'}],columns:[{title:'名称',dataIndex:'name'}],pagination:false as const,onRow:()=>({onClick:row}),expandable:{expandedRowRender:()=> <p>Details</p>,onExpand:expand}};
 const view=render(<LanshangProvider><DataTable {...props}/></LanshangProvider>);
 const button=screen.getByRole('button',{name:'展开行'});fireEvent.click(button);
 expect(expand).toHaveBeenCalledTimes(1);expect(row).not.toHaveBeenCalled();expect(screen.getByRole('button',{name:'收起行'}).getAttribute('aria-expanded')).toBe('true');
 view.rerender(<LanshangProvider><DataTable {...props} expandable={{...props.expandable,expandIcon:()=> <button>Custom expand</button>}}/></LanshangProvider>);expect(screen.getByText('Custom expand')).toBeTruthy();
});

it('does not reserve tree indentation in ordinary tables, but retains real tree expansion',()=>{
 const props={rowKey:'id',dataSource:[{id:'a',name:'A'}],columns:[{title:'名称',dataIndex:'name'}],pagination:false as const};
 const view=render(<LanshangProvider><Table {...props}/><DataTable {...props}/></LanshangProvider>);
 expect(view.container.querySelector('.ant-table-row-indent')).toBeNull();
 expect(view.container.querySelector('.ls-table-expand-spacer')).toBeNull();
 view.rerender(<LanshangProvider><DataTable {...props} dataSource={[{id:'a',name:'A',children:[{id:'b',name:'B'}]}]}/></LanshangProvider>);
 fireEvent.click(screen.getByRole('button',{name:'展开行'}));
 expect(screen.getByText('B')).toBeTruthy();
 expect(view.container.querySelector('.ant-table-row-indent')).toBeTruthy();
});
