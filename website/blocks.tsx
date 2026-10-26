import {Select, Progress} from '../dist/index.js';
import {FeedbackPanel,Stack,Inline} from '../dist/index.js';
import {useEffect, useRef, useState, type ReactNode, type Key} from 'react';
import {Form, TabStrip as Tabs, Dialog as Modal, ConfirmPopover as Popconfirm} from '../dist/index.js';
import {ToggleSwitch as Switch} from '../dist/index.js';
import {TextInput,TextArea} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {DataTable, SearchField, PageHeader, MetadataList, NavigationLink, BeautifulNavigation, StatusTag, RowActionButton, ContentState, MotionIcon} from '../dist/index.js';

export type ProjectRecord = {id:string; name:string; owner:string; status:'active'|'draft'|'archived'; category:string; description:string; notifications:boolean; progress:number};
export type BlockState = 'ready' | 'loading' | 'empty' | 'error';
export type BlockStateProps = {state?:BlockState; onRetry?:()=>void};
/** No requests or timers: callers own loading, errors and retry transitions. */
function BlockStatePanel({state,subject,onRetry,action}:{state:Exclude<BlockState,'ready'>;subject:string;onRetry?:()=>void;action?:ReactNode}){
 return <div className="ls-block-panel ls-block-state"><ContentState
  loading={state==='loading'} role={state==='error'?'alert':'status'}
  title={state==='loading'?`正在加载${subject}`:state==='error'?`${subject}暂时无法加载`:`暂无${subject}`}
  description={state==='loading'?'正在准备内容，请稍候。':state==='error'?'请稍后重试，或返回其他页面。':'内容准备好后，会显示在这里。'}
  action={state==='loading'?undefined:state==='error'?(onRetry&&<Button motionIcon="retry" onClick={onRetry}>重新加载</Button>):action}
 /></div>;
}
export const emptyProject:ProjectRecord={id:'',name:'',owner:'',status:'draft',category:'',description:'',notifications:true,progress:0};
const statusLabels={active:'进行中',draft:'草稿',archived:'已归档'};
function ProjectStatus({status}:{status:ProjectRecord['status']}){return <StatusTag tone={status==='active'?'success':status==='draft'?'warning':'neutral'}>{statusLabels[status]}</StatusTag>}
const blockStyles=`
.ls-block{width:100%;min-width:0;color:var(--ui-text);font-size:13px}
.ls-block .bui-page-header{margin-bottom:0}
.ls-block .bui-page-heading h2{font-size:20px;letter-spacing:-.5px}
.ls-block-state{min-height:240px;display:grid;place-items:center}.ls-block-state .bui-content-state{width:100%}

.ls-block-toolbar{margin:0;justify-content:space-between}
.ls-block .ls-block-caption{font-size:12px;color:var(--ui-secondary);margin:14px 0}
.ls-block-panel{border:1px solid var(--ls-surface-edge);border-radius:16px;background:var(--ls-surface-face);box-shadow:var(--ls-surface-shadow);padding:16px;margin:0}
.ls-block-panel h3{font-size:13px;margin:0;font-weight:600}
.ls-block-panel p{color:var(--ui-secondary);line-height:1.7;margin:0}
.ls-block-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.ls-block-footer{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--ui-line);padding-top:16px;margin-top:0}
.ls-block-panel>.ant-form-item,.ls-block-grid>.ant-form-item{margin-bottom:0}
.ls-block-name{display:flex;align-items:center;gap:9px;min-width:160px;max-width:320px;white-space:normal;overflow-wrap:anywhere}
.ls-block-name .ant-btn{min-width:0;max-width:100%;height:auto;white-space:normal;text-align:left;line-height:1.6;padding-block:3px}
.ls-block-event>div{min-width:0;overflow-wrap:anywhere}
.ls-block-caption{overflow-wrap:anywhere}
.ls-block-avatar{display:inline-grid;place-items:center;width:25px;height:25px;border-radius:7px;background:var(--ui-selected);color:var(--ui-secondary);font-size:11px;flex-shrink:0}
.ls-block-event{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--ui-line)}
.ls-block-event:last-child{border:0}.ls-block-event small{color:var(--ui-secondary)}
@media(max-width:600px){.ls-block-footer{flex-wrap:wrap}.ls-block-panel{min-width:0}.ls-block .ant-select{max-width:100%}
.ls-block-grid{grid-template-columns:1fr}.ls-block-panel{padding:14px}}
`;
function BlockFrame({children}:{children:ReactNode}){return <section className="ls-block"><style>{blockStyles}</style><Stack>{children}</Stack></section>}

export type ProjectListBlockProps=BlockStateProps & {
 rows?:ProjectRecord[]; total?:number; query?:string; status?:string; page?:number; pageSize?:number;
 selectedKeys?:Key[]; onSelectionChange?:(keys:Key[])=>void;
 onFilterChange?:(filter:{query:string;status:string})=>void; onPageChange?:(page:number)=>void;
 refreshing?:boolean; refreshError?:string; actionError?:string; notice?:string; archiving?:boolean;
 onRefresh?:()=>void; onCreate?:()=>void; onOpen?:(row:ProjectRecord)=>void; onEdit?:(row:ProjectRecord)=>void;
 onArchive?:()=>void;
};
/** Controlled presentation: rows are already filtered/paged by the caller. */
export function ProjectListBlock({rows=[],total=rows.length,query='',status='all',page=1,pageSize=5,selectedKeys=[],onSelectionChange,onFilterChange,onPageChange,state='ready',onRetry,refreshing=false,refreshError,actionError,notice,archiving=false,onRefresh,onCreate,onOpen,onEdit,onArchive}:ProjectListBlockProps={}){
 const [archiveOpen,setArchiveOpen]=useState(false);
 const busy=refreshing||archiving;
 const filter=(next:{query:string;status:string})=>{onSelectionChange?.([]);setArchiveOpen(false);onFilterChange?.(next)};
 return <BlockFrame><PageHeader title="项目空间" description="所有项目，各有进展。" meta={state==='ready'?`${total} 个项目`:undefined} actions={<Inline className="ls-block-actions">{onRefresh&&<Button motionIcon="refresh" loading={refreshing} disabled={archiving||state==='loading'} onClick={onRefresh} aria-label="刷新" title="刷新"/>}{onCreate&&<Button motionIcon="add" disabled={busy||state==='loading'} type="primary" onClick={onCreate}>新建项目</Button>}</Inline>}/>
 {notice&&<FeedbackPanel type="success" message={notice}/>}
 {refreshError&&<FeedbackPanel role="alert" type="warning" message={refreshError} description="保留上次结果，数据可能不是最新。" action={onRefresh&&<Button motionIcon="retry" disabled={busy} onClick={onRefresh}>重试刷新</Button>}/>}
 {state!=='ready'?<BlockStatePanel state={state} subject="项目" onRetry={onRetry} action={onCreate&&<Button motionIcon="add" type="primary" onClick={onCreate}>创建第一个项目</Button>}/>:<>
 <Inline className="ls-block-toolbar"><SearchField aria-label="搜索项目" placeholder="搜索名称、标识或负责人…" value={query} disabled={archiving} onChange={query=>filter({query,status})} style={{width:240,maxWidth:'100%'}}/><Select aria-label="项目状态" value={status} disabled={archiving} onChange={status=>filter({query,status})} style={{width:120}} options={[{value:'all',label:'全部状态'},...Object.entries(statusLabels).map(([value,label])=>({value,label}))]}/></Inline>
 {selectedKeys.length>0&&<Inline role="region" aria-label="批量操作" className="ls-block-toolbar" style={{background:'var(--ui-selected)',borderRadius:'var(--ls-control-middle-radius,10px)',padding:'8px 12px'}}><span>已选择 {selectedKeys.length} 个项目</span><Inline className="ls-block-actions"><Button disabled={busy} type="text" onClick={()=>{onSelectionChange?.([]);setArchiveOpen(false)}}>取消选择</Button>{onArchive&&<Popconfirm open={archiveOpen} onOpenChange={setArchiveOpen} title={`归档所选 ${selectedKeys.length} 个项目？`} description="成功项将取消选择，失败项保留供重试。" okText="确认归档" cancelText="取消" onConfirm={()=>{setArchiveOpen(false);onArchive()}}><Button disabled={refreshing} loading={archiving}>归档所选</Button></Popconfirm>}</Inline></Inline>}
 {actionError&&<FeedbackPanel role="alert" type="error" message={actionError} description="未完成的项目保持选中，可重新归档。"/>}
 {refreshing&&<div role="status" className="ls-block-caption">正在刷新，保留当前内容…</div>}
 <div aria-busy={busy}><DataTable<ProjectRecord> rowSelection={onSelectionChange?{selectedRowKeys:selectedKeys,onChange:keys=>{onSelectionChange(keys);setArchiveOpen(false)},preserveSelectedRowKeys:true,getCheckboxProps:row=>({'aria-label':`选择${row.name}`,disabled:busy})}:undefined} locale={{emptyText:<ContentState title={query||status!=='all'?'没有匹配的项目':'暂无项目'} description="试试其他关键词或创建新项目。" action={query||status!=='all'?<Button disabled={busy} onClick={()=>filter({query:'',status:'all'})}>清除筛选</Button>:onCreate&&<Button disabled={busy} onClick={onCreate}>创建项目</Button>}/>}} rowKey="id" scroll={{x:590}} dataSource={rows} pagination={{current:page,pageSize,total,disabled:busy,onChange:onPageChange,showSizeChanger:false,showTotal:total=>`${total} 个项目`}} columns={[
 {title:'项目',dataIndex:'name',render:(_,row)=><div className="ls-block-name"><span className="ls-block-avatar">{row.name.slice(0,1)}</span>{onOpen?<RowActionButton size="small" disabled={busy} onClick={()=>onOpen(row)}>{row.name}</RowActionButton>:row.name}</div>},
 {title:'类别',dataIndex:'category'}, {title:'负责人',dataIndex:'owner'}, {title:'状态',dataIndex:'status',render:status=><ProjectStatus status={status}/>},
 ...(onEdit?[{title:'操作',width:72,render:(_:unknown,row:ProjectRecord)=><RowActionButton size="small" disabled={busy} onClick={()=>onEdit(row)} aria-label={`编辑${row.name}`} motionIcon="edit" title="编辑"/>}]:[])
 ]}/></div></>}</BlockFrame>;
}

export class ProjectFieldError extends Error { constructor(public fields:Partial<Record<keyof ProjectRecord,string[]>>,message='请修正标记的字段后重新保存。'){super(message);this.name='ProjectFieldError'} }
export class ProjectSaveUnknown extends Error { constructor(public reconcile:()=>Promise<ProjectRecord|null>){super('保存结果待核对');this.name='ProjectSaveUnknown'} }
export type EditFormBlockProps=BlockStateProps & {record?:ProjectRecord;owners?:string[];categories?:string[];onDirtyChange?:(dirty:boolean)=>void;onUnresolvedChange?:(unresolved:boolean)=>void;onSave?:(record:ProjectRecord)=>Promise<ProjectRecord|void>|ProjectRecord|void;onCancel?:()=>void};
/** Caller owns persistence, permissions and server validation. Confirm dirty navigation in the caller before changing record.id; do not key by loading state. */
export function EditFormBlock({record=emptyProject,owners=[],categories=[],onDirtyChange,onUnresolvedChange,onSave,onCancel,state='ready',onRetry}:EditFormBlockProps={}){
 const [form]=Form.useForm();const baseline=useRef(record);const submitting=useRef(false);const [dirty,setDirty]=useState(false),[discard,setDiscard]=useState(false);
 const generation=useRef(0);const pendingFocus=useRef<string>();
 const [unknown,setUnknown]=useState<ProjectSaveUnknown>();const recoveryFocus=useRef<HTMLButtonElement>(null),saveFocus=useRef<HTMLButtonElement>(null);const restoreFocus=useRef(false);
 const focusOrigin=useRef<Element|null>(null);
 const canReturnFocus=()=>document.activeElement===document.body||document.activeElement===focusOrigin.current;
 useEffect(()=>{onUnresolvedChange?.(!!unknown)},[unknown,onUnresolvedChange]);
 useEffect(()=>()=>{generation.current++},[]);
 useEffect(()=>{generation.current++;baseline.current=record;form.resetFields();form.setFieldsValue(record);setDirty(false);setFeedback('');setUnknown(undefined);setDiscard(false);setSaving(false);submitting.current=false;pendingFocus.current=undefined;restoreFocus.current=false;focusOrigin.current=null},[record.id]);
 useEffect(()=>{onDirtyChange?.(dirty)},[dirty,onDirtyChange]);
 const reset=()=>{form.resetFields();form.setFieldsValue(baseline.current);setDirty(false);setFeedback('');setDiscard(false);onCancel?.()};
 const [saving,setSaving]=useState(false),[feedback,setFeedback]=useState(''),[failed,setFailed]=useState(false);
 useEffect(()=>{if(!saving&&restoreFocus.current){restoreFocus.current=false;canReturnFocus()&&(unknown?recoveryFocus:saveFocus).current?.focus()}},[saving,unknown]);
 useEffect(()=>{if(!saving&&pendingFocus.current){if(canReturnFocus())form.getFieldInstance(pendingFocus.current)?.focus?.();pendingFocus.current=undefined}},[saving,form]);
 const submit=async(values:ProjectRecord)=>{if(!onSave||submitting.current||unknown)return;const token=generation.current;focusOrigin.current=document.activeElement;submitting.current=true;setSaving(true);setFeedback('');setFailed(false);try{const next={...record,...values,name:values.name.trim()};const response=await onSave(next);if(token!==generation.current)return;const saved=response??next;baseline.current=saved;form.setFieldsValue(saved);setDirty(false);setFeedback('保存成功')}catch(error){if(token!==generation.current)return;setFailed(true);if(error instanceof ProjectSaveUnknown){setUnknown(error);restoreFocus.current=true}if(error instanceof ProjectFieldError){const fields=Object.entries(error.fields).filter(([name])=>['name','owner','category','description','status','notifications'].includes(name));form.setFields(fields.map(([name,errors])=>({name,errors})));if(fields[0])pendingFocus.current=fields[0][0];}setFeedback(error instanceof Error?error.message:'保存失败，请重试')}finally{if(token===generation.current){submitting.current=false;setSaving(false)}}};
 const reconcile=async()=>{if(!unknown||submitting.current)return;const token=generation.current;focusOrigin.current=document.activeElement;submitting.current=true;setSaving(true);try{const saved=await unknown.reconcile();if(token!==generation.current)return;setUnknown(undefined);setFailed(!saved);if(saved){baseline.current=saved;form.setFieldsValue(saved);setDirty(false);setFeedback('保存成功')}else{setFeedback('已确认未执行，可以重新保存。')}restoreFocus.current=true}catch{if(token===generation.current){setFeedback('暂时无法核对，输入和待核对请求已保留。');restoreFocus.current=true}}finally{if(token===generation.current){submitting.current=false;setSaving(false)}}};
 if(state!=='ready')return <BlockFrame><Form form={form} component={false}/><PageHeader title="编辑项目" description="项目资料"/><BlockStatePanel state={state} subject="项目资料" onRetry={onRetry} action={onCancel&&<Button onClick={onCancel}>返回列表</Button>}/></BlockFrame>;
 return <BlockFrame><PageHeader title={record.name?'编辑项目':'新建项目'} description="清晰的信息，是协作的起点。" meta={record.name?record.id:'草稿'}/>
 <Form form={form} aria-busy={saving} layout="vertical" initialValues={record} onValuesChange={(changed,values)=>{setDirty(Object.keys(values).some(key=>values[key as keyof ProjectRecord]!==baseline.current[key as keyof ProjectRecord]));form.setFields(Object.keys(changed).map(name=>({name,errors:[]})));setFeedback('')}} onFinish={submit} onFinishFailed={({errorFields})=>{if(errorFields[0])form.getFieldInstance(errorFields[0].name)?.focus?.()}} disabled={saving||!!unknown} requiredMark={true}><Stack>
 <Stack className="ls-block-panel"><Stack gap="xs"><h3>基本信息</h3><p>填写团队用于识别和管理项目的信息。</p></Stack>
 <Form.Item label="项目名称" name="name" rules={[{required:true,whitespace:true,message:'请输入项目名称'}]}><TextInput maxLength={60} placeholder="例如：设计系统"/></Form.Item>
 <div className="ls-block-grid"><Form.Item label="负责人" name="owner" rules={[{required:true,message:'请选择负责人'}]}><Select options={owners.map(value=>({value,label:value}))}/></Form.Item><Form.Item label="项目类别" name="category"><Select options={categories.map(value=>({value,label:value}))}/></Form.Item></div>
 <Form.Item label="项目说明" name="description"><TextArea rows={3} maxLength={240} showCount placeholder="描述目标与使用场景…"/></Form.Item></Stack>
 <Stack className="ls-block-panel"><Stack gap="xs"><h3>协作设置</h3><p>选择当前阶段和通知偏好。</p></Stack><Form.Item label="项目状态" name="status"><Select options={Object.entries(statusLabels).map(([value,label])=>({value,label}))}/></Form.Item><Form.Item label="接收项目更新通知" name="notifications" valuePropName="checked"><Switch/></Form.Item></Stack>
 {feedback&&<FeedbackPanel role={failed?"alert":"status"} type={unknown?'warning':failed?'error':'success'} message={feedback} description={unknown?'请求可能已执行。先核对回执，避免重复保存；当前输入保留。':failed?'修正问题后使用下方保存按钮重试，输入不会丢失。':undefined} action={unknown&&<Button motionIcon="retry" ref={recoveryFocus} disabled={saving} loading={saving} onClick={reconcile}>核对保存结果</Button>}/>}
 <Inline className="ls-block-footer"><span className="ls-block-caption" role="status">{saving?(unknown?'正在核对回执…':'正在保存，请稍候…'):unknown?'等待回执核对，不重复提交。':feedback?'':!onSave?'未配置保存操作，当前输入不会提交。':dirty?'有未保存的修改':'保存后修改才会生效。'}</span><Inline className="ls-block-actions"><Button disabled={saving||!!unknown} onClick={()=>dirty?setDiscard(true):reset()}>{onCancel?'取消':'重置'}</Button><Button motionIcon="save" ref={saveFocus} type="primary" htmlType="submit" disabled={!onSave||!!unknown} loading={saving&&!unknown}>保存项目</Button></Inline></Inline>
 </Stack></Form><Modal title="放弃未保存的修改？" open={discard} onCancel={()=>setDiscard(false)} onOk={reset} okText="放弃修改" cancelText="继续编辑" okButtonProps={{danger:true}}><p>当前输入尚未保存。放弃后将恢复最近保存的内容。</p></Modal></BlockFrame>;
}

export type ProjectActivity={id:string;actor:string;label:string;time:string};
export type DetailBlockProps=BlockStateProps & {record?:ProjectRecord;activities?:ProjectActivity[];onBack?:()=>void;onEdit?:()=>void};
export function DetailBlock({record,activities=[],onBack,onEdit,state='ready',onRetry}:DetailBlockProps={}){
 if(state!=='ready'||!record)return <BlockFrame><PageHeader title="项目详情" description="项目信息与最新进展"/><BlockStatePanel state={state==='ready'?'empty':state} subject="项目详情" onRetry={onRetry} action={onBack&&<Button onClick={onBack}>返回列表</Button>}/></BlockFrame>;
 return <BlockFrame><div className="ls-block-caption">{onBack&&<RowActionButton onClick={onBack}>← 返回列表</RowActionButton>} {record.id}</div><PageHeader title={record.name} description={record.description} meta={<ProjectStatus status={record.status}/>} actions={onEdit&&<Button onClick={onEdit}>编辑项目</Button>}/>
 <Tabs items={[{key:'overview',label:'概览',children:<Stack><Stack className="ls-block-panel"><h3>项目信息</h3><MetadataList items={[{key:'id',label:'项目标识',value:record.id},{key:'owner',label:'负责人',value:record.owner},{key:'category',label:'类别',value:record.category},{key:'notifications',label:'更新通知',value:record.notifications?'已开启':'已关闭'}]}/></Stack><Stack className="ls-block-panel"><h3>里程碑进度</h3><Progress value={record.progress} label="里程碑进度" status="unknown"/></Stack></Stack>},{key:'activity',label:'活动记录',children:<Stack className="ls-block-panel"><h3>最近活动</h3>{activities.length?activities.map(event=><div className="ls-block-event" key={event.id}><span className="ls-block-avatar">{event.actor.slice(0,1)}</span><div>{event.actor} · {event.label}<br/><small>{event.time}</small></div></div>):<ContentState title="暂无活动记录"/>}</Stack>}]}/></BlockFrame>;
}
export function SidebarBlock(){const [collapsed,setCollapsed]=useState(false),[open,setOpen]=useState(['workspace']),[selected,setSelected]=useState('/projects');return <div style={{display:"flex",gap:24,alignItems:"flex-start",flexWrap:"wrap"}}><div style={{width:collapsed?64:220}}><BeautifulNavigation collapsed={collapsed} items={[{key:'workspace',label:'项目空间',icon:<MotionIcon name="folder" size={16}/>,children:[{key:'/projects',label:'全部项目'},{key:'/groups',label:'项目组'}]},{key:'/settings',label:'设置',icon:<MotionIcon name="settings" size={16}/>}]} selectedKeys={[selected]} openKeys={open} onOpenChange={setOpen} onClick={({key})=>setSelected(key)}/></div><section><Button motionIcon="sidebar" iconActive={!collapsed} onClick={()=>setCollapsed(!collapsed)}>{collapsed?'展开侧栏':'折叠侧栏'}</Button><p role="status" style={{color:"var(--ui-secondary)"}}>当前页面：{selected}</p></section></div>}
