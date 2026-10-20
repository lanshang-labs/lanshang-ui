import {MotionButton} from '../dist/index.js';
import {Stack,Inline} from '../dist/index.js';
import './overlay-preview.css';
import {useEffect,useRef,useState} from 'react';
import {Dialog as Modal, DrawerPanel as Drawer, ConfirmPopover as Popconfirm} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
type Kind='modal'|'drawer'|'popconfirm';
export function OverlayPreview(){
 const [open,setOpen]=useState<Kind|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[fail,setFail]=useState(true),[draft,setDraft]=useState('项目预览'),[notice,setNotice]=useState('只操作本地样例。');
 const opener=useRef<HTMLElement|null>(null),summary=useRef<HTMLParagraphElement>(null),safe=useRef<HTMLButtonElement>(null),retry=useRef<HTMLButtonElement>(null),owner=useRef<Element|null>(null),lock=useRef(false),timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 useEffect(()=>{if(error&&(document.activeElement===document.body||document.activeElement===owner.current))retry.current?.focus()},[error]);
 const returnFocus=()=>{const node=opener.current;const active=document.activeElement;if(active!==document.body&&active?.isConnected&&!active.closest('.ls-overlay-demo-popup'))return;(node?.isConnected&&!node.matches(':disabled')?node:summary.current)?.focus()};
 function begin(kind:Kind,target:HTMLElement){opener.current=target;setError('');setOpen(kind)}
 function close(){if(lock.current)return;setOpen(null);setError('')}
 function submit(){if(lock.current)return;lock.current=true;setBusy(true);setError('');owner.current=document.activeElement;timer.current=setTimeout(()=>{lock.current=false;setBusy(false);if(fail){setError('模拟请求失败，输入保留。关闭失败模拟后可重试。')}else{setNotice('操作已确认，样例已保存。');setOpen(null)}},450)}
 const content=<Stack gap="md" className="ls-overlay-content"><TextInput aria-label="浮层项目名称" value={draft} disabled={busy} onChange={e=>setDraft(e.target.value)}/><Checkbox checked={fail} disabled={busy} onChange={e=>setFail(e.target.checked)}>模拟请求失败</Checkbox>{error&&<FeedbackPanel variant="inline" type="error" message="暂未保存" description={<span role="alert">{error}</span>}/>}<p>请求期间保留浮层，防止结果未知时重复提交。</p></Stack>;
 const actions=<Inline className="ls-overlay-actions"><MotionButton motionIcon="back" ref={safe} disabled={busy} onClick={close}>返回，不执行</MotionButton><MotionButton motionIcon={error?"retry":"save"} type="primary" ref={retry} loading={busy} disabled={busy} onClick={submit}>{error?'重试操作':'确认操作'}</MotionButton></Inline>;
 return <Stack className="ls-overlay-demo"><Inline><Button onClick={e=>begin('modal',e.currentTarget)}>打开 Modal</Button><Button onClick={e=>begin('drawer',e.currentTarget)}>打开 Drawer</Button><Popconfirm icon={null} destroyTooltipOnHide rootClassName="ls-overlay-demo-popup" open={open==='popconfirm'} title="确认更新项目？" description={<Stack gap="md" onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();close()}}}>{content}{actions}</Stack>} hideDefaultActions onOpenChange={next=>{if(!next)close()}} afterOpenChange={next=>{if(next)safe.current?.focus();else returnFocus()}}><Button onClick={e=>begin('popconfirm',e.currentTarget)}>打开 Popconfirm</Button></Popconfirm></Inline>
 <p ref={summary} tabIndex={-1} className="ls-queue-result" role="status">{notice}</p>
 <Modal destroyOnClose rootClassName="ls-overlay-demo-popup" title="确认项目修改" open={open==='modal'} focusTriggerAfterClose={false} afterClose={returnFocus} afterOpenChange={next=>{if(next)safe.current?.focus()}} onCancel={close} keyboard={!busy} maskClosable={!busy} closable={!busy} footer={actions}>{content}</Modal>
 <Drawer destroyOnClose rootClassName="ls-overlay-demo-popup" title="编辑项目详情" open={open==='drawer'} width="min(420px, 100vw)" afterOpenChange={next=>{if(next)safe.current?.focus();else returnFocus()}} onClose={close} keyboard={!busy} maskClosable={!busy} closable={!busy} footer={actions}>{content}</Drawer>
 </Stack>;
}
