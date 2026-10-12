import {theme, type ThemeConfig} from "antd";
import {foundations as f, palettes, type ThemeMode} from "./tokens.js";
export function designTheme(mode:ThemeMode):ThemeConfig {
 const p=palettes[mode];
 return {
  algorithm:mode==="dark"?theme.darkAlgorithm:theme.defaultAlgorithm,
  token:{fontFamily:f.font,fontSize:f.fontSize,controlHeight:32,controlHeightSM:f.controlHeight,controlHeightLG:36,borderRadius:f.radius,
   colorPrimary:p.accent,colorInfo:p.accent,colorSuccess:p["success-text"],colorWarning:p["warning-text"],colorError:p["error-text"],
   colorBgBase:p.canvas,colorBgLayout:p.canvas,colorBgContainer:p.surface,colorBgElevated:mode==="light"?p.surface:p.raised,
   colorSuccessBg:p["success-bg"],colorSuccessBorder:p["success-line"],colorSuccessText:p["success-text"],
   colorWarningBg:p["warning-bg"],colorWarningBorder:p["warning-line"],colorWarningText:p["warning-text"],
   colorErrorBg:p["error-bg"],colorErrorText:p["error-text"],colorInfoBg:p["info-bg"],
   colorTextPlaceholder:p.muted,colorTextDisabled:mode==="light"?"#a4a4ab":"#64666b",
   colorText:p.text,colorTextSecondary:p.secondary,colorTextTertiary:p.muted,colorBorder:p["line-strong"],colorBorderSecondary:p.line},
  components:{
   Layout:{headerBg:p.canvas,siderBg:p.canvas,bodyBg:p.canvas},
   Menu:{darkItemBg:p.canvas,darkSubMenuItemBg:p.canvas,darkItemSelectedBg:p.selected,darkItemSelectedColor:p.text,darkItemHoverBg:p.raised,darkItemColor:p.secondary,itemBorderRadius:f.controlRadius},
   Button:{defaultBg:p.surface,defaultShadow:"none",primaryShadow:"none",borderRadiusSM:f.controlRadius,defaultBorderColor:p.line,defaultColor:p.text},
   Input:{colorBorder:p.line,colorBgContainer:p.raised,activeBg:p.surface,hoverBg:p.raised,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"],activeShadow:"0 0 0 2px "+p["info-bg"]},
   Select:{colorBorder:p.line,optionSelectedFontWeight:400,selectorBg:p.raised,optionSelectedBg:p.selected,optionSelectedColor:p.text,optionActiveBg:p.raised,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"],activeOutlineColor:p["info-bg"]},
   InputNumber:{colorBorder:p.line,colorBgContainer:p.raised,activeBg:p.surface,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"]},
   Form:{itemMarginBottom:16,verticalLabelPadding:"0 0 6px",labelColor:p.secondary},
   Tag:{defaultBg:p.raised,defaultColor:p.secondary,borderRadiusSM:f.controlRadius},
   Tabs:{itemColor:p.muted,itemSelectedColor:p.text,inkBarColor:p.secondary},
   Card:{headerBg:"transparent"},
   Table:{fontSize:f.fontSize,cellFontSizeSM:f.fontSize,cellPaddingBlockSM:f.table.compactPadding,cellPaddingInlineSM:f.table.horizontalPadding,
    headerBg:p.surface,headerColor:p.secondary,borderColor:p.line,rowHoverBg:p.raised,rowSelectedBg:p.selected,rowSelectedHoverBg:p.selected,headerSplitColor:"transparent"},
  },
 };
}
