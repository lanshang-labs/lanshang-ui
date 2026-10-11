import {theme, type ThemeConfig} from "antd";
import {foundations as f, palettes, type ThemeMode} from "./tokens.js";
export function designTheme(mode:ThemeMode):ThemeConfig {
 const p=palettes[mode];
 return {
  algorithm:mode==="dark"?theme.darkAlgorithm:theme.defaultAlgorithm,
  token:{fontFamily:f.font,fontSize:f.fontSize,controlHeightSM:f.controlHeight,borderRadius:f.radius,
   colorPrimary:p.accent,colorInfo:p.accent,colorSuccess:p["success-text"],colorWarning:p["warning-text"],colorError:p["error-text"],
   colorBgBase:p.canvas,colorBgLayout:p.canvas,colorBgContainer:p.surface,colorBgElevated:p.raised,
   colorText:p.text,colorTextSecondary:p.secondary,colorTextTertiary:p.muted,colorBorder:p["line-strong"],colorBorderSecondary:p.line},
  components:{
   Layout:{headerBg:p.canvas,siderBg:p.canvas,bodyBg:p.canvas},
   Menu:{darkItemBg:p.canvas,darkSubMenuItemBg:p.canvas,darkItemSelectedBg:p.selected,darkItemSelectedColor:p.text,darkItemHoverBg:p.raised,darkItemColor:p.secondary,itemBorderRadius:f.controlRadius},
   Button:{defaultBg:p.surface,defaultShadow:"none",primaryShadow:"none",borderRadiusSM:f.controlRadius},
   Tabs:{itemColor:p.muted,itemSelectedColor:p.text,inkBarColor:p.secondary},
   Card:{headerBg:"transparent"},
   Table:{fontSize:f.fontSize,cellFontSizeSM:f.fontSize,cellPaddingBlockSM:f.table.compactPadding,cellPaddingInlineSM:f.table.horizontalPadding,
    headerBg:p.raised,headerColor:p.secondary,borderColor:p.line,rowHoverBg:p.raised,rowSelectedBg:p.selected,rowSelectedHoverBg:p.selected,headerSplitColor:"transparent"},
  },
 };
}
