import type {ComponentPropsWithoutRef,ReactNode} from 'react';

export interface WorkbenchPageProps extends ComponentPropsWithoutRef<'section'> {
 toolbar?:ReactNode;
 /** Page navigation belongs to the same surface as its content. */
 navigation?:ReactNode;
 footer?:ReactNode;
 contentPadding?:'none'|'normal';
 /** managed: a table, editor or split panel owns scrolling. */
 scroll?:'body'|'managed';
}
/** Presentation template only. Data, routing and state ownership stay with the application. */
export function WorkbenchPage({toolbar,navigation,footer,contentPadding='normal',scroll='body',children,className='',...props}:WorkbenchPageProps){
 return <section {...props} className={`ls-workbench-page ${className}`}>
  {toolbar&&<div className="ls-workbench-toolbar">{toolbar}</div>}
  <div className="ls-workbench-panel">
   {navigation&&<div className="ls-workbench-navigation">{navigation}</div>}
   <div className="ls-workbench-content" data-padding={contentPadding} data-scroll={scroll}>{children}</div>
   {footer&&<div className="ls-workbench-status">{footer}</div>}
  </div>
 </section>;
}
