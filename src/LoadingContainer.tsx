import {forwardRef,useId,type HTMLAttributes,type ReactNode} from 'react';
import LoadingLabel from './beautiful-ui/LoadingLabel.js';
import {Skeleton} from './Skeleton.js';
import {ContentState} from './ContentState.js';
import {MotionButton} from './MotionButton.js';

export type LoadingContainerProps=Omit<HTMLAttributes<HTMLElement>,'title'|'children'> & {
  /** A successful result exists, including an intentionally empty result. Never infer this from children. */
  hasContent:boolean;
  loading?:boolean;
  error?:ReactNode;
  variant?:'page'|'block';
  title?:ReactNode;
  actions?:ReactNode;
  children?:ReactNode;
  presentation?:'skeleton'|'indicator';
  /** Decorative placeholder only; do not include interactive controls. */
  skeleton?:ReactNode;
  delay?:number;
  loadingLabel?:string;
  refreshingLabel?:string;
  errorTitle?:string;
  retryLabel?:string;
  onRetry?:()=>void;
};

/** Presentation only. Consumers own requests, successful snapshots, errors and retry policy. */
export const LoadingContainer=forwardRef<HTMLElement,LoadingContainerProps>(function LoadingContainer({
  hasContent,loading=false,error,variant='block',title,actions,children,presentation='skeleton',skeleton,delay=150,
  loadingLabel='正在加载内容',refreshingLabel='正在更新，保留上次内容',errorTitle='读取失败',retryLabel='重试',onRetry,
  className='',...props
},ref){
  const id=useId(),failed=!loading&&error!=null&&error!==false;
  const fullMessage=!hasContent&&(failed||(loading&&presentation==='indicator'));
  const retry=onRetry?<MotionButton motionIcon="retry" onClick={onRetry}>{retryLabel}</MotionButton>:undefined;
  return <section {...props} ref={ref} aria-labelledby={props['aria-labelledby']??(props['aria-label']==null&&title!=null?id:undefined)}
    className={`ls-loading-container ${className}`} data-variant={variant} data-has-content={hasContent}
    data-state={loading?(hasContent?'refreshing':'loading'):failed?'error':hasContent?'ready':'idle'}>
    {(title!=null||actions!=null)&&<header className="ls-loading-container-header">
      {title!=null&&(variant==='page'?<h2 id={id}>{title}</h2>:<h3 id={id}>{title}</h3>)}
      {actions!=null&&<div className="ls-loading-container-actions">{actions}</div>}
    </header>}
    <div className="ls-loading-container-stage">
      {/* Keep the live feedback outside aria-busy so pending announcements are not deferred. */}
      <div className="ls-loading-container-notice" data-full={fullMessage} data-visible={loading||failed}>
        <div role="status" className="ls-loading-container-pending">{loading&&<LoadingLabel announce={false} label={hasContent?refreshingLabel:loadingLabel}/>}</div>
        {failed?<div role="alert" className="ls-loading-container-error">
            <span className="ls-loading-container-error-dot" aria-hidden="true"/>
            <div><strong>{errorTitle}</strong><div className="ls-loading-container-error-description">{error}</div>
              {hasContent&&<p className="ls-loading-container-stale">当前仍显示上次成功读取的内容。</p>}
            </div>{retry}
          </div>:null}
      </div>
      {/* This wrapper and children retain their identity during refresh and refresh errors. */}
      <div className="ls-loading-container-body" aria-busy={loading} hidden={fullMessage}>
        {hasContent?children:loading&&presentation==='skeleton'?<div aria-hidden="true"><Skeleton label={loadingLabel} delay={delay} template={skeleton}/></div>
          :!loading&&!failed?<ContentState title="尚未加载"/>:null}
      </div>
    </div>
  </section>;
});
