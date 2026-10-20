import {useState} from 'react';
import {Dialog as Modal} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {CustomizableToolbar,ToolbarItem,Select,SearchField,Stack} from '../dist/index.js';
export function CustomToolbarPreview(){
 const [allowed,setAllowed]=useState(true),[editing,setEditing]=useState(false),[name,setName]=useState('演示任务');
 const [query,setQuery]=useState(''),[status,setStatus]=useState('all'),[result,setResult]=useState('尚未查询'),[fields,setFields]=useState<Record<string,string>>({});
 return <Stack><Checkbox checked={allowed} onChange={e=>setAllowed(e.target.checked)}>模拟编辑权限</Checkbox><CustomizableToolbar storageKey="lanshang.demo.toolbar.v1">
 <ToolbarItem id="query" label="关键词" active={!!query}><SearchField aria-label="示例关键词" value={query} onChange={setQuery} placeholder="搜索任务"/></ToolbarItem>
 {['项目','服务','Request ID','Trace ID'].map(label=><ToolbarItem key={label} id={label} label={label} active={!!fields[label]}><TextInput aria-label={`示例${label}`} placeholder={label} value={fields[label]||''} onChange={e=>setFields({...fields,[label]:e.target.value})}/></ToolbarItem>)}
 <ToolbarItem id="status" label="状态" defaultPinned={false} active={status!=='all'}><Select aria-label="示例状态" value={status} onChange={setStatus} options={[{value:'all',label:'全部状态'},{value:'running',label:'处理中'}]}/></ToolbarItem>
 <ToolbarItem id="search" label="查询任务" group="action"><Button onClick={()=>setResult(`关键词：${query||'无'}；状态：${status}`)}>查询任务</Button></ToolbarItem>
 {allowed&&<ToolbarItem id="edit" label="编辑任务" group="action" defaultPinned={false}><Button onClick={()=>setEditing(true)}>编辑任务</Button></ToolbarItem>}
 </CustomizableToolbar><Modal className="ls-form-dialog" title="编辑任务" okText="确认" cancelText="取消" open={editing} onCancel={()=>setEditing(false)} onOk={()=>setEditing(false)}><TextInput aria-label="任务名称" value={name} onChange={e=>setName(e.target.value)}/></Modal><p>筛选项按等宽列对齐，按钮独立成组靠右；缩窄窗口查看多行布局。齿轮可调整固定项及分组内顺序。将状态设为处理中，可看到隐藏筛选提示；从设置内打开编辑任务，关闭后返回原按钮。模拟权限关闭后，编辑入口从页面和设置一起移除。</p><p role="status">{result}</p></Stack>
}
