import {useEffect,useRef,useState} from 'react';
import {ButtonGroup,ContentState,LoadingContainer,MotionButton,RowActionButton,SkeletonBlock,TextInput} from '../dist/index.js';
import './loading-container-preview.css';

/** Local read simulation only. Production fetching, cancellation and retry policy belong to the app. */
export function LoadingContainerPreview(){
  const [variant,setVariant]=useState<'page'|'block'>('page');
  const [presentation,setPresentation]=useState<'skeleton'|'indicator'>('skeleton');
  const [loading,setLoading]=useState(true),[hasContent,setHasContent]=useState(false),[error,setError]=useState<string>();
  const [revision,setRevision]=useState(0),[empty,setEmpty]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>>(),locked=useRef(false),sequence=useRef(0);
  const host=useRef<HTMLElement>(null),retryFocused=useRef(false);
  function read(initial=false,fail=false){
    if(locked.current)return;
    locked.current=true;const current=++sequence.current;
    setLoading(true);setError(undefined);
    if(initial){setHasContent(false);setEmpty(false);}
    timer.current=setTimeout(()=>{
      if(sequence.current!==current)return;
      locked.current=false;setLoading(false);
      if(fail)setError('本次示例读取失败，请重试。没有发送网络请求。');
      else {setHasContent(true);setRevision(value=>value+1);}
      // Only recover focus if the removed retry button had it and the user has not moved elsewhere.
      if(retryFocused.current&&document.activeElement===document.body)host.current?.focus();
      retryFocused.current=false;
    },1600);
  }
  useEffect(()=>{read(true);return()=>{clearTimeout(timer.current);sequence.current++;locked.current=false;};},[]);
  return <div className="ls-loading-example">
    <div className="ls-loading-example-options">
      <ButtonGroup aria-label="加载容器范围">{(['page','block'] as const).map((value,index)=><RowActionButton key={value} aria-pressed={variant===value} onClick={()=>setVariant(value)}>{['页面','区块'][index]}</RowActionButton>)}</ButtonGroup>
      <ButtonGroup aria-label="首次加载外观">{(['skeleton','indicator'] as const).map((value,index)=><RowActionButton key={value} aria-pressed={presentation===value} onClick={()=>setPresentation(value)}>{['骨架','像素提示'][index]}</RowActionButton>)}</ButtonGroup>
    </div>
    <div className="ls-loading-example-scenarios" role="group" aria-label="模拟读取场景">
      <MotionButton aria-disabled={loading} onClick={()=>read(true)}>重新首次加载</MotionButton>
      <MotionButton aria-disabled={loading} onClick={()=>read(true,true)}>模拟首次失败</MotionButton>
      <MotionButton disabled={!hasContent} aria-disabled={loading} onClick={()=>read(false,true)}>模拟刷新失败</MotionButton>
      <MotionButton disabled={!hasContent} aria-disabled={loading} aria-pressed={empty} onClick={()=>setEmpty(value=>!value)}>空结果</MotionButton>
    </div>
    <div className="ls-loading-example-stage">
      <LoadingContainer ref={host} tabIndex={-1} aria-label="生产概览加载示例" variant={variant} title="生产概览"
        hasContent={hasContent} loading={loading} error={error} presentation={presentation}
        loadingLabel="正在读取生产概览" refreshingLabel="正在更新概览，保留上次内容"
        onRetry={()=>{retryFocused.current=host.current?.contains(document.activeElement)??false;read(!hasContent);if(retryFocused.current)requestAnimationFrame(()=>{if(document.activeElement===document.body)host.current?.focus()});}}
        actions={<MotionButton motionIcon="refresh" aria-label="刷新概览" title="刷新概览" aria-busy={loading&&hasContent} aria-disabled={loading} disabled={!hasContent} onClick={()=>read()}/>}
        skeleton={<div className="ls-loading-example-placeholder"><div className="ls-loading-example-metrics">{[0,1,2].map(key=><SkeletonBlock key={key} active title={{width:'55%'}} paragraph={{rows:1}}/>)}</div><SkeletonBlock active title={false} paragraph={{rows:3}}/></div>}>
        {empty?<ContentState title="暂无生产记录" description="读取已成功，空结果不会继续显示加载动画。"/>:<>
          <div className="ls-loading-example-metrics">{[['分集','95'],['已完成',String(30+revision)],['待处理','18']].map(([label,value])=><div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          <div className="ls-loading-example-records"><h4>最近记录 <span>第 {revision} 次成功读取</span></h4>{['角色资源已核对','场景参考已准备','分镜清单待确认'].map((text,index)=><div key={text}><span className="ls-loading-example-record-dot" aria-hidden="true"/><span>{text}</span><small>0{index+1}</small></div>)}</div>
          <label className="ls-loading-example-draft">本地备注<TextInput aria-label="本地备注" placeholder="输入后刷新，草稿与焦点会保留"/></label>
        </>}
      </LoadingContainer>
    </div>
    <p className="docs-muted">每次模拟读取 1.6 秒。首次加载显示骨架或像素提示；刷新与刷新失败保留旧内容和本地备注。失败后点击重试恢复；空结果是一次成功读取。页面与区块共用同一组件，不发送网络请求。</p>
  </div>;
}
