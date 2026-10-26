import type {ThemeConfig} from 'antd';
import {designTheme} from '../../../src/theme';

/** Local candidate only. AntD keeps behavior; coss neutral surfaces guide this mapping. */
export function foundationTheme(dark:boolean,candidate=true):ThemeConfig{
 const current=designTheme(dark?'dark':'light');
 if(!candidate)return {...current,inherit:false};
 const foreground=dark?'#f5f5f5':'#262626';
 const surface=dark?'#1b1b1b':'#ffffff';
 const border=dark?'#ffffff14':'#0000001a';
 const muted=dark?'#a3a3a3':'#696969';
 const hover=dark?'#ffffff0a':'#0000000a';
 const focus=dark?'#a3a3a3':'#737373';
 const geometry={controlHeight:32,controlHeightSM:28,controlHeightLG:36,borderRadius:8,borderRadiusSM:6,borderRadiusLG:10};
 const field={...geometry,colorBorder:border,colorBgContainer:surface,activeBg:surface,hoverBg:surface,activeBorderColor:focus,hoverBorderColor:dark?'#ffffff38':'#00000038',activeShadow:`0 0 0 3px ${dark?'#ffffff1a':'#0000000f'}`};
 return {...current,inherit:false,token:{...current.token,...geometry,fontSize:13,colorPrimary:foreground,colorPrimaryHover:dark?'#dedede':'#404040',colorPrimaryActive:dark?'#d4d4d4':'#171717',colorTextLightSolid:dark?'#262626':'#fafafa',colorText:foreground,colorTextSecondary:muted,colorTextPlaceholder:dark?'#828282':'#808080',colorBgContainer:surface,colorBgElevated:surface,colorBgLayout:dark?'#161616':'#fafafa',colorBorder:border,colorBorderSecondary:dark?'#ffffff0f':'#00000014',colorFillAlter:hover,colorLink:foreground,colorLinkHover:foreground,boxShadowSecondary:dark?'0 8px 28px #0005':'0 8px 28px #00000014'},components:{...current.components,
  Button:{...current.components?.Button,...geometry,colorPrimary:foreground,colorPrimaryHover:dark?'#dedede':'#404040',colorPrimaryActive:dark?'#d4d4d4':'#171717',primaryColor:dark?'#262626':'#fafafa',defaultBg:surface,defaultColor:foreground,defaultBorderColor:border,defaultHoverBg:hover,defaultHoverColor:foreground,defaultHoverBorderColor:border,textHoverBg:hover,paddingInline:11,paddingInlineSM:9,defaultShadow:dark?'inset 0 1px #ffffff0f':'0 1px 2px #0000000d',primaryShadow:dark?'none':'inset 0 1px #ffffff29,0 1px 2px #00000014'},
  Input:{...current.components?.Input,...field},InputNumber:{...current.components?.InputNumber,...field},DatePicker:{...current.components?.DatePicker,...field},
  Select:{...current.components?.Select,...geometry,colorBorder:border,selectorBg:surface,optionHeight:28,optionPadding:'4px 8px',optionSelectedBg:dark?'#303030':'#ffffff',optionSelectedColor:foreground,optionActiveBg:hover,activeBorderColor:focus,hoverBorderColor:focus,activeOutlineColor:dark?'#ffffff1a':'#0000000f'},
  Checkbox:{...current.components?.Checkbox,controlInteractiveSize:16,borderRadiusSM:4,colorPrimary:foreground,colorPrimaryHover:foreground,colorWhite:surface},
  Switch:{...current.components?.Switch,colorPrimary:foreground,colorPrimaryHover:foreground,handleBg:surface},
  Segmented:{...current.components?.Segmented,itemSelectedBg:dark?'#353535':'#ffffff',itemSelectedColor:foreground,itemHoverBg:hover,itemHoverColor:foreground,trackBg:dark?'#222222':'#f3f3f3'},
  Table:{...current.components?.Table,cellPaddingBlockSM:6,cellPaddingInlineSM:12,headerBg:dark?'#ffffff04':'#00000003',headerColor:muted,borderColor:dark?'#ffffff0f':'#0000000f',rowHoverBg:hover,rowSelectedBg:dark?'#ffffff0a':'#00000004',rowSelectedHoverBg:dark?'#ffffff0f':'#00000008'},
  Form:{...current.components?.Form,labelColor:foreground,labelFontSize:13,itemMarginBottom:18,verticalLabelPadding:'0 0 7px'},
  Modal:{borderRadiusLG:12,contentBg:surface,headerBg:surface,paddingContentHorizontalLG:24},
  Alert:{defaultPadding:'10px 12px',withDescriptionPadding:'12px 14px',borderRadiusLG:8},
 }};
}
