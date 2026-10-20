import {MotionButton} from '../dist/index.js';
import {Select} from '../dist/index.js';
import {overlayPopupContainer} from './overlay-popup-container';
import {useEffect,useRef,useState} from 'react';
import {LayoutSpace as Space, Dialog as Modal} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import type {SelectRef as RefSelectProps} from '../dist/index.js';
import {LoadingLabel} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
import './overlay-preview.css';
const teams=Array.from({length:36},(_,i)=>({value:`team-${i+1}`,label:`${['设计','研发','内容'][i%3]}团队 ${String(i+1).padStart(2,'0')}`}));
const storageKey='lanshang.remote-select.demo.v1';
type Team=typeof teams[number];
// Simulated server: a short query deliberately arrives later than a longer one.
export function fetchTeamPage(query:string,page:number,fail=false):Promise<{items:Team[];total:number}>{
 return new Promise((resolve,reject)=>setTimeout(()=>{
  if(fail){reject(new Error('选项读取失败'));return}
  const filtered=teams.filter(t=>t.label.includes(query.trim()));
  resolve({items:filtered.slice((page-1)*6,page*6),total:filtered.length});
 },query.length===1?1100:350));
}
function readSelection():Team[]{try{const ids:unknown=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(ids)?teams.filter(t=>ids.includes(t.value)):[]}catch{return []}}
function RemoteSelectForm(){
 const [selected,setSelected]=useState<Team[]>(readSelection),[query,setQuery]=useState(''),[rows,setRows]=useState<Team[]>([]),[page,setPage]=useState(0),[total,setTotal]=useState(0),[busy,setBusy]=useState(true),[error,setError]=useState(''),[fail,setFail]=useState(false),[open,setOpen]=useState(false);
 const version=useRef(0),lock=useRef(false),timer=useRef<ReturnType<typeof setTimeout>>(),host=useRef<HTMLDivElement>(null),select=useRef<RefSelectProps>(null);
 const target=useRef({query:'',page:1});
 function request(q:string,p:number,id:number,shouldFail=false){
  lock.current=true;setBusy(true);setError('');target.current={query:q,page:p};
  fetchTeamPage(q,p,shouldFail).then(result=>{
   if(id!==version.current)return;
   setRows(current=>p===1?result.items:[...current,...result.items.filter(item=>!current.some(old=>old.value===item.value))]);setPage(p);setTotal(result.total);
  }).catch(()=>{if(id===version.current)setError('加载失败，已选项与已加载选项仍保留。')}).finally(()=>{if(id===version.current){lock.current=false;setBusy(false)}});
 }
 function search(q:string){
  setQuery(q);const id=++version.current;clearTimeout(timer.current);lock.current=true;setBusy(true);setRows([]);setPage(0);setTotal(0);setError('');
  timer.current=setTimeout(()=>request(q,1,id),250);
 }
 useEffect(()=>{request('',1,++version.current);return()=>{++version.current;clearTimeout(timer.current)}},[]);
 function save(next:Team[]){setSelected(next);try{localStorage.setItem(storageKey,JSON.stringify(next.map(t=>t.value)))}catch{/* Selection still works when browser storage is unavailable. */}}
 return <div ref={host} className="ls-overlay-control-host ls-async-teams" onKeyDownCapture={e=>{if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();setOpen(false);select.current?.focus()}if(e.key==='Tab')setOpen(false)}}>
 <p>输入“研”，稍停后输入“研发”，模拟旧请求晚到。每页 6 项，选择与搜索结果独立保存。</p>
 <Select ref={select} aria-label="远程团队" mode="multiple" labelInValue allowClear virtual={false} filterOption={false} showSearch searchValue={query} onSearch={search} autoClearSearchValue={false} value={selected} onChange={save} options={rows} open={open} onDropdownVisibleChange={setOpen} getPopupContainer={trigger=>overlayPopupContainer(trigger,host.current!)} popupClassName="ls-overlay-control-select" style={{width:'100%'}} notFoundContent={<div className="ls-overlay-no-results">{busy?'正在搜索团队…':error?'搜索失败，请重试。':'没有匹配的团队。'}</div>}/>
 <div aria-busy={busy}><FeedbackPanel variant="inline" type={error?'error':'info'} message={busy?<LoadingLabel label="正在搜索团队"/>:error?<span role="alert">{error}</span>:<span role="status">已加载 {rows.length} / {total} 项</span>} action={<Space wrap><Button aria-disabled={busy||(!error&&rows.length>=total)} onClick={()=>{if(lock.current)return;if(error)request(target.current.query,target.current.page,version.current);else if(rows.length<total)request(query,page+1,version.current,fail)}}>{error?'重试加载':'加载更多'}</Button><Button disabled={!selected.length} onClick={()=>{save([]);select.current?.focus()}}>清空远程选择</Button></Space>}/></div>
 <Checkbox checked={fail} onChange={e=>setFail(e.target.checked)}>下一页模拟失败</Checkbox>
 <p role="status">已选团队：{selected.map(t=>t.label).join('、')||'暂无选择'}</p>
 <p>关闭重开或刷新页面恢复此浏览器中的模拟选择；清空可删除保存的选择。实际服务需按 ID 查询名称及有效性。</p>
 </div>;
}
export function RemoteSelectPreview(){
 const [open,setOpen]=useState(false);const trigger=useRef<HTMLButtonElement>(null);
 return <><Button ref={trigger} onClick={()=>setOpen(true)}>远程搜索与分页</Button><Modal rootClassName="ls-overlay-demo-popup" title="团队搜索 · 分页加载" open={open} destroyOnClose onCancel={()=>setOpen(false)} focusTriggerAfterClose={false} afterClose={()=>trigger.current?.focus()} footer={<MotionButton motionIcon="close" onClick={()=>setOpen(false)}>关闭远程搜索</MotionButton>}>{open?<RemoteSelectForm/>:null}</Modal></>;
}
