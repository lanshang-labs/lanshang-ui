import {DataTable} from '../dist/index.js';
const rows=[{id:1,name:'Lanshang UI',owner:'设计团队',done:18,pending:3},{id:2,name:'部署服务',owner:'研发团队',done:26,pending:5}];
export function GroupedTablePreview({virtualized=false}:{virtualized?:boolean}={}){return <section aria-label="分组表头示例"><p className="docs-muted">通过 columns.children 组织多级表头；分组标题只表达列关系，不参与数据排序。</p><DataTable virtual={virtualized} rowKey="id" dataSource={rows} pagination={false} scroll={{x:600,y:virtualized?160:undefined}} columns={[
 {title:'项目信息',children:[{title:'项目',dataIndex:'name',width:200},{title:'负责人',dataIndex:'owner',width:160}]},
 {title:'任务统计',children:[{title:'已完成',dataIndex:'done',align:'right',width:120,sorter:(a,b)=>a.done-b.done},{title:'待处理',dataIndex:'pending',align:'right',width:120}]},
]}/></section>}
