import {useState} from 'react';

import {Checkbox} from '../dist/index.js';
import {DataTable} from '../dist/index.js';
const rows=[{id:1,group:'基础平台',name:'Lanshang UI',owner:'设计团队'},{id:2,group:'基础平台',name:'部署服务',owner:'研发团队'},{id:3,group:'业务应用',name:'文档中心',owner:'内容团队'},{id:4,group:'业务应用',name:'项目空间',owner:'应用团队'},{id:5,group:'说明',name:'当前数据仅用于展示相邻分组的合并规则。',owner:''}];
export function MergedTablePreview({virtualized=false}:{virtualized?:boolean}={}){
 const [merged,setMerged]=useState(true);
 return <section aria-label="合并单元格示例"><Checkbox checked={merged} onChange={e=>setMerged(e.target.checked)}>合并相邻分组及说明行</Checkbox><p className="docs-muted">rowSpan 合并相邻分组；最后一行使用 colSpan。排序、筛选或分页后，应基于实际展示行重新计算跨度，不能复用原始索引。</p><DataTable virtual={virtualized} rowKey="id" dataSource={rows} pagination={false} scroll={{x:560,y:virtualized?160:undefined}} columns={[
 {title:'项目组',dataIndex:'group',width:140,onCell:(_,index)=>({rowSpan:!merged||index===4?1:index!%2===0?2:0})},
 {title:'项目',dataIndex:'name',width:260,onCell:row=>({colSpan:merged&&row.id===5?2:1})},
 {title:'负责人',dataIndex:'owner',width:160,onCell:row=>({colSpan:merged&&row.id===5?0:1})},
]}/></section>;
}
