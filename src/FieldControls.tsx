import {forwardRef,useContext,useState,type ComponentProps,type ComponentRef} from 'react';
import {Checkbox as AntCheckbox,ConfigProvider,DatePicker as AntDatePicker,Input,InputNumber as AntInputNumber,Segmented as AntSegmented,Slider as AntSlider,Switch,type CheckboxProps,type DatePickerProps,type InputNumberProps,type InputProps,type InputRef,type SegmentedProps,type SliderSingleProps,type SwitchProps} from 'antd';
import {FormItemInputContext as EsFormItemInputContext} from 'antd/es/form/context.js';
import {FormItemInputContext as LibFormItemInputContext} from 'antd/lib/form/context.js';
import {Calendar,NavArrowRight} from 'iconoir-react';
import {withClearControlIcon} from './ClearControlIcon.js';
import {MotionIcon} from './MotionIcon.js';
import {controlSizes,type ControlSize} from './tokens.js';

function useFieldSize(size:InputProps['size']){const {componentSize}=ConfigProvider.useConfig();return size??componentSize??'middle'}

/** Standard single-line field. Size and surface styling come from LanshangProvider. */
export const TextInput=forwardRef<InputRef,InputProps>(function TextInput({size,className='',...props},ref){
 const resolvedSize=useFieldSize(size);
 return <Input {...props} ref={ref} size={resolvedSize} allowClear={withClearControlIcon(props.allowClear,resolvedSize,'清空输入')} className={`ls-text-input ${className}`.trim()}/>;
});

/** Password field with a named, keyboard-operable visibility control. */
export const PasswordInput=forwardRef<InputRef,Omit<InputProps,'type'>>(function PasswordInput({className='',disabled,suffix,...props},ref){
 const [visible,setVisible]=useState(false);
 return <TextInput {...props} ref={ref} type={visible?'text':'password'} disabled={disabled} className={`ls-password-input ${className}`.trim()} suffix={<>{suffix}<button type="button" className="ls-password-visibility" aria-label={visible?'隐藏密码':'显示密码'} aria-pressed={visible} disabled={disabled} onMouseDown={event=>event.preventDefault()} onClick={()=>setVisible(value=>!value)}><MotionIcon name="visibility" active={visible} size={16}/></button></>}/>;
});

export type TextAreaProps=ComponentProps<typeof Input.TextArea>;
export const TextArea=forwardRef<ComponentRef<typeof Input.TextArea>,TextAreaProps>(function TextArea({size,className='',...props},ref){
 const resolvedSize=useFieldSize(size);
 return <Input.TextArea {...props} ref={ref} size={resolvedSize} allowClear={withClearControlIcon(props.allowClear,resolvedSize,'清空文本')} className={`ls-text-area ${className}`.trim()}/>;
});

export type ToggleSwitchProps=Omit<SwitchProps,'size'> & {size?:'small'|'middle'|'large'|'default'};
/** Binary control sharing the Lanshang switch shape and motion tokens. */
export const ToggleSwitch=forwardRef<HTMLButtonElement,ToggleSwitchProps>(function ToggleSwitch({size,className='',...props},ref){
 const {componentSize}=ConfigProvider.useConfig();
 const resolvedSize=size==='default'?'middle':size??componentSize??'middle';
 return <Switch {...props} ref={ref} size={resolvedSize==='small'?'small':'default'} data-ls-size={resolvedSize} className={`ls-toggle-switch ${className}`.trim()}/>;
});

const CheckboxControl=forwardRef<ComponentRef<typeof AntCheckbox>,CheckboxProps>(function CheckboxControl({className='',...props},ref){
 return <AntCheckbox {...props} ref={ref} className={`ls-checkbox ${className}`.trim()}/>;
});
/** Includes Group so options, mixed state, keyboard and Form binding share one public entry. */
export const Checkbox=Object.assign(CheckboxControl,{Group:AntCheckbox.Group});

/** Number and range controls share the default field size while preserving native value semantics. */
export const NumberInput=forwardRef<HTMLInputElement,InputNumberProps<number>>(function NumberInput({size,className='',...props},ref){
 return <AntInputNumber<number> {...props} ref={ref} size={useFieldSize(size)} className={`ls-number-input ${className}`.trim()}/>;
});
export function RangeSlider({className='',...props}:SliderSingleProps){
 return <AntSlider {...props} className={`ls-range-slider ${className}`.trim()}/>;
}

/** Keep Ant Design's calendar parsing and keyboard model behind the shared theme boundary. */
function DateSuffix({size}:{size:ControlSize}){
 // Ant Design exposes separate ESM and CJS context instances; consume the active one
 // so the default icon does not hide Form.Item's validation feedback in either build.
 const esFeedback=useContext(EsFormItemInputContext);
 const libFeedback=useContext(LibFormItemInputContext);
 const {hasFeedback,feedbackIcon}=esFeedback.hasFeedback?esFeedback:libFeedback;
 return <><span aria-hidden="true" className="ls-control-icon"><Calendar width={controlSizes[size].icon} height={controlSizes[size].icon} strokeWidth={1.8}/></span>{hasFeedback&&feedbackIcon}</>;
}
export const DateField=forwardRef<ComponentRef<typeof AntDatePicker>,DatePickerProps>(function DateField({size,className='',popupClassName='',suffixIcon,...props},ref){
 const resolvedSize=useFieldSize(size);
 return <AntDatePicker {...props} ref={ref} size={resolvedSize} suffixIcon={suffixIcon===undefined?<DateSuffix size={resolvedSize}/>:suffixIcon} allowClear={withClearControlIcon(props.allowClear??true,resolvedSize,'清空已选日期',props.clearIcon)} className={`ls-date-field ${className}`.trim()} popupClassName={`ls-date-popup ls-date-popup-${resolvedSize} ${popupClassName}`.trim()}/>;
});
export type DateRangeFieldProps=ComponentProps<typeof AntDatePicker.RangePicker>;
export const DateRangeField=forwardRef<ComponentRef<typeof AntDatePicker.RangePicker>,DateRangeFieldProps>(function DateRangeField({size,className='',popupClassName='',suffixIcon,separator,...props},ref){
 const resolvedSize=useFieldSize(size);
 return <AntDatePicker.RangePicker {...props} ref={ref} size={resolvedSize} suffixIcon={suffixIcon===undefined?<DateSuffix size={resolvedSize}/>:suffixIcon} separator={separator===undefined?<span aria-label="至" className="ls-date-range-separator"><NavArrowRight width={controlSizes[resolvedSize].icon} height={controlSizes[resolvedSize].icon} strokeWidth={1.8}/></span>:separator} allowClear={withClearControlIcon(props.allowClear??true,resolvedSize,'清空已选日期范围',props.clearIcon)} className={`ls-date-range-field ${className}`.trim()} popupClassName={`ls-date-popup ls-date-popup-${resolvedSize} ${popupClassName}`.trim()}/>;
});

export const SegmentedControl=forwardRef<HTMLDivElement,SegmentedProps>(function SegmentedControl({size,className='',...props},ref){
 return <AntSegmented {...props} ref={ref} size={useFieldSize(size)} className={`ls-segmented-control ${className}`.trim()}/>;
}) as typeof AntSegmented;
