import type {HTMLAttributes} from 'react';
import {foundations} from './tokens.js';
export type StackProps=HTMLAttributes<HTMLDivElement>&{gap?:keyof typeof foundations.spacing};
/** Vertical content rhythm; native div semantics and consumer styles are retained. */
export function Stack({gap='lg',style,className='',...props}:StackProps){return <div {...props} className={`ls-stack ${className}`} style={{display:'flex',flexDirection:'column',gap:foundations.spacing[gap],minWidth:0,...style}}/>}
/** Wrapping action row. Prefer Stack for form sections. */
export function Inline({gap='sm',style,className='',...props}:StackProps){return <div {...props} className={`ls-inline ${className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:foundations.spacing[gap],minWidth:0,...style}}/>}
/** Equal-width form fields; wraps to one column when the container is narrow. */
export function FormGrid({gap='lg',style,className='',...props}:StackProps){return <div {...props} className={`ls-form-grid ${className}`} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,14rem),1fr))',alignItems:'start',gap:foundations.spacing[gap],minWidth:0,...style}}/>}
