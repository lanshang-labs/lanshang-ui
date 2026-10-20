import type {TagProps} from 'antd';
import {MotionIcon} from './MotionIcon.js';
import {controlSizes} from './tokens.js';

/** A default for closable tags; caller-supplied icons keep their own behavior. */
export function tagCloseIcon(closable:TagProps['closable'],closeIcon:TagProps['closeIcon']):TagProps['closeIcon']{
 if(!closable||closeIcon!==undefined||(typeof closable==='object'&&closable.closeIcon!==undefined))return closeIcon;
 return <span role="img" aria-label="移除标签"><MotionIcon name="close" size={controlSizes.small.icon}/></span>;
}
