// Adapted from Beautiful UI SidebarNav.tsx. MIT — see LICENSE and upstream snapshot.
import {useEffect, useLayoutEffect, useState, useRef, type ReactNode} from "react";
import {Popover} from "antd";
import {NavArrowDown} from "iconoir-react";
export function RailButton({
  icon,
  label,
  active = false,
  containsActive = false,
  count,
  onClick,
  expanded,
  disabled,
}: {
  icon: ReactNode;
  label: ReactNode;
  active?: boolean;
  containsActive?: boolean;
  count?: string;
  onClick?: () => void;
  expanded?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={typeof label === "string" ? label : undefined}
      aria-current={active ? "page" : undefined}
      aria-expanded={expanded}
      data-child-active={containsActive || undefined}
      disabled={disabled}
      title={typeof label === "string" ? label : undefined}
      data-row
      type="button"
      onClick={onClick}
      className={`sidebar-row relative z-10 mx-2 flex h-8 items-center rounded-[8px] px-2 text-left
        transition-[width,background-color,color,transform] duration-150 active:scale-[0.98]
        ${active ? "bg-hover-2 " : ""}`}
    >
      <span className={`bui-nav-icon flex size-5 shrink-0 items-center justify-center ${active ? "text-ink" : "text-ink-2"}`}>
        {icon}
      </span>
      <span className={`sidebar-copy ml-1.5 min-w-0 flex-1 truncate text-[14px] font-medium ${active ? "text-ink" : "text-ink-2"}`}>
        {label}
      </span>
      {expanded !== undefined && <NavArrowDown aria-hidden="true" className={`bui-group-arrow${expanded?" is-open":""}`} width={14} height={14}/>}
      {count && (
        <span className="sidebar-copy mr-2 shrink-0 text-[12px] font-medium tabular-nums text-ink-3">
          {count}
        </span>
      )}
    </button>
  );
}

export type NavigationItem = {key:string;label:ReactNode;icon?:ReactNode;children?:NavigationItem[];disabled?:boolean};
export function BeautifulNavigation({items,selectedKeys,openKeys,onOpenChange,onClick,collapsed=false}: {
 items:NavigationItem[];selectedKeys:string[];openKeys:string[];onOpenChange:(keys:string[])=>void;onClick:(event:{key:string})=>void;collapsed?:boolean;
}) {
 const [popup,setPopup]=useState<string>();
 const navRef=useRef<HTMLElement>(null);
 const closePopup=()=>{if(!popup)return;navRef.current?.querySelector<HTMLButtonElement>('[aria-expanded="true"]')?.focus();setPopup(undefined);};
 useEffect(()=>setPopup(undefined),[collapsed,selectedKeys.join("|")]);
 return <nav ref={navRef} onKeyDown={e=>{if(e.key==="Escape")closePopup();}} className={`bui bui-navigation${collapsed?" is-collapsed":""}`} aria-label="工作空间"><div className="flex flex-col gap-px">{items.map(item=>{
 const active=selectedKeys.includes(item.key), childActive=item.children?.some(c=>selectedKeys.includes(c.key));
 const children=<div className="bui bui-nav-popup" onKeyDown={e=>{if(e.key==="Escape")closePopup();}}>{item.children?.map(child=><RailButton key={child.key} icon={child.icon} label={child.label} disabled={item.disabled||child.disabled} active={selectedKeys.includes(child.key)} onClick={()=>{closePopup();onClick({key:child.key});}}/>)}</div>;
 const button=<RailButton icon={item.icon} label={item.label} disabled={item.disabled} active={active} containsActive={!!childActive} expanded={item.children?(collapsed?popup===item.key:openKeys.includes(item.key)):undefined} onClick={()=>{if(collapsed&&item.children)return;item.children?onOpenChange(openKeys.includes(item.key)?openKeys.filter(k=>k!==item.key):[...openKeys,item.key]):onClick({key:item.key});}}/>;
 return <div key={item.key}>{collapsed&&item.children?<Popover trigger="click" placement="rightTop" open={popup===item.key} onOpenChange={open=>setPopup(open?item.key:undefined)} content={children}><span className="bui-nav-trigger">{button}</span></Popover>:button}{!collapsed&&item.children&&openKeys.includes(item.key)&&<div className="bui-nav-children">{children}</div>}</div>;
 })}</div></nav>;
}
export function BeautifulTabs({items,activeKey,onChange,className=""}:{items:{key:string;label:ReactNode;disabled?:boolean}[];activeKey:string;onChange?:(key:string)=>void;className?:string}) {
 const root=useRef<HTMLElement>(null);
 const [indicator,setIndicator]=useState<{x:number;width:number}|null>(null);
 useLayoutEffect(()=>{
  const node=root.current;if(!node)return;
  const measure=()=>{
   const selected=node.querySelector<HTMLElement>('[aria-current="page"]');
   setIndicator(selected?{x:selected.offsetLeft,width:selected.offsetWidth}:null);
  };
  measure();
  const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
  observer?.observe(node);Array.from(node.children).forEach(child=>observer?.observe(child));
  return ()=>observer?.disconnect();
 },[activeKey,items]);
 return <nav ref={root} className={`bui bui-top-nav ${className}`} aria-label="页面导航">{indicator&&<span aria-hidden="true" className="ls-nav-indicator" style={{width:indicator.width,transform:`translateX(${indicator.x}px)`}}/>}{items.map(item=><RailButton key={item.key} icon={null} label={item.label} disabled={item.disabled} active={activeKey===item.key} onClick={()=>{if(!item.disabled)onChange?.(item.key);}}/>)}</nav>;
}
