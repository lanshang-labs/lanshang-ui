import {Badge as AntBadge,ConfigProvider,Grid,Radio as AntRadio,Skeleton as AntSkeleton,Table,Tag as AntTag,Upload as AntUpload,type BadgeProps,type RadioProps,type SkeletonProps,type TagProps,type UploadProps} from 'antd';
import type {ComponentProps} from 'react';
import {tagCloseIcon} from './TagCloseIcon.js';

/** Neutral classification label; state labels should use StatusTag instead. */
export function CategoryTag({className='',closable,closeIcon,...props}:TagProps){return <AntTag {...props} closable={closable} closeIcon={tagCloseIcon(closable,closeIcon)} className={`ls-category-tag ${className}`.trim()}/>}
export function CountBadge({className='',...props}:BadgeProps){return <AntBadge {...props} className={`ls-count-badge ${className}`.trim()}/>}
export function RadioOption({className='',...props}:RadioProps){return <AntRadio {...props} className={`ls-radio-option ${className}`.trim()}/>}
export function SkeletonAvatar({className='',...props}:ComponentProps<typeof AntSkeleton.Avatar>){return <AntSkeleton.Avatar {...props} className={`ls-skeleton-avatar ${className}`.trim()}/>}
export function SkeletonBlock({className='',...props}:SkeletonProps){return <AntSkeleton {...props} className={`ls-skeleton-block ${className}`.trim()}/>}
export const DataTableSummary=Table.Summary;
export const useLayoutBreakpoint=Grid.useBreakpoint;

function UploadButton({className='',...props}:UploadProps){return <AntUpload {...props} className={`ls-upload-control ${className}`.trim()}/>}
function UploadDragger({className='',...props}:ComponentProps<typeof AntUpload.Dragger>){return <AntUpload.Dragger {...props} className={`ls-upload-drop ${className}`.trim()}/>}
export const UploadControl=Object.assign(UploadButton,{Dragger:UploadDragger,LIST_IGNORE:AntUpload.LIST_IGNORE});

/** Isolates typography comparisons without changing the site's root theme. */
export function TypographyScope({fontFamily,fontSize,children}:{fontFamily:string;fontSize:number;children:React.ReactNode}){
 return <ConfigProvider theme={{token:{fontFamily,fontSize},components:{Table:{cellFontSizeSM:fontSize},Input:{inputFontSizeSM:fontSize},Select:{optionFontSize:fontSize}}}}>{children}</ConfigProvider>;
}
