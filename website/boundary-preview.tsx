import {Select,MotionButton} from '../dist/index.js';
import {useState} from 'react';
import {ContentState,PageHeader} from '../dist/index.js';
import {ProjectListBlock,DetailBlock,EditFormBlock,type ProjectRecord} from './blocks';
import './boundary-preview.css';
const record:ProjectRecord={id:'PRJ-REGIONAL-COLLABORATION-2026-LONG-IDENTIFIER',name:'跨区域项目协作与工程资料统一管理工作空间_LongProjectNameWithoutSpacesForResponsiveLayout',owner:'跨区域协作平台维护团队',category:'基础平台与协作服务',status:'active',description:'用于核对长标题、长标识、负责人和说明在窄屏中的显示。https://example.com/projects/VeryLongContinuousProjectIdentifierWithoutAnyBreaks',notifications:true,progress:42};
export function BoundaryPreview(){
 const [scene,setScene]=useState('list'),[current,setCurrent]=useState(record),[filter,setFilter]=useState({query:'',status:'all'});
 const rows=[current].filter(row=>row.name.includes(filter.query)&&(filter.status==='all'||row.status===filter.status));
 return <div style={{width:'100%',minWidth:0}}><div className="ls-boundary-intro"><strong>逐项检查内容边界</strong><p>长名称要完整可读；连续标识允许断行；空列表与无匹配结果保留不同的恢复入口。切换场景后，再把视口缩窄检查。</p></div><Select aria-label="边界展示场景" value={scene==='edit'?'empty':scene} onChange={next=>{setCurrent(record);setFilter({query:'',status:'all'});setScene(next)}} style={{width:220,maxWidth:'100%',marginBottom:20}} options={[{value:'list',label:'长文本 · 列表'},{value:'detail',label:'长文本 · 详情'},{value:'empty',label:'空列表 · 创建入口'},{value:'filter',label:'无匹配结果 · 清除筛选'},{value:'state',label:'长文本 · 空状态'}]}/>
 {scene==='list'?<ProjectListBlock rows={rows} {...filter} onFilterChange={setFilter} onOpen={()=>setScene('detail')}/>:scene==='detail'?<DetailBlock record={current} activities={[]} onBack={()=>setScene('list')}/>:scene==='empty'?<ProjectListBlock rows={[]} onCreate={()=>setScene('edit')}/>:scene==='edit'?<EditFormBlock owners={['演示用户']} categories={['基础平台']} onCancel={()=>setScene('empty')} onSave={next=>{setCurrent({...next,id:'PRJ-NEW'});setFilter({query:'',status:'all'});setScene('list')}}/>:scene==='filter'?<ProjectListBlock rows={[]} query="找不到的项目" onFilterChange={()=>setScene('list')}/>:<><PageHeader title="资源尚未准备好" meta={record.id}/><ContentState title="暂无可访问的项目资料" description={record.description} action={<MotionButton onClick={()=>setScene('list')}>返回项目列表</MotionButton>}/></>}
 <p style={{fontSize:12,color:'var(--ui-muted)',marginTop:18}}>仅本地边界样例。窄屏下表格在自身容器横向滚动，名称可换行阅读；空数据保留可用入口。</p></div>;
}
