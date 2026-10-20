import {applyBatch,eligible,queueBoundaryTasks,type BatchCommand,type DemoTask} from './task-queue-model';
export const remoteQueueKey='lanshang-demo:remote-queue-service:v1';
export type QueueQuery={search:string;status:string;page:number};
export type QueueResult={id:string;title:string;outcome:'applied'|'missing'|'ineligible'|'failed';reason:string};
export type QueueReceipt={id:string;action:BatchCommand;ids:string[];applied:string[];skipped:string[];results?:QueueResult[]};
type Database={tasks:DemoTask[];receipts:QueueReceipt[]};
const delay=()=>new Promise<void>(resolve=>setTimeout(resolve,350));
function read():Database{const raw=sessionStorage.getItem(remoteQueueKey);if(raw)return JSON.parse(raw);const tasks=queueBoundaryTasks('large').map((task,i)=>({...task,status:i%8===3?'failed' as const:task.status}));return {tasks,receipts:[]}}
/** Mock service boundary. UI receives a page, never the full dataset. */
export async function fetchQueue(query:QueueQuery,fail=false){
 await delay();if(fail)throw new Error('模拟读取失败，请重新读取；已选任务保留。');
 const all=read().tasks.filter(task=>(!query.status||task.status===query.status)&&task.title.toLocaleLowerCase().includes(query.search.trim().toLocaleLowerCase()));
 const page=Math.min(Math.max(1,query.page),Math.max(1,Math.ceil(all.length/10)));
 return {items:all.slice((page-1)*10,page*10),total:all.length,page};
}
/** Acceptance and receipt are persisted together, before the response can be lost. */
export async function sendQueueCommand(id:string,ids:string[],action:BatchCommand,timeout=false,partial=false){
 const db=read(),existing=db.receipts.find(item=>item.id===id);
 if(existing&&(existing.action!==action||JSON.stringify(existing.ids)!==JSON.stringify(ids)))throw new Error('命令 ID 已绑定其他内容');
 let receipt=existing;
 if(!receipt){
  let eligibleIndex=0;
  const results:QueueResult[]=[...new Set(ids)].map(key=>{const task=db.tasks.find(t=>t.id===key);const outcome=!task?'missing':!eligible(task,action)?'ineligible':partial&&eligibleIndex++%2===1?'failed':'applied';return {id:key,title:task?.title??key,outcome,reason:outcome==='missing'?'任务已失效或不可访问':outcome==='ineligible'?`当前状态 ${{queued:'排队中',running:'处理中',paused:'已暂停',failed:'失败',done:'完成',cancelled:'已取消'}[task!.status]} 不适用`:outcome==='failed'?'模拟临时故障，明确未执行，可重试':'已执行'}});
  const applied=results.filter(x=>x.outcome==='applied').map(x=>x.id);
  receipt={id,ids,action,applied,skipped:results.filter(x=>x.outcome!=='applied').map(x=>x.id),results};db.tasks=applyBatch(db.tasks,applied,action);db.receipts.push(receipt);sessionStorage.setItem(remoteQueueKey,JSON.stringify(db));
 }
 await delay();if(timeout)throw new Error('响应超时，结果未知；请核对原命令。');return receipt;
}
export async function fetchQueueReceipt(id:string){await delay();return read().receipts.find(item=>item.id===id)??null}

/** Simulates another actor changing selected tasks; never mutates client selection. */
export function changeSelectedTasks(ids:string[]){
 const db=read();db.tasks=db.tasks.filter(task=>task.id!==ids[1]).map(task=>task.id===ids[0]?{...task,status:'done'}:task);sessionStorage.setItem(remoteQueueKey,JSON.stringify(db));
}
