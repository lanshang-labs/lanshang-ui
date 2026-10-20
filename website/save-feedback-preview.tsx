import {Select} from '../dist/index.js';
import {useRef,useState} from 'react';
import {LayoutSpace as Space, Dialog as Modal} from '../dist/index.js';
import {ToggleSwitch as Switch} from '../dist/index.js';
import {EditFormBlock,ProjectSaveUnknown,type ProjectRecord} from './blocks';
import {createProjectSource,projectSamples,demoOwners,demoCategories} from './mock-project-source';
import './save-feedback-preview.css';

/** Demo transport only. A production API needs durable operation IDs and receipt lookup. */
export function SaveFeedbackPreview(){
 const [recordIndex,setRecordIndex]=useState(0),[dirty,setDirty]=useState(false),[unresolved,setUnresolved]=useState(false),[nextRecord,setNextRecord]=useState<number>();
 const [records,setRecords]=useState(projectSamples);
 const remember=(saved:ProjectRecord)=>{setRecords(rows=>rows.map(row=>row.id===saved.id?saved:row));return saved};
 const source=useRef(createProjectSource()).current;
 const [mode,setMode]=useState('success'),[lookupFail,setLookupFail]=useState(false),[writes,setWrites]=useState(0),[busy,setBusy]=useState(false);
 const lookupFailure=useRef(lookupFail);lookupFailure.current=lookupFail;
 async function save(record:ProjectRecord){
  setBusy(true);
  try{
   if(mode==='failure')return await source.save(record,true);
   if(mode==='unknown-missing'){await new Promise(resolve=>setTimeout(resolve,700));throw new ProjectSaveUnknown(async()=>{await new Promise(resolve=>setTimeout(resolve,700));if(lookupFailure.current)throw new Error('无法核对');return null})}
   const saved=await source.save(record);setWrites(n=>n+1);
   if(mode==='unknown-saved')throw new ProjectSaveUnknown(async()=>{const result=await source.detail(saved.id);if(lookupFailure.current)throw new Error('无法核对');return result.record?remember(result.record):null});
   return remember(saved);
  }finally{setBusy(false)}
 }
 return <div className="ls-save-spec"><div className="ls-save-spec-intro"><strong>保存结果决定恢复动作</strong><div><span>成功：确认完成</span><span>明确失败：允许重试</span><span>未知结果：先核对回执</span></div><p>在下方切换模拟结果、修改表单并保存，观察反馈和“实际写入”次数。未知结果不能直接重发。</p></div><Space wrap style={{marginBottom:20}}><Select aria-label="切换保存示例记录" value={recordIndex} disabled={busy||unresolved} style={{width:180}} options={[{value:0,label:"设计系统"},{value:1,label:"文档中心"}]} onChange={next=>dirty?setNextRecord(next):setRecordIndex(next)}/><Select aria-label="模拟保存结果" disabled={busy} value={mode} onChange={setMode} style={{width:220}} options={[{value:'success',label:'保存成功'},{value:'failure',label:'明确失败，未执行'},{value:'unknown-saved',label:'超时，实际已保存'},{value:'unknown-missing',label:'超时，实际未执行'}]}/><label><Switch checked={lookupFail} onChange={setLookupFail} aria-label="模拟回执核对失败"/> 核对失败</label><span>实际写入 {writes} 次</span></Space>
 <EditFormBlock record={records[recordIndex]} onDirtyChange={setDirty} onUnresolvedChange={setUnresolved} owners={demoOwners} categories={demoCategories} onSave={save}/>
 <Modal title="放弃修改并切换记录？" open={nextRecord!==undefined} onCancel={()=>setNextRecord(undefined)} onOk={()=>{setRecordIndex(nextRecord!);setNextRecord(undefined)}} okText="放弃并切换" cancelText="继续编辑"><p>当前未保存的输入将被丢弃。保存和结果待核对期间不能切换记录。</p></Modal>
 <p className="docs-muted">保存和待核对期间禁止切换记录；有未保存输入时先确认。仅内存模拟，刷新后重置。未知结果不等于失败：核对成功不再次写入；确认未执行后才开放保存。真实服务必须按操作 ID 核对持久化回执，不能仅通过记录当前内容判断。</p></div>;
}
