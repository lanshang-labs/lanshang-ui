import {FeedbackPanel} from '../dist/index.js';
import {useEffect,useRef,useState} from 'react';
import {LayoutSpace as Space} from '../dist/index.js';
import {ToggleSwitch as Switch} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {BeautifulSurface} from '../dist/index.js';

/** Local demo only: production requests and retry policy belong to the application. */
export function AsyncActionDemo(){
 const [value,setValue]=useState('设计系统'),[fail,setFail]=useState(true),[state,setState]=useState<'idle'|'loading'|'error'|'success'>('idle');
 const pending=useRef(false),timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const save=()=>{if(pending.current)return;pending.current=true;setState('loading');timer.current=setTimeout(()=>{pending.current=false;setState(fail?'error':'success')},900)};
 return <BeautifulSurface title="04 / 异步操作与错误恢复"><p className="gallery-note">先模拟失败，再关闭失败开关重试。输入保留，处理中不重复提交，成功前不显示完成。</p>
 <Space wrap><Switch aria-label="模拟请求失败" checked={fail} disabled={state==='loading'} onChange={setFail}/><span>模拟请求失败</span></Space>
 <form className="gallery-gap" aria-label="异步保存示例" aria-busy={state==='loading'} onSubmit={event=>{event.preventDefault();save()}}><Space wrap><TextInput aria-label="异步项目名称" value={value} disabled={state==='loading'} onChange={event=>{setValue(event.target.value);setState('idle')}}/><Button htmlType="submit" type="primary" loading={state==='loading'} aria-busy={state==='loading'}>保存样例</Button></Space></form>
 <div className="gallery-gap">{state==='loading'?<span role="status">正在保存，请稍候…</span>:state==='error'?<FeedbackPanel role="alert" type="error" message="保存失败，输入已保留。" description="关闭模拟请求失败后，再次点击保存样例即可重试。"/>:state==='success'?<FeedbackPanel role="status" type="success" message={`已保存：${value}`}/>:<span className="gallery-note">仅本地模拟，不请求业务服务。</span>}</div>
 </BeautifulSurface>;
}
