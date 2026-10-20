import {forwardRef,useId,useState,type ComponentRef} from 'react';
import {Checkbox,Inline,MotionButton,NumberStepper,RangeSlider,Stack} from '../dist/index.js';
import './number-slider-preview.css';
type NumberParameterProps={
 value?:number|null;onChange?:(value:number|null)=>void;
 label:string;min:number;max:number;step?:number;disabled?:boolean;id?:string;
 'aria-describedby'?:string;'aria-invalid'?:boolean|'true'|'false';
};
/** Controlled composition: the caller owns validation, saving and the default value. */
export const NumberParameter=forwardRef<ComponentRef<typeof NumberStepper>,NumberParameterProps>(function NumberParameter({value,onChange,label,min,max,step=1,disabled,id,...aria},ref){
 const fallback=useId(),inputId=id??fallback;
 // AntD 5 forwards these rc-slider handle attributes but omits them from its public type.
 const handleAccessibility={ariaLabelForHandle:label+'滑动调节',ariaValueTextFormatterForHandle:(v:number)=>value==null?'未填写，可滑动设置':String(v)};
 return <div className="ls-number-parameter">
  <NumberStepper ref={ref} id={inputId} value={value} onChange={onChange} min={min} max={max} step={step} disabled={disabled} aria-label={label+'精确值'} {...aria}/>
  <RangeSlider value={typeof value==='number'?value:min} min={min} max={max} step={step} disabled={disabled} onChange={onChange} {...handleAccessibility} tooltip={{formatter:v=>String(v)}}/>
 </div>;
});
function StandaloneSlider(){
 const [value,setValue]=useState(40);
 const handleAccessibility={ariaLabelForHandle:'预览宽度',ariaValueTextFormatterForHandle:(current:number)=>`${current}%`};
 return <Stack gap="sm">
  <h3>单值滑块 · 快速调节</h3>
  <span id="standalone-slider-label">预览宽度 · 0–100%</span>
  <RangeSlider min={0} max={100} value={value} onChange={setValue} {...handleAccessibility}/>
  <output aria-labelledby="standalone-slider-label">当前草稿：{value}%</output>
 </Stack>;
}
export function NumberSliderPreview({primary='number'}:{primary?:'number'|'slider'}={}){
 const [count,setCount]=useState<number|null>(4),[duration,setDuration]=useState<number|null>(6),[disabled,setDisabled]=useState(false);
 return <Stack>
  {primary==='slider'&&<StandaloneSlider/>}
  <h3>生成参数 · 精确输入与快速调节</h3>
  <p className="docs-muted">输入框与滑块共享同一个值。清空保留为空，不自动替换为零；滑动后重新设置数值。</p>
  <Stack gap="sm"><span>生成数量 · 1–12 张</span><NumberParameter label="生成数量" min={1} max={12} value={count} onChange={setCount} disabled={disabled}/></Stack>
  <Stack gap="sm"><span>片段时长 · 1–30 秒，步长 0.5</span><NumberParameter label="片段时长" min={1} max={30} step={0.5} value={duration} onChange={setDuration} disabled={disabled}/></Stack>
  <Inline><MotionButton disabled={disabled} onClick={()=>{setCount(4);setDuration(6)}}>恢复默认参数</MotionButton><Checkbox checked={disabled} onChange={e=>setDisabled(e.target.checked)}>禁用参数调整</Checkbox></Inline>
  <p role="status">当前草稿：{count??'未填写'} 张 / {duration??'未填写'} 秒。此页不提交任务。</p>
  <p className="docs-muted">方向键调节，滑块 Home / End 到达边界；输入越界时失焦按控件范围归整。生成表单还会校验必填、范围和步长，不能只依赖滑块限制。</p>
 </Stack>;
}
