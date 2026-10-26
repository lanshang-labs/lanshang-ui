import {Select,Inline,MotionButton} from '../dist/index.js';
import {useEffect,useRef,useState} from 'react';
import {LoadingLabel,Skeleton} from '../dist/index.js';
import './loading-feedback-preview.css';
function usePending(){
 const [pending,setPending]=useState(false),[done,setDone]=useState(false);
 const lock=useRef(false),timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function run(){if(lock.current)return;lock.current=true;setPending(true);setDone(false);timer.current=setTimeout(()=>{lock.current=false;setPending(false);setDone(true)},4800)}
 return {pending,done,run};
}
export function LoadingFeedbackPreview(){
 const initial=usePending(),refresh=usePending(),save=usePending(),options=usePending();
 const [team,setTeam]=useState('design');
 return <div className="ls-loading-study">

 <section aria-busy={refresh.pending}><h3>01 · 任务处理 / 流光文字</h3><p>保留可读内容，只有相关操作等待结果。</p><Inline><MotionButton onClick={refresh.run} disabled={refresh.pending} motionIcon="refresh" aria-label="刷新摘要" title="刷新摘要"/><span role="status">{refresh.pending?<LoadingLabel label="正在刷新摘要" announce={false}/>:refresh.done?'摘要已更新':'摘要已就绪'}</span></Inline></section>
 <section><h3>02 · 提交操作 / 单段圆弧</h3><Inline><MotionButton motionIcon="save" type="primary" style={{minWidth:108}} loading={save.pending} aria-busy={save.pending} onClick={save.run}>{save.pending?'保存中…':'保存修改'}</MotionButton><span role="status">{save.done?'保存成功':save.pending?'':'尚未提交'}</span></Inline></section>
 <section><h3>03 · 选项读取 / 单段圆弧</h3><Inline><Select aria-label="加载团队选项" value={team} onChange={setTeam} loading={options.pending} aria-busy={options.pending} style={{width:180}} options={[{value:'design',label:'设计团队'},{value:'engineering',label:'研发团队'}]}/><MotionButton disabled={options.pending} onClick={options.run} motionIcon="refresh" aria-label="刷新选项" title="刷新选项"/></Inline><p role="status">{options.pending?'正在读取团队选项…':options.done?'选项已更新，当前选择保留':'可切换团队后刷新选项'}</p></section>
 <section><h3>首次读取 · 骨架屏</h3><MotionButton onClick={initial.run} disabled={initial.pending}>重新读取摘要</MotionButton><div style={{minHeight:120,paddingTop:12}}><Skeleton loading={initial.pending}><p>项目摘要 · 已有内容</p></Skeleton></div></section>
 <p className="docs-muted">设计对照 · 每次独立模拟 4.8 秒。细圆弧与文字流光采用 1.6 秒周期；按钮内只保留圆弧和清晰文案，像素与流光用于持续任务提示。此方案由公共样式统一提供，仅在实际处理中显示动效。</p>
 </div>;
}

export function LoadingLifecyclePreview(){
 const [state,setState]=useState<'idle'|'running'|'paused'|'failed'|'done'>('idle');
 const timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 function change(next:typeof state){clearTimeout(timer.current);setState(next);if(next==='running')timer.current=setTimeout(()=>setState('done'),4800)}
 return <section className="ls-loading-lifecycle" aria-label="加载状态转换">
 <h3>状态转换与长文案</h3>
 <Inline><MotionButton onClick={()=>change('running')} disabled={state==='running'}>{state==='paused'?'继续处理':'开始处理'}</MotionButton><MotionButton onClick={()=>change('paused')} disabled={state!=='running'}>暂停处理</MotionButton><MotionButton onClick={()=>change('failed')} disabled={state!=='running'}>模拟失败</MotionButton><MotionButton onClick={()=>change('done')} disabled={state!=='running'}>立即完成</MotionButton></Inline>
 <div role="status" style={{marginTop:14,minHeight:44}}>{state==='running'?<LoadingLabel announce={false} label="正在核对跨项目素材与交付记录，请保留当前页面等待结果…"/>:({idle:'尚未开始',paused:'已暂停，可以继续处理',failed:'读取失败，可重新开始；原内容保留',done:'处理完成，已停止等待提示'}[state])}</div>
 <p className="docs-muted">暂停、失败和完成会立即移除等待动效；暂停也会取消本次模拟完成回调。系统减少动画模式下，处理中保留静态标识与文案。</p>
 </section>;
}
