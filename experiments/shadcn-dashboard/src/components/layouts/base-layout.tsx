// Adapted from ShadcnStore, MIT. Keep upstream layout markup; local routing and controls only.
import type {CSSProperties,ReactNode} from 'react';
import {AppSidebar} from '../app-sidebar';
import {SiteHeader} from '../site-header';
import {SidebarInset,SidebarProvider} from '../ui/sidebar';
import {useLab} from '../../lab-context';

export function BaseLayout({children}:{children:ReactNode}){
 const {navigate}=useLab();
 return <SidebarProvider style={{'--sidebar-width':'16rem','--sidebar-width-icon':'3rem','--header-height':'calc(var(--spacing) * 14)'} as CSSProperties}>
   <AppSidebar variant="inset" collapsible="icon" side="left"/>
   <SidebarInset>
    <SiteHeader/>
    <div className="flex flex-1 flex-col min-w-0">
     <div className="@container/main flex flex-1 flex-col gap-2 min-w-0">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
     </div>
    </div>
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t p-6 text-xs text-muted-foreground">
     <span>ShadcnStore · MIT · 固定演示数据，非实时经营指标</span>
     <button type="button" className="underline underline-offset-4" onClick={()=>navigate('/source')}>来源、许可与接入说明</button>
    </footer>
   </SidebarInset>
 </SidebarProvider>;
}
