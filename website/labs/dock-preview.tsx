import {useState} from 'react';
import {Home,Package,Component,Activity,ScrollText,Mail,SunMoon} from 'lucide-react';
import {Dock,type DockItem} from '../../dist/dock.js';
import {useTheme} from '../../dist/index.js';
import '../../dist/dock.css';
import './dock-preview.css';
const items:DockItem[]=[{id:'home',label:'工作台',icon:<Home/>},{id:'projects',label:'项目',icon:<Package/>},{id:'assets',label:'资源',icon:<Component/>},{id:'activity',label:'动态',icon:<Activity/>},{id:'notes',label:'笔记',icon:<ScrollText/>},{id:'inbox',label:'收件箱',icon:<Mail/>},{id:'theme',label:'切换主题',icon:<SunMoon/>,action:true}];
const descriptions:Record<string,string>={home:'把常用入口收进一条轻盈的工具栏。',projects:'常用项目随手可达，切换不打断当前工作。',assets:'图片、文档与灵感，保持清晰的归属。',activity:'查看工作动态，了解最近发生了什么。',notes:'在需要的时候，回到自己的想法。',inbox:'把需要关注的信息，留在一个地方。'};
export function DockPreview(){
 const [active,setActive]=useState('home');const {mode,setMode}=useTheme();
 const current=items.find(item=>item.id===active)!;
 return <div className="ls-dock-example">
  <div className="ls-dock-example-heading"><span>INTERACTION LAB / DOCK</span><h2>让常用入口，靠近一点。</h2><p>移动鼠标，图标随距离轻轻放大；点击切换内容，最后一个图标可切换浅暗主题。</p></div>
  <section className="ls-dock-example-stage" aria-label="Dock 工作台示例">
   <div className="ls-dock-example-content" role="status" aria-live="polite"><span className="ls-dock-example-symbol" aria-hidden="true">{current.icon}</span><h3>{current.label}</h3><p>{descriptions[active]}</p></div>
   <Dock items={items} activeId={active} onSelect={id=>{if(id==='theme')setMode(mode==='light'?'dark':'light');else setActive(id)}}/>
  </section>
  <p className="ls-dock-example-note">方向键移动焦点，Enter / Space 选择。窄屏与减少动态效果时保持固定尺寸；示例只切换本地内容。</p>
 </div>;
}
