import {useState} from 'react';
import {Dialog,ImageDeck,Inline,SegmentedControl,Stack,type ImageDeckItem} from '../dist/index.js';
import './image-deck-preview.css';

// Local vector images keep this example usable offline without business resources.
function landscape(sky:string,mountain:string,foreground:string,sun:string,moon=false){
 return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="${sky}"/><circle cx="420" cy="210" r="62" fill="${sun}"/>${moon?`<circle cx="445" cy="185" r="57" fill="${sky}"/>`:''}<path d="M0 500 180 280 350 490 470 365 600 480V800H0Z" fill="${mountain}"/><path d="m0 625 155-155 120 135 110-100 215 145v150H0Z" fill="${foreground}"/><path d="M0 705q150-45 300 15t300-10v90H0Z" fill="${sky}" opacity=".18"/><path d="M56 65h42M56 65v42M544 735h-42M544 735v-42" stroke="${sun}" opacity=".5" fill="none" stroke-width="2"/></svg>`)}`;
}
const images:ImageDeckItem[]=[
 {id:'dawn',src:landscape('#e6dad1','#9eaaa5','#506c63','#fff2d2'),alt:'浅杏色晨空与青绿色山峦',title:'山间 · 晨光'},
 {id:'mist',src:landscape('#dce3e0','#a7b6b1','#6a8380','#f7f7e9'),alt:'薄雾中层叠的灰绿色山峦',title:'山间 · 薄雾'},
 {id:'dusk',src:landscape('#e4c5af','#aa8e87','#6d6272','#ffe5bb'),alt:'落日下的暖色山谷与紫灰色山脊',title:'山间 · 暮色'},
 {id:'night',src:landscape('#263944','#536774','#354e57','#dfe7da',true),alt:'蓝色夜空下的月牙和寂静山谷',title:'山间 · 月夜'},
];
export function ImageDeckPreview(){
 const [preview,setPreview]=useState<ImageDeckItem|null>(null);
 const [container,setContainer]=useState('fluid');
 return <Stack gap="xl">
  <Inline style={{justifyContent:'space-between',alignItems:'flex-end'}}><div className="docs-deck-intro"><span className="docs-deck-eyebrow">L A N S H A N G · I M A G E  D E C K</span><h3>把一组画面，收进一叠卡片。</h3><p>滚轮翻到下一张，点击叠卡舒展开来。</p></div><SegmentedControl aria-label="预览容器" value={container} onChange={value=>setContainer(String(value))} options={[{label:'宽容器',value:'fluid'},{label:'窄容器',value:'card'}]}/></Inline>
  <div style={{width:container==='card'?280:'100%',maxWidth:'100%',alignSelf:'center'}}><ImageDeck aria-label="山间四时" items={images} cardWidth={228} onImageClick={setPreview}/></div>
  <Dialog title={preview?.title} open={!!preview} onCancel={()=>setPreview(null)} footer={null} closeAriaLabel="关闭预览" width={520}>
   {preview&&<img className="docs-deck-original" src={preview.src} alt={preview.alt}/>}
  </Dialog>
 </Stack>;
}
