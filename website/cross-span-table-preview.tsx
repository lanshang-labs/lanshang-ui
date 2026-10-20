import {useState} from 'react';

import {Checkbox} from '../dist/index.js';
import {DataTable} from '../dist/index.js';
const rows=Array.from({length:400},(_,i)=>({id:i+1,group:`分组 ${Math.floor(i/20)+1}`,name:`记录 ${i+1}`,amount:i+1}));
export function CrossSpanTablePreview(){
 const [merged,setMerged]=useState(true);
 return <section aria-label="跨屏合并示例"><Checkbox checked={merged} onChange={e=>setMerged(e.target.checked)}>每 20 行合并分组</Checkbox><p className="docs-muted">400 条固定顺序记录；合并跨度大于可视窗口。滚到组中部时，合并首行即使已滚出视口，分组单元格仍应覆盖其剩余范围。</p><DataTable virtual rowKey="id" pagination={false} dataSource={rows} scroll={{x:600,y:200}} columns={[
 {title:'分组',dataIndex:'group',width:160,onCell:(_,index)=>({rowSpan:merged?(index??0)%20===0?20:0:1})},
 {title:'记录',dataIndex:'name',width:280},{title:'数量',dataIndex:'amount',width:160,align:'right'},
 ]}/><p className="docs-muted">本例不叠加树形展开、排序或筛选。合并区域会补渲染额外单元格；不要将数千行合并为一个单元格，也不能假定 DOM 数量永远等于可视行数量。</p></section>;
}
