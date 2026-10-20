import {useState} from 'react';
import {WorkspaceLayout, WorkspaceSidebar, WorkspaceHeader, BeautifulNavigation, BeautifulTabs, RowActionButton, SourceCodeBlock} from '../dist/index.js';
import {HomeSimple, Folder} from '../dist/icons.js';
export function WorkspaceLayoutPreview(){
 const [collapsed,setCollapsed]=useState(false),[page,setPage]=useState('projects'),[tab,setTab]=useState('overview');
 return <WorkspaceLayout style={{height:480,border:'1px solid var(--ls-surface-edge)',borderRadius:14,boxShadow:'var(--ls-surface-shadow)'}} sidebar={<WorkspaceSidebar collapsed={collapsed} onCollapsedChange={setCollapsed}>
 <div style={{padding:16,height:56,fontWeight:600}}>{collapsed?'L':'Lanshang'}</div>
 <BeautifulNavigation collapsed={collapsed} openKeys={[]} onOpenChange={()=>{}} selectedKeys={[page]} onClick={({key})=>setPage(key)} items={[{key:'home',label:'工作台',icon:<HomeSimple width={16}/>},{key:'projects',label:'项目空间',icon:<Folder width={16}/>}]} />
 <RowActionButton aria-label={collapsed?'展开菜单':'收起菜单'} aria-expanded={!collapsed} onClick={()=>setCollapsed(!collapsed)} motionIcon="sidebar" iconActive={!collapsed}>{!collapsed&&'收起菜单'}</RowActionButton>
 </WorkspaceSidebar>} header={<WorkspaceHeader><BeautifulTabs activeKey={tab} onChange={setTab} items={[{key:'overview',label:'概览'},{key:'settings',label:'设置'}]}/><span style={{fontSize:12}}>Yifan</span></WorkspaceHeader>}>
 {tab==='overview'?<SourceCodeBlock filename={page==='projects'?'project.json':'workspace.json'} language="json" code={JSON.stringify({name:'一个较长的项目名称，用于检查内容边界',status:'active'},null,2)}/>:<div>项目设置</div>}
 </WorkspaceLayout>;
}
