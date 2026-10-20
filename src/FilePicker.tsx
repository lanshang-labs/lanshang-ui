import {useId,type ChangeEvent} from 'react';
import {UploadOutlined,FileTextOutlined} from './icons.js';
import {MotionButton} from './MotionButton.js';
export type FilePickerProps={label:string;accept?:string;file?:File;disabled?:boolean;onChange:(file:File|undefined)=>void;hint?:string};
/** File selection only; validation and uploads stay with the application. */
export function FilePicker({label,accept,file,disabled,onChange,hint}:FilePickerProps){
 const id=useId();
 return <div className="ls-file-picker" data-disabled={disabled||undefined}>
  <label className="ls-file-picker-target">
   <input type="file" aria-label={label} accept={accept} disabled={disabled} aria-describedby={hint?id:undefined} onChange={(e:ChangeEvent<HTMLInputElement>)=>{const selected=e.target.files?.[0];if(selected)onChange(selected);e.target.value=''}}/>
   <span className="ls-file-picker-icon" aria-hidden="true">{file?<FileTextOutlined/>:<UploadOutlined/>}</span>
   <span className="ls-file-picker-copy"><strong>{file?file.name:'选择文件'}</strong><span>{file?`${Math.max(1,Math.ceil(file.size/1024))} KB · 点击重新选择`:hint||'点击浏览本地文件'}</span></span>
  </label>
  {hint&&<span id={id} className="ls-file-picker-hint">{hint}</span>}
  {file&&<MotionButton htmlType="button" type="text" motionIcon="delete" disabled={disabled} onClick={()=>onChange(undefined)}>移除文件</MotionButton>}
 </div>;
}
