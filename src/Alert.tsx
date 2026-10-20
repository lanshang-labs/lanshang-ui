import {Alert as AntAlert, type AlertProps} from 'antd';
import {CheckCircle,InfoCircle,WarningCircle,XmarkCircle} from 'iconoir-react';
import {MotionIcon} from './MotionIcon.js';
import {controlSizes} from './tokens.js';

const statusIcons={info:InfoCircle,success:CheckCircle,warning:WarningCircle,error:XmarkCircle};
/** Inline feedback retains Ant's accessibility, dismissal and action behavior. */
export function Alert({className='',icon,closable,closeIcon,closeText,...props}:AlertProps){
 const StatusIcon=statusIcons[props.type??(props.banner?'warning':'info')];
 const statusIcon=icon===undefined&&(props.showIcon??props.banner)?<span aria-hidden="true"><StatusIcon width="1em" height="1em" strokeWidth={1.8}/></span>:icon;
 const callerCloseIcon=typeof closable==='object'&&closable.closeIcon!==undefined;
 const sharedClose=closeIcon===undefined&&closeText===undefined&&!callerCloseIcon&&!!closable;
 const resolvedClosable=sharedClose?(typeof closable==='object'?{...closable,closeIcon:<MotionIcon name="close" size={controlSizes.middle.icon}/>, 'aria-label':closable['aria-label']??'关闭提示'}:{closeIcon:<MotionIcon name="close" size={controlSizes.middle.icon}/>, 'aria-label':'关闭提示'}):closable;
 return <AntAlert {...props} icon={statusIcon} closable={resolvedClosable} closeIcon={closeIcon} closeText={closeText} className={`bui-alert ${className}`}/>;
}
