import {forwardRef,useState,type ComponentRef} from 'react';
import {Button,ConfigProvider,type ButtonProps} from 'antd';
import {MotionIcon,type MotionIconName} from './MotionIcon.js';
import {controlSizes} from './tokens.js';
export interface MotionButtonProps extends ButtonProps {motionIcon?:MotionIconName;iconActive?:boolean}
/** Adds decorative click feedback; stateful icons are controlled by the caller. */
export const MotionButton=forwardRef<ComponentRef<typeof Button>,MotionButtonProps>(function MotionButton({motionIcon,iconActive=false,icon,onClick,...props},ref){
 const [replay,setReplay]=useState(0);
 const {componentSize}=ConfigProvider.useConfig();
 const size=props.size??componentSize??'middle';
 const savePending=motionIcon==='save'&&props.loading===true;
 return <Button {...props} ref={ref} loading={savePending?false:props.loading} htmlType={savePending?'button':props.htmlType} aria-busy={savePending||props['aria-busy']} aria-disabled={savePending||props['aria-disabled']} icon={motionIcon?<MotionIcon name={motionIcon} active={iconActive} replay={replay} pending={savePending} size={controlSizes[size].icon}/>:icon} onClick={event=>{if(props.disabled||props.loading||props['aria-disabled']===true||props['aria-disabled']==='true'){event.preventDefault();return}setReplay(n=>n+1);onClick?.(event)}}/>;
});
