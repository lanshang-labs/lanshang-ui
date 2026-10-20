import type {ReactNode} from 'react';
import {MotionIcon} from './MotionIcon.js';
import {controlSizes,type ControlSize} from './tokens.js';

type ClearIcon=ReactNode|((props:any)=>ReactNode);
type AllowClear<T extends ClearIcon>=boolean|{clearIcon?:T}|undefined;

/** Keep AntD's clear interaction while giving shared fields one visible icon and name. */
export function withClearControlIcon<T extends ClearIcon>(allowClear:AllowClear<T>,size:ControlSize,label:string,customClearIcon?:ReactNode):AllowClear<T|ReactNode>{
 if(!allowClear)return allowClear;
 const clearIcon=customClearIcon===undefined?<span role="img" aria-label={label}><MotionIcon name="close" size={controlSizes[size].icon}/></span>:customClearIcon;
 return allowClear===true?{clearIcon}:{...allowClear,clearIcon:allowClear.clearIcon===undefined?clearIcon:allowClear.clearIcon};
}
