import {useId,type ReactNode} from 'react';
export type FeedbackPanelProps={
 type?:'info'|'success'|'warning'|'error';
 variant?:'card'|'inline';
 message:ReactNode;
 description?:ReactNode;
 action?:ReactNode;
 /** Opt in for newly arrived feedback; persisted receipts need no announcement. */
 role?:'alert'|'status';
 className?:string;
};
/** Neutral feedback surface. Callers own dismissal, confirmation and focus. */
export function FeedbackPanel({type='info',variant='card',message,description,action,role,className=''}:FeedbackPanelProps){
 const id=useId();
 return <section className={`ls-feedback-panel ${className}`} aria-labelledby={id} data-tone={type} data-variant={variant} role={role}>
  <header><span className="ls-feedback-panel-dot" aria-hidden="true"/><h3 id={id}>{message}</h3></header>
  {description&&<div className="ls-feedback-panel-body">{description}</div>}
  {action&&<div className="ls-feedback-panel-actions">{action}</div>}
 </section>;
}
