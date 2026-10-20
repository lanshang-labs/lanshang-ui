import {Select} from '../dist/index.js';
import './task-queue-preview.css';
import {Stack,Inline} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
import {useEffect,useRef,useState} from 'react';
import {MotionButton as Button} from '../dist/index.js';
import {TaskProgressBlock} from '../dist/index.js';
import {freshRecovery,parseRecovery,reconcile,recoveryKey,type RecoveryRecord,type Receipt} from './task-recovery-store';

export function TaskRecoveryPreview(){
 const [record,setRecord]=useState<RecoveryRecord>(freshRecovery);
 const [ready,setReady]=useState(false),[busy,setBusy]=useState(false);
 const [error,setError]=useState(''),[notice,setNotice]=useState('');
 const [outcome,setOutcome]=useState<Receipt>('applied');
 const [queryFails,setQueryFails]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>>();const locked=useRef(false);
 useEffect(()=>{try{const saved=parseRecovery(sessionStorage.getItem(recoveryKey));setRecord(saved);setNotice(saved.operation?.phase==='unknown'?'已恢复待核对命令；没有重新发送。':'已读取本地模拟记录。')}catch{setError('无法读取恢复记录。已停止操作；可明确重置本地样例。')}setReady(true);return()=>clearTimeout(timer.current)},[]);
 function persist(next:RecoveryRecord){try{sessionStorage.setItem(recoveryKey,JSON.stringify(next));setRecord(next);return true}catch{setError('无法保存恢复记录，已停止操作。请允许当前站点存储后重置样例。');return false}}
 const unresolved=record.operation?.phase==='unknown';
 function submit(){
  if(locked.current||unresolved||error||!ready)return;
  const task=record.tasks.find(t=>t.status==='running');if(!task)return;
  const next:RecoveryRecord={...record,operation:{id:crypto.randomUUID(),ids:[task.id],action:'pause',receipt:outcome,phase:'unknown'}};
  // Journal before simulating transmission. Reload never replays this mutation.
  if(!persist(next))return;
  locked.current=true;setBusy(true);setNotice('已发送模拟暂停命令，等待响应…');
  timer.current=setTimeout(()=>{locked.current=false;setBusy(false);setNotice('请求超时，结果未知。超时不代表失败，请核对原命令回执。')},600);
 }
 function check(){
  if(locked.current||!unresolved||error)return;
  const id=record.operation!.id;locked.current=true;setBusy(true);setNotice('正在只读核对原命令回执…');
  timer.current=setTimeout(()=>{
   locked.current=false;setBusy(false);
   if(queryFails){setNotice('回执查询暂时失败，原命令仍待核对；可以再次查询，不会重发命令。');return}
   const next=reconcile(record,id);
   if(persist(next))setNotice(next.operation?.phase==='confirmed'?'已确认原命令成功，仅同步任务状态。':next.operation?.phase==='rejected'?'已确认原命令未执行，可手动发起新操作。':'服务仍在处理，继续保留待核对状态。');
  },450);
 }
 function reset(){clearTimeout(timer.current);locked.current=false;setBusy(false);setError('');if(persist(freshRecovery()))setNotice('仅重置本地模拟数据；真实业务不能据此丢弃未决命令。')}
 return <Stack className="ls-queue-demo">
  <p className="docs-muted">独立的刷新恢复实验。只在本标签页 sessionStorage 保存样例，未连接真实服务。</p>
  <Inline><Select aria-label="模拟服务回执" disabled={busy||!!unresolved||!!error} value={outcome} onChange={setOutcome} options={[{value:'applied',label:'已执行，但响应丢失'},{value:'rejected',label:'明确未执行'},{value:'pending',label:'服务仍在处理'}]}/><Button disabled={!ready||busy||!!unresolved||!!error||!record.tasks.some(t=>t.status==='running')} onClick={submit}>发送暂停并模拟超时</Button><Button onClick={reset}>重置恢复样例</Button></Inline>
  {error&&<FeedbackPanel role="alert" type="error" message={error}/>}
  {unresolved&&<FeedbackPanel type="warning" message={busy?'正在等待回执':'结果未知，禁止重复发送'} description={<Stack gap="md"><p style={{overflowWrap:'anywhere'}}>原命令：{record.operation?.id} · 暂停任务。刷新页面后仍需核对。</p><Inline><Button disabled={busy||!!error} onClick={check}>核对原命令回执</Button><Button disabled={busy} aria-pressed={queryFails} onClick={()=>setQueryFails(!queryFails)}>{queryFails?'关闭查询失败模拟':'模拟回执查询失败'}</Button>{record.operation?.receipt==='pending'&&<Button disabled={busy||!!error} onClick={()=>persist({...record,operation:{...record.operation!,receipt:'applied'}})}>模拟服务完成原命令</Button>}</Inline></Stack>}/>}
  <TaskProgressBlock snapshot refreshing={busy} title="回执恢复工作台" description="下方保留最近确认的状态；未知不等于成功或失败。" rows={record.tasks.map(t=>({key:t.id,label:t.title,status:t.status,amount:`第 ${t.attempt} 次执行`,details:[]}))} labels={{completed:'完成',failed:'失败'}} progress={{label:unresolved?'等待核对原命令':'最近确认的任务状态',status:unresolved?'unknown':record.tasks.some(t=>t.status==='running')?'running':'paused'}}/>
  <p role="status" className="docs-muted">{notice}</p>
 </Stack>;
}
