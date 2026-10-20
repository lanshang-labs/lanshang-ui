import {forwardRef,useState} from 'react';
import {ConfigProvider,InputNumber,type InputNumberProps} from 'antd';
import {MinusOutlined,PlusOutlined} from './icons.js';
import type {ControlSize} from './tokens.js';

export interface NumberStepperProps extends Omit<InputNumberProps<number>,'controls'|'stringMode'|'size'|'step'> {
 size?:ControlSize;
 step?:number;
}

/** A numeric input with adjacent, bounded step actions in one shared surface. */
export const NumberStepper=forwardRef<HTMLInputElement,NumberStepperProps>(function NumberStepper({size,value,defaultValue,onChange,min,max,step=1,disabled,readOnly,className='',...props},ref){
 const {componentSize,componentDisabled}=ConfigProvider.useConfig();
 const resolvedSize=size??componentSize??'middle';
 const isDisabled=disabled??componentDisabled;
 const isImmutable=isDisabled||readOnly;
 const [internalValue,setInternalValue]=useState<number|null>(defaultValue??null);
 const current=value===undefined?internalValue:value;
 const label=props['aria-label']??'数值';
 const update=(next:number|null)=>{
  if(isImmutable)return;
  if(value===undefined)setInternalValue(next);
  onChange?.(next);
 };
 const changeBy=(direction:-1|1)=>{
  if(isImmutable)return;
  const stepped=current===null||current===undefined
   ?(direction>0?min??step:max??-step)
   :Number((current+direction*step).toFixed(12));
  const next=Math.min(max??Infinity,Math.max(min??-Infinity,stepped));
  if(next!==current)update(next);
 };
 return <div className={`ls-number-stepper ${className}`} data-ls-size={resolvedSize} data-disabled={isDisabled?'true':undefined} data-read-only={readOnly?'true':undefined}>
  <button type="button" className="ls-number-stepper-action" aria-label={`${label}减少`} disabled={isImmutable||current!==null&&current!==undefined&&min!==undefined&&current<=min} onClick={()=>changeBy(-1)}><span aria-hidden="true"><MinusOutlined/></span></button>
  <InputNumber<number> {...props} ref={ref} size={resolvedSize} aria-label={label} controls={false} value={current} min={min} max={max} step={step} disabled={isDisabled} readOnly={readOnly} onChange={update}/>
  <button type="button" className="ls-number-stepper-action" aria-label={`${label}增加`} disabled={isImmutable||current!==null&&current!==undefined&&max!==undefined&&current>=max} onClick={()=>changeBy(1)}><span aria-hidden="true"><PlusOutlined/></span></button>
 </div>;
});
