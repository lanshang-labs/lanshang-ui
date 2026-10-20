import {forwardRef,useState,type ComponentRef} from "react";
import {Button,ConfigProvider,type ButtonProps} from "antd";
import {MotionIcon,type MotionIconName} from "./MotionIcon.js";
import {controlSizes} from './tokens.js';
/** For table actions, including Popconfirm triggers; callbacks and permissions are caller-owned. */
export const RowActionButton=forwardRef<ComponentRef<typeof Button>,Omit<ButtonProps,"type">&{motionIcon?:MotionIconName;iconActive?:boolean;iconMotion?:"rotate"|"search"}>(function RowActionButton({className="",iconMotion,motionIcon,iconActive=false,icon,onClick,...props},ref){
 const [turns,setTurns]=useState(0);
 const {componentSize}=ConfigProvider.useConfig();
 const size=props.size??componentSize??'middle';
 return <Button {...props} icon={motionIcon?<MotionIcon name={motionIcon} active={iconActive} replay={turns} size={controlSizes[size].icon}/>:iconMotion==="rotate"?<span className="ls-action-rotate" style={{transform:`rotate(${turns*360}deg)`}}>{icon}</span>:iconMotion==="search"?<span key={turns} className="ls-action-search" data-active={turns>0||undefined}>{icon}</span>:icon} onClick={event=>{if(props.disabled||props.loading||props["aria-disabled"]===true||props["aria-disabled"]==="true"){event.preventDefault();return;}if(iconMotion||motionIcon)setTurns(value=>value+1);onClick?.(event);}} ref={ref} aria-busy={props["aria-busy"]??!!props.loading} type="text" size={size} className={`bui-row-action ${className}`}/>;
});
