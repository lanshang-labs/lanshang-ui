import {useEffect, useRef, type ReactNode, type CSSProperties, type ComponentPropsWithoutRef} from 'react';

export interface WorkspaceLayoutProps extends ComponentPropsWithoutRef<'div'> {
  sidebar: ReactNode;
  header: ReactNode;
  contentClassName?: string;
  mainClassName?: string;
  contentWidth?: 'full' | 'reading';
}
/** Layout only: routes, permissions, persistence and account actions stay with the consumer. */
export function WorkspaceLayout({sidebar, header, children, className='', mainClassName='', contentClassName='', contentWidth='full', ...props}: WorkspaceLayoutProps) {
  return <div {...props} className={`ls-workspace-layout ${className}`}>
    {sidebar}
    <div className={`ls-workspace-main ${mainClassName}`}>
      {header}
      <main className={`ls-workspace-content ${contentClassName}`} data-width={contentWidth}>{children}</main>
    </div>
  </div>;
}
export interface WorkspaceSidebarProps extends ComponentPropsWithoutRef<'aside'> {
  collapsed: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
  /** Request collapse below this viewport width, then restore the previous desktop preference. */
  breakpoint?: number;
}
export function WorkspaceSidebar({collapsed, onCollapsedChange, width=224, collapsedWidth=72, breakpoint=992, className='', style, ...props}: WorkspaceSidebarProps) {
  const change = useRef(onCollapsedChange);
  change.current = onCollapsedChange;
  const currentCollapsed = useRef(collapsed);
  currentCollapsed.current = collapsed;
  const desktopCollapsed = useRef(collapsed);
  const narrow = useRef(false);
  useEffect(() => {
    if (!breakpoint || typeof window.matchMedia !== 'function') {
      if (narrow.current) { narrow.current = false; change.current?.(desktopCollapsed.current); }
      return;
    }
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => {
      if (query.matches && !narrow.current) {
        desktopCollapsed.current = currentCollapsed.current;
        narrow.current = true;
        change.current?.(true);
      } else if (!query.matches && narrow.current) {
        narrow.current = false;
        change.current?.(desktopCollapsed.current);
      }
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [breakpoint]);
  return <aside {...props} className={`ls-workspace-sidebar ${className}`} data-collapsed={collapsed} style={{'--ls-sidebar-width':`${collapsed ? collapsedWidth : width}px`, ...style} as CSSProperties}/>;
}
