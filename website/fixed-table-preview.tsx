import {useState} from 'react';
import {useLayoutBreakpoint} from '../dist/index.js';
import {LayoutSpace as Space, HintTooltip as Tooltip} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {DataTable, RowActionButton, MetadataList} from '../dist/index.js';
const wideRows=Array.from({length:16},(_,i)=>({id:i+1,name:`项目 ${i+1}`,owner:i%2?"设计团队":"研发团队"})).map(row=>({...row,
 name:row.id%3===1?'跨团队研发协作与持续交付管理平台（长名称示例）':row.name,
 description:row.id%2?'汇总跨团队项目、部署记录与文档协作信息；长文本完整换行，保持内容可阅读。':'短说明与长说明共存，不强制所有行相同高度。',
 identifier:`lanshang_workspace_production_${String(row.id).padStart(3,'0')}_continuous_identifier_without_spaces`,
}));
export function FixedTablePreview(){
 const [fixedHeader,setFixedHeader]=useState(true),[fixedColumns,setFixedColumns]=useState(true);
 const [detail,setDetail]=useState<typeof wideRows[number]|null>(null);
 const screens=useLayoutBreakpoint();
 // On narrow viewports, both pinned sides would cover the scrollable columns.
 const pin=fixedColumns&&!!screens.md;
 return <section className="docs-demo-gap" aria-label="固定与滚动示例">
  <h3>固定表头与左右固定列</h3>
  <Space wrap>
   <Checkbox checked={fixedHeader} onChange={e=>setFixedHeader(e.target.checked)}>固定表头</Checkbox>
   <Checkbox checked={fixedColumns} onChange={e=>setFixedColumns(e.target.checked)}>固定项目与操作列</Checkbox>
  </Space>
  <p className="docs-muted">{pin?'左右滑动查看中间字段，上下滚动查看其余记录。':'窄屏或关闭固定列时，所有列随表格横向滚动，避免遮挡正文。'} 项目名称省略后可聚焦查看全文；说明与连续标识完整换行。</p>
  <DataTable className="docs-wide-table" rowKey="id" dataSource={wideRows} pagination={false}
   scroll={{x:980,y:fixedHeader?280:undefined}}
   columns={[
    {title:'项目',dataIndex:'name',width:180,fixed:pin?'left':undefined,render:name=><Tooltip title={name} trigger={['hover','focus']}><span tabIndex={0} className="docs-table-truncate">{name}</span></Tooltip>},
    {title:'负责人',dataIndex:'owner',width:100},
    {title:'说明',dataIndex:'description',width:300,render:value=><span className="docs-table-wrap">{value}</span>},
    {title:'标识',dataIndex:'identifier',width:300,render:value=><span className="docs-table-wrap">{value}</span>},
    {title:'操作',key:'actions',width:100,fixed:pin?'right':undefined,render:(_,row)=><RowActionButton size="small" aria-label={`查看项目 ${row.id} 详情`} onClick={()=>setDetail(row)}>查看详情</RowActionButton>},
   ]}/>
  <div aria-live="polite" className="docs-demo-gap">{detail?<><RowActionButton onClick={()=>setDetail(null)}>收起详情</RowActionButton><MetadataList items={[
   {key:'name',label:'项目',value:detail.name},{key:'identifier',label:'完整标识',value:detail.identifier},
  ]}/></>:<span className="docs-muted">点击操作列的“查看详情”，在表格下方查看完整内容。</span>}</div>
 </section>;
}
