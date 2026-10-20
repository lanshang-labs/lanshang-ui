import {useEffect,useRef,useState} from 'react';
import {SearchField,MotionButton,MotionIcon,motionIcons} from '../dist/index.js';
import './icon-motion-preview.css';
export function IconMotionPreview(){
 const [query,setQuery]=useState('');
 const visible=motionIcons.filter(item=>`${item.name} ${item.id}`.toLowerCase().includes(query.trim().toLowerCase()));
 return <div className="icon-gallery"><p>点击图标播放，再次点击重播；成对图标点击切换。保存图标会演示对号变为等待圆弧，再恢复对号。</p><SearchField aria-label="搜索图标" placeholder="搜索图标名称…" value={query} onChange={setQuery}/><div className="icon-review-grid">{visible.map(item=><IconTile key={item.id} item={item}/>)}</div>{!visible.length&&<p role="status">没有匹配的图标</p>}</div>
}
function IconTile({item}:{item:typeof motionIcons[number]}){
 const [play,setPlay]=useState(0);const toggle=['theme','turn','pair','folder','lock'].includes(item.effect);
 const [pending,setPending]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function playIcon(){if(pending)return;setPlay(n=>n+1);if(item.id==='save'){setPending(true);timer.current=setTimeout(()=>{setPending(false);timer.current=null},1200)}}
 return <MotionButton className="icon-review-tile" aria-label={`${item.name}，点击播放动效`} aria-pressed={toggle?play%2===1:undefined} aria-busy={pending} onClick={playIcon}><MotionIcon name={item.id} active={play%2===1} replay={play} pending={pending} size={24}/><span>{item.name}</span></MotionButton>;
}
