import {useEffect} from "react";
import {useLocation} from "react-router-dom";
// Upstream header layout retained; replace promotional controls with local lab actions.
import {Moon,Sun,Search,ArrowLeftRight} from 'lucide-react';
import {Button} from './ui/button';
import {Separator} from './ui/separator';
import {useSidebar,SidebarTrigger} from './ui/sidebar';
import {useLab} from '../lab-context';

export function SiteHeader(){
 const {dark,setDark,search}=useLab();
 const location=useLocation(),{setOpenMobile}=useSidebar();
 useEffect(()=>setOpenMobile(false),[location.pathname,setOpenMobile]);
 return <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
  <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6 min-w-0">
   <SidebarTrigger aria-label="Toggle Sidebar" className="-ml-1"/>
   <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
   <div className="flex-1 max-w-sm min-w-0"><Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={search}><Search/><span className="truncate">Search transactions…</span></Button></div>
   <div className="ml-auto flex items-center gap-2">
    <Button variant="ghost" size="sm" asChild className="hidden md:flex"><a href="./workbench-lab.html"><ArrowLeftRight/>对比原版</a></Button>
    <Button variant="ghost" size="icon" aria-label={dark?'切换浅色':'切换深色'} onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</Button>
   </div>
  </div>
 </header>;
}
