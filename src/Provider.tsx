
import {themeVariables} from "./tokens.js";

import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from "react";
import { ConfigProvider, Button, Space } from "antd";
import type { ConfigProviderProps } from "antd";
import { SunOutlined, MoonOutlined } from "./icons.js";
import { designTheme } from "./theme.js";

type Mode = "light" | "dark";
const ThemeContext = createContext<{mode:Mode; setMode:(mode:Mode)=>void}>({mode:"dark",setMode:()=>{}});
export const useTheme = () => useContext(ThemeContext);
export function LanshangProvider({children, storageKey="boomerang.ui.theme", defaultMode="dark", locale}: {children:ReactNode; storageKey?:string; defaultMode?:Mode; locale?:ConfigProviderProps["locale"]}) {
  const [mode,setMode] = useState<Mode>(()=>{
    try { const saved=localStorage.getItem(storageKey); return saved==="light"||saved==="dark"?saved:defaultMode; } catch { return defaultMode; }
  });
  useLayoutEffect(()=>{
    document.documentElement.dataset.theme=mode;
    document.documentElement.style.colorScheme=mode;
    Object.entries(themeVariables(mode)).forEach(([key,value])=>document.documentElement.style.setProperty(key,value));
    try { localStorage.setItem(storageKey,mode); } catch { /* Session switching still works without storage. */ }
  },[mode,storageKey]);
  return <ThemeContext.Provider value={{mode,setMode}}><ConfigProvider locale={locale} componentSize="small" theme={designTheme(mode)}>{children}</ConfigProvider></ThemeContext.Provider>;
}
export function ThemeSwitch({compact=false}:{compact?:boolean}) {
  const {mode,setMode}=useContext(ThemeContext);
  return <div className={`platform-theme-switch${compact?" is-compact":""}`} role="group" aria-label="主题切换">
    {!compact&&<span className="theme-switch-label">外观</span>}
    <Space.Compact><Button aria-label="浅色模式" aria-pressed={mode==="light"} title="浅色模式" className={mode==="light"?"is-selected":""} icon={<SunOutlined/>} onClick={()=>setMode("light")}>{!compact&&"浅色"}</Button><Button aria-label="暗色模式" aria-pressed={mode==="dark"} title="暗色模式" className={mode==="dark"?"is-selected":""} icon={<MoonOutlined/>} onClick={()=>setMode("dark")}>{!compact&&"暗色"}</Button></Space.Compact>
  </div>;
}

/** @deprecated Use LanshangProvider. Retained for existing consumers. */
export const BoomerangProvider = LanshangProvider;
