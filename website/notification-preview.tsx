import {MotionButton} from '../dist/index.js';
import './overlay-preview.css';
import {useEffect,useRef,useState} from 'react';
import type {TextInputRef as InputRef} from '../dist/index.js';
import {Dialog as Modal, DrawerPanel as Drawer} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {NotificationViewport,mergeNotification,Stack,Inline,Disclosure,type NotificationItem} from '../dist/index.js';
export function NotificationPreview(){
 const [items,setItems]=useState<NotificationItem[]>([]),[viewed,setViewed]=useState(false);
 const [overlay,setOverlay]=useState<'modal'|'drawer'|null>(null),[suspended,setSuspended]=useState(false);
 const activeKind=useRef<'modal'|'drawer'|null>(null),openKind=useRef<'modal'|'drawer'|null>(null);
 const opener=useRef<HTMLElement|null>(null),modalField=useRef<InputRef>(null),drawerField=useRef<InputRef>(null);
 function openOverlay(kind:'modal'|'drawer',target:HTMLElement){activeKind.current=kind;openKind.current=kind;opener.current=target;setSuspended(true);setOverlay(kind)}
 function closeOverlay(){openKind.current=null;setOverlay(null)}
 function closed(kind:'modal'|'drawer'){if(openKind.current||activeKind.current!==kind)return;activeKind.current=null;setSuspended(false);if(document.activeElement===document.body||document.activeElement?.closest('.ls-notification-overlay'))opener.current?.focus()}
 const overlayContent=(kind:'modal'|'drawer')=><Stack><TextInput ref={kind==='modal'?modalField:drawerField} aria-label="通知浮层备注" placeholder="键盘焦点留在当前浮层"/><Inline><Button onClick={()=>show({id:'during-overlay',title:'浮层期间后台任务完成',type:'success',duration:5000,description:'关闭浮层后显示，并开始剩余计时。'})}>模拟浮层期间收到通知</Button></Inline><p>通知保留但暂不展示、不播报、不计时，关闭浮层动画结束后恢复。</p></Stack>;
 const updates=useRef<ReturnType<typeof setInterval>>();
 useEffect(()=>()=>clearInterval(updates.current),[]);
 const closeAll=()=>{clearInterval(updates.current);setItems([])};
 const stress=()=>{clearInterval(updates.current);let count=0;setItems(rows=>mergeNotification(rows,{id:'frequent',title:'高频结果更新',duration:5000,description:'等待更新'}));updates.current=setInterval(()=>{count++;setItems(rows=>rows.map(row=>row.id==='frequent'?{...row,description:`收到第 ${count} 次结果更新，原计时不延长。`}:row));if(count===20)clearInterval(updates.current)},100)};
 const close=(id:string)=>setItems(rows=>rows.filter(row=>row.id!==id));
 const show=(item:NotificationItem)=>setItems(rows=>mergeNotification(rows,item));
 return <Stack className="ls-notification-demo"><p className="docs-muted">先触发一条通知，观察它如何出现、关闭，以及在重复更新时保留原位置。</p><section aria-labelledby="notification-primary"><h3 id="notification-primary">常用结果</h3><Inline>
 <Button onClick={()=>show({id:'export',title:'导出已完成',type:'success',description:'24 条项目记录已准备好，可前往下载中心查看。'})}>模拟后台任务完成</Button>
 <MotionButton motionIcon="notice" onClick={()=>show({id:'review',title:'交付结果需要查看',type:'warning',duration:0,description:'部分素材未通过校验。通知关闭不代表问题已解决，请在任务详情处理。',action:<MotionButton motionIcon="document" onClick={()=>setViewed(true)}>查看模拟结果</MotionButton>})}>打开常驻通知</MotionButton>
 <Button onClick={()=>show({id:'failed',title:'后台同步失败',type:'error',duration:0,description:'已有内容保留。请前往任务详情核对原因后重试。'})}>模拟后台失败</Button>
 </Inline></section><section aria-labelledby="notification-updates"><h3 id="notification-updates">合并与更新</h3><Inline>
 <Button onClick={()=>setItems([{id:'batch-ready',title:'批量导出完成',type:'success',duration:5000,description:'此条 5 秒后关闭，悬停或聚焦时单独暂停。'},{id:'batch-review',title:'跨区域协作项目的超长交付结果需要人工核对',type:'warning',duration:0,description:'ProjectDelivery_2026_LongIdentifierWithoutSpaces_ReviewRequired。此条常驻，窄屏可完整换行。'},{id:'batch-failed',title:'附件同步失败',type:'error',duration:0,description:'保留原始附件，请在任务详情重试。'}])}>同时显示三条通知</Button>
 <Button onClick={()=>show({id:'sync',title:'同步进行中',duration:0,description:'重复点击将合并到同一个通知，不增加卡片。'})}>重复推送同一任务</Button>
 <Button onClick={()=>show({id:'sync',title:'同步已完成',type:'success',duration:5000,description:'原位更新为完成，开始 5 秒计时。',action:undefined})}>更新为完成</Button>
 <Button onClick={()=>setItems(rows=>rows.map(row=>row.id==='sync'?{...row,description:'收到新的结果说明；剩余计时保持不变。'}:row))}>仅更新说明</Button>
 </Inline></section><Disclosure className="ls-notification-boundaries" label="边界场景与浮层协作"><Inline>
 <Button onClick={stress}>2 秒内更新 20 次</Button>
 <Button onClick={()=>{clearInterval(updates.current);setItems(Array.from({length:20},(_,index)=>({id:`many-${index}`,title:`任务 ${index+1} · 待查看结果`,duration:0,description:'跨区域协作数据同步完成，详细信息保留在任务中心。LongResultIdentifierWithoutSpaces_2026_NotificationBoundary'})))}}>显示 20 条常驻通知</Button>
 <Button onClick={e=>openOverlay('modal',e.currentTarget)}>通知与 Modal</Button><Button onClick={e=>openOverlay('drawer',e.currentTarget)}>通知与 Drawer</Button>
 </Inline><p className="docs-muted">20 条样例用于检查边界；实际业务应汇总批量结果。</p></Disclosure><Disclosure className="ls-notification-boundaries" label="计时与键盘规则"><p className="docs-muted">完成提醒 5 秒后关闭；鼠标悬停或键盘焦点进入时暂停计时。Tab 可到达关闭和操作按钮，Escape 关闭当前通知。通知出现不抢焦点；相同任务 ID 不重复堆叠。常驻提醒由用户关闭。按 ID 合并保留位置；仅更新内容不重置计时，改变 duration 才重置倒计时。关闭全部会清理所有通知和定时器，并停止本例的模拟推送。窄屏通知区限高并独立滚动，批量关闭入口保持可见。多条通知关闭后，焦点先移至下一条（或上一条）的关闭按钮，最后一条关闭才返回进入通知区前的控件。</p></Disclosure>
 {viewed&&<p role="status">已查看模拟结果，通知仍保留，便于继续阅读。</p>}
 <Modal rootClassName="ls-notification-overlay" title="通知与模态框" open={overlay==='modal'} onCancel={closeOverlay} footer={<Inline className="ls-overlay-footer"><MotionButton onClick={closeOverlay} aria-label="关闭模态框" title="关闭模态框">关闭模态框</MotionButton></Inline>} afterClose={()=>closed('modal')} afterOpenChange={open=>{if(open)modalField.current?.focus()}}>{overlayContent('modal')}</Modal>
 <Drawer footer={<Inline className="ls-overlay-footer"><MotionButton onClick={closeOverlay} aria-label="关闭抽屉" title="关闭抽屉">关闭抽屉</MotionButton></Inline>} rootClassName="ls-notification-overlay" title="通知与抽屉" width="min(420px, 100vw)" open={overlay==='drawer'} onClose={closeOverlay} afterOpenChange={open=>{if(open)drawerField.current?.focus();else closed('drawer')}}>{overlayContent('drawer')}</Drawer>
 <NotificationViewport suspended={suspended} items={items} onClose={close} onCloseAll={closeAll}/></Stack>;
}
