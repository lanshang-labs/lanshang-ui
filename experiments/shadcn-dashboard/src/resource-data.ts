import type {ImageDeckItem} from '@lanshang-labs/ui/media';

// Project-owned vector samples, adapted from the existing ImageDeck documentation art.
function landscape(sky:string,mountain:string,foreground:string,sun:string,moon=false){
 return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="${sky}"/><circle cx="420" cy="210" r="62" fill="${sun}"/>${moon?`<circle cx="445" cy="185" r="57" fill="${sky}"/>`:''}<path d="M0 500 180 280 350 490 470 365 600 480V800H0Z" fill="${mountain}"/><path d="m0 625 155-155 120 135 110-100 215 145v150H0Z" fill="${foreground}"/><path d="M0 705q150-45 300 15t300-10v90H0Z" fill="${sky}" opacity=".18"/><path d="M56 65h42M56 65v42M544 735h-42M544 735v-42" stroke="${sun}" opacity=".5" fill="none" stroke-width="2"/></svg>`)}`;
}
export const resourceImages:ImageDeckItem[]=[
 {id:'dawn',src:landscape('#e6dad1','#9eaaa5','#506c63','#fff2d2'),alt:'浅杏色晨空与青绿色山峦',title:'山间 · 晨光'},
 {id:'mist',src:landscape('#dce3e0','#a7b6b1','#6a8380','#f7f7e9'),alt:'薄雾中层叠的灰绿色山峦',title:'山间 · 薄雾'},
 {id:'dusk',src:landscape('#e4c5af','#aa8e87','#6d6272','#ffe5bb'),alt:'落日下的暖色山谷与紫灰色山脊',title:'山间 · 暮色'},
 {id:'night',src:landscape('#263944','#536774','#354e57','#dfe7da',true),alt:'蓝色夜空下的月牙和寂静山谷',title:'山间 · 月夜'},
];
