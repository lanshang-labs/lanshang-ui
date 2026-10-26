
import {Checkbox} from '../dist/index.js';

import type {ResourceTreeNode as DataNode} from '../dist/index.js';
import {useRef,useState} from 'react';
import {RowActionButton,ResourceTree,ResourceIcon,type ResourceTreeRef} from '../dist/index.js';
const longName='project_documentation_version_history_项目文档历史记录与归档';
const deepNode={key:'deep-leaf',title:longName,icon:<ResourceIcon kind="table"/>};
function nested(level:number):DataNode{
 return level===6?deepNode:{key:`level-${level}`,title:`第 ${level} 层 · 项目资料与历史版本`,icon:<ResourceIcon kind="folder"/>,children:[nested(level+1)]};
}
export function ResourceTreePreview(){
 const tree=useRef<ResourceTreeRef>(null);
 const [selected,setSelected]=useState<React.Key[]>(['projects']);
 const [expanded,setExpanded]=useState<React.Key[]>(['connection','database','tables']);
 const [stress,setStress]=useState(false),[narrow,setNarrow]=useState(false);
 return <div style={{width:'100%',minWidth:0}}>
 <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:16}}>
 <Checkbox checked={stress} onChange={e=>{setStress(e.target.checked);setSelected([e.target.checked?'deep-leaf':'projects']);setExpanded(e.target.checked?['level-1','level-2','level-3','level-4','level-5']:['connection','database','tables']);}}>长名称与六层嵌套</Checkbox>
 <Checkbox checked={narrow} onChange={e=>setNarrow(e.target.checked)}>窄面板 220px</Checkbox>
 <RowActionButton onClick={()=>{setExpanded(stress?['level-1','level-2','level-3','level-4','level-5']:['connection','database','tables']);requestAnimationFrame(()=>tree.current?.scrollTo({key:selected[0]}));}}>定位选中项</RowActionButton>
 </div>
 <div style={{width:'100%',maxWidth:narrow?220:320,boxSizing:'border-box',padding:12,border:'1px solid var(--ui-shell-line,var(--ui-line))',borderRadius:14,background:'var(--ui-shell-sidebar,var(--ui-raised))'}}>
 <ResourceTree ref={tree} selectedKeys={selected} onSelect={keys=>setSelected(keys)} expandedKeys={expanded} onExpand={keys=>setExpanded(keys)} key={String(stress)} defaultExpandedKeys={stress?['level-1','level-2','level-3','level-4','level-5']:['connection','database','tables']} defaultSelectedKeys={stress?['deep-leaf']:['projects']} treeData={stress?[nested(1)]:[
 {key:'connection',title:'本地开发',icon:<ResourceIcon kind="database"/>,children:[
 {key:'database',title:'workspace',icon:<ResourceIcon kind="database"/>,children:[
 {key:'tables',title:'表',icon:<ResourceIcon kind="folder"/>,children:[...['projects','documents','members'].map(key=>({key,title:key,icon:<ResourceIcon kind="table"/>})),{key:'restricted',title:'受限资源',disabled:true,icon:<ResourceIcon kind="table"/>}]}
 ]}]}]}/>
 </div>
 </div>;
}
