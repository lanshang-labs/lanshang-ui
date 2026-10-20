import {NavArrowDown} from 'iconoir-react';
import {forwardRef,useId,useState,type ReactNode} from 'react';
export type DisclosureProps={label:string;count?:number;defaultOpen?:boolean;children:ReactNode;className?:string};
/** Native disclosure semantics with the shared Lanshang surface and keyboard focus. */
export const Disclosure=forwardRef<HTMLDetailsElement,DisclosureProps>(function Disclosure({label,count=0,defaultOpen=false,children,className=''},ref){
 const id=useId();
 const [initialOpen]=useState(defaultOpen);
 return <details open={initialOpen} ref={ref} className={`ls-disclosure ${className}`}><summary aria-controls={id}><span className="ls-filter-label">{label}</span>{count>0&&<span className="ls-filter-count">{count} 已启用</span>}<NavArrowDown className="ls-filter-chevron" width={16} height={16} aria-hidden="true"/></summary><div id={id} className="ls-filter-content">{children}</div></details>;
});
/** Filter count is optional; applying filters belongs to callers. */
export const FilterDisclosure=forwardRef<HTMLDetailsElement,DisclosureProps>(function FilterDisclosure(props,ref){
 return <Disclosure {...props} ref={ref} className={`ls-filter-disclosure ${props.className||''}`}/>;
});
