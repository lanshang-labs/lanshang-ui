export interface CanvasViewport { x:number; y:number; scale:number }
export interface CanvasSize { width:number; height:number }
export interface CanvasPoint { x:number; y:number }
export interface CanvasNode<T=unknown> extends CanvasPoint,CanvasSize { id:string; data:T; label?:string }
export interface CanvasScaleLimits { minScale?:number; maxScale?:number }
export interface CanvasFitOptions extends CanvasScaleLimits { padding?:number }
export interface CanvasArrangeOptions { columns?:number; gap?:number; origin?:CanvasPoint }
export const defaultCanvasViewport:Readonly<CanvasViewport>={x:24,y:24,scale:1};

function finite(value:number,name:string){if(!Number.isFinite(value))throw new RangeError(`${name} must be finite`);return value;}
export function clampCanvasScale(scale:number,{minScale=.05,maxScale=4}:CanvasScaleLimits={}){
 finite(scale,'scale');finite(minScale,'minScale');finite(maxScale,'maxScale');
 if(minScale<=0||maxScale<minScale)throw new RangeError('Canvas scale limits must be positive and ordered');
 return Math.min(maxScale,Math.max(minScale,scale));
}
export function validateCanvasNodes<T>(nodes:readonly CanvasNode<T>[]){
 const ids=new Set<string>();
 for(const node of nodes){
  if(!node.id||ids.has(node.id))throw new Error('Canvas node ids must be nonempty and unique');
  ids.add(node.id);
  for(const key of ['x','y','width','height'] as const)finite(node[key],`node.${key}`);
  if(node.width<=0||node.height<=0)throw new RangeError('Canvas node dimensions must be positive');
 }
}
export function getCanvasBounds<T>(nodes:readonly CanvasNode<T>[]){
 validateCanvasNodes(nodes);
 if(!nodes.length)return null;
 let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
 for(const node of nodes){left=Math.min(left,node.x);top=Math.min(top,node.y);right=Math.max(right,node.x+node.width);bottom=Math.max(bottom,node.y+node.height);}
 return {x:left,y:top,width:right-left,height:bottom-top};
}
/** The world point below the screen anchor remains fixed while zooming. */
export function zoomCanvasAt(view:CanvasViewport,scale:number,anchor:CanvasPoint,limits:CanvasScaleLimits={}):CanvasViewport{
 finite(view.x,'viewport.x');finite(view.y,'viewport.y');finite(view.scale,'viewport.scale');
 finite(anchor.x,'anchor.x');finite(anchor.y,'anchor.y');
 if(view.scale<=0)throw new RangeError('Viewport scale must be positive');
 const next=clampCanvasScale(scale,limits),ratio=next/view.scale;
 return {x:anchor.x-(anchor.x-view.x)*ratio,y:anchor.y-(anchor.y-view.y)*ratio,scale:next};
}
export function fitCanvasViewport<T>(nodes:readonly CanvasNode<T>[],size:CanvasSize,{padding=24,minScale=.05,maxScale=1}:CanvasFitOptions={}):CanvasViewport{
 finite(size.width,'width');finite(size.height,'height');finite(padding,'padding');
 if(padding<0)throw new RangeError('Canvas fit padding must be nonnegative');
 const bounds=getCanvasBounds(nodes);
 if(!bounds||size.width<=0||size.height<=0)return {...defaultCanvasViewport,scale:clampCanvasScale(1,{minScale,maxScale})};
 const scale=clampCanvasScale(Math.min(Math.max(0,size.width-2*padding)/bounds.width,Math.max(0,size.height-2*padding)/bounds.height),{minScale,maxScale});
 return {x:(size.width-bounds.width*scale)/2-bounds.x*scale,y:(size.height-bounds.height*scale)/2-bounds.y*scale,scale};
}
/** Stable input order, variable node sizes, no mutation and no node-count limit. */
export function arrangeCanvasNodes<T>(nodes:readonly CanvasNode<T>[],{columns=Math.max(1,Math.ceil(Math.sqrt(nodes.length))),gap=24,origin={x:0,y:0}}:CanvasArrangeOptions={}):CanvasNode<T>[] {
 validateCanvasNodes(nodes);finite(columns,'columns');finite(gap,'gap');finite(origin.x,'origin.x');finite(origin.y,'origin.y');
 if(!Number.isInteger(columns)||columns<1||gap<0)throw new RangeError('Canvas columns must be a positive integer and gap nonnegative');
 const widths:number[]=[],heights:number[]=[];
 nodes.forEach((node,i)=>{const col=i%columns,row=Math.floor(i/columns);widths[col]=Math.max(widths[col]??0,node.width);heights[row]=Math.max(heights[row]??0,node.height);});
 const offsets=(values:number[],start:number)=>{const result:number[]=[];let next=start;for(const value of values){result.push(next);next+=value+gap;}return result;};
 const xs=offsets(widths,origin.x),ys=offsets(heights,origin.y);
 return nodes.map((node,i)=>({...node,x:xs[i%columns],y:ys[Math.floor(i/columns)]}));
}
