import {Select} from '../dist/index.js';
import {useState} from 'react';
import {LayoutSpace as Space} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {TreeTablePreview} from './tree-table-preview';
import {GroupedTablePreview} from './grouped-table-preview';
import {MergedTablePreview} from './merged-table-preview';
import {SummaryTablePreview} from './summary-table-preview';
import {EditableTablePreview} from './editable-table-preview';
const cases=[{value:'tree',label:'树形与选择',Component:TreeTablePreview},{value:'grouped',label:'分组表头与排序',Component:GroupedTablePreview},{value:'merged',label:'行列合并',Component:MergedTablePreview},{value:'summary',label:'分页与汇总',Component:SummaryTablePreview},{value:'editable',label:'行编辑',Component:EditableTablePreview}];
export function TableCompatibilityPreview(){
 const [kind,setKind]=useState('tree'),[virtualized,setVirtualized]=useState(true);
 const Component=cases.find(item=>item.value===kind)!.Component;
 return <section aria-label="虚拟组合兼容示例"><Space wrap><Select aria-label="组合场景" value={kind} onChange={setKind} options={cases.map(({value,label})=>({value,label}))} style={{width:190}}/><Checkbox checked={virtualized} onChange={e=>setVirtualized(e.target.checked)}>开启虚拟滚动</Checkbox></Space>
 <p className="docs-muted">对照相同数据的普通与虚拟渲染。切换场景会重置该示例；这里只验证列出的有限组合，不能代替真实业务数据验收。</p>
 <Component key={kind} virtualized={virtualized}/>
 <p className="docs-muted">虚拟模式使用数值 scroll.x/y，汇总需使用 Table.Summary fixed。树形父节点汇总不自动去重；合并按展示顺序计算，跨度过大会增加额外渲染。编辑草稿归 Form 持有，滚出视口会卸载输入框，不能保证持续焦点；需持续输入时使用普通分页或表格外编辑器。树形懒加载与每 20 行跨屏合并请查看独立专项示例；尚未验证所有功能同时启用。</p>
 </section>;
}
