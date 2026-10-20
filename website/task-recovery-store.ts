import {applyBatch,initialTasks,type DemoTask,type BatchCommand} from './task-queue-model';
export const recoveryKey='lanshang-demo:queue-recovery:v1';
export type Receipt='applied'|'rejected'|'pending';
export type RecoveryRecord={version:1;tasks:DemoTask[];operation:null|{id:string;ids:string[];action:BatchCommand;receipt:Receipt;phase:'unknown'|'confirmed'|'rejected'}};
export const freshRecovery=():RecoveryRecord=>({version:1,tasks:initialTasks(true),operation:null});
/** Small versioned demo journal. Invalid data must not silently unlock mutations. */
export function parseRecovery(raw:string|null):RecoveryRecord{
 if(!raw)return freshRecovery();
 const value=JSON.parse(raw);
 const statuses=['queued','running','paused','failed','done','cancelled'];
 if(value?.version!==1||!Array.isArray(value.tasks)||value.tasks.length>5000||value.tasks.some((t:DemoTask,i:number)=>!t||typeof t.id!=='string'||!t.id||typeof t.title!=='string'||!statuses.includes(t.status)||!Number.isInteger(t.attempt)||t.attempt<1))throw new Error('恢复记录格式不兼容');
 if(new Set(value.tasks.map((t:DemoTask)=>t.id)).size!==value.tasks.length)throw new Error('重复任务标识');
 const op=value.operation;
 if(op!==null&&(!op||typeof op.id!=='string'||!op.id||!Array.isArray(op.ids)||!op.ids.length||op.ids.some((id:string)=>!value.tasks.some((t:DemoTask)=>t.id===id))||!['pause','resume','retry','cancel'].includes(op.action)||!['applied','rejected','pending'].includes(op.receipt)||!['unknown','confirmed','rejected'].includes(op.phase)))throw new Error('回执记录格式不兼容');
 return value;
}
export function reconcile(record:RecoveryRecord,operationId:string):RecoveryRecord{
 const op=record.operation;
 if(!op||op.id!==operationId||op.phase!=='unknown'||op.receipt==='pending')return record;
 return {...record,tasks:op.receipt==='applied'?applyBatch(record.tasks,op.ids,op.action):record.tasks,operation:{...op,phase:op.receipt==='applied'?'confirmed':'rejected'}};
}
