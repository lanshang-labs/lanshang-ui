import {useState, type Key} from 'react';
import {LayoutSpace as Space} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {DataTable, RowActionButton} from '../dist/index.js';
type Node={id:string;name:string;owner:string;children?:Node[]};
const rows:Node[]=[{id:'platform',name:'基础平台',owner:'平台组',children:[{id:'ui',name:'Lanshang UI',owner:'设计团队'},{id:'deploy',name:'部署服务',owner:'研发团队',children:[{id:'agent',name:'部署 Agent',owner:'研发团队'}]}]},{id:'business',name:'业务应用',owner:'应用组',children:[{id:'docs',name:'文档中心',owner:'内容团队'}]}];
export function TreeTablePreview({virtualized=false}:{virtualized?:boolean}={}){
 const [expanded,setExpanded]=useState<Key[]>(['platform']),[selected,setSelected]=useState<Key[]>([]),[strict,setStrict]=useState(true);
 return <section aria-label="树形数据示例">
  <Space wrap><RowActionButton onClick={()=>setExpanded(['platform','deploy','business'])}>全部展开</RowActionButton><RowActionButton onClick={()=>setExpanded([])}>全部收起</RowActionButton><Checkbox checked={strict} onChange={e=>{setStrict(e.target.checked);setSelected([])}}>父子独立选择</Checkbox></Space>
  <p className="docs-muted">{strict?'选择父节点不会自动选择子节点。':'父子联动选择；部分子节点被选中时父节点显示半选。'} 切换选择模式会清空选择。</p>
  <DataTable<Node> virtual={virtualized} rowKey="id" columns={[{title:'项目层级',dataIndex:'name',width:300},{title:'负责人',dataIndex:'owner',width:160}]} dataSource={rows} pagination={false} scroll={{x:500,y:virtualized?160:undefined}}
   locale={{expand:'展开子项目',collapse:'收起子项目',selectionAll:'选择全部节点'}}
   expandable={{expandedRowKeys:expanded,onExpandedRowsChange:keys=>setExpanded([...keys])}}
   rowSelection={{selectedRowKeys:selected,onChange:setSelected,checkStrictly:strict,
    getCheckboxProps:row=>({name:row.id,'aria-label':`选择 ${row.name}`})}}/>
  <p role="status" className="docs-muted">已选择 {selected.length} 个节点；折叠后仍保留选择。</p>
 </section>;
}
