// Adapted from Beautiful UI SidebarNav.tsx. MIT — see LICENSE and upstream snapshot.
import type { ReactNode } from "react";
export function RailButton({
  icon,
  label,
  active = false,
  count,
  onClick,
  expanded,
  disabled,
}: {
  icon: ReactNode;
  label: ReactNode;
  active?: boolean;
  count?: string;
  onClick?: () => void;
  expanded?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      aria-current={active ? "page" : undefined}
      aria-expanded={expanded}
      disabled={disabled}
      title={typeof label === "string" ? label : undefined}
      data-row
      type="button"
      onClick={onClick}
      className={`sidebar-row relative z-10 mx-2 flex h-8 items-center rounded-[8px] px-2 text-left
        transition-[width,background-color,color,transform] duration-150 active:scale-[0.98]
        ${active ? "bg-hover-2 " : ""}`}
    >
      <span className={`flex size-5 shrink-0 items-center justify-center ${active ? "text-ink" : "text-ink-2"}`}>
        {icon}
      </span>
      <span className={`sidebar-copy ml-1.5 min-w-0 flex-1 truncate text-[14px] font-medium ${active ? "text-ink" : "text-ink-2"}`}>
        {label}
      </span>
      {count && (
        <span className="sidebar-copy mr-2 shrink-0 text-[12px] font-medium tabular-nums text-ink-3">
          {count}
        </span>
      )}
    </button>
  );
}

type Item = {key:string;label:ReactNode;icon?:ReactNode;children?:Item[];disabled?:boolean};
export function BeautifulNavigation({items,selectedKeys,openKeys,onOpenChange,onClick}: {
 items:Item[];selectedKeys:string[];openKeys:string[];onOpenChange:(keys:string[])=>void;onClick:(event:{key:string})=>void;
}) {
 return <nav className="bui bui-navigation" aria-label="工作空间"><div className="flex flex-col gap-px">{items.map(item=><div key={item.key}>
 <RailButton icon={item.icon} label={item.label} disabled={item.disabled} active={selectedKeys.includes(item.key)} expanded={item.children?openKeys.includes(item.key):undefined} onClick={()=>item.children?onOpenChange(openKeys.includes(item.key)?openKeys.filter(k=>k!==item.key):[...openKeys,item.key]):onClick({key:item.key})}/>
 {item.children&&openKeys.includes(item.key)&&<div className="bui-nav-children">{item.children.map(child=><RailButton key={child.key} icon={child.icon} label={child.label} disabled={item.disabled || child.disabled} active={selectedKeys.includes(child.key)} onClick={()=>onClick({key:child.key})}/>)}</div>}
 </div>)}</div></nav>;
}
export function BeautifulTabs({items,activeKey,onChange,className=""}:{items:{key:string;label:ReactNode;disabled?:boolean}[];activeKey:string;onChange?:(key:string)=>void;className?:string}) {
 return <nav className={`bui bui-top-nav ${className}`} aria-label="页面导航">{items.map(item=><RailButton key={item.key} icon={null} label={item.label} disabled={item.disabled} active={activeKey===item.key} onClick={()=>{if(!item.disabled)onChange?.(item.key);}}/>)}</nav>;
}
