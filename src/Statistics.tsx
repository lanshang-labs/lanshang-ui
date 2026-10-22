import {useId,type HTMLAttributes,type ReactNode} from 'react';
import {ArrowUpRight,ArrowDownRight,Minus} from 'iconoir-react';
import {LoadingContainer,type LoadingContainerProps} from './LoadingContainer.js';

export type StatisticCardProps=Omit<HTMLAttributes<HTMLElement>,'title'> & {
  label:string;
  value:number|string|null;
  unit?:ReactNode;
  description?:ReactNode;
  trend?:{direction:'up'|'down'|'flat';label:string;tone?:'neutral'|'success'|'warning'|'error'};
  visualization?:ReactNode;
};
/** Formatting and whether a change is good or bad belong to the consumer. Zero is a valid value. */
export function StatisticCard({label,value,unit,description,trend,visualization,className='',...props}:StatisticCardProps){
  const id=useId(),Icon=trend?.direction==='up'?ArrowUpRight:trend?.direction==='down'?ArrowDownRight:Minus;
  const display=value==null||(typeof value==='number'&&!Number.isFinite(value))?'—':value;
  return <section {...props} className={`ls-statistic-card ${className}`} aria-labelledby={props['aria-labelledby']??(props['aria-label']?undefined:id)}>
    <h3 id={id}>{label}</h3><div className="ls-statistic-value"><strong>{display}</strong>{unit!=null&&<span>{unit}</span>}</div>
    {trend&&<div className="ls-statistic-trend" data-tone={trend.tone??'neutral'}><Icon width={14} height={14} aria-hidden="true"/><span className="ls-chart-summary">{trend.direction==='up'?'上升':trend.direction==='down'?'下降':'持平'}，</span>{trend.label}</div>}
    {visualization!=null&&<div className="ls-statistic-visualization">{visualization}</div>}
    {description!=null&&<div className="ls-statistic-description">{description}</div>}
  </section>;
}

export type ChartCardProps=LoadingContainerProps & {description?:ReactNode;footer?:ReactNode};
/** A shared card and recovery boundary. The chart engine remains optional. */
export function ChartCard({description,footer,children,className='',...props}:ChartCardProps){
  return <LoadingContainer {...props} className={`ls-chart-card ${className}`}>
    {description!=null&&<p className="ls-chart-description">{description}</p>}
    {children}
    {footer!=null&&<div className="ls-chart-footer">{footer}</div>}
  </LoadingContainer>;
}

export type RankingBarItem={key:string;label:string;value:number;displayValue?:ReactNode};
export type RankingBarListProps=HTMLAttributes<HTMLOListElement> & {items:readonly RankingBarItem[];max?:number;emptyText?:string};
/** Non-negative magnitude comparison. Order is supplied by the caller; negative values are not clamped into bars. */
export function RankingBarList({items,max,emptyText='暂无排行数据',className='',...props}:RankingBarListProps){
  const domain=typeof max==='number'&&Number.isFinite(max)&&max>0?max:Math.max(0,...items.map(item=>Number.isFinite(item.value)?item.value:0));
  return <ol {...props} className={`ls-ranking-bars ${className}`}>
    {items.length?items.map(item=>{const valid=Number.isFinite(item.value)&&item.value>=0;return <li key={item.key}>
      <span className="ls-ranking-bar-fill" aria-hidden="true" style={{width:`${valid&&domain>0?Math.min(100,item.value/domain*100):0}%`}}/>
      <span className="ls-ranking-bar-label">{item.label}</span><span className="ls-ranking-bar-value">{item.displayValue??(valid?item.value:'—')}</span>
    </li>}):<li className="ls-ranking-bars-empty">{emptyText}</li>}
  </ol>;
}
