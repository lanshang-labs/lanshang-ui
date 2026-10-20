export type DemoTask = {id:string;title:string;status:'queued'|'running'|'paused'|'failed'|'done'|'cancelled';attempt:number};
export type DemoCommand='pause'|'resume'|'retry'|'fail'|'complete'|'cancel';
export function initialTasks(queue=false):DemoTask[]{return (queue?['生成产品预览','整理素材索引','导出交付文件']:['检查输入素材','生成项目预览','整理交付结果']).map((title,index)=>({id:`task-${index}`,title,status:queue?(index===0?'running':'queued'):(index===0?'done':index===1?'running':'queued'),attempt:1}))}
/** Demo only. State changes represent explicit mock responses, never elapsed-time success. */
export function applyCommand(tasks:DemoTask[],id:string,command:DemoCommand):DemoTask[]{
 const item=tasks.find(task=>task.id===id);if(!item)return tasks;
 if(command==='cancel')return ['done','cancelled'].includes(item.status)?tasks:tasks.map(task=>task.id===id?{...task,status:'cancelled'}:task);
 const expected={pause:'running',resume:'paused',retry:'failed',fail:'running',complete:'running'}[command];
 if(item.status!==expected)return tasks;
 if((command==='resume'||command==='retry')&&tasks.some(task=>task.id!==id&&task.status==='running'))return tasks;
 let next=tasks.map(task=>task.id===id?{...task,status:({pause:'paused',resume:'running',retry:'running',fail:'failed',complete:'done'} as const)[command],attempt:task.attempt+(command==='retry'?1:0)}:task);
 if(command==='complete')return startNext(next);
 return next;
}

export type BatchCommand='pause'|'resume'|'retry'|'cancel';
export function eligible(task:DemoTask,command:BatchCommand){
 return command==='pause'?['queued','running'].includes(task.status):command==='resume'?task.status==='paused':command==='retry'?task.status==='failed':!['done','cancelled'].includes(task.status);
}
export function startNext(tasks:DemoTask[]):DemoTask[]{
 if(tasks.some(task=>task.status==='running'))return tasks;
 const next=tasks.find(task=>!['done','cancelled'].includes(task.status));
 return next?.status==='queued'?tasks.map(task=>task.id===next.id?{...task,status:'running'}:task):tasks;
}
export function applyBatch(tasks:DemoTask[],ids:string[],command:BatchCommand):DemoTask[]{
 const next=tasks.map(task=>ids.includes(task.id)&&eligible(task,command)?{...task,status:command==='pause'?'paused' as const:command==='cancel'?'cancelled' as const:'queued' as const,attempt:task.attempt+(command==='retry'?1:0)}:task);
 return command==='resume'||command==='retry'?startNext(next):next;
}

export function queueBoundaryTasks(kind:'long'|'large'|'empty'):DemoTask[]{
 if(kind==='empty')return [];
 return Array.from({length:kind==='large'?120:3},(_,index)=>({id:`task-${index}`,title:kind==='long'?`任务 ${index+1} · 多语言资源校验与高分辨率交付文件生成 — ${'跨项目共享素材与版本一致性检查'.repeat(4)} / ${'asset_revision_2026_'.repeat(6)}`:`任务 ${String(index+1).padStart(3,'0')} · ${['生成预览','校验素材','导出交付'][index%3]}`,status:index===0?'running':'queued',attempt:1}));
}
