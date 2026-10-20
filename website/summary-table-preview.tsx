import {DataTableSummary} from '../dist/index.js';
import {DataTable} from '../dist/index.js';
const rows=Array.from({length:12},(_,i)=>({id:i+1,name:`项目 ${i+1}`,done:i+2,pending:i%3+1}));
export function SummaryTablePreview({virtualized=false}:{virtualized?:boolean}={}){return <section aria-label="汇总行示例"><p className="docs-muted">汇总仅计算当前页（包含筛选结果），不代表服务端全部记录；筛选或翻页后自动更新。</p><DataTable virtual={virtualized} rowKey="id" dataSource={rows} scroll={{x:500,y:virtualized?160:undefined}} columns={[
 {title:'项目',dataIndex:'name',width:260},{title:'已完成',dataIndex:'done',width:120,align:'right'},
 {title:'待处理',dataIndex:'pending',width:120,align:'right',filters:[{text:'1 项',value:1},{text:'2 项',value:2},{text:'3 项',value:3}],onFilter:(value,row)=>row.pending===value},
]} locale={{filterConfirm:'应用',filterReset:'重置'}} pagination={{defaultPageSize:5,showSizeChanger:false,showTotal:total=>`共 ${total} 条`}}
 summary={pageRows=><DataTableSummary fixed={virtualized}><DataTableSummary.Row><DataTableSummary.Cell index={0}>当前页合计 · {pageRows.length} 条</DataTableSummary.Cell><DataTableSummary.Cell index={1} align="right">{pageRows.reduce((n,row)=>n+row.done,0)}</DataTableSummary.Cell><DataTableSummary.Cell index={2} align="right">{pageRows.reduce((n,row)=>n+row.pending,0)}</DataTableSummary.Cell></DataTableSummary.Row></DataTableSummary>}/></section>}
