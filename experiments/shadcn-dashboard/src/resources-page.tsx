import {useRef,useState} from 'react';
import {ImageCard,ImageDeck,type ImageDeckItem} from '@lanshang-labs/ui/media';
import '@lanshang-labs/ui/media.css';
import {Modal,Segmented} from 'antd';
import {ArrowUpRight,Images} from 'lucide-react';
import {BaseLayout} from './components/layouts/base-layout';
import {Card,CardContent,CardDescription,CardHeader,CardTitle} from './components/ui/card';
import {resourceImages} from './resource-data';
import './resources.css';

export function ResourcesPage(){
 const [material,setMaterial]=useState('template');
 const [activeId,setActiveId]=useState(resourceImages[0].id);
 const [preview,setPreview]=useState<ImageDeckItem|null>(null);
 const previewTrigger=useRef<HTMLElement|null>(null);
 const active=resourceImages.find(image=>image.id===activeId)??resourceImages[0];
 function openPreview(image:ImageDeckItem){previewTrigger.current=document.activeElement instanceof HTMLElement?document.activeElement:null;setPreview(image);}
 return <BaseLayout><div className="resource-page px-6 space-y-6">
  <header className="flex flex-wrap items-center justify-between gap-4">
   <div><h1 className="text-2xl font-bold tracking-tight">Resource Library</h1><p className="text-muted-foreground mt-2">A small collection of places, light, and quiet moments.</p></div>
   <Segmented aria-label="资料展示材质" value={material} onChange={value=>setMaterial(String(value))} options={[{value:'template',label:'原模板'},{value:'glass',label:'玻璃材质'}]}/>
  </header>
  <div className="resource-media-theme space-y-6" data-material={material}>
   <div className="resource-hero-grid">
    <Card><CardHeader className="flex flex-row items-center justify-between"><div className="space-y-2"><CardDescription>COLLECTION / 01</CardDescription><CardTitle>山间四时</CardTitle><CardDescription>一组光线与色彩的观察，收藏在一起。</CardDescription></div><Images className="size-5 text-muted-foreground" aria-hidden="true"/></CardHeader><CardContent>
     <div className="resource-deck-stage"><ImageDeck aria-label="山间四时" items={resourceImages} activeId={activeId} onActiveChange={setActiveId} onImageClick={openPreview} cardWidth={230}/></div>
     <p className="text-xs text-muted-foreground mt-4">滚轮或方向键切换，点击展开；展开后可查看原图。</p>
    </CardContent></Card>
    <section aria-label="当前画面" className="resource-current-panel">
     <div className="flex items-center justify-between gap-3 mb-4"><h2 className="text-sm font-semibold">当前画面</h2><span className="text-xs text-muted-foreground">{String(resourceImages.findIndex(image=>image.id===active.id)+1).padStart(2,'0')} / 04</span></div>
     <div className="resource-current-stage"><ImageCard src={active.src} alt={active.alt} title={active.title} description="山间四时 · 个人参考集" aspectRatio="3/4" objectFit="cover" onPreview={()=>openPreview(active)} previewLabel={`预览${active.title}`}/></div>
     <dl className="resource-info"><div><dt>尺寸</dt><dd>600 × 800</dd></div><div><dt>格式</dt><dd>SVG 插画</dd></div><div><dt>来源</dt><dd>本地示例素材</dd></div></dl>
    </section>
   </div>
   <section aria-labelledby="resource-all-title"><div className="flex items-center justify-between gap-4 mb-4"><h2 id="resource-all-title" className="text-base font-semibold">全部素材 <span className="ml-2 text-xs font-normal text-muted-foreground">4 张</span></h2><span className="text-xs text-muted-foreground flex items-center gap-1">点击查看 <ArrowUpRight size={13} aria-hidden="true"/></span></div>
    <div className="resource-image-grid">{resourceImages.map((image,index)=><ImageCard key={image.id} src={image.src} alt={image.alt} title={image.title} index={String(index+1).padStart(2,'0')} description="山间四时" aspectRatio="4/3" objectFit="cover" onPreview={()=>openPreview(image)} previewLabel={`打开${image.title}`}/>)}</div>
   </section>
  </div>
  <Modal title={preview?.title??'图片预览'} open={!!preview} onCancel={()=>setPreview(null)} footer={null} width={680} afterClose={()=>{if(previewTrigger.current?.isConnected)previewTrigger.current.focus();}}>
   {preview&&<figure className="resource-original"><img src={preview.src} alt={preview.alt}/><figcaption>{preview.alt}</figcaption></figure>}
  </Modal>
 </div></BaseLayout>;
}
