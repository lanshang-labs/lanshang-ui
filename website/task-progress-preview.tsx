import {Stack,Inline,ButtonGroup,RowActionButton} from '../dist/index.js';
import {useEffect, useRef, useState} from 'react';
import {MotionButton as Button} from '../dist/index.js';
import {Progress, TaskRows, TaskProgressBlock, progressLabels, type ProgressStatus, type TaskRow} from '../dist/index.js';

const statuses:ProgressStatus[]=['running','queued','paused','blocked','failed','success','cancelled','unknown'];
export function ProgressPreview(){
  return <Stack gap="xl">
    <p className="docs-muted">进度与结果独立：100% 仍可等待结果核对。未知总量不展示百分比。</p>
    {statuses.map(status=><Progress key={status} label={progressLabels[status]} status={status} value={status==='unknown'?undefined:status==='queued'?0:status==='success'?100:48}/>)}
    <Progress label="正在等待响应" description="尚未获取任务总量"/>
    <Progress label="全部步骤已处理" value={100} status="running" description="等待服务端确认最终结果"/>
    <Progress label="下载资源" value={62} variant="circle" valueText="31 / 50 项"/>
    <Progress label="正在准备资源" variant="circle"/>
  </Stack>;
}
export function TaskRowsPreview(){
  const [empty,setEmpty]=useState(false);
  const rows:TaskRow[]=statuses.map((status,index)=>({key:status,label:['生成项目预览','导出素材','上传原始文件','等待可用资源','同步项目','校验文件','旧导出任务','核对请求记录'][index],status:status==='success'?'done':status,amount:status==='queued'?'等待开始':status==='success'?'24 / 24 项':status==='unknown'?'待核实':'12 / 24 项',details:[{label:'说明',meta:status==='unknown'?'等待真实运行记录':'本地状态样例，无网络请求'}],progress:{value:status==='unknown'?undefined:status==='success'?100:status==='queued'?0:50}}));
  return <Stack><Button onClick={()=>setEmpty(!empty)}>{empty?'显示任务':'查看空列表'}</Button><TaskRows rows={empty?[]:rows}/></Stack>;
}
type Scenario=ProgressStatus|'loading'|'empty'|'refresh-error';
export function TaskProgressPreview(){
  const [scenario,setScenario]=useState<Scenario>('running');
  const [busy,setBusy]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>>();
  const pending=useRef(false);
  useEffect(()=>()=>{clearTimeout(timer.current)},[]);
  function choose(next:Scenario){clearTimeout(timer.current);pending.current=false;setBusy(false);setScenario(next)}
  // Only the demo owns delay and transitions. No automatic completion or business request.
  function recover(){
    if(pending.current)return;
    pending.current=true;setBusy(true);
    timer.current=setTimeout(()=>{pending.current=false;setBusy(false);setScenario('running')},700);
  }
  const status:ProgressStatus=statuses.includes(scenario as ProgressStatus)?scenario as ProgressStatus:'running';
  const value=scenario==='unknown'?undefined:scenario==='success'?100:scenario==='queued'||scenario==='empty'?0:58;
  const rows:TaskRow[]=scenario==='empty'?[]:[
    {key:'prepare',label:'准备素材',amount:'24 / 24',status:'done',details:[{label:'已完成',meta:'输入文件已校验'}]},
    {key:'generate',label:'生成预览与高分辨率资源',amount:scenario==='success'?'24 / 24':scenario==='queued'?'0 / 24':scenario==='unknown'?'待核实':'14 / 24',status:status==='success'?'done':status,step:2,details:[{label:'当前任务',meta:scenario==='blocked'?'等待资源额度':scenario==='failed'?'上次请求失败，已完成资源保留':'进度由模拟数据源提供'}]},
    {key:'export',label:'整理并导出',amount:scenario==='success'?'已完成':'等待前序任务',status:scenario==='success'?'done':'queued',details:[]},
  ];
  return <Stack gap="xl">
    <div style={{overflowX:'auto',maxWidth:'100%',padding:2}}><ButtonGroup aria-label="模拟场景" style={{maxWidth:'none',whiteSpace:'nowrap'}}>{(['running','queued','paused','blocked','failed','success','cancelled','unknown','loading','empty','refresh-error'] as Scenario[]).map(item=><RowActionButton key={item} aria-pressed={scenario===item} onClick={()=>choose(item)}>{item==='loading'?'首次加载':item==='empty'?'空任务':item==='refresh-error'?'刷新失败':progressLabels[item]}</RowActionButton>)}</ButtonGroup></div>
    <TaskProgressBlock title="项目资源生成" description="本地模拟 · 任务状态由调用方控制" rows={rows}
      loading={scenario==='loading'} refreshing={busy && scenario==='refresh-error'}
      progress={{label:scenario==='empty'?'尚未开始':'整体任务',value,status,valueText:scenario==='empty'?'暂无任务':scenario==='success'?'3 / 3 步骤完成':'1 / 3 步骤完成'}}
      error={scenario==='refresh-error'?'暂时无法读取最新进度。下方保留上次记录，刷新不会重新执行任务。':undefined}
      recovery={<Button loading={busy} onClick={recover}>重新读取</Button>}
      actions={scenario==='running'?<Button onClick={()=>choose('paused')}>暂停任务</Button>:scenario==='paused'?<Button onClick={()=>choose('running')}>继续任务</Button>:scenario==='failed'?<Button loading={busy} onClick={recover}>重试失败步骤</Button>:scenario==='blocked'?<Button loading={busy} onClick={recover}>检查资源并继续</Button>:undefined}/>
    <p className="docs-muted" role="status">{busy?'正在处理模拟请求…':'模拟操作只修改当前页面。重试恢复到处理中，不自动完成；切换场景会取消上一个模拟响应。'}</p>
  </Stack>;
}
