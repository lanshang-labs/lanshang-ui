import {Select} from '../dist/index.js';
import {Inline} from '../dist/index.js';
import {useEffect,useRef,useState,type Key} from 'react';
import {Dialog as Modal} from '../dist/index.js';
import {ToggleSwitch as Switch} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {ProjectListBlock,EditFormBlock,DetailBlock,ProjectFieldError,emptyProject,type ProjectRecord,type ProjectActivity,type BlockState} from './blocks';
import {createProjectSource,demoOwners,demoCategories,type FailureMode} from './mock-project-source';

/** Async controller example. The generated Blocks contain neither fixtures nor requests. */
function BlockPreview({kind}:{kind:'list'|'edit'|'detail'}){
 const [dirty,setDirty]=useState(false),[pending,setPending]=useState<string>(),[fieldFail,setFieldFail]=useState(false);
 const switchRecord=(next:string)=>{if(dirty)setPending(next);else setId(next)};
 const source=useRef(createProjectSource()).current;
 const [view,setView]=useState(kind),[id,setId]=useState(kind==='list'?'':'PRJ-001');
 const [filter,setFilter]=useState({query:'',status:'all'}),[page,setPage]=useState(1);
 const [rows,setRows]=useState<ProjectRecord[]>([]),[total,setTotal]=useState(0);
 const [record,setRecord]=useState<ProjectRecord>(),[activities,setActivities]=useState<ProjectActivity[]>([]);
 const [state,setState]=useState<BlockState>('loading'),[scenario,setScenario]=useState<BlockState>('ready');
 const [readFail,setReadFail]=useState(false),[saveFail,setSaveFail]=useState(false),[archiveMode,setArchiveMode]=useState<FailureMode>('none');
 const [busy,setBusy]=useState(false),[refreshing,setRefreshing]=useState(false),[archiving,setArchiving]=useState(false);
 const [selected,setSelected]=useState<Key[]>([]),[refreshError,setRefreshError]=useState(''),[actionError,setActionError]=useState(''),[notice,setNotice]=useState('');
 const [revision,setRevision]=useState(0);const request=useRef(0);
 const loadList=async(background=false)=>{
  const token=++request.current;setRefreshError('');setBusy(true);setRefreshing(background);if(!background)setState('loading');
  try{const data=await source.list({...filter,page,pageSize:5},readFail);if(token!==request.current)return;
   if(page>1&&!data.rows.length&&data.total){setPage(Math.ceil(data.total/5));return}
   setRows(data.rows);setTotal(data.total);setState('ready');
  }catch(error){if(token!==request.current)return;if(background)setRefreshError((error as Error).message);else setState('error')}
  finally{if(token===request.current){setBusy(false);setRefreshing(false)}}
 };
 useEffect(()=>{
  if(scenario!=='ready'){++request.current;setState(scenario);setBusy(false);setRefreshing(false);return}
  if(view==='list'){void loadList(state==='ready');return()=>{++request.current}}
  const token=++request.current;setState('loading');setBusy(true);
  if(!id){setRecord({...emptyProject});setState('ready');setBusy(false);return}
  source.detail(id,readFail).then(data=>{if(token!==request.current)return;setRecord(data.record);setActivities(data.activities);setState(data.record?'ready':'empty')}).catch(()=>{if(token===request.current)setState('error')}).finally(()=>{if(token===request.current)setBusy(false)});
  return()=>{++request.current};
 },[view,id,filter,page,revision,scenario]);
 const retry=()=>{setScenario('ready');setRevision(n=>n+1)};
 const back=()=>{setView('list');setScenario('ready');setRevision(n=>n+1)};
 const open=(row:ProjectRecord,mode:'detail'|'edit')=>{setId(row.id);setView(mode);setScenario('ready')};
 const archive=async()=>{
  if(busy)return;setBusy(true);setArchiving(true);setActionError('');setNotice('');
  try{const result=await source.archive(selected.map(String),archiveMode);setSelected(result.failed);setNotice(result.succeeded.length?`已归档 ${result.succeeded.length} 个项目`:'');if(result.failed.length)setActionError(`${result.failed.length} 个项目未完成（模拟拒绝），可重试。`);await loadList(true)}
  catch(error){setActionError((error as Error).message)}finally{setArchiving(false);setBusy(false)}
 };
 return <div style={{width:'100%',minWidth:0}}><Inline gap="md" style={{paddingBottom:16,marginBottom:16,borderBottom:'1px solid var(--ui-line)'}}>
 <span style={{fontSize:12,color:'var(--ui-muted)'}}>模拟数据源 · 约 700ms</span>
 <Select aria-label="区块预览场景" disabled={busy} value={scenario} style={{width:130}} onChange={setScenario} options={[{value:'ready',label:'正常请求'},{value:'loading',label:'持续加载'},{value:'empty',label:'空数据'},{value:'error',label:'加载失败'}]}/>
 {scenario==='loading'&&<Button onClick={retry}>模拟加载完成</Button>}
 <label style={{fontSize:12}}><Switch aria-label="读取失败" disabled={busy} checked={readFail} onChange={setReadFail}/> 读取失败</label>
 {view==='edit'&&<><Select aria-label="切换编辑记录" value={id||undefined} disabled={busy} placeholder="新项目" style={{width:150}} onChange={switchRecord} options={[{value:'PRJ-001',label:'记录 1 · 设计系统'},{value:'PRJ-002',label:'记录 2 · 文档中心'}]}/><label style={{fontSize:12}}><Switch aria-label="服务端字段错误" disabled={busy} checked={fieldFail} onChange={setFieldFail}/> 字段错误</label></>}
 {view==='edit'?<label style={{fontSize:12}}><Switch aria-label="保存失败" disabled={busy} checked={saveFail} onChange={setSaveFail}/> 保存失败</label>:view==='list'&&<Select aria-label="归档结果" disabled={busy} value={archiveMode} onChange={setArchiveMode} style={{width:145}} options={[{value:'none',label:'归档全部成功'},{value:'partial',label:'归档部分失败'},{value:'all',label:'归档全部失败'}]}/>}
 </Inline>
 {view==='list'?<ProjectListBlock rows={rows} total={total} {...filter} page={page} selectedKeys={selected} onSelectionChange={keys=>{setSelected(keys);setActionError('');setNotice('')}} onFilterChange={next=>{setFilter(next);setPage(1);setActionError('');setNotice('')}} onPageChange={setPage} state={state} onRetry={retry} refreshing={refreshing} refreshError={refreshError} actionError={actionError} notice={notice} archiving={archiving} onRefresh={()=>loadList(true)} onCreate={()=>{setId('');setView('edit');setScenario('ready')}} onOpen={row=>open(row,'detail')} onEdit={row=>open(row,'edit')} onArchive={archive}/>:view==='detail'?<DetailBlock record={record} activities={activities} state={state} onRetry={retry} onBack={back} onEdit={()=>setView('edit')}/>:<EditFormBlock record={record} onDirtyChange={setDirty} owners={demoOwners} categories={demoCategories} state={state} onRetry={retry} onCancel={back} onSave={async next=>{setBusy(true);try{if(fieldFail){await new Promise(resolve=>setTimeout(resolve,700));throw new ProjectFieldError({name:['该项目名称已存在，请更换名称。']})}const saved=await source.save({...next,name:next.name.trim()},saveFail);setId(saved.id);setRecord(saved);if(kind!=='edit')setView('detail');setNotice('');setSelected([]);return saved}finally{setBusy(false)}}}/>}
 <Modal title="切换记录并放弃修改？" open={pending!==undefined} onCancel={()=>setPending(undefined)} onOk={()=>{setId(pending!);setPending(undefined);setDirty(false)}} okText="放弃并切换" cancelText="继续编辑"><p>当前记录有未保存的输入。继续编辑会保留输入，切换后加载另一条记录。</p></Modal>
 <p style={{color:'var(--ui-muted)',fontSize:12,marginTop:16}}>仅当前页面内存数据 · 保存后可在详情活动中核对 · 刷新浏览器重置</p>
 </div>;
}
export const ProjectListPreview=()=> <BlockPreview kind="list"/>;
export const EditFormPreview=()=> <BlockPreview kind="edit"/>;
export const DetailPreview=()=> <BlockPreview kind="detail"/>;
