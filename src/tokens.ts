import {motionVariables} from './motion.js';
// Canonical semantic tokens. AntD and source-adapted Beautiful UI consume these values.
export type ThemeMode = "light" | "dark";
export const controlSizes = {
  small: {height:26,radius:8,fontSize:12,icon:12,gap:4,paddingInline:7,popupRadius:10,optionHeight:24,optionRadius:6,switchWidth:36,switchHeight:20,switchHandle:14},
  middle:{height:32,radius:10,fontSize:13,icon:14,gap:6,paddingInline:10,popupRadius:12,optionHeight:28,optionRadius:8,switchWidth:44,switchHeight:24,switchHandle:18},
  large: {height:38,radius:12,fontSize:14,icon:16,gap:8,paddingInline:14,popupRadius:14,optionHeight:32,optionRadius:10,switchWidth:52,switchHeight:28,switchHandle:22},
} as const;
export type ControlSize = keyof typeof controlSizes;
export const foundations = {
  font: '"Inter Variable","Noto Sans SC Variable",-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif',
  mono: 'ui-monospace,SFMono-Regular,monospace',
  inputGroupHeight:controlSizes.middle.height, inputGroupRadius:controlSizes.middle.radius,
  fieldRadius:controlSizes.middle.radius, fieldRadiusSM:controlSizes.small.radius, fieldRadiusLG:controlSizes.large.radius,
  fieldHeight:controlSizes.middle.height, fieldHeightSM:controlSizes.small.height, fieldHeightLG:controlSizes.large.height,
  fontSize: 13, controlHeight: controlSizes.small.height, radius: controlSizes.middle.radius, controlRadius: controlSizes.middle.radius,
  spacing: {xs:4, sm:8, md:12, lg:16, xl:24},
  table: {compactPadding:4, comfortablePadding:10, horizontalPadding:10},
};
export const palettes = {
  "dark": {
    "canvas": "#09090b",
    "error-text": "#e48b8b", "error-bg":"#352628",
    "danger-fill":"#b23a43", "danger-fill-hover":"#bd414b", "danger-fill-active":"#a8323d",
    "surface": "#18181b",
    "raised": "#27272a",
    "selected": "#353539",
    "line": "#323438",
    "line-strong": "#43474f",
    "text": "#e5e5e7",
    "secondary": "#b3b8c2",
    "muted": "#9ca1ab",
    "accent": "#8db9f8",
    "link-text": "#8db9f8",
    "info-bg": "#252b32",
    "warning-bg": "#2a2823",
    "warning-line": "#454035",
    "warning-text": "#d2b277",
    "success-bg": "#242a27",
    "success-line": "#343d39",
    "success-text": "#8cbba1"
  },
  "light": {
    "canvas": "#f7f7f8",
    "error-text": "#c22f3b", "error-bg":"#fbefef",
    "danger-fill":"#c22f3b", "danger-fill-hover":"#ce3542", "danger-fill-active":"#aa2b37",
    "surface": "#ffffff",
    "raised": "#f2f2f3",
    "selected": "#eaeaec",
    "line": "#ededf0",
    "line-strong": "#d9d9df",
    "text": "#202124",
    "secondary": "#565860",
    "muted": "#65676f",
    "accent": "#0085ff",
    "link-text": "#0067c7",
    "info-bg": "#edf6ff",
    "warning-bg": "#fcf7ec",
    "warning-line": "#e9dcc2",
    "warning-text": "#876124",
    "success-bg": "#eaf7ef",
    "success-line": "#c7e9d4",
    "success-text": "#11783f"
  }
} as const;
export const syntaxPalettes = {
  light: {keyword:"#006bd6",string:"#a44718",function:"#7753a8",number:"#087e72"},
  dark: {keyword:"#8db9f8",string:"#e9ad82",function:"#c4a2e8",number:"#82c6bb"},
} as const;
export function themeVariables(mode: ThemeMode): Record<string,string> {
  return {
    ...motionVariables,
    "--ls-input-group-height":`${foundations.inputGroupHeight}px`,
    "--ls-input-group-radius":`${foundations.inputGroupRadius}px`,
    ...Object.fromEntries(Object.entries(controlSizes).flatMap(([size,values])=>Object.entries(values).map(([key,value])=>[`--ls-control-${size}-${key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}`,`${value}px`]))),
    ...Object.fromEntries(Object.entries(palettes[mode]).map(([key,value])=>[`--ui-${key}`,value])),
    ...Object.fromEntries(Object.entries(syntaxPalettes[mode]).map(([key,value])=>[`--ls-syntax-${key}`,value])),
    "--ds-font":foundations.font,"--ds-mono":foundations.mono,
    "--ds-radius":`${foundations.radius}px`,
    ...Object.fromEntries(Object.entries(foundations.spacing).map(([key,value])=>[`--ds-space-${key}`,`${value}px`])),
  };
}
