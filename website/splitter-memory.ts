/** Demo-only, versioned preference record. No task data or notes are persisted. */
export const splitterMemoryKey='lanshang-demo:splitter-layout:v1';
export const splitterModes=['horizontal','vertical','nested','folded'] as const;
export type SplitterMode=typeof splitterModes[number];
export type PanelMemory={size:number;collapsed:boolean};
export type LayoutMemory={version:1;mode:SplitterMode;panels:Record<string,PanelMemory>};
export function freshLayout():LayoutMemory{return {version:1,mode:'horizontal',panels:{horizontal:{size:38,collapsed:false},vertical:{size:38,collapsed:false},nested:{size:38,collapsed:false},'nested-inner':{size:60,collapsed:false},folded:{size:65,collapsed:false},'folded-inner':{size:38,collapsed:false}}}}
export function parseLayout(raw:string|null):LayoutMemory{
 if(!raw)return freshLayout();const value=JSON.parse(raw),result=freshLayout();
 if(value.version!==1||!splitterModes.includes(value.mode)||!value.panels)throw new Error('Invalid layout');
 result.mode=value.mode;
 for(const key of Object.keys(result.panels)){const panel=value.panels[key];if(!panel||!Number.isFinite(panel.size)||panel.size<25||panel.size>70||typeof panel.collapsed!=='boolean')throw new Error('Invalid panel');result.panels[key]={size:panel.size,collapsed:panel.collapsed}}
 return result;
}
