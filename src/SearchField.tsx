import {forwardRef,useImperativeHandle,useRef} from "react";
import {ConfigProvider,Input,type InputProps,type InputRef} from "antd";
import {MotionButton} from './MotionButton.js';
import {MotionIcon} from './MotionIcon.js';
import {withClearControlIcon} from './ClearControlIcon.js';
import {controlSizes} from './tokens.js';
export type SearchFieldProps=Omit<InputProps,"onChange"|"onSearch"|"suffix"|"prefix"> & {onChange?:(value:string)=>void;onSearch?:(value:string)=>void;searchLabel?:string};
/** Search field; filtering and request timing remain with the caller. */
export const SearchField=forwardRef<InputRef,SearchFieldProps>(function SearchField({onChange,onSearch,searchLabel="搜索",onPressEnter,onClear,disabled,...props},ref) {
 const input=useRef<InputRef>(null);
 const {componentSize}=ConfigProvider.useConfig();
 const size=props.size??componentSize??'middle';
 useImperativeHandle(ref,()=>input.current!);
 return <Input {...props} ref={input} size={size} onClear={()=>{onClear?.();onSearch?.("");}} disabled={disabled} className={`bui-search-field ${props.className||""}`} allowClear={withClearControlIcon(props.allowClear??true,size,'清空搜索')}
 onChange={event=>onChange?.(event.target.value)}
 onPressEnter={event=>{onPressEnter?.(event);if(!event.defaultPrevented&&!event.nativeEvent.isComposing)onSearch?.(event.currentTarget.value);}}
 suffix={onSearch?<MotionButton type="text" size={size} motionIcon="search" disabled={disabled} aria-label={searchLabel} onClick={()=>onSearch(input.current?.input?.value??"")}/>:<MotionIcon name="search" size={controlSizes[size].icon}/>}/>;
});
