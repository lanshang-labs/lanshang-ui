import {useState, type Key} from 'react';
import type {DataTableProps as TableProps} from '../dist/index.js';
import {LayoutSpace as Space} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {ButtonGroup,DataTable, NavigationLink, StatusTag, RowActionButton, MetadataList} from '../dist/index.js';

const rows=Array.from({length:86},(_,index)=>({
 id:index+1,name:`${['项目工作台','文档中心','部署服务','数据管理'][index%4]} ${String(index+1).padStart(2,'0')}`,
 owner:['灰豆儿','设计团队','研发团队'][index%3],active:index%4!==3,
}));

type RecordRow = typeof rows[number];
export function SelectionTablePreview(){
 const [current,setCurrent]=useState(1),[pageSize,setPageSize]=useState(5);
 const [state,setState]=useState<'ready'|'empty'|'loading'>('ready');
 const empty=state==='empty',loading=state==='loading';
 const [comfortable,setComfortable]=useState(false),[disabled,setDisabled]=useState(false);
 const [selected,setSelected]=useState<Key[]>([]),[expanded,setExpanded]=useState<Key[]>([]);
 const [filters,setFilters]=useState<Record<string,(Key|boolean)[]|null>>({});
 const [sortOrder,setSortOrder]=useState<'ascend'|'descend'|null>(null);
 const onTableChange:NonNullable<TableProps<RecordRow>['onChange']>=(pagination,nextFilters,sorter)=>{
  setCurrent(pagination.pageSize===pageSize?(pagination.current??1):1);
  setPageSize(pagination.pageSize??5);setFilters(nextFilters);
  setSortOrder(!Array.isArray(sorter)?sorter.order??null:null);
 };
 return <>
  <ButtonGroup aria-label="表格状态">
   {([['ready','正常'],['empty','空数据'],['loading','加载中']] as const).map(([value,label])=><RowActionButton key={value} aria-pressed={state===value} onClick={()=>{setState(value);if(value==='empty'){setCurrent(1);setSelected([]);setExpanded([])}}}>{label}</RowActionButton>)}
  </ButtonGroup>
  <Space wrap size={[16,8]} className="docs-demo-gap">
   <Checkbox checked={comfortable} onChange={e=>setComfortable(e.target.checked)}>舒适行距</Checkbox>
   <Checkbox checked={disabled} onChange={e=>setDisabled(e.target.checked)}>禁用分页</Checkbox>

  </Space>
  <div className="docs-demo-gap"><Space wrap>
   <span className="docs-muted">已选择 {selected.length} 条（跨页保留）</span>
   <RowActionButton disabled={!selected.length||loading} onClick={()=>setSelected([])}>清除选择</RowActionButton>
   <RowActionButton disabled={loading} onClick={()=>{setFilters({});setSortOrder(null);setCurrent(1)}}>重置排序与筛选</RowActionButton>
  </Space></div>
  <div className="docs-demo-gap" aria-busy={loading}>
   <DataTable density={comfortable?'comfortable':'compact'} rowKey="id" loading={loading}
    locale={{filterTitle:"筛选",filterConfirm:"应用",filterReset:"重置",selectAll:"选择本页",selectInvert:"反选本页",selectNone:"清除选择",selectionAll:"选择全部",expand:"展开详情",collapse:"收起详情",triggerAsc:"升序排列",triggerDesc:"降序排列",cancelSort:"取消排序"}}
    scroll={{x:600}} onChange={onTableChange}
    rowSelection={{selectedRowKeys:selected,preserveSelectedRowKeys:true,onChange:setSelected,
     getCheckboxProps:record=>({disabled:loading,'aria-label':`选择 ${record.name}`}),columnWidth:40}}
    expandable={{expandedRowKeys:expanded,onExpandedRowsChange:keys=>setExpanded([...keys]),columnWidth:40,
     expandedRowRender:record=><MetadataList aria-label={`${record.name}详情`} items={[
      {key:'id',label:'项目编号',value:`PRJ-${String(record.id).padStart(3,'0')}`},
      {key:'scope',label:'说明',value:'这是本地演示记录。展开详情、选择与筛选均不连接业务服务。'},
     ]}/>}}
    columns={[
     {title:'项目',dataIndex:'name',width:220,sorter:(a,b)=>a.id-b.id,sortOrder,render:name=><NavigationLink href="#/components/navigation-link">{name}</NavigationLink>},
     {title:'负责人',dataIndex:'owner',width:140,filters:['灰豆儿','设计团队','研发团队'].map(value=>({text:value,value})),filteredValue:filters.owner??null,onFilter:(value,record)=>record.owner===value},
     {title:'状态',dataIndex:'active',width:120,filters:[{text:'正常',value:true},{text:'未启用',value:false}],filteredValue:filters.active??null,onFilter:(value,record)=>record.active===value,render:active=><StatusTag tone={active?'success':'neutral'}>{active?'正常':'未启用'}</StatusTag>},
    ]}
    dataSource={empty?[]:rows}
    pagination={{current,pageSize,locale:{items_per_page:"/ 页",jump_to:"跳至",page:"页",prev_page:"上一页",next_page:"下一页",prev_5:"向前 5 页",next_5:"向后 5 页",page_size:"每页条数"},showLessItems:true,showSizeChanger:true,pageSizeOptions:[5,10,20],showQuickJumper:true,
     disabled:disabled||loading,showTotal:(total,range)=>total?`${range[0]}–${range[1]} / 共 ${total} 条`:'共 0 条',

    }}/>
  </div>
  <p className="docs-muted" role="status">第 {current} 页 · 每页 {pageSize} 条{loading?' · 正在加载（演示开关）':''}</p>
 </>;
}
