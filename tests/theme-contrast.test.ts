import {expect,it} from 'vitest';
import {palettes,syntaxPalettes,themeVariables} from '../src/tokens';

function luminance(color:string){
 const channels=[1,3,5].map(index=>{
  const value=parseInt(color.slice(index,index+2),16)/255;
  return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;
 });
 return 0.2126*channels[0]+0.7152*channels[1]+0.0722*channels[2];
}
function contrast(a:string,b:string){
 const first=luminance(a),second=luminance(b);
 return (Math.max(first,second)+0.05)/(Math.min(first,second)+0.05);
}

it.each(['light','dark'] as const)('keeps small semantic text readable on shared surfaces (%s)',mode=>{
 const palette=palettes[mode];
 for(const ink of ['text','secondary','muted'] as const){
  for(const background of ['canvas','surface','raised','selected'] as const){
   expect(contrast(palette[ink],palette[background]),`${mode} ${ink} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
 }
 for(const background of ['canvas','surface','raised','selected','info-bg'] as const){
  expect(contrast(palette['link-text'],palette[background]),`${mode} link on ${background}`).toBeGreaterThanOrEqual(4.5);
 }
 for(const tone of ['error','warning','success'] as const){
  for(const background of ['canvas','surface','raised','selected'] as const){
   expect(contrast(palette[`${tone}-text`],palette[background]),`${mode} ${tone} on ${background}`).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast(palette[`${tone}-text`],palette[`${tone}-bg`]),`${mode} ${tone} on its tint`).toBeGreaterThanOrEqual(4.5);
 }
 for(const [kind,ink] of Object.entries(syntaxPalettes[mode])){
  expect(themeVariables(mode)[`--ls-syntax-${kind}`]).toBe(ink);
  expect(contrast(ink,palette.surface),`${mode} code ${kind} on surface`).toBeGreaterThanOrEqual(4.5);
 }
});
