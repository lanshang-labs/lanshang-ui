import {forwardRef, type HTMLAttributes, type ReactNode} from "react";
export type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title" | "children"> & {
  title: ReactNode; description?: ReactNode; meta?: ReactNode; actions?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6; headingId?: string;
};
/** Presentation only; callers own counts, actions and permissions. */
export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader({title, description, meta, actions, headingLevel=2, headingId, className="", ...props}, ref) {
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  const hasMeta = meta != null && meta !== false;
  return <header {...props} ref={ref} className={`bui-page-header ${className}`}>
    <div className="bui-page-heading"><Heading id={headingId}>{title}</Heading>{description != null && <div className="bui-page-description">{description}</div>}</div>
    {(hasMeta || actions != null) && <div className="bui-page-heading-extra">{hasMeta && <span className="bui-page-meta">{meta}</span>}{actions}</div>}
  </header>;
});
