import {MotionButton} from '../dist/index.js';
import {useEffect,useRef,useState} from 'react';
import {UploadControl as Upload} from '../dist/index.js';
import {Dialog as Modal} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {FeedbackPanel,Inline,Progress,Stack,StatusTag} from '../dist/index.js';
import './upload-preview.css';
type State='running'|'failed'|'success'|'cancelled';
type Item={id:string;file:File;url?:string;state:State;percent:number};
const accepted=/\.(png|jpe?g|webp|gif|mp4|webm|pdf|txt|docx)$/i;
export function uploadFileError(file:File){
 return !accepted.test(file.name)?'不支持此文件类型':file.size===0?'不能选择空文件':file.size>50*1024*1024?'单个文件不能超过 50 MB':'';
}
export function UploadPreview(){
 const [items,setItems]=useState<Item[]>([]),[fail,setFail]=useState(false),[message,setMessage]=useState('');
 const [receipt,setReceipt]=useState<{added:number;errors:string[]}|null>(null);
 const batches=useRef(new WeakSet<File[]>());
 const [preview,setPreview]=useState<Item|null>(null),[previewError,setPreviewError]=useState(false);
 const rows=useRef<Item[]>([]),timers=useRef(new Map<string,ReturnType<typeof setInterval>>()),serial=useRef(0);
 const opener=useRef<HTMLElement|null>(null),choose=useRef<HTMLButtonElement>(null);
 const previewButtons=useRef(new Map<string,HTMLElement>()),attempts=useRef(new Map<string,number>());
 function update(fn:(items:Item[])=>Item[]){rows.current=fn(rows.current);setItems(rows.current)}
 function stop(id:string){attempts.current.set(id,(attempts.current.get(id)??0)+1);clearInterval(timers.current.get(id));timers.current.delete(id)}
 useEffect(()=>()=>{timers.current.forEach(clearInterval);attempts.current.clear();rows.current.forEach(item=>{if(item.url)URL.revokeObjectURL(item.url)})},[]);
 function start(id:string){
  stop(id);const failAttempt=fail,attempt=attempts.current.get(id);
  update(list=>list.map(item=>item.id===id?{...item,state:'running',percent:0}:item));
  timers.current.set(id,setInterval(()=>{
   if(attempts.current.get(id)!==attempt)return;
   const item=rows.current.find(row=>row.id===id);
   if(!item||item.state!=='running'){stop(id);return}
   const percent=Math.min(100,item.percent+25);
   const state:State=failAttempt&&percent>=50?'failed':percent===100?'success':'running';
   update(list=>list.map(row=>row.id===id?{...row,percent,state}:row));
   if(state!=='running'){stop(id);setMessage(item.file.name+(state==='success'?'：模拟上传完成':'：模拟上传失败，可重试'))}
  },400));
 }
 function addBatch(files:File[]){
  const errors:string[]=[];let added=0;
  for(const file of files){
   const error=uploadFileError(file)||(rows.current.length>=5?'最多保留 5 个文件，请先移除不需要的文件。':'');
   if(error){errors.push(file.name+'：'+error);continue}
   const id=String(++serial.current);
   const media=/\.(png|jpe?g|webp|gif|mp4|webm)$/i.test(file.name);
   update(list=>[...list,{id,file,url:media?URL.createObjectURL(file):undefined,state:'running',percent:0}]);start(id);added++;
  }
  setReceipt({added,errors});
  setMessage(`本次加入 ${added} 个文件，未加入 ${errors.length} 个。`);
 }
 function beforeUpload(_file:File,files:File[]){
  // rc-upload calls this once per file with the same batch array.
  if(!batches.current.has(files)){batches.current.add(files);addBatch(files)}
  return Upload.LIST_IGNORE;
 }
 function remove(item:Item){
  const index=rows.current.findIndex(row=>row.id===item.id);
  const neighbor=rows.current[index+1]??rows.current[index-1];
  stop(item.id);if(item.url)URL.revokeObjectURL(item.url);
  update(list=>list.filter(row=>row.id!==item.id));(neighbor?previewButtons.current.get(neighbor.id):choose.current)?.focus();setMessage('已移除 '+item.file.name);
 }
 function batch(action:'cancel'|'retry'|'remove'){
  const targets=rows.current.filter(item=>action==='cancel'?item.state==='running':action==='retry'?item.state==='failed'||item.state==='cancelled':item.state!=='running');
  if(!targets.length)return;
  if(action==='retry')targets.forEach(item=>start(item.id));
  else {
   const ids=new Set(targets.map(item=>item.id));
   targets.forEach(item=>{stop(item.id);if(action==='remove'&&item.url)URL.revokeObjectURL(item.url)});
   update(list=>action==='remove'?list.filter(item=>!ids.has(item.id)):list.map(item=>ids.has(item.id)?{...item,state:'cancelled'}:item));
  }
  setMessage({cancel:'已取消',retry:'已重新开始',remove:'已移除'}[action]+' '+targets.length+' 个文件；其他状态保持不变。');
 }
 const running=items.filter(item=>item.state==='running').length;
 const retryable=items.filter(item=>item.state==='failed'||item.state==='cancelled').length;
 const removable=items.length-running;
 function samples(long=false){
  const bytes=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='),c=>c.charCodeAt(0));
  addBatch([new File([bytes],'预览图片.png',{type:'image/png'}),
  new File(['本地模拟交付说明，不上传到服务器。'],long?'跨区域交付说明_ProjectDelivery_2026_ReviewRequiredWithoutSpaces_ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789.txt':'交付说明.txt',{type:'text/plain'})]);
 }
 return <Stack className="ls-upload-example">
  <header><h3>素材上传</h3><p className="docs-muted">图片、视频与文档统一为文件卡片。所有进度均为本地模拟，不发送文件。</p></header>
  <Inline><Upload multiple accept=".png,.jpg,.jpeg,.webp,.gif,.mp4,.webm,.pdf,.txt,.docx" showUploadList={false} beforeUpload={beforeUpload}><MotionButton motionIcon="upload" ref={choose} type="primary">选择文件</MotionButton></Upload><Button onClick={()=>samples()}>添加模拟图片与文档</Button><Button onClick={()=>samples(true)}>添加长文件名样例</Button><Button onClick={()=>addBatch([new File(['demo'],'有效文档.txt'),new File(['demo'],'不支持的附件.exe'),new File([],'空文档.txt'),...Array.from({length:5},(_,i)=>new File(['demo'],`批次文档 ${i+1}.txt`))])}>添加混合校验样例</Button><Checkbox checked={fail} onChange={e=>setFail(e.target.checked)}>模拟上传失败</Checkbox></Inline>
  <Upload.Dragger multiple showUploadList={false} beforeUpload={beforeUpload}>
   <p>拖放图片、视频或文档到这里</p><p className="docs-muted">也可点击选择文件，或使用上方“选择文件”按钮。</p>
  </Upload.Dragger>
  <Inline><Button aria-disabled={!running} onClick={()=>batch('cancel')}>批量取消</Button><MotionButton motionIcon="retry" aria-disabled={!retryable} onClick={()=>batch('retry')}>批量重试</MotionButton><Button aria-disabled={!removable} onClick={()=>batch('remove')}>移除非上传中项</Button></Inline>
  <p className="docs-muted">上传中 {running} · 可重试 {retryable} · 可移除 {removable}。批量操作作用于当前列表中适用的文件；移除不会中断上传，请先取消。</p>
  <p className="docs-muted">最多 5 个文件，每个不超过 50 MB。支持 PNG / JPEG / WebP / GIF、MP4 / WebM、PDF / TXT / DOCX。失败开关作用于新上传或重试，不改变已开始的尝试。</p>
  <p role="status" className="docs-muted">{message||'选择文件后自动开始模拟上传。'}</p>
  {receipt&&<section className="ls-upload-receipt" aria-label="最近一次文件校验">
   <FeedbackPanel type={receipt.errors.length?'warning':'success'} message={`本次加入 ${receipt.added} 个文件，未加入 ${receipt.errors.length} 个。`} description="按文件顺序接收有效项；未加入的文件不会自动重试，请处理原因后重新选择。"/>
   {receipt.errors.length>0&&<ul tabIndex={0} aria-label="未加入文件及原因">{receipt.errors.map((error,index)=><li key={index}>{error}</li>)}</ul>}
  </section>}
  {!items.length&&<FeedbackPanel message="还没有文件" description="选择本地素材，或添加模拟文件体验进度与恢复。"/>}
  <Stack gap="sm">{items.map(item=><article key={item.id} className="ls-upload-card" aria-label={item.file.name}><Stack gap="sm">
   <Inline><strong className="ls-upload-name">{item.file.name}</strong><StatusTag tone={item.state==='failed'?'error':item.state==='success'?'success':'neutral'}>{{running:'上传中',failed:'失败',success:'完成',cancelled:'已取消'}[item.state]}</StatusTag></Inline>
   <span className="docs-muted">{(item.file.size/1024).toFixed(1)} KB · {item.percent}% · 仅本地模拟</span>
   <Progress label={item.file.name} value={item.percent} status={item.state} showInfo={false}/>
   <Inline><Button ref={node=>{if(node)previewButtons.current.set(item.id,node);else previewButtons.current.delete(item.id)}} aria-label={`预览 ${item.file.name}`} onClick={event=>{opener.current=event.currentTarget;setPreviewError(false);setPreview(item)}}>预览</Button>
    <Button aria-disabled={item.state==='success'} aria-label={`${item.state==='running'?'取消上传':item.state==='success'?'已完成':'重新上传'} ${item.file.name}`} onClick={()=>{if(item.state==='success')return;if(item.state==='running'){stop(item.id);update(list=>list.map(row=>row.id===item.id?{...row,state:'cancelled'}:row));setMessage('已取消 '+item.file.name)}else start(item.id)}}>{item.state==='running'?'取消上传':item.state==='success'?'已完成':'重新上传'}</Button>
    <MotionButton motionIcon="delete" aria-label={`移除 ${item.file.name}`} onClick={()=>remove(item)}>移除</MotionButton></Inline>
   {item.state==='failed'&&<p className="docs-muted">模拟请求失败，文件保留。关闭失败开关后重试。</p>}
  </Stack></article>)}</Stack>
  <Modal className="ls-upload-preview" title={preview?.file.name??'文件预览'} open={!!preview} onCancel={()=>setPreview(null)} footer={<MotionButton motionIcon="close" onClick={()=>setPreview(null)}>关闭预览</MotionButton>} focusTriggerAfterClose={false} afterClose={()=>{if(opener.current?.isConnected)opener.current.focus();else choose.current?.focus()}}>
   {preview&&(/\.(png|jpe?g|webp|gif)$/i.test(preview.file.name)?<img className="ls-upload-media" src={preview.url} onError={()=>setPreviewError(true)} alt={preview.file.name}/>:/\.(mp4|webm)$/i.test(preview.file.name)?<video key={preview.id} className="ls-upload-media" src={preview.url} onError={()=>setPreviewError(true)} controls preload="metadata" aria-label={preview.file.name}/>:<Stack><StatusTag>文档</StatusTag><p>{preview.file.name}</p><p className="docs-muted">文档预览仅展示文件信息，不执行或嵌入文件内容。PDF / Office 正文预览由业务接入安全预览服务。</p></Stack>)}
   {previewError&&<FeedbackPanel type="warning" role="alert" message="无法预览此文件" description="文件可能已损坏或浏览器不支持其编码；可关闭预览，文件卡片与上传状态保留。"/>}
  </Modal>
 </Stack>;
}
