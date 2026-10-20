import {MotionIcon} from "./MotionIcon.js";

import {controlSizes, foundations, themeVariables} from "./tokens.js";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { ConfigProvider } from "antd";
import type { ConfigProviderProps } from "antd";
import { SunOutlined, MoonOutlined } from "./icons.js";
import {ButtonGroup} from "./ControlGroup.js";
import {MotionButton} from "./MotionButton.js";
import {RowActionButton} from "./RowActionButton.js";
import { designTheme } from "./theme.js";

type Mode = "light" | "dark";
const ThemeContext = createContext<{mode:Mode; setMode:(mode:Mode)=>void}>({mode:"dark",setMode:()=>{}});
export const useTheme = () => useContext(ThemeContext);
export function LanshangProvider({children, storageKey="boomerang.ui.theme", defaultMode="dark", locale, fontFamily=foundations.font}: {children:ReactNode; storageKey?:string; defaultMode?:Mode; locale?:ConfigProviderProps["locale"]; fontFamily?:string}) {
  const [mode,setMode] = useState<Mode>(()=>{
    try { const saved=localStorage.getItem(storageKey); return saved==="light"||saved==="dark"?saved:defaultMode; } catch { return defaultMode; }
  });
  useLayoutEffect(()=>{
    document.documentElement.dataset.theme=mode;
    document.documentElement.style.colorScheme=mode;
    Object.entries(themeVariables(mode)).forEach(([key,value])=>document.documentElement.style.setProperty(key,value));
    document.documentElement.style.setProperty("--ds-font",fontFamily);
    try { localStorage.setItem(storageKey,mode); } catch { /* Session switching still works without storage. */ }
  },[mode,storageKey,fontFamily]);
  return <ThemeContext.Provider value={{mode,setMode}}><ConfigProvider wave={{disabled:true}} button={{autoInsertSpace:false}} modal={{closeIcon:<MotionIcon name="close" size={controlSizes.middle.icon}/>}} drawer={{closeIcon:<MotionIcon name="close" size={controlSizes.middle.icon}/>}} locale={locale} componentSize="middle" theme={designTheme(mode,fontFamily)}>{children}</ConfigProvider></ThemeContext.Provider>;
}
export function ThemeSwitch({compact=false,variant="segmented"}:{compact?:boolean;variant?:"segmented"|"toggle"}) {
  const {mode,setMode}=useContext(ThemeContext);
  if(variant==="toggle") {
    const label=mode==="dark"?"切换到浅色模式":"切换到暗色模式";
    return <MotionButton className="bui-theme-toggle" aria-label={label} title={label} motionIcon="theme" iconActive={mode==="dark"} onClick={()=>setMode(mode==="dark"?"light":"dark")}/>;
  }
  return <div className={`platform-theme-switch${compact?" is-compact":""}`} role="group" aria-label="主题切换">
    {!compact&&<span className="theme-switch-label">外观</span>}
    <ButtonGroup aria-label="选择外观"><RowActionButton aria-label="浅色模式" aria-pressed={mode==="light"} title="浅色模式" className={mode==="light"?"is-selected":""} icon={<SunOutlined/>} onClick={()=>setMode("light")}>{!compact&&"浅色"}</RowActionButton><RowActionButton aria-label="暗色模式" aria-pressed={mode==="dark"} title="暗色模式" className={mode==="dark"?"is-selected":""} icon={<MoonOutlined/>} onClick={()=>setMode("dark")}>{!compact&&"暗色"}</RowActionButton></ButtonGroup>
  </div>;
}

/** @deprecated Use LanshangProvider. Retained for existing consumers. */
export const BoomerangProvider = LanshangProvider;
