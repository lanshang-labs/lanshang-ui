import {useState} from 'react';
import {Button} from 'antd';
import {FolderOutlined, SettingOutlined} from '../dist/icons.js';
import {DataTable, SearchField, PageHeader, MetadataList, NavigationLink, BeautifulNavigation} from '../dist/index.js';
/** Application supplies rows and actions; no network or permission assumptions. */
export function ProjectListBlock(){
 const [query,setQuery]=useState('');
 const rows=[{id:'workspace',name:'项目工作台',owner:'示例成员'},{id:'docs',name:'文档中心',owner:'示例成员'}].filter(row=>row.name.includes(query));
 return <section><PageHeader title="项目" meta={`${rows.length} 个项目`}/><SearchField aria-label="筛选项目" placeholder="搜索项目名称" value={query} onChange={setQuery}/><div style={{marginTop:16}}><DataTable rowKey="id" pagination={false} columns={[{title:'名称',dataIndex:'name',render:name=><NavigationLink href="#/blocks/detail">{name}</NavigationLink>},{title:'负责人',dataIndex:'owner'}]} dataSource={rows}/></div></section>;
}
export function DetailBlock(){const [expanded,setExpanded]=useState(false);return <section><PageHeader title="文档中心" description="详情页组合示例" actions={<Button onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}>{expanded?'收起说明':'展开说明'}</Button>}/><MetadataList aria-label="项目详情" items={[{key:'id',label:'标识',value:'docs'},{key:'owner',label:'负责人',value:'示例成员'},{key:'count',label:'待处理',value:0}]}/>{expanded&&<p style={{color:"var(--ui-secondary)"}}>项目负责数据、权限和提交；区块负责布局与交互连接。</p>}</section>}
export function SidebarBlock(){const [collapsed,setCollapsed]=useState(false),[open,setOpen]=useState(['workspace']),[selected,setSelected]=useState('/projects');return <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}><div style={{width:collapsed?64:220}}><BeautifulNavigation collapsed={collapsed} items={[{key:'workspace',label:'项目空间',icon:<FolderOutlined/>,children:[{key:'/projects',label:'全部项目'},{key:'/groups',label:'项目组'}]},{key:'/settings',label:'设置',icon:<SettingOutlined/>}]} selectedKeys={[selected]} openKeys={open} onOpenChange={setOpen} onClick={({key})=>setSelected(key)}/></div><section><Button onClick={()=>setCollapsed(!collapsed)}>{collapsed?'展开侧栏':'折叠侧栏'}</Button><p role="status" style={{color:"var(--ui-secondary)"}}>当前页面：{selected}</p></section></div>}
