import {useEffect,useRef,useState,type ComponentRef} from 'react';
import {ButtonGroup,RowActionButton,ThemeSwitch,MotionButton} from '../dist/index.js';
import {ProductionWorkspacePreview,DocumentWorkspacePreview} from './workspace-complex-preview';
import {BasicWorkspacePreview} from './workspace-layout-preview';
import {DockWorkspacePreview} from './workspace-dock-preview';
import './workspace-showcase.css';
export const layoutExamples=[['dock','Dock 项目工作台'],['production','生产多栏工作台'],['document','文档工作台'],['basic','基础外壳']] as const;
const selectedLayout=()=>layoutExamples.some(([key])=>key===location.hash.slice(1))?location.hash.slice(1):'dock';
export function WorkspaceShowcase(){
 const [layout,setLayout]=useState(selectedLayout),[immersive,setImmersive]=useState(false);
 const enterButton=useRef<ComponentRef<typeof MotionButton>>(null),exitButton=useRef<ComponentRef<typeof MotionButton>>(null);
 const leaveImmersive=()=>{setImmersive(false);requestAnimationFrame(()=>enterButton.current?.focus());};
 useEffect(()=>{if(!immersive)return;exitButton.current?.focus();const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!event.defaultPrevented){event.preventDefault();leaveImmersive();}};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape)},[immersive]);
 const [visited,setVisited]=useState(()=>new Set([selectedLayout()]));
 const selectLayout=(key:string)=>{setVisited(old=>new Set([...old,key]));setLayout(key);};
 useEffect(()=>{const update=()=>selectLayout(selectedLayout());window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update)},[]);
 return <div className="workspace-showcase" data-immersive={immersive}>
  <header className="workspace-showcase-bar" hidden={immersive}>
   <a className="workspace-showcase-brand" href="./#/components/workspace-layout">L<span>布局工作台</span></a>
   <ButtonGroup aria-label="选择布局样板">{layoutExamples.map(([key,label])=><RowActionButton key={key} aria-pressed={layout===key} onClick={()=>{location.hash=key;selectLayout(key)}}>{label}</RowActionButton>)}</ButtonGroup>
   <div className="workspace-showcase-actions"><MotionButton ref={enterButton} type="text" motionIcon="fullscreen" aria-label="进入整页体验" title="进入整页体验" onClick={()=>setImmersive(true)}/><ThemeSwitch compact variant="toggle"/></div>
  </header>
  {immersive&&<MotionButton ref={exitButton} className="workspace-showcase-exit" motionIcon="fullscreen" iconActive aria-label="返回布局选择" title="返回布局选择" onClick={leaveImmersive}/>}
  <div className="workspace-showcase-stage">
   <section hidden={layout!=='dock'} aria-label="Dock 项目工作台样板">{visited.has('dock')&&<DockWorkspacePreview/>}</section>
   <section hidden={layout!=='production'} aria-label="生产多栏工作台样板">{visited.has('production')&&<ProductionWorkspacePreview/>}</section>
   <section hidden={layout!=='document'} aria-label="文档工作台样板">{visited.has('document')&&<DocumentWorkspacePreview/>}</section>
   <section hidden={layout!=='basic'} aria-label="基础外壳样板">{visited.has('basic')&&<BasicWorkspacePreview/>}</section>
  </div>
 </div>;
}
