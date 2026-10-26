import {MotionButton} from '../dist/index.js';
import {Select} from '../dist/index.js';
import {overlayPopupContainer} from './overlay-popup-container';
import {MotionIcon} from '../dist/index.js';
import {Stack,Inline} from '../dist/index.js';
import {useRef,useState} from 'react';
import {Dialog as Modal, DrawerPanel as Drawer, MenuDropdown as Dropdown, HintTooltip as Tooltip} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import type {SelectRef as RefSelectProps} from '../dist/index.js';
import './overlay-preview.css';
type Popup='select'|'menu'|'tip'|null;
export function OverlayControlsPreview(){
 const [kind,setKind]=useState<'modal'|'drawer'|null>(null),[popup,setPopup]=useState<Popup>(null),[team,setTeam]=useState('design'),[notice,setNotice]=useState('选择和菜单操作只更新本地状态。');
 const host=useRef<HTMLDivElement>(null),controls=useRef<HTMLDivElement>(null),opener=useRef<HTMLElement|null>(null),select=useRef<RefSelectProps>(null),menu=useRef<HTMLButtonElement>(null),tip=useRef<HTMLButtonElement>(null),closeButton=useRef<HTMLButtonElement>(null);
 function dismiss(){const current=popup;setPopup(null);if(current==='select')select.current?.focus();else if(current==='menu')menu.current?.focus();else tip.current?.focus()}
 const container=(trigger:HTMLElement)=>overlayPopupContainer(trigger,host.current!);
 function togglePopup(target:Exclude<Popup,null>,open:boolean){setPopup(current=>open?target:current===target?null:current)}
 const content=<div ref={host} className="ls-overlay-control-host" onKeyDownCapture={e=>{if(e.key==='Escape'&&popup){e.preventDefault();e.stopPropagation();dismiss()}else if(e.key==='Tab'&&popup){setPopup(null);if(popup==='menu'){e.preventDefault();if(e.shiftKey)menu.current?.focus();else tip.current?.focus()}else if(popup==='tip'){e.preventDefault();if(e.shiftKey)menu.current?.focus();else closeButton.current?.focus()}}}}>
 <div onScroll={e=>{const area=e.currentTarget.getBoundingClientRect(),trigger=controls.current?.getBoundingClientRect();if(popup&&trigger&&(trigger.bottom<=area.top||trigger.top>=area.bottom)){setPopup(null);if(document.activeElement?.closest('.ant-dropdown,.ant-tooltip'))e.currentTarget.focus({preventScroll:true})}}} className="ls-overlay-control-scroll" role="region" aria-label="浮层控件滚动区" tabIndex={0}>
 <Stack><p>滚动内容时检查弹出层跟随；Escape 先关闭当前弹出层，再关闭父层。</p>
 <div ref={controls}><Inline><Select ref={select} aria-label="浮层负责人" style={{width:200,maxWidth:'100%'}} popupClassName="ls-overlay-control-select" virtual={false} notFoundContent={<div className="ls-overlay-no-results" role="status">没有匹配的团队，请尝试其他关键词。</div>} showSearch optionFilterProp="label" value={team} open={popup==='select'} onDropdownVisibleChange={open=>togglePopup('select',open)} getPopupContainer={container} onChange={value=>{setTeam(value);setNotice('已选择负责人');setPopup(null);select.current?.focus()}} options={[{value:'design',label:'设计团队'},{value:'engineering',label:'研发团队 · 公共基础设施与跨项目协作 / InfrastructurePlatformTeam'},{value:'archived',label:'归档团队 · 历史项目已归档，当前不可分配（不可选）',disabled:true,'aria-disabled':true}]}/>
 <Dropdown overlayClassName="ls-overlay-control-menu" autoFocus trigger={['click']} open={popup==='menu'} onOpenChange={open=>togglePopup('menu',open)} getPopupContainer={container} menu={{items:[{key:'copy',label:'复制配置（模拟）'},{key:'reset',label:'恢复默认团队'},{key:'restricted',label:'导出团队完整配置与历史记录（无权限操作）',disabled:true}],onClick:({key})=>{if(key==='reset')setTeam('design');setNotice(key==='reset'?'已恢复默认团队':'已完成模拟复制');setPopup(null);menu.current?.focus()}}}><Button ref={menu} aria-haspopup="menu" aria-expanded={popup==='menu'} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setPopup('menu')}}}>浮层更多操作<MotionIcon name="expand" active={popup==='menu'} size={14}/></Button></Dropdown>
 <Tooltip title="这里选择本次任务的负责团队。归档团队不可分配；输入名称可搜索，没有匹配结果时可以修改关键词。此说明不会改变当前选择。" trigger={['hover','focus']} open={popup==='tip'} onOpenChange={open=>togglePopup('tip',open)} getPopupContainer={container} overlayClassName="ls-overlay-control-tooltip"><Button ref={tip} aria-label="负责人说明">说明</Button></Tooltip></Inline></div>
 {Array.from({length:18},(_,i)=><p key={i}>说明 {i+1} · 所选团队用于本地演示。下拉内容和提示挂载在当前浮层中，保留键盘上下文。</p>)}</Stack>
 </div><p role="status">{notice}</p></div>;
 function close(){setPopup(null);setKind(null)}
 const afterClose=()=>opener.current?.isConnected&&opener.current.focus();
 return <Stack><Inline><Button onClick={e=>{opener.current=e.currentTarget;setKind('modal')}}>Modal 内控件</Button><Button onClick={e=>{opener.current=e.currentTarget;setKind('drawer')}}>Drawer 内控件</Button></Inline>
 <Modal destroyOnClose rootClassName="ls-overlay-demo-popup" title="Modal 内的选择与操作" open={kind==='modal'} keyboard={!popup} maskClosable={!popup} onCancel={close} focusTriggerAfterClose={false} afterClose={afterClose} afterOpenChange={open=>{if(open)select.current?.focus()}} footer={<MotionButton ref={closeButton} onClick={close} aria-label="关闭控件示例" title="关闭控件示例">关闭控件示例</MotionButton>}>{content}</Modal>
 <Drawer destroyOnClose rootClassName="ls-overlay-demo-popup" title="Drawer 内的选择与操作" open={kind==='drawer'} width="min(460px,100vw)" keyboard={!popup} maskClosable={!popup} onClose={close} afterOpenChange={open=>{if(open)select.current?.focus();else afterClose()}} footer={<MotionButton ref={closeButton} onClick={close} aria-label="关闭控件示例" title="关闭控件示例">关闭控件示例</MotionButton>}>{content}</Drawer>
 </Stack>;
}
