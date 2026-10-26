import {useLab} from "../lab-context"
"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  LayoutDashboard,
  Mail,
  CheckSquare,
  MessageCircle,
  Calendar,
  Shield,
  AlertTriangle,
  Settings,
  HelpCircle,
  CreditCard,
  LayoutTemplate,
  Users,
  Images,
  Component,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Logo } from "./logo"
import { SidebarNotification } from "./sidebar-notification"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

const data = {
 user: { name: "本地演示账户", email: "demo@example.test", avatar: "" },
 navGroups: [
  {label:"Workspace",items:[{title:"Business Dashboard",url:"/dashboard-2",icon:LayoutPanelLeft},{title:"Transactions",url:"/transactions",icon:CreditCard},{title:"Customers",url:"/customers",icon:Users},{title:"Resources",url:"/resources",icon:Images},{title:"Foundation",url:"/foundation",icon:Component}]},
  {label:"Preferences",items:[{title:"Settings",url:"/settings",icon:Settings},{title:"Source & License",url:"/source",icon:HelpCircle}]}
 ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {workspaceName}=useLab()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ShadcnStore</span>
                  <span className="truncate text-xs">{workspaceName}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarNotification />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
