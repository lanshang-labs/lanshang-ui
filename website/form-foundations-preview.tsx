import {NumberParameter} from './number-slider-preview';
import {useEffect,useId,useRef,useState} from 'react';
import {RadioGroup,RadioOption as Radio} from '../dist/index.js';
import {Form} from '../dist/index.js';
import {Checkbox,FeedbackPanel,FilterDisclosure,Inline,Stack,MotionButton,TextInput,TextArea,ToggleSwitch} from '../dist/index.js';
import './form-foundations-preview.css';

type Values={name:string;description:string;outputs:string[];quality:string;review:boolean;count:number|null;duration:number|null};
const initial=(generation:boolean):Values=>({name:generation?'产品预览':'设计系统',description:'',outputs:['image'],quality:'balanced',review:true,count:4,duration:6});
/** Demo owns the draft and simulated request. Replace with application validation and transport. */
export function FormFoundationPreview({generation=false}:{generation?:boolean}){
 const [form]=Form.useForm<Values>();
 const [baseline,setBaseline]=useState(()=>initial(generation));
 const [draft,setDraft]=useState(()=>initial(generation));
 const [busy,setBusy]=useState(false),[fail,setFail]=useState(false);
 const [result,setResult]=useState<'idle'|'success'|'error'>('idle');
 const timer=useRef<ReturnType<typeof setTimeout>>();
 const pending=useRef(false),saveButton=useRef<HTMLButtonElement>(null);
 const id=useId(),advanced=useRef<HTMLDetailsElement>(null);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const dirty=JSON.stringify(draft)!==JSON.stringify(baseline);
 function restore(values:Values){form.setFieldsValue(values);form.setFields((Object.keys(values) as (keyof Values)[]).map(name=>({name,errors:[]})));setDraft({...values});setResult('idle')}
 function save(submitted:Values){
  const values={...draft,...submitted};
  if(pending.current)return;
  pending.current=true;setBusy(true);setResult('idle');
  timer.current=setTimeout(()=>{
   pending.current=false;setBusy(false);
   if(fail){setResult('error');return}
   setBaseline({...values});setDraft({...values});setResult('success');
  },600);
 }
 return <Stack className="ls-form-example">
  <header><h3>{generation?'生成参数设置':'项目基本信息'}</h3><p className="docs-muted">{generation?'先设置常用参数，更多选项按需展开。保存配置不会启动生成任务。':'修改暂留本页；明确保存后才更新基准。仅本地模拟。'}</p></header>
  <Form form={form} name={id} layout="vertical" initialValues={baseline} disabled={busy}
   onValuesChange={(_,values)=>{setDraft(current=>({...current,...values}));setResult('idle')}}
   onFinish={save} onFinishFailed={({errorFields})=>{const field=errorFields[0]?.name;if(field?.[0]==='outputs'&&advanced.current)advanced.current.open=true;const child=document.getElementById(id+'_'+field?.[0])?.querySelector<HTMLInputElement>('input:not(:disabled)');if(child)child.focus();else form.getFieldInstance(field)?.focus?.();}}>
   <Form.Item name="name" label={generation?'配置名称':'项目名称'} rules={[{required:true,whitespace:true,message:'请输入名称'},{max:60,message:'名称不能超过 60 个字符'}]}>
    <TextInput maxLength={60} placeholder="输入便于识别的名称"/>
   </Form.Item>
   {generation?<>
    <Form.Item name="count" label="生成数量" extra="1–12 张；精确输入与滑动调节同步。" rules={[{required:true,message:'请输入生成数量'},{type:'integer',min:1,max:12,message:'数量必须为 1–12 的整数'}]}>
     <NumberParameter label="生成数量" min={1} max={12} disabled={busy}/>
    </Form.Item>
    <Form.Item name="duration" label="片段时长" extra="1–30 秒，按 0.5 秒调节。" rules={[{required:true,message:'请输入片段时长'},{type:'number',min:1,max:30,message:'时长必须在 1–30 秒之间'},{validator:(_,value)=>value==null||Number.isInteger(value*2)?Promise.resolve():Promise.reject(new Error('时长需为 0.5 秒的倍数'))}]}>
     <NumberParameter label="片段时长" min={1} max={30} step={0.5} disabled={busy}/>
    </Form.Item>
    <Form.Item name="quality" label="生成方案" extra="只选择一种；方向键切换，Tab 离开选项组。">
     <RadioGroup name={id+'-quality'}><Inline><Radio value="fast">快速 Fast</Radio><Radio value="balanced">均衡 Balanced</Radio><Radio value="quality">高质量 Quality</Radio><Radio value="unavailable" disabled>专属模型（未配置）</Radio></Inline></RadioGroup>
    </Form.Item>
    <FilterDisclosure ref={advanced} label="高级设置" className="ls-form-advanced">
     <Form.Item name="outputs" label="输出内容" rules={[{type:'array',min:1,message:'至少选择一种输出内容'}]}>
      <Checkbox.Group><Inline><Checkbox value="image">预览图片</Checkbox><Checkbox value="report">核对报告</Checkbox><Checkbox value="video" disabled>视频（暂不可用）</Checkbox></Inline></Checkbox.Group>
     </Form.Item>
     <div className="ls-form-setting-row"><div><label htmlFor={id+'-review'}>交付前人工核对</label><p id={id+'-review-help'} className="docs-muted">开关仅修改草稿，保存后生效。</p></div><Form.Item name="review" valuePropName="checked" noStyle><ToggleSwitch id={id+'-review'} aria-label="交付前人工核对" aria-describedby={id+'-review-help'}/></Form.Item></div>
    </FilterDisclosure>
   </>:<>
    <Form.Item name="description" label="项目说明（选填）" extra="说明项目目标，避免填写凭据等敏感信息。"><TextArea rows={3} maxLength={300} showCount/></Form.Item>
    <Form.Item name="outputs" label="默认交付内容" rules={[{type:'array',min:1,message:'至少选择一种交付内容'}]}><Checkbox.Group><Inline><Checkbox value="image">预览图片</Checkbox><Checkbox value="report">核对报告</Checkbox></Inline></Checkbox.Group></Form.Item>
   </>}
  </Form>
  <Inline><MotionButton ref={saveButton} type="primary" loading={busy} aria-disabled={busy} onClick={()=>{if(!pending.current)form.submit()}}>{busy?'保存中…':result==='error'?'重试保存':'保存配置'}</MotionButton><MotionButton disabled={busy||!dirty} onClick={()=>restore(baseline)}>撤销未保存修改</MotionButton>{generation&&<MotionButton disabled={busy} onClick={()=>restore(initial(true))}>恢复默认参数</MotionButton>}</Inline>
  <p role="status" className="docs-muted">{busy?'正在保存配置':dirty?'有未保存的修改':result==='success'?'已保存，基准已更新':'与已保存配置一致'}</p>
  {result==='error'&&<FeedbackPanel type="error" role="alert" message="保存失败，输入已保留" description="关闭模拟失败后点击重试；失败不会更新保存基准。"/>}
  <Checkbox checked={fail} disabled={busy} onChange={e=>setFail(e.target.checked)}>模拟保存失败</Checkbox>
  <p className="docs-muted">{generation?'恢复默认参数只修改草稿，需再次保存。':'撤销恢复最近一次成功保存的值。'}刷新会清空本地样例；请求、权限与服务端字段错误由应用接入。</p>
 </Stack>;
}
export function FormFoundationsPreview(){return <Stack><FormFoundationPreview/><FormFoundationPreview generation/></Stack>}
export function CheckboxFoundationPreview(){
 const [values,setValues]=useState<string[]>(['image']);
 const options=[{label:'预览图片',value:'image'},{label:'核对报告',value:'report'}];
 return <Stack><Checkbox checked={values.length===2} indeterminate={values.length>0&&values.length<2} onChange={e=>setValues(e.target.checked?['image','report']:[])}>选择全部交付内容</Checkbox><Checkbox.Group aria-label="交付内容" options={options} value={values} onChange={setValues}/><Checkbox disabled>视频（暂不可用）</Checkbox><p role="status">已选择 {values.length} 项；多选保留每个已选标识。</p></Stack>;
}
export function RadioFoundationPreview(){
 const [value,setValue]=useState('balanced');
 const id=useId();
 return <Stack><RadioGroup aria-label="生成方案" name={id} value={value} onChange={e=>setValue(e.target.value)}><Inline><Radio value="fast">快速 Fast</Radio><Radio value="balanced">均衡 Balanced</Radio><Radio value="quality">高质量 Quality</Radio><Radio value="disabled" disabled>未配置</Radio></Inline></RadioGroup><p role="status">当前方案：{value}。只选一项，方向键切换。</p></Stack>;
}
export function SwitchFoundationPreview(){
 const [checked,setChecked]=useState(true);
 const id=useId();
 return <Stack><div className="ls-form-setting-row"><div><label htmlFor={id}>显示完成提醒</label><p id={id+'-help'} className="docs-muted">此本地偏好即时生效，无网络请求。</p></div><ToggleSwitch id={id} checked={checked} onChange={setChecked} aria-label="显示完成提醒" aria-describedby={id+'-help'}/></div><div className="ls-form-setting-row"><span>团队统一配置（只读）</span><ToggleSwitch aria-label="团队统一配置" checked disabled/></div><p role="status">完成提醒已{checked?'开启':'关闭'}。表单内的开关则随表单保存生效。</p></Stack>;
}
