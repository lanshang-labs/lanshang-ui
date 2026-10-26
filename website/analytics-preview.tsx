import {useEffect,useMemo,useRef,useState} from 'react';
import {ButtonGroup,ChartCard,Checkbox,LoadingContainer,MotionButton,RankingBarList,RowActionButton,SkeletonBlock,StatisticCard} from '../dist/index.js';
import {AreaChart,BarChart,ColumnChart,DonutChart,LineChart,Sparkline} from '../dist/charts.js';
import './analytics-preview.css';
// Daily cumulative snapshots, not daily increments. Both series share the same cutoff.
const counts=[8,9,11,13,15,18,24,25,26,27,28,29,30,31];
const checked=[4,5,6,7,9,12,18,19,21,22,24,26,27,28];
const distribution=[{status:'已完成',count:31},{status:'处理中',count:46},{status:'待确认',count:18}];
type Query={days:number;empty:boolean};
export function AnalyticsPreview(){
  const [snapshot,setSnapshot]=useState<Query|null>(null),[kind,setKind]=useState<'line'|'area'|'column'|'bar'>('line');
  const [loading,setLoading]=useState(true),[error,setError]=useState<string>();
  const host=useRef<HTMLElement>(null);
  const [fail,setFail]=useState(false),[requestedEmpty,setRequestedEmpty]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>>(),lock=useRef(false),request=useRef<Query>({days:7,empty:false});
  function read(target:Query,simulateFailure=fail){
    if(lock.current)return;lock.current=true;
    const frozen={...target};request.current=frozen;setLoading(true);setError(undefined);
    timer.current=setTimeout(()=>{lock.current=false;setLoading(false);
      if(simulateFailure)setError('本次统计读取失败。重试只重新读取，不执行生产操作。');
      else {setSnapshot(frozen);setRequestedEmpty(frozen.empty);}
    },1200);
  }
  useEffect(()=>{read({days:7,empty:false},false);return()=>{clearTimeout(timer.current);lock.current=false;};},[]);
  const days=snapshot?.days??7,empty=snapshot?.empty??true;
  const {single,trend}=useMemo(()=>{
    if(!snapshot||snapshot.empty)return {single:[],trend:[]};
    const first=counts.length-snapshot.days;
    return {
      single:counts.slice(first).map((count,index)=>({date:`10/${first+index+1}`,count})),
      trend:counts.slice(first).flatMap((count,index)=>[{date:`10/${first+index+1}`,count,series:'已完成'},{date:`10/${first+index+1}`,count:checked[first+index],series:'已核对'}]),
    };
  },[snapshot]);
  const change=counts[counts.length-1]-counts[counts.length-8];
  const Plot=kind==='area'?AreaChart:kind==='column'?ColumnChart:kind==='bar'?BarChart:LineChart;
  return <div className="ls-analytics-example">
    <div className="ls-analytics-toolbar">
      <ButtonGroup aria-label="统计时间范围">{[7,14].map(value=><RowActionButton key={value} aria-disabled={loading} aria-pressed={days===value} onClick={()=>read({days:value,empty:requestedEmpty})}>近 {value} 天</RowActionButton>)}</ButtonGroup>
      <Checkbox checked={fail} disabled={loading} onChange={e=>setFail(e.target.checked)}>模拟读取失败</Checkbox>
      <Checkbox checked={requestedEmpty} aria-disabled={loading} onChange={e=>{if(loading)return;setRequestedEmpty(e.target.checked);read({days,empty:e.target.checked});}}>请求空结果</Checkbox>
      <MotionButton aria-disabled={loading} onClick={()=>{setSnapshot(null);read({days,empty:requestedEmpty});}}>重新首次加载</MotionButton>
      <MotionButton motionIcon="refresh" aria-label="刷新统计" title="刷新统计" aria-disabled={loading} onClick={()=>read({days,empty:requestedEmpty})}/>
    </div>
    <LoadingContainer ref={host} tabIndex={-1} className="ls-analytics-boundary" variant="page" aria-label="统计成功快照" hasContent={snapshot!==null} loading={loading} error={error}
      loadingLabel="正在读取统计概览" refreshingLabel="正在更新统计，保留上次完整快照"
      onRetry={()=>{
        const ownedFocus=host.current?.contains(document.activeElement)??false;
        setFail(false);read(request.current,false);
        if(ownedFocus)requestAnimationFrame(()=>{if(document.activeElement===document.body)host.current?.focus()});
      }}
      skeleton={<div className="ls-analytics-placeholder"><div className="ls-analytics-metrics">{[0,1,2].map(key=><SkeletonBlock key={key} active paragraph={{rows:2}}/>)}</div><SkeletonBlock active paragraph={{rows:5}}/></div>}>
    <div className="ls-analytics-content"><div className="ls-analytics-metrics">
      <StatisticCard label="分集总数" value={empty?0:95} unit="集" description="当前项目 · 示例快照"/>
      <StatisticCard label="已完成" value={empty?0:counts[counts.length-1]} unit="集" trend={empty?undefined:{direction:'up',label:`较 7 天前增加 ${change} 集`}} visualization={empty?undefined:<Sparkline label="累计完成数量趋势" summary={`最近${days}天，末日${single[single.length-1]?.count}集；各日不求和。`} data={single} xField="date" yField="count" height={40}/>}/>
      <StatisticCard label="待确认" value={empty?0:18} unit="集" description="等待人工核对与确认"/>
    </div>
    <ChartCard title="生产趋势" description={`近 ${days} 天每日截至当日的累计数量；已核对是已完成中的子集。`}
      hasContent
      actions={<ButtonGroup aria-label="趋势图形">{(['line','area','column','bar'] as const).map((value,index)=><RowActionButton key={value} aria-pressed={kind===value} onClick={()=>setKind(value)}>{['折线','面积','柱形','条形'][index]}</RowActionButton>)}</ButtonGroup>}
      footer="数值单位：集 · 各日累计值不求和 · 示例数据">
      <Plot label="生产趋势" summary={`最近${days}天的累计完成与核对数量，各日不求和。`} data={trend} xField="date" yField="count" seriesField="series" height={240} {...(kind==='column'||kind==='bar'?{group:true}:{})}/>
    </ChartCard>
    <div className="ls-analytics-secondary">
      <ChartCard title="状态分布" hasContent>
        <DonutChart label="分集状态分布" summary={empty?'暂无状态记录。':'共95集：已完成31，处理中46，待确认18。'} data={empty?[]:distribution} categoryField="status" valueField="count" height={220}/>
      </ChartCard>
      <ChartCard title="资源数量" description="本次统计包含的分镜、场景、角色与音频。" hasContent>
        <RankingBarList aria-label="资源数量排行" items={empty?[]:[{key:'shots',label:'分镜',value:128},{key:'scenes',label:'场景',value:64},{key:'characters',label:'角色',value:42},{key:'audio',label:'音频',value:26}]}/>
      </ChartCard>
    </div></div>
    </LoadingContainer>
    <p className="docs-muted">整组统计共用成功快照与恢复入口。时间范围或“请求空结果”只有读取成功后才生效；失败保留整组旧内容，重试使用失败时的条件并关闭失败模拟。勾选失败后“重新首次加载”可检查首次失败。累计值各日不求和，7／14 天只改变观察窗口。</p>
  </div>;
}
