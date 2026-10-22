import {foundations,palettes,type ThemeMode} from './tokens.js';
/** Stable categorical hues across themes; data colors are separate from neutral UI actions. */
export const chartPalettes={
  light:['#596dd9','#248f83','#bf8a3d','#9270bd','#c26787','#388fb7'],
  dark:['#8c9ef0','#65c4b4','#ddb16b','#b69adb','#e196b1','#79bcdb'],
} as const;
export function createChartTheme(mode:ThemeMode){
  const p=palettes[mode];
  return {type:mode,color:chartPalettes[mode][0],category10:[...chartPalettes[mode]],
    view:{viewFill:'transparent',plotFill:'transparent'},
    axis:{labelFill:p.secondary,labelFillOpacity:1,labelOpacity:1,labelFontSize:11,labelFontFamily:foundations.font,
      titleFill:p.secondary,titleFontSize:12,titleFontFamily:foundations.font,gridStroke:p.line,gridStrokeOpacity:1,gridLineWidth:1,line:false,tick:false},
    legendCategory:{itemLabelFill:p.secondary,itemLabelFontSize:11,itemLabelFontFamily:foundations.font},
    title:{titleFill:p.text,subtitleFill:p.secondary}};
}
