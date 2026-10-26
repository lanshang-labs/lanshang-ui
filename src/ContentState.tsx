import {forwardRef, type HTMLAttributes, type ReactNode} from "react";
import LoadingLabel from "./beautiful-ui/LoadingLabel.js";
export type ContentStateProps = Omit<HTMLAttributes<HTMLDivElement>, "title" | "children" | "role"> & {
  title: string; description?: ReactNode; icon?: ReactNode; action?: ReactNode;
  loading?: boolean; role?: "status" | "alert";
};
/** No inferred errors or timers: callers supply state and recovery actions. */
export const ContentState = forwardRef<HTMLDivElement, ContentStateProps>(function ContentState({title, description, icon, action, loading=false, role="status", className="", "aria-live": live, ...props}, ref) {
  // This is the live feedback, not the busy data region. Explicit caller ARIA still passes through.
  return <div {...props} ref={ref} className={`bui-content-state ${className}`} role={role} aria-live={live ?? (role === "alert" ? "assertive" : "polite")}>
    {icon != null && <span className="bui-content-state-icon" aria-hidden="true">{icon}</span>}
    {loading ? <div className="bui"><LoadingLabel label={title} announce={false}/></div> : <strong>{title}</strong>}
    {description != null && <div className="bui-content-state-description">{description}</div>}
    {action != null && <div className="bui-content-state-action">{action}</div>}
  </div>;
});
