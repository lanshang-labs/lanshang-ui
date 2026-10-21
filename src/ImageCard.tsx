import {useState,type CSSProperties,type HTMLAttributes,type ReactNode} from 'react';
import {BorderOuterOutlined,ExpandOutlined} from './icons.js';
import {MotionButton} from './MotionButton.js';

export interface ImageCardProps extends Omit<HTMLAttributes<HTMLElement>,'title'|'children'> {
 src:string;
 alt:string;
 title?:ReactNode;
 description?:ReactNode;
 index?:ReactNode;
 fallbackSrc?:string;
 aspectRatio?:CSSProperties['aspectRatio'];
 objectFit?:CSSProperties['objectFit'];
 objectPosition?:CSSProperties['objectPosition'];
 loading?:'eager'|'lazy';
 onPreview?:()=>void;
 previewLabel?:string;
 disabled?:boolean;
}
function CardImage({src,fallbackSrc,alt,objectFit,objectPosition,loading,interactive}:Pick<ImageCardProps,'src'|'fallbackSrc'|'alt'|'objectFit'|'objectPosition'|'loading'>&{interactive:boolean}){
 const [retry,setRetry]=useState(false),[failed,setFailed]=useState(false);
 const url=retry?fallbackSrc:src;
 if(!url||failed)return <div className="ls-image-card-placeholder"><span role="img" aria-label={`${alt}，${src?'图片暂不可用':'未提供图片'}`}><span aria-hidden><BorderOuterOutlined/></span></span><span>{src?'图片暂不可用':'未提供图片'}</span>{src&&<MotionButton className="ls-image-card-retry" type="text" motionIcon="refresh" aria-label={`重新加载${alt}`} title="重新加载图片" disabled={!interactive} onClick={()=>{setRetry(false);setFailed(false);}}/>}</div>;
 return <img src={url} alt={alt} loading={loading} draggable={false} style={{objectFit,objectPosition}} onError={()=>{if(!retry&&fallbackSrc&&fallbackSrc!==src)setRetry(true);else setFailed(true);}}/>;
}
/** Shared paper frame for a natural-ratio image or a consistently sized gallery tile. */
export function ImageCard({src,alt,title,description,index,fallbackSrc,aspectRatio,objectFit='contain',objectPosition='center',loading='lazy',onPreview,previewLabel,disabled=false,className='',style,...props}:ImageCardProps){
 const caption=title!=null||description!=null||index!=null;
 const label=previewLabel??`查看${typeof title==='string'?title:alt}`;
 return <figure {...props} className={`ls-image-card ${className}`} data-caption={caption} data-preview={!!onPreview&&!disabled} style={style}>
  <div className="ls-image-card-media" data-fixed-aspect={aspectRatio!=null&&aspectRatio!=='auto'||undefined} style={{aspectRatio}}>
   <CardImage key={`${src}\0${fallbackSrc??''}`} src={src} fallbackSrc={fallbackSrc} alt={alt} loading={loading} objectFit={objectFit} objectPosition={objectPosition} interactive={!disabled&&props['aria-hidden']!==true&&props['aria-hidden']!=='true'}/>
  </div>
  {caption&&<figcaption className="ls-image-card-caption">
   <div className="ls-image-card-caption-line"><span className="ls-image-card-title" title={typeof title==='string'?title:undefined}>{title??alt}</span>{index!=null&&<span className="ls-image-card-index">{index}</span>}</div>
   {description!=null&&<div className="ls-image-card-description">{description}</div>}
  </figcaption>}
  {onPreview&&<button type="button" className="ls-image-card-action" disabled={disabled} aria-label={label} title={label} onClick={onPreview}><span className="ls-image-card-preview-hint" aria-hidden><ExpandOutlined/></span></button>}
 </figure>;
}
