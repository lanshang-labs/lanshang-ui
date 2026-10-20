import {theme, type ThemeConfig} from "antd";
import {controlSizes,foundations as f, palettes, type ThemeMode} from "./tokens.js";
export function designTheme(mode:ThemeMode, fontFamily:string=f.font):ThemeConfig {
 const p=palettes[mode];
 const field={borderRadius:f.fieldRadius,borderRadiusSM:f.fieldRadiusSM,borderRadiusLG:f.fieldRadiusLG,controlHeight:f.fieldHeight,controlHeightSM:f.fieldHeightSM,controlHeightLG:f.fieldHeightLG};
 return {
  algorithm:mode==="dark"?theme.darkAlgorithm:theme.defaultAlgorithm,
  token:{fontFamily,fontSize:f.fontSize,fontSizeSM:controlSizes.small.fontSize,fontSizeLG:controlSizes.large.fontSize,controlHeight:controlSizes.middle.height,controlHeightSM:f.controlHeight,controlHeightLG:controlSizes.large.height,borderRadius:f.radius,
   colorPrimary:p.accent,colorInfo:p["link-text"],colorLink:p["link-text"],colorLinkHover:p["link-text"],colorLinkActive:p["link-text"],colorSuccess:p["success-text"],colorWarning:p["warning-text"],colorError:p["error-text"],
   colorBgBase:p.canvas,colorBgLayout:p.canvas,colorBgContainer:p.surface,colorBgElevated:mode==="light"?p.surface:p.raised,
   colorSuccessBg:p["success-bg"],colorSuccessBorder:p["success-line"],colorSuccessText:p["success-text"],
   colorWarningBg:p["warning-bg"],colorWarningBorder:p["warning-line"],colorWarningText:p["warning-text"],
   colorErrorBg:p["error-bg"],colorErrorText:p["error-text"],colorInfoBg:p["info-bg"],
   colorTextPlaceholder:p.muted,colorTextDisabled:mode==="light"?"#a4a4ab":"#64666b",
   colorText:p.text,colorTextSecondary:p.secondary,colorTextTertiary:p.muted,colorBorder:p["line-strong"],colorBorderSecondary:p.line},
  components:{
   Skeleton:{gradientFromColor:p.raised,gradientToColor:p.selected,blockRadius:f.controlRadius,titleHeight:16},
   Layout:{headerBg:p.canvas,siderBg:p.canvas,bodyBg:p.canvas},
   Menu:{darkItemBg:p.canvas,darkSubMenuItemBg:p.canvas,darkItemSelectedBg:p.selected,darkItemSelectedColor:p.text,darkItemHoverBg:p.raised,darkItemColor:p.secondary,itemBorderRadius:controlSizes.middle.radius,itemSelectedBg:p.selected,itemSelectedColor:p.text,itemHoverBg:p.raised,itemHoverColor:p.text},
   Button:{...field,colorPrimary:mode==="dark"?"#246fc4":"#0072e5",colorPrimaryHover:mode==="dark"?"#2877cc":"#1675d5",colorPrimaryActive:mode==="dark"?"#1f68bd":"#0062cc",primaryColor:"#ffffff",colorError:p["error-text"],colorErrorHover:p["error-text"],colorErrorActive:p["error-text"],defaultBg:p.raised,defaultShadow:"none",primaryShadow:"none",dangerShadow:"none",paddingInline:controlSizes.middle.paddingInline,paddingInlineSM:controlSizes.small.paddingInline,paddingInlineLG:controlSizes.large.paddingInline,fontWeight:500,defaultBorderColor:p.line,defaultColor:p.text,defaultHoverBg:p.selected,defaultHoverColor:p.text,defaultHoverBorderColor:p["line-strong"],defaultActiveBg:p.selected,defaultActiveColor:p.text,defaultActiveBorderColor:p["line-strong"],textHoverBg:p.raised},
   Input:{...field,colorBorder:p.line,colorBgContainer:mode==="light"?p.surface:p.raised,activeBg:mode==="light"?p.surface:p.raised,hoverBg:mode==="light"?p.surface:p.raised,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"],activeShadow:"0 0 0 2px "+p["info-bg"]},
   Select:{...field,optionHeight:28,optionPadding:"4px 8px",optionFontSize:13,optionLineHeight:20/13,colorBorder:p.line,optionSelectedFontWeight:400,selectorBg:mode==="light"?p.surface:p.raised,optionSelectedBg:p.selected,optionSelectedColor:p.text,optionActiveBg:p.raised,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"],activeOutlineColor:p["info-bg"]},
   Slider:{railBg:p.raised,railHoverBg:p.selected,trackBg:p.secondary,trackHoverBg:p.text,handleColor:p.secondary,handleActiveColor:p.text,handleActiveOutlineColor:p['info-bg']},
   DatePicker:{...field,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"],activeShadow:"0 0 0 2px "+p["info-bg"],colorBgContainer:mode==="light"?p.surface:p.raised,colorBorder:p.line,cellHoverBg:p.raised,cellActiveWithRangeBg:p.selected,cellHoverWithRangeBg:p.selected,cellRangeBorderColor:p.secondary},
   InputNumber:{...field,activeShadow:"0 0 0 2px "+p["info-bg"],colorBorder:p.line,colorBgContainer:mode==="light"?p.surface:p.raised,activeBg:mode==="light"?p.surface:p.raised,activeBorderColor:p.accent,hoverBorderColor:p["line-strong"]},
   Checkbox:{borderRadiusSM:7,controlInteractiveSize:20,colorPrimary:p.text,colorPrimaryHover:p.secondary,colorWhite:p.surface},
   Segmented:{itemSelectedBg:p.selected,itemSelectedColor:p.text,itemHoverBg:p.raised,itemHoverColor:p.text,trackBg:p.canvas},
   Radio:{buttonSolidCheckedBg:p.selected,buttonSolidCheckedHoverBg:p.selected,buttonSolidCheckedActiveBg:p.selected,buttonSolidCheckedColor:p.text,colorPrimary:p.text,colorPrimaryHover:p.secondary,dotColorDisabled:p.muted},
   Switch:{colorPrimary:p.text,colorPrimaryHover:p.secondary,handleBg:p.surface,handleShadow:"none",trackHeight:controlSizes.middle.switchHeight,trackHeightSM:controlSizes.small.switchHeight,trackMinWidth:controlSizes.middle.switchWidth,trackMinWidthSM:controlSizes.small.switchWidth,handleSize:controlSizes.middle.switchHandle,handleSizeSM:controlSizes.small.switchHandle},
   Form:{labelFontSize:13,itemMarginBottom:20,verticalLabelPadding:"0 0 8px",labelColor:p.secondary},
   Badge:{textFontSize:12,textFontSizeSM:11,indicatorHeight:20,indicatorHeightSM:16,statusSize:6},
   Tag:{fontSizeSM:12,lineHeightSM:1.5,defaultBg:p.raised,defaultColor:p.secondary,borderRadiusSM:controlSizes.small.radius},
   Dropdown:{controlPaddingHorizontal:8,paddingBlock:4,borderRadiusLG:controlSizes.middle.popupRadius},
   Tabs:{itemColor:p.muted,itemSelectedColor:p.text,itemHoverColor:p.text,itemActiveColor:p.text,inkBarColor:p.secondary},
   Pagination:{itemSize:controlSizes.middle.height,itemSizeSM:controlSizes.small.height,itemActiveBg:p.selected,itemBg:p.surface,itemInputBg:p.raised,colorPrimary:p.text,colorPrimaryHover:p.text,borderRadius:controlSizes.middle.radius},
   Card:{headerBg:"transparent"},
   Table:{fontSize:f.fontSize,cellFontSizeSM:f.fontSize,cellPaddingBlockSM:f.table.compactPadding,cellPaddingInlineSM:f.table.horizontalPadding,
    headerBg:p.surface,headerColor:p.secondary,borderColor:p.line,rowHoverBg:p.raised,rowSelectedBg:p.selected,rowSelectedHoverBg:p.selected,headerSplitColor:"transparent"},
  },
 };
}
