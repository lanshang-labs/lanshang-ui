import {useId,useState} from 'react';
import {SegmentedControl as Segmented} from '../dist/index.js';
import {TabStrip as Tabs, MenuDropdown as Dropdown} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {MotionIcon} from '../dist/index.js';
import {BeautifulTabs,RadioGroup,TaskRows} from '../dist/index.js';

/** Compare the shared visual grammar while preserving each control's semantics. */
export function MotionSelectionPreview(){
 const [route,setRoute]=useState('overview'),[density,setDensity]=useState('compact'),[scope,setScope]=useState('mine'),[menuOpen,setMenuOpen]=useState(false);
 const name=useId();
 const items=[{key:'overview',label:'概览'},{key:'activity',label:'活动'},{key:'disabled',label:'无权限',disabled:true}];
 return <>
  <section><h3>轻量导航 · BeautifulTabs</h3><BeautifulTabs items={items} activeKey={route} onChange={setRoute}/><p>选中项保留底片；悬停只提亮文字，移动焦点不改变当前项。</p></section>
  <section><h3>内容页签 · Tabs</h3><Tabs items={items.map(item=>({...item,children:<p>{item.label}内容</p>}))}/></section>
  <section><h3>分段选择 · Segmented</h3><Segmented aria-label="规范显示密度" value={density} onChange={setDensity} options={[{value:'compact',label:'紧凑'},{value:'comfortable',label:'舒适'},{value:'disabled',label:'不可用',disabled:true}]}/><p>切换后将鼠标移回旧项：只提亮文字，不出现第二层底色。</p></section>
  <section><h3>按钮式单选 · RadioGroup</h3><RadioGroup name={name} aria-label="规范项目范围" optionType="button" value={scope} onChange={e=>setScope(e.target.value)} options={[{value:'mine',label:'我的项目'},{value:'team',label:'团队项目'},{value:'disabled',label:'全部项目',disabled:true}]}/><p>使用 Lanshang UI 的 RadioGroup；保留原生单选语义，方向键切换，无点击扩散。</p></section>
  <section><h3>下拉菜单 · Dropdown</h3><Dropdown open={menuOpen} onOpenChange={setMenuOpen} autoFocus trigger={['click']} getPopupContainer={node=>node.parentElement!} menu={{selectable:true,selectedKeys:[route],items,onClick:({key})=>{setRoute(key);setMenuOpen(false)}}}><Button aria-haspopup="menu" aria-expanded={menuOpen} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setMenuOpen(true)}}}>切换视图<MotionIcon name="expand" active={menuOpen} size={14}/></Button></Dropdown><p>打开后已选项只显示勾选；自动定位不画底色，鼠标或键盘探索才显示浅色反馈。</p></section>
  <section><h3>任务卡片 · TaskRows</h3><TaskRows rows={[{key:'check',label:'检查项目配置',amount:'1 项',status:'done',details:[{label:'配置校验',meta:'通过'}]}]} labels={{completed:'已完成'}}/><p>使用箭头旋转和详情展开过渡，不套用单选底片。静态卡片不增加可点击暗示。</p></section>
 </>;
}
