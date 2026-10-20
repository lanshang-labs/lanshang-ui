import {forwardRef,type AnchorHTMLAttributes} from "react";
import {ArrowUpRight} from "iconoir-react";
export type NavigationLinkProps=AnchorHTMLAttributes<HTMLAnchorElement>&{variant?:"name"|"action"};
/** Native anchor semantics, including modified clicks and context menus. */
export const NavigationLink=forwardRef<HTMLAnchorElement,NavigationLinkProps>(function NavigationLink({variant="name",className="",children,...props},ref){
 return <a {...props} ref={ref} className={`bui-navigation-link bui-navigation-link--${variant} ${className}`}><span>{children}</span><span className="bui-navigation-link__icon" aria-hidden="true"><ArrowUpRight aria-hidden="true" width="100%" height="100%" strokeWidth={2}/></span></a>;
});
