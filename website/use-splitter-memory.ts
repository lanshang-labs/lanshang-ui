import {useEffect,useRef,useState} from 'react';
import {freshLayout,parseLayout,splitterMemoryKey,type LayoutMemory,type SplitterMode} from './splitter-memory';
export function useSplitterMemory(simulateStorageFailure=false){
 const [initial]=useState(()=>{try{return {record:parseLayout(localStorage.getItem(splitterMemoryKey)),error:''}}catch{return {record:freshLayout(),error:'无法读取布局记录。当前使用默认布局；请重置后再保存。'}}});
 const [external,setExternal]=useState(false),[dirty,setDirty]=useState(false);
 const seen=useRef<string|null|undefined>(undefined);
 useEffect(()=>{
  try{seen.current=localStorage.getItem(splitterMemoryKey)}catch{}
  function sync(event:StorageEvent){
   if(event.key!==splitterMemoryKey&&event.key!==null)return;
   try{if(event.storageArea!==localStorage)return;setExternal(localStorage.getItem(splitterMemoryKey)!==seen.current)}catch{setError('无法读取其他标签页的布局，请恢复存储权限后重试。')}
  }
  window.addEventListener('storage',sync);return ()=>window.removeEventListener('storage',sync);
 },[]);
 function applyExternal(){
  try{
   if(simulateStorageFailure)throw new Error('Simulated storage failure');
   const raw=localStorage.getItem(splitterMemoryKey),next=parseLayout(raw);
   seen.current=raw;current.current=next;setRecord(next);blocked.current=false;setExternal(false);setDirty(false);setError('');setRevision(value=>value+1);setNotice('已应用其他标签页的最新布局；当前备注保留。');
  }catch{setError('无法应用外部布局，当前布局保留；请重试或重置布局。')}
 }
 const [revision,setRevision]=useState(0),[notice,setNotice]=useState('');
 const [record,setRecord]=useState(initial.record),[error,setError]=useState(initial.error);const current=useRef(record),blocked=useRef(!!initial.error);
 function save(next:LayoutMemory,overwrite=false){
  setDirty(true);
  if(blocked.current)return;
  try{
   if(simulateStorageFailure)throw new Error('Simulated storage failure');
   // Read again at the write boundary: a storage event may still be queued.
   if(!overwrite&&localStorage.getItem(splitterMemoryKey)!==seen.current){
    setExternal(true);setNotice('');setError('外部布局已变化，本页调整尚未保存。请选择保留本页或应用外部布局。');return;
   }
   const raw=JSON.stringify(next);localStorage.setItem(splitterMemoryKey,raw);
   seen.current=raw;setExternal(false);setDirty(false);setError('');setNotice('布局偏好已保存。');
  }catch{setNotice('');setError('布局保存失败，当前操作仍可继续；刷新后可能无法恢复。')}
 }
 function update(next:LayoutMemory){current.current=next;setRecord(next);save(next)}
 function retrySave(){save(current.current,external)}

 function panel(key:string){return {...record.panels[key],onResize:(size:number)=>update({...current.current,panels:{...current.current.panels,[key]:{...current.current.panels[key],size}}}),onCollapsedChange:(collapsed:boolean)=>update({...current.current,panels:{...current.current.panels,[key]:{...current.current.panels[key],collapsed}}})}}
 function reset(){try{if(simulateStorageFailure)throw new Error('Simulated storage failure');localStorage.removeItem(splitterMemoryKey);seen.current=null;setExternal(false);const next=freshLayout();current.current=next;setRecord(next);blocked.current=false;setDirty(false);setError('');setRevision(value=>value+1);setNotice('已重置全部布局；回到任务队列，当前备注保留。')}catch{setNotice('');setError('无法清除布局记录，请恢复浏览器存储权限后重试。')}}
 return {mode:record.mode,setMode:(mode:SplitterMode)=>update({...current.current,mode}),panel,reset,error,revision,notice,external,applyExternal,dirty,retrySave};
}
