import type {ReactNode} from "react";
export type PageHeaderProps = {title:ReactNode; description?:ReactNode; meta?:ReactNode; actions?:ReactNode};
/** Presentation only; callers own counts, actions and permissions. */
export function PageHeader({title,description,meta,actions}:PageHeaderProps) {
 return <header className="bui-page-header"><div className="bui-page-heading"><h2>{title}</h2>{description&&<p>{description}</p>}</div>{(meta||actions)&&<div className="bui-page-heading-extra">{meta&&<span className="bui-page-meta">{meta}</span>}{actions}</div>}</header>;
}
