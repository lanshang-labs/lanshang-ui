import {MotionButton} from '../dist/index.js';
import {Select} from '../dist/index.js';
import {Stack,Inline,ButtonGroup,RowActionButton} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
import {parseRecovery,reconcile,type RecoveryRecord,type Receipt} from './task-recovery-store';
export const queueJournalKey='lanshang-demo:task-queue-journal:v1';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {SearchField,TaskProgressBlock,type TaskRow} from '../dist/index.js';
import './task-queue-preview.css';
import {initialTasks,queueBoundaryTasks,applyCommand,eligible,startNext,type BatchCommand,type DemoCommand} from './task-queue-model';

export function TaskQueuePreview(){
 const cancelOrigin=useRef<HTMLElement|null>(null),operationOrigin=useRef<HTMLElement|null>(null),actionOwner=useRef<Element|null>(null);
 const returnButton=useRef<HTMLButtonElement>(null),retryButton=useRef<HTMLButtonElement>(null),receiptButton=useRef<HTMLButtonElement>(null),result=useRef<HTMLParagraphElement>(null);
 const focusRequest=useRef<null|(()=>HTMLElement|null)>(null);const [focusTick,setFocusTick]=useState(0);
 function focusAfterRender(target:()=>HTMLElement|null,guard=false){
  if(guard&&document.activeElement!==document.body&&document.activeElement!==actionOwner.current)return;
  focusRequest.current=target;setFocusTick(value=>value+1);
 }
 const restoreOrigin=()=>{const origin=operationOrigin.current;return origin?.isConnected&&!origin.matches(':disabled')?origin:result.current};
 useLayoutEffect(()=>{const target=focusRequest.current;focusRequest.current=null;target?.()?.focus()},[focusTick]);
 function openCancel(ids:string[]){cancelOrigin.current=document.activeElement as HTMLElement;setConfirmCancel(ids);focusAfterRender(()=>returnButton.current)}
 function closeCancel(){setConfirmCancel(null);focusAfterRender(()=>cancelOrigin.current?.isConnected?cancelOrigin.current:result.current)}

 const [query,setQuery]=useState(''),[page,setPage]=useState(1);
 const [ready,setReady]=useState(false),[storageError,setStorageError]=useState('');
 const [delivery,setDelivery]=useState<'normal'|Receipt>('normal');
 const [unknown,setUnknown]=useState(false),[queryFails,setQueryFails]=useState(false);
 const journal=useRef<RecoveryRecord>({version:1,tasks:initialTasks(),operation:null});
 const [queue,setQueue]=useState(false);
 const [tasks,setTasks]=useState(()=>initialTasks());
 const [selected,setSelected]=useState<string[]>([]);
 const [failNext,setFailNext]=useState(false);
 const [error,setError]=useState('');
 const [failedRequest,setFailedRequest]=useState<{ids:string[];action:BatchCommand}|null>(null);
 const [confirmCancel,setConfirmCancel]=useState<string[]|null>(null);
 const [pending,setPending]=useState('');
 const [notice,setNotice]=useState('本地模拟，点击“模拟完成当前步骤”推进，不随时间自动完成。');
 const timer=useRef<ReturnType<typeof setTimeout>>();
 const lock=useRef(false);
 useEffect(()=>{
  try{const raw=sessionStorage.getItem(queueJournalKey);if(raw){const saved=parseRecovery(raw);const mode=JSON.parse(raw).queue;if(typeof mode!=='boolean')throw new Error();journal.current=saved;setQueue(mode);setTasks(saved.tasks);if(saved.operation?.phase==='unknown'){setUnknown(true);setSelected(saved.operation.ids);setNotice('已恢复原命令，必须核对回执；没有重新执行。')}else if(saved.operation?.phase==='rejected'){setFailedRequest(saved.operation);setError('原命令已明确拒绝，任务未修改。')}}}catch{setStorageError('恢复记录无法读取，已阻止操作。可明确重置本地样例。')}setReady(true);
  return()=>clearTimeout(timer.current);
 },[]);
 function save(next:RecoveryRecord,mode=queue){try{sessionStorage.setItem(queueJournalKey,JSON.stringify({...next,queue:mode}));journal.current=next;setTasks(next.tasks);return true}catch{setStorageError('无法保存恢复记录，已阻止操作；恢复存储后重置样例。');return false}}
 function updateTasks(change:(tasks:RecoveryRecord['tasks'])=>RecoveryRecord['tasks']){save({...journal.current,tasks:change(journal.current.tasks)})}
 function acceptReceipt(){
  const original=journal.current.operation;if(!original)return;
  const next=reconcile(journal.current,original.id);
  if(!save(next))return;
  setUnknown(next.operation?.phase==='unknown');
  if(next.operation?.phase==='rejected'){focusAfterRender(()=>retryButton.current,true);setFailedRequest(original);setError('模拟服务明确拒绝了本次命令，任务未修改。可以重试原操作或放弃。')}
  else if(next.operation?.phase==='confirmed'){focusAfterRender(restoreOrigin,true);setFailedRequest(null);setError('');setSelected([])}
  if(next.operation?.phase==='unknown')focusAfterRender(()=>receiptButton.current,true);
  setNotice(next.operation?.phase==='unknown'?'仍在处理，保留原命令并继续等待。':next.operation?.phase==='confirmed'?'已核对原命令成功，同步状态，没有重复执行。':'已核对原命令未执行。');
 }
 function queryReceipt(){if(lock.current||storageError||!unknown)return;actionOwner.current=document.activeElement;lock.current=true;setPending('receipt');timer.current=setTimeout(()=>{lock.current=false;setPending('');if(queryFails){focusAfterRender(()=>receiptButton.current,true);setNotice('回执查询失败，仍锁定原命令；再次查询不会重发。');return}acceptReceipt()},450)}
 function reset(next=queue){setQuery('');setPage(1);clearTimeout(timer.current);lock.current=false;setPending('');setQueue(next);setTasks(initialTasks(next));setNotice('已重置本地样例。');setSelected([]);setError('');setFailedRequest(null);setConfirmCancel(null);setFailNext(false);setStorageError('');setUnknown(false);setDelivery('normal');setQueryFails(false);save({version:1,tasks:initialTasks(next),operation:null},next)}
 function command(id:string,action:DemoCommand){
  if(lock.current||failedRequest||unknown||storageError||!ready)return;
  lock.current=true;setPending(id);setNotice('正在等待模拟回执，当前状态保持不变…');
  timer.current=setTimeout(()=>{
   updateTasks(current=>applyCommand(current,id,action));lock.current=false;setPending('');
   setNotice(({pause:'已暂停，保留已完成步骤，后续任务等待。',resume:'已恢复当前任务。',retry:'已重试失败步骤；已完成步骤不重跑。',fail:'当前任务失败，后续任务保持等待。',complete:'当前步骤已完成；有后续任务时继续执行。',cancel:'任务已取消'})[action]);
  },450);
 }
 function batch(ids:string[],action:BatchCommand,retry=false){
  if(lock.current||unknown||storageError||!ready||(!retry&&failedRequest))return;
  const targets=ids.filter(id=>tasks.some(task=>task.id===id&&eligible(task,action)));
  if(!targets.length)return;
  actionOwner.current=document.activeElement;
  if(!retry)operationOrigin.current=confirmCancel?cancelOrigin.current:document.activeElement as HTMLElement;
  const receipt:Receipt=failNext?'rejected':delivery==='normal'?'applied':delivery;
  const op={id:crypto.randomUUID(),ids:targets,action,receipt,phase:'unknown' as const};
  if(!save({...journal.current,operation:op}))return;
  setUnknown(true);lock.current=true;setPending('batch');setError('');setConfirmCancel(null);setFailNext(false);
  const timeout=delivery!=='normal'&&!failNext;setDelivery('normal');
  setNotice(`正在处理 ${targets.length} 项任务，原命令已保存…`);
  timer.current=setTimeout(()=>{lock.current=false;setPending('');if(timeout){focusAfterRender(()=>receiptButton.current,true);setNotice('请求超时，结果未知。请核对原命令，不要重新发送。');return}acceptReceipt()},450);
 }

 const blocked=!ready||!!storageError||unknown||!!pending||!!failedRequest||!!confirmCancel;
 const selectable=tasks.filter(task=>!['done','cancelled'].includes(task.status));
 const count=(action:BatchCommand)=>tasks.filter(task=>selected.includes(task.id)&&eligible(task,action)).length;
 const active=tasks.find(task=>['running','paused','failed'].includes(task.status));
 const done=tasks.filter(task=>task.status==='done').length;
 const filtered=tasks.filter(task=>task.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 const pageCount=Math.max(1,Math.ceil(filtered.length/10));
 const currentPage=Math.min(page,pageCount);
 const visible=filtered.slice((currentPage-1)*10,currentPage*10);
 const rows:TaskRow[]=visible.map((task,index)=>({key:task.id,label:task.title,status:task.status,step:tasks.indexOf(task)+1,amount:task.status==='queued'?'等待前序任务':`第 ${task.attempt} 次执行`,details:[{label:'状态说明',meta:task.status==='failed'?'请求失败，已完成结果保留':task.status==='paused'?'暂停已确认，不推进后续任务':task.status==='done'?'模拟完成回执已确认':'仅模拟，不连接业务服务'}],actions:<><Checkbox disabled={blocked||['done','cancelled'].includes(task.status)} aria-label={`选择 ${task.title}`} checked={selected.includes(task.id)} onChange={event=>setSelected(current=>event.target.checked?[...current,task.id]:current.filter(id=>id!==task.id))}>选择</Checkbox>{task.status==='running'?<MotionButton motionIcon="play" iconActive aria-label="暂停" loading={pending===task.id} disabled={blocked} onClick={()=>batch([task.id],'pause')}>暂停</MotionButton>:task.status==='paused'?<MotionButton motionIcon="play" aria-label="恢复" disabled={blocked} loading={pending===task.id} onClick={()=>batch([task.id],'resume')}>恢复</MotionButton>:task.status==='failed'?<MotionButton motionIcon="retry" disabled={blocked} loading={pending===task.id} onClick={()=>batch([task.id],'retry')}>重试失败任务</MotionButton>:undefined}{!['done','cancelled'].includes(task.status)&&<MotionButton motionIcon="stop" disabled={blocked} onClick={()=>openCancel([task.id])}>取消任务</MotionButton>}</>}));
 return <Stack className="ls-queue-demo">
  <Inline><ButtonGroup aria-label="任务模式"><RowActionButton disabled={unknown} aria-pressed={!queue} onClick={()=>reset(false)}>多阶段任务</RowActionButton><RowActionButton disabled={unknown} aria-pressed={queue} onClick={()=>reset(true)}>串行任务队列</RowActionButton></ButtonGroup><Button onClick={()=>reset()}>重置样例</Button></Inline>
  <Inline>{(['long','large','empty'] as const).map(kind=><Button key={kind} disabled={unknown||!!pending} onClick={()=>{reset(true);save({version:1,tasks:queueBoundaryTasks(kind),operation:null},true)}}>{({long:'长文本样例',large:'120 项任务',empty:'空队列样例'})[kind]}</Button>)}</Inline>
  <SearchField aria-label="筛选任务" placeholder="搜索任务名称" value={query} disabled={!!confirmCancel} onChange={value=>{setQuery(value);setPage(1)}}/>
  <p className="docs-muted">共 {tasks.length} 项，匹配 {filtered.length} 项；全选与批量操作作用于整个队列，包含其他页和当前未显示的已选任务。</p>
  <Inline>
   <Checkbox disabled={blocked||!selectable.length} checked={!!selectable.length&&selected.length===selectable.length} indeterminate={selected.length>0&&selected.length<selectable.length} onChange={event=>setSelected(event.target.checked?selectable.map(task=>task.id):[])}>选择全部可操作任务</Checkbox>
   <span className="docs-muted">已选择 {selected.length} 项</span>
   {(['pause','resume','retry','cancel'] as BatchCommand[]).map(action=><MotionButton motionIcon={action==="retry"?"retry":action==="cancel"?"stop":"play"} iconActive={action==="pause"} key={action} disabled={blocked||!count(action)} onClick={()=>action==='cancel'?openCancel(selected.filter(id=>tasks.some(task=>task.id===id&&eligible(task,action)))):batch(selected,action)}>{({pause:'批量暂停',resume:'批量恢复',retry:'批量重试',cancel:'批量取消'})[action]} ({count(action)})</MotionButton>)}
  </Inline>
  {storageError&&<FeedbackPanel role="alert" type="error" message={storageError}/>}
  {unknown&&<FeedbackPanel type="warning" message="原命令待核对，已锁定重复操作" description={<Stack gap="md"><p style={{overflowWrap:'anywhere'}}>命令 {journal.current.operation?.id} · {journal.current.operation&&({pause:'暂停',resume:'恢复',retry:'重试',cancel:'取消'})[journal.current.operation.action]} · {journal.current.operation?.ids.length} 项。保留最近确认状态，刷新后可继续核对。</p><Inline><Button ref={receiptButton} disabled={!!pending||!!storageError} onClick={queryReceipt}>核对原命令回执</Button><Button disabled={!!pending} aria-pressed={queryFails} onClick={()=>setQueryFails(!queryFails)}>模拟查询失败</Button>{journal.current.operation?.receipt==='pending'&&<Button disabled={!!pending||!!storageError} onClick={()=>save({...journal.current,operation:{...journal.current.operation!,receipt:'applied'}})}>模拟服务完成原命令</Button>}</Inline></Stack>}/>}
  {confirmCancel&&<div role="group" aria-label="取消任务确认" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeCancel()}}}><FeedbackPanel type="warning" message={`确认取消 ${confirmCancel.length} 项任务？`} description={<Stack gap="md"><div className="ls-queue-cancel-targets" tabIndex={0} aria-label="待取消任务名单"><ul>{tasks.filter(task=>confirmCancel.includes(task.id)).map(task=><li key={task.id}>{task.title}</li>)}</ul></div><p>已完成结果保留，取消后不能恢复；后续任务不会自动开始。</p><Inline><MotionButton motionIcon="back" ref={returnButton} onClick={closeCancel}>返回队列</MotionButton><MotionButton motionIcon="stop" danger onClick={()=>batch(confirmCancel,'cancel')}>确认取消</MotionButton></Inline></Stack>}/></div>}
  {error&&<FeedbackPanel role="alert" type="error" message={error} description={<Inline><MotionButton motionIcon="retry" ref={retryButton} disabled={!!pending} onClick={()=>failedRequest&&batch(failedRequest.ids,failedRequest.action,true)}>重试原操作</MotionButton><Button disabled={!!pending} onClick={()=>{focusAfterRender(restoreOrigin);setError('');setFailedRequest(null);setNotice('已放弃失败命令，任务未修改。');save({...journal.current,operation:null})}}>放弃本次操作</Button></Inline>}/>}
  <TaskProgressBlock title={queue?'工作队列':'准备项目交付'} description={queue?'并发数 1 · 当前任务结束后领取下一项':'三个阶段 · 保留已完成结果'} rows={rows} emptyText={tasks.length?'没有匹配的任务':'队列中暂无任务'} labels={{completed:'完成',failed:'失败'}}
    progress={{label:tasks.length===0?'尚未创建任务':unknown?'等待原命令回执核对':active?.status==='running'?active.title:done===tasks.length?'所有任务已完成':tasks.every(task=>['done','cancelled'].includes(task.status))?'队列已结束':active?.title??'等待任务',status:tasks.length===0?'queued':unknown?'unknown':active?.status==='running'?'running':active?.status==='failed'?'failed':active?.status==='paused'?'paused':done===tasks.length?'success':tasks.every(task=>['done','cancelled'].includes(task.status))?'cancelled':'queued',valueText:`${done} / ${tasks.length} ${queue?'任务':'阶段'}完成`}}/>
  {filtered.length>10&&<Inline aria-label="任务分页"><MotionButton motionIcon="back" disabled={currentPage===1||!!confirmCancel} onClick={()=>setPage(currentPage-1)} aria-label="上一页任务" title="上一页任务"/><span>第 {currentPage} / {pageCount} 页 · 每页 10 项</span><MotionButton motionIcon="forward" disabled={currentPage===pageCount||!!confirmCancel} onClick={()=>setPage(currentPage+1)} aria-label="下一页任务" title="下一页任务"/></Inline>}
  {!tasks.length&&<MotionButton motionIcon="add" onClick={()=>reset(true)}>添加模拟任务</MotionButton>}
  {!!tasks.length&&!filtered.length&&<Button onClick={()=>{setQuery('');setPage(1)}}>清除筛选</Button>}
  <Inline><Button disabled={!active||active.status!=='running'||blocked} onClick={()=>active&&command(active.id,'complete')}>模拟完成当前步骤</Button><Button disabled={!active||active.status!=='running'||blocked} onClick={()=>active&&command(active.id,'fail')}>模拟当前步骤失败</Button></Inline>
  <Inline><Select aria-label="命令响应场景" disabled={blocked} value={delivery} onChange={setDelivery} options={[{value:'normal',label:'正常回执'},{value:'applied',label:'超时：服务已执行'},{value:'rejected',label:'超时：明确未执行'},{value:'pending',label:'超时：服务仍在处理'}]}/><Checkbox checked={failNext} disabled={blocked} onChange={event=>setFailNext(event.target.checked)}>下一次管理操作模拟失败</Checkbox><Button disabled={blocked||!!active||!tasks.some(task=>task.status==='queued')} onClick={()=>{updateTasks(current=>startNext(current));setNotice('已显式继续后续任务。')}}>继续后续任务</Button></Inline>
  <p ref={result} tabIndex={-1} aria-label="队列操作结果" className="docs-muted ls-queue-result" role="status">{notice}</p>
  <a href="#/blocks/task-recovery">查看请求超时、回执核对与刷新恢复示例 →</a>
 </Stack>;
}
