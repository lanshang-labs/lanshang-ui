import {MotionButton} from '../dist/index.js';
import './overlay-preview.css';
import {useEffect,useRef,useState} from 'react';
import type {TextInputRef as InputRef} from '../dist/index.js';
import {Dialog as Modal, DrawerPanel as Drawer} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {Stack,Inline,NotificationViewport,mergeNotification,type NotificationItem} from '../dist/index.js';
/** Visibility and close-animation ownership belong to the application, not the notification. */
export function NotificationNestedPreview(){
 const [modal,setModal]=useState(false),[drawer,setDrawer]=useState(false),[modalPresent,setModalPresent]=useState(false),[drawerPresent,setDrawerPresent]=useState(false);
 const modalOpen=useRef(false),drawerOpen=useRef(false),root=useRef<HTMLButtonElement>(null),child=useRef<HTMLButtonElement>(null),field=useRef<InputRef>(null);
 const [long,setLong]=useState(false);
 const [items,setItems]=useState<NotificationItem[]>([]);
 const reopen=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(reopen.current),[]);
 function showModal(){modalOpen.current=true;setModalPresent(true);setModal(true)}
 function showDrawer(){drawerOpen.current=true;setDrawerPresent(true);setDrawer(true)}
 function closeModal(){if(drawerPresent)return;modalOpen.current=false;setModal(false)}
 function closeDrawer(){drawerOpen.current=false;setDrawer(false)}
 function rapid(kind:'modal'|'drawer'){clearTimeout(reopen.current);if(kind==='modal')closeModal();else closeDrawer();reopen.current=setTimeout(()=>{if(kind==='modal')showModal();else showDrawer()},80)}
 function update(){setItems(rows=>mergeNotification(rows,{id:'nested-job',title:rows.length?'后台结果已更新':'后台任务已完成',type:'success',duration:5000,description:long?'浮层期间接收并合并结果。跨区域协作交付任务需要核对原始素材与处理回执：ProjectDelivery_2026_LongIdentifierWithoutSpaces_ReviewRequired。全部关闭后继续计时。':'浮层期间接收并合并结果，全部关闭后才继续 5 秒计时。'}))}
 const details=long?<Stack gap="md" className="ls-notification-long"><p>请逐项检查交付说明；长内容在浮层正文内滚动，底部操作保持可达。</p>{Array.from({length:18},(_,i)=><p key={i}>交付说明 {i+1} · 已完成结果会保留，失败项目需要核对回执。ProjectDelivery_2026_LongIdentifierWithoutSpaces_ReviewRequired。</p>)}</Stack>:null;
 return <Stack><Inline><Button ref={root} onClick={showModal}>打开嵌套通知示例</Button><Button onClick={update}>模拟后台结果</Button><Checkbox checked={long} onChange={e=>setLong(e.target.checked)}>长文本与窄屏样例</Checkbox></Inline><p className="docs-muted">Modal → Drawer；Escape 逐层关闭。快速重开使用 80ms 模拟，旧关闭回调不得恢复通知或抢走新浮层的焦点。</p>
 <Modal rootClassName="ls-notification-overlay" title={long?"嵌套通知 · 跨区域项目交付结果核对与异常恢复工作区":"嵌套通知 · 工作区"} open={modal} keyboard={!drawerPresent} maskClosable={!drawerPresent} closable={!drawerPresent} focusTriggerAfterClose={false}
 modalRender={node=><div aria-hidden={drawerPresent||undefined} ref={element=>{if(element){if(drawerPresent)element.setAttribute('inert','');else element.removeAttribute('inert')}}}>{node}</div>}
 onCancel={closeModal} afterOpenChange={open=>{if(open&&modalOpen.current){if(drawerOpen.current)field.current?.focus();else child.current?.focus()}}} afterClose={()=>{if(modalOpen.current)return;setModalPresent(false);root.current?.focus()}} footer={<Inline className="ls-overlay-footer"><MotionButton onClick={closeModal} disabled={drawerPresent} aria-label="关闭工作区" title="关闭工作区">关闭工作区</MotionButton><Button ref={child} aria-label="打开内层 Drawer" onClick={showDrawer} disabled={drawerPresent}>{long?'打开详情并继续核对交付结果':'打开内层 Drawer'}</Button></Inline>}>
 <Stack><TextInput aria-label="工作区备注" placeholder="备注保留在当前浮层"/><Inline><MotionButton motionIcon="notice" onClick={update}>更新后台通知</MotionButton><Button onClick={()=>rapid('modal')} disabled={drawerPresent}>快速重开 Modal</Button></Inline><p>输入与操作组间距 16px，组内按钮间距 8px。内层关闭期间父层保持不可交互。</p>{details}</Stack>
 </Modal>
 <Drawer rootClassName="ls-notification-overlay" footer={<Inline className="ls-overlay-footer"><Button aria-label="返回工作区" onClick={closeDrawer}>{long?"保留备注并返回工作区继续检查":"返回工作区"}</Button></Inline>} title={long?"交付详情 · 长标识与异常恢复说明":"嵌套通知 · 详情"} open={drawer} width="min(420px,100vw)" zIndex={1100} onClose={closeDrawer} afterOpenChange={open=>{if(open){if(drawerOpen.current)field.current?.focus()}else{if(drawerOpen.current)return;setDrawerPresent(false);requestAnimationFrame(()=>{if(!drawerOpen.current&&modalOpen.current)child.current?.focus()})}}}>
 <Stack><TextInput ref={field} aria-label="内层详情备注"/><Inline><MotionButton motionIcon="notice" onClick={update}>更新内层后台通知</MotionButton><Button onClick={()=>rapid('drawer')}>快速重开 Drawer</Button></Inline><p>关闭内层后通知仍暂停，直到外层关闭动画完成。</p>{details}</Stack>
 </Drawer>
 <NotificationViewport suspended={modalPresent||drawerPresent} items={items} onClose={id=>setItems(rows=>rows.filter(row=>row.id!==id))} onCloseAll={()=>setItems([])}/></Stack>;
}
