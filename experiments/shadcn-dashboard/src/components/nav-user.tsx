// Local profile action in the upstream sidebar footer structure.
import {Avatar,AvatarFallback} from './ui/avatar';
import {SidebarMenu,SidebarMenuItem,SidebarMenuButton} from './ui/sidebar';
import {ChevronsUpDown} from 'lucide-react';
import {useLab} from '../lab-context';
export function NavUser({user}:{user:{name:string;email:string;avatar:string}}){
 const {navigate}=useLab();
 return <SidebarMenu><SidebarMenuItem><SidebarMenuButton size="lg" onClick={()=>navigate('/settings')} aria-label="账户设置">
  <Avatar className="h-8 w-8 rounded-lg"><AvatarFallback className="rounded-lg">LS</AvatarFallback></Avatar>
  <div className="grid flex-1 text-left text-sm leading-tight"><span className="truncate font-semibold">{user.name}</span><span className="truncate text-xs">{user.email}</span></div><ChevronsUpDown className="ml-auto size-4"/>
 </SidebarMenuButton></SidebarMenuItem></SidebarMenu>;
}
