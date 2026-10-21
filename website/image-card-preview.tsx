import {useState} from 'react';
import {Dialog,ImageCard,MotionButton,Stack} from '../dist/index.js';
import './image-card-preview.css';

function scene(width:number,height:number,sky:string,hill:string,front:string){
 return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${sky}"/><circle cx="${width*.74}" cy="${height*.27}" r="${height*.12}" fill="#ffe6b9"/><path d="M0 ${height*.7} ${width*.22} ${height*.3} ${width*.51} ${height*.73} ${width*.78} ${height*.42} ${width} ${height*.64}V${height}H0Z" fill="${hill}"/><path d="M0 ${height*.86} ${width*.25} ${height*.56} ${width*.48} ${height*.83} ${width*.68} ${height*.65} ${width} ${height*.9}V${height}H0Z" fill="${front}"/></svg>`)}`;
}
const references=[
 {src:scene(960,480,'#e4c5af','#aa8e87','#6d6272'),alt:'暮色下的横幅山谷与落日',title:'暮色山谷',description:'场景参考 · 原始画幅 2:1'},
 {src:scene(720,480,'#dce3e0','#a7b6b1','#6a8380'),alt:'薄雾中展开的层叠山脊',title:'山间薄雾',description:'构图参考 · 原始画幅 3:2'},
];
export function ImageCardPreview(){
 const [preview,setPreview]=useState<typeof references[number]|null>(null);
 return <Stack gap="lg">
  <div className="docs-image-card-heading"><span>LANSHANG · IMAGE CARD</span><h3>让画面决定比例。</h3><p>与叠卡共用纸片边框和内嵌标题。完整显示，不再把横图塞进灰色方块。</p></div>
  <div className="docs-image-card-grid">{references.map((image,i)=><ImageCard key={image.src} {...image} index={String(i+1).padStart(2,'0')} onPreview={()=>setPreview(image)}/>)}</div>
  <Dialog title={preview?.title} open={!!preview} onCancel={()=>setPreview(null)} footer={<MotionButton onClick={()=>setPreview(null)}>关闭</MotionButton>} width={760}>
   {preview&&<img className="docs-image-card-original" src={preview.src} alt={preview.alt}/>}
  </Dialog>
 </Stack>;
}
