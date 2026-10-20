import {useMemo, useState, type Key} from 'react';
import {useLayoutBreakpoint} from '../dist/index.js';
import {LayoutSpace as Space, HintTooltip as Tooltip} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {ContentState, DataTable, MetadataList, RowActionButton, SearchField, StatusTag} from '../dist/index.js';

const records=Array.from({length:10_000},(_,index)=>({
 id:index+1,
 name:`项目 ${String(index+1).padStart(5,'0')}${index%7===0?' · 跨团队研发与持续交付协作平台':''}`,
 owner:['灰豆儿','研发团队','设计团队'][index%3],
 identifier:`lanshang_workspace_${String(index+1).padStart(5,'0')}_continuous_delivery`,
 active:index%4!==3,
}));
export function VirtualTablePreview(){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState<Key[]>([]);
 const [fixed,setFixed]=useState(true),[detail,setDetail]=useState<typeof records[number]|null>(null);
 const screens=useLayoutBreakpoint(),pin=fixed&&!!screens.md;
 const filtered=useMemo(()=>records.filter(row=>`${row.id} ${row.name} ${row.owner}`.includes(query.trim())),[query]);
 return <section className="docs-demo-gap" aria-label="虚拟滚动示例">
  <h3>万条数据与虚拟滚动</h3>
  <Space wrap>
   <SearchField aria-label="筛选万条样例" placeholder="搜索编号、项目或负责人" value={query} onChange={setQuery} allowClear/>
   <Checkbox checked={fixed} onChange={e=>setFixed(e.target.checked)}>虚拟表格固定列</Checkbox>
   <RowActionButton disabled={!selected.length} onClick={()=>setSelected([])}>清除虚拟表格选择</RowActionButton>
  </Space>
  <p className="docs-muted" role="status">共 10,000 条本地记录 · 匹配 {filtered.length.toLocaleString()} 条 · 已选择 {selected.length} 条</p>
  <p className="docs-muted">只渲染可视行。滚动或筛选后保留选择；表头全选针对全部匹配记录。{!pin?'窄屏下取消固定列，表格内横向滚动。':''}</p>
  <DataTable className="docs-virtual-table" virtual rowKey="id" dataSource={filtered} pagination={false}
   scroll={{x:900,y:320}}
   locale={{selectAll:'选择全部匹配记录',selectionAll:'选择全部匹配记录',emptyText:<ContentState title="没有匹配结果" description="尝试其他编号或负责人，也可以清除筛选。" action={<RowActionButton onClick={()=>setQuery('')}>清除筛选</RowActionButton>}/>}}
   rowSelection={{selectedRowKeys:selected,onChange:setSelected,preserveSelectedRowKeys:true,fixed:pin,columnWidth:40,
    getCheckboxProps:row=>({name:`record-${row.id}`,'aria-label':`选择记录 ${row.id}`})}}
   columns={[
    {title:'项目',dataIndex:'name',width:220,fixed:pin?'left':undefined,render:name=><Tooltip title={name} trigger={['hover','focus']}><span className="docs-table-truncate" tabIndex={0}>{name}</span></Tooltip>},
    {title:'负责人',dataIndex:'owner',width:120},
    {title:'标识',dataIndex:'identifier',width:320,render:value=><span className="docs-table-truncate" title={value}>{value}</span>},
    {title:'状态',dataIndex:'active',width:100,render:active=><StatusTag tone={active?'success':'neutral'}>{active?'正常':'未启用'}</StatusTag>},
    {title:'操作',key:'action',width:100,fixed:pin?'right':undefined,render:(_,row)=><RowActionButton size="small" aria-label={`查看虚拟记录 ${row.id}`} onClick={()=>setDetail(row)}>详情</RowActionButton>},
   ]}/>
  <div className="docs-demo-gap" aria-live="polite">{detail?<><RowActionButton motionIcon="close" onClick={()=>setDetail(null)}>关闭记录详情</RowActionButton><MetadataList items={[
   {key:'name',label:'项目',value:detail.name},{key:'id',label:'完整标识',value:detail.identifier},
  ]}/></>:<span className="docs-muted">长内容使用省略与详情查看；此示例不使用动态展开行，保持滚动行高稳定。</span>}</div>
 </section>;
}
