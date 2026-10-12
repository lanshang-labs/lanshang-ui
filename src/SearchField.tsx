import {useRef} from "react";
import {Input,Button,type InputProps,type InputRef} from "antd";
import {SearchOutlined} from "./icons.js";
export type SearchFieldProps=Omit<InputProps,"onChange"|"onSearch"|"suffix"|"prefix"> & {onChange?:(value:string)=>void;onSearch?:(value:string)=>void;searchLabel?:string};
/** Search field; filtering and request timing remain with the caller. */
export function SearchField({onChange,onSearch,searchLabel="搜索",onPressEnter,onClear,disabled,...props}:SearchFieldProps) {
 const input=useRef<InputRef>(null);
 return <Input {...props} ref={input} onClear={()=>{onClear?.();onSearch?.("");}} disabled={disabled} className={`bui-search-field ${props.className||""}`} allowClear={props.allowClear??true}
 onChange={event=>onChange?.(event.target.value)}
 onPressEnter={event=>{onPressEnter?.(event);if(!event.defaultPrevented&&!event.nativeEvent.isComposing)onSearch?.(event.currentTarget.value);}}
 suffix={onSearch?<Button type="text" size="small" disabled={disabled} aria-label={searchLabel} icon={<SearchOutlined/>} onClick={()=>onSearch(input.current?.input?.value??"")}/>:<span aria-hidden="true"><SearchOutlined/></span>}/>;
}
