import {forwardRef,type AnchorHTMLAttributes} from "react";
import {ArrowRight} from "iconoir-react";
export type NavigationLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{variant?:"name"|"action"};
/** Native anchor semantics, including modified clicks and context menus. */
export const NavigationLink=forwardRef<HTMLAnchorElement,NavigationLinkProps>(function NavigationLink({variant="name",className="",children,...props},ref){
 return <a {...props} ref={ref} className={`bui-navigation-link bui-navigation-link--${variant} ${className}`}><span>{children}</span>{variant==="action"&&<ArrowRight aria-hidden="true" width="14" height="14" strokeWidth={1.5}/>}</a>;
});
