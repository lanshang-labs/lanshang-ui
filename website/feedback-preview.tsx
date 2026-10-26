import {Stack,Inline,MotionButton} from '../dist/index.js';
import {useEffect,useRef,useState} from 'react';
import {FeedbackPanel} from '../dist/index.js';
import './feedback-preview.css';
export function FeedbackPreview(){
 const [confirm,setConfirm]=useState(false),[done,setDone]=useState(false);
 const trigger=useRef<HTMLButtonElement>(null),back=useRef<HTMLButtonElement>(null);
 const result=useRef<HTMLDivElement>(null),retryOwnedFocus=useRef(false);
 useEffect(()=>{if(confirm)back.current?.focus()},[confirm]);
 useEffect(()=>{if(done&&retryOwnedFocus.current){retryOwnedFocus.current=false;if(document.activeElement===document.body)result.current?.focus()}},[done]);
 function close(){setConfirm(false);requestAnimationFrame(()=>trigger.current?.focus())}
 return <Stack>
  <FeedbackPanel message="保留上次结果" description="后台更新期间仍可查看已有内容。"/>
  <FeedbackPanel type="success" message="更改已保存" description="状态使用文字和局部颜色表达，不铺满整个面板。"/>
  <FeedbackPanel type="warning" message="部分任务未执行" description="成功项已完成；请核对失败原因再重试。"/>
  {!done&&<FeedbackPanel type="error" message="保存失败，输入已保留" description="确认网络恢复后可以重新提交。" action={<MotionButton motionIcon="retry" onClick={event=>{retryOwnedFocus.current=event.currentTarget===document.activeElement;setDone(true)}}>模拟重试成功</MotionButton>}/>}
  {done&&<div ref={result} tabIndex={-1} role="region" aria-label="重试结果" className="ls-feedback-result"><FeedbackPanel type="success" role="status" message="重试已成功，原内容保留"/></div>}
  <Inline><MotionButton ref={trigger} onClick={()=>setConfirm(true)}>打开确认示例</MotionButton></Inline>
  {confirm&&<div role="group" aria-label="中性确认示例" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();close()}}}><FeedbackPanel type="warning" message="确认结束当前任务？" description="这是行内确认，不是模态对话框；已完成结果将保留。" action={<Inline><MotionButton motionIcon="back" ref={back} onClick={close}>返回，不执行</MotionButton><MotionButton motionIcon="stop" danger onClick={()=>{setDone(true);close()}}>确认结束模拟任务</MotionButton></Inline>}/></div>}
 </Stack>;
}
