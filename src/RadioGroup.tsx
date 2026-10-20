import {ConfigProvider,Radio,type RadioGroupProps} from 'antd';
import {useLayoutEffect,useRef,useState} from 'react';
/** Native radio semantics with one moving selection surface for button options. */
export function RadioGroup(props:RadioGroupProps){
 const root=useRef<HTMLDivElement>(null);
 const [indicator,setIndicator]=useState<{x:number;y:number;width:number;height:number}|null>(null);
 const {componentSize}=ConfigProvider.useConfig();
 const size=props.size??componentSize??'middle';
 useLayoutEffect(()=>{
  const node=root.current;if(!node)return;
  const measure=()=>{const selected=node.querySelector<HTMLElement>('.ant-radio-button-wrapper-checked');setIndicator(selected?{x:selected.offsetLeft,y:selected.offsetTop,width:selected.offsetWidth,height:selected.offsetHeight}:null)};
  measure();const observer=new MutationObserver(measure);observer.observe(node,{subtree:true,attributes:true,attributeFilter:['class'],childList:true});
  const resize=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);resize?.observe(node);node.querySelectorAll('label').forEach(el=>resize?.observe(el));
  return()=>{observer.disconnect();resize?.disconnect()};
 },[]);
 return <div ref={root} className="ls-radio-group" data-ls-size={size}>{indicator&&<span aria-hidden="true" className="ls-radio-indicator" style={{width:indicator.width,height:indicator.height,transform:`translate(${indicator.x}px,${indicator.y}px)`}}/>}<ConfigProvider wave={{disabled:true}}><Radio.Group {...props} size={size}/></ConfigProvider></div>;
}
