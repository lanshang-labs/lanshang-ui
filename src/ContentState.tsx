import type {ReactNode} from "react";
import LoadingLabel from "./beautiful-ui/LoadingLabel.js";
export type ContentStateProps={title:string;description?:ReactNode;icon?:ReactNode;action?:ReactNode;loading?:boolean};
/** No inferred errors or timers: the caller supplies the current state. */
export function ContentState({title,description,icon,action,loading=false}:ContentStateProps){return <div className="bui-content-state" role="status" aria-live="polite" aria-busy={loading}>{icon&&<span className="bui-content-state-icon" aria-hidden="true">{icon}</span>}{loading?<div className="bui"><LoadingLabel label={title}/></div>:<strong>{title}</strong>}{description&&<p>{description}</p>}{action&&<div className="bui-content-state-action">{action}</div>}</div>}
