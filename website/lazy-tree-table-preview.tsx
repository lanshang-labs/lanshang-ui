import {useEffect,useRef,useState,type Key} from 'react';
import {LayoutSpace as Space} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {DataTable,LoadingLabel,RowActionButton} from '../dist/index.js';
type Node={id:string;name:string;children?:Node[]};
const seed=():Node[]=>Array.from({length:40},(_,i)=>({id:`group-${i}`,name:`项目组 ${i+1}`,children:[]}));
export function LazyTreeTablePreview(){
 const [rows,setRows]=useState(seed),[expanded,setExpanded]=useState<Key[]>([]),[selected,setSelected]=useState<Key[]>([]);
 const [pending,setPending]=useState<string[]>([]),[errors,setErrors]=useState<string[]>([]),[fail,setFail]=useState(false);
 const timers=useRef(new Map<string,ReturnType<typeof setTimeout>>());
 useEffect(()=>()=>{timers.current.forEach(clearTimeout)},[]);
 function load(row:Node){
  if(timers.current.has(row.id)||row.children?.length)return;
  setPending(previous=>[...previous,row.id]);setErrors(previous=>previous.filter(id=>id!==row.id));
  timers.current.set(row.id,setTimeout(()=>{
   timers.current.delete(row.id);setPending(previous=>previous.filter(id=>id!==row.id));
   if(fail){setErrors(previous=>[...previous,row.id]);return;}
   setRows(previous=>previous.map(item=>item.id===row.id?{...item,children:Array.from({length:30},(_,i)=>({id:`${row.id}-${i}`,name:`${row.name} / 子项目 ${i+1}`}))}:item));
  },650));
 }
 function reset(){timers.current.forEach(clearTimeout);timers.current.clear();setRows(seed());setPending([]);setErrors([]);setExpanded([]);setSelected([])}
 return <section aria-label="树形懒加载示例"><Space wrap><Checkbox checked={fail} onChange={e=>setFail(e.target.checked)}>模拟节点加载失败</Checkbox><RowActionButton onClick={reset}>重置树形样例</RowActionButton></Space>
 <p className="docs-muted">40 个根节点，首次展开每个节点模拟加载 30 个子项；折叠不取消数据加载，也不强制重新展开。父子独立选择，尚未加载的子节点不自动选中。</p>
 <DataTable<Node> virtual rowKey="id" dataSource={rows} pagination={false} scroll={{x:600,y:240}}
  locale={{expand:'加载或展开节点',collapse:'折叠节点'}}
  expandable={{expandedRowKeys:expanded,onExpandedRowsChange:keys=>setExpanded([...keys]),onExpand:(open,row)=>{if(open)load(row)}}}
  rowSelection={{checkStrictly:true,selectedRowKeys:selected,onChange:setSelected,preserveSelectedRowKeys:true,getCheckboxProps:row=>({name:row.id,'aria-label':`选择 ${row.name}`})}}
  columns={[{title:'项目',dataIndex:'name',width:350},{title:'加载状态',width:250,render:(_,row)=>pending.includes(row.id)?<LoadingLabel label="正在加载子项目"/>:errors.includes(row.id)?<RowActionButton size="small" motionIcon="retry" onClick={()=>load(row)}>重试 {row.name}</RowActionButton>:row.children?row.children.length?'已加载':'展开后加载':'子项目'}]}/>
 <p role="status" className="docs-muted">加载中 {pending.length} 个 · 失败 {errors.length} 个 · 已选择 {selected.length} 个</p></section>;
}
