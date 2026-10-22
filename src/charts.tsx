/** Optional chart entry point. The base UI entry never imports the AntV engine. */
import {useEffect,useId,useState,type ReactNode} from 'react';
import {Line,Area,Column,Bar,Pie,type LineConfig,type AreaConfig,type ColumnConfig,type BarConfig,type PieConfig} from '@ant-design/plots';
import {useTheme} from './Provider.js';
import {ContentState} from './ContentState.js';
import {chartPalettes,createChartTheme} from './chart-theme.js';
export {chartPalettes,createChartTheme} from './chart-theme.js';
type Datum=Record<string,unknown>;
type Presentation={
  /** Human readable chart name. Data remains available through the optional HTML table. */
  label:string;summary?:string;showDataTable?:boolean;height?:number;
};
type Cartesian={data:Datum[];xField:string;yField:string;seriesField?:string};
export type LineChartProps=Omit<LineConfig,'theme'|'animate'|'label'|'data'|'xField'|'yField'|'colorField'|'height'> & Cartesian & Presentation;
export type AreaChartProps=Omit<AreaConfig,'theme'|'animate'|'label'|'data'|'xField'|'yField'|'colorField'|'height'> & Cartesian & Presentation;
export type ColumnChartProps=Omit<ColumnConfig,'theme'|'animate'|'label'|'data'|'xField'|'yField'|'colorField'|'height'> & Cartesian & Presentation;
export type BarChartProps=Omit<BarConfig,'theme'|'animate'|'label'|'data'|'xField'|'yField'|'colorField'|'height'> & Cartesian & Presentation;
export type DonutChartProps=Omit<PieConfig,'theme'|'animate'|'label'|'data'|'angleField'|'colorField'|'height'> & Presentation & {data:Datum[];categoryField:string;valueField:string};
export type SparklineProps=Cartesian & Omit<Presentation,'showDataTable'>;

function useChartTheme(){
  const {mode}=useTheme(),[reduced,setReduced]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion:reduce)').matches);
  useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion:reduce)'),update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  return {mode,theme:createChartTheme(mode),animate:reduced?false:{enter:{duration:180},update:{duration:150}}};
}
function ChartFigure({label,summary,data,fields,height=240,showDataTable=true,children}:Presentation & {data:Datum[];fields:string[];children:ReactNode}){
  const id=useId(),[expanded,setExpanded]=useState(false);
  return <figure className="ls-chart" style={{margin:0}} aria-labelledby={id}>
    <figcaption id={id} className="ls-chart-summary">{label}{summary?`。${summary}`:''}</figcaption>
    {data.length?<div className="ls-chart-canvas" aria-hidden="true" style={{height}}>{children}</div>:<ContentState title="暂无图表数据" style={{minHeight:height}}/>}
    {showDataTable&&data.length>0&&<details onToggle={event=>setExpanded(event.currentTarget.open)}><summary>查看数据（{data.length} 条）</summary>
      {expanded&&<div className="ls-chart-data-scroll" tabIndex={0} role="region" aria-label={`${label}数据表`}><table className="ls-chart-data"><caption className="ls-chart-summary">{label}原始数据</caption><thead><tr>{fields.map(field=><th key={field} scope="col">{field}</th>)}</tr></thead><tbody>{data.map((row,index)=><tr key={index}>{fields.map(field=><td key={field}>{row[field]==null?'—':String(row[field])}</td>)}</tr>)}</tbody></table></div>}
    </details>}
  </figure>;
}

/** The upstream plot props remain available for axes, tooltips, scales, events and annotations. */
export function LineChart({label,summary,showDataTable,height=240,data,xField,yField,seriesField,...props}:LineChartProps){
  const {theme,animate}=useChartTheme();
  return <ChartFigure {...{label,summary,showDataTable,height,data}} fields={[xField,yField,...seriesField?[seriesField]:[]]}>
    <Line height={height} autoFit data={data} xField={xField} yField={yField} colorField={seriesField} theme={theme} animate={animate} axis={{x:{title:false,labelAutoHide:true,labelAutoRotate:false},y:{title:false,labelAutoHide:true,labelAutoRotate:false}}} legend={seriesField?{color:{position:'bottom',title:false}}:false} style={{lineWidth:2}} {...props}/>
  </ChartFigure>;
}
export function AreaChart({label,summary,showDataTable,height=240,data,xField,yField,seriesField,...props}:AreaChartProps){
  const {theme,animate}=useChartTheme();
  return <ChartFigure {...{label,summary,showDataTable,height,data}} fields={[xField,yField,...seriesField?[seriesField]:[]]}>
    <Area {...{animate}} height={height} autoFit data={data} xField={xField} yField={yField} colorField={seriesField} theme={theme} axis={{x:{title:false,labelAutoHide:true,labelAutoRotate:false},y:{title:false,labelAutoHide:true,labelAutoRotate:false}}} legend={seriesField?{color:{position:'bottom',title:false}}:false} style={{fillOpacity:.12}} line={{style:{lineWidth:1.8}}} {...props}/>
  </ChartFigure>;
}
export function ColumnChart({label,summary,showDataTable,height=240,data,xField,yField,seriesField,...props}:ColumnChartProps){
  const {theme,animate}=useChartTheme();
  return <ChartFigure {...{label,summary,showDataTable,height,data}} fields={[xField,yField,...seriesField?[seriesField]:[]]}>
    <Column height={height} autoFit data={data} xField={xField} yField={yField} colorField={seriesField} theme={theme} animate={animate} axis={{x:{title:false,labelAutoHide:true,labelAutoRotate:false},y:{title:false,labelAutoHide:true,labelAutoRotate:false}}} legend={seriesField?{color:{position:'bottom',title:false}}:false} style={{radiusTopLeft:3,radiusTopRight:3,maxWidth:32}} {...props}/>
  </ChartFigure>;
}
export function BarChart({label,summary,showDataTable,height=240,data,xField,yField,seriesField,...props}:BarChartProps){
  const {theme,animate}=useChartTheme();
  return <ChartFigure {...{label,summary,showDataTable,height,data}} fields={[xField,yField,...seriesField?[seriesField]:[]]}>
    <Bar height={height} autoFit data={data} xField={xField} yField={yField} colorField={seriesField} theme={theme} animate={animate} axis={{x:{title:false,labelAutoHide:true,labelAutoRotate:false},y:{title:false,labelAutoHide:true,labelAutoRotate:false}}} legend={seriesField?{color:{position:'bottom',title:false}}:false} style={{radiusTopRight:3,radiusBottomRight:3,maxWidth:24}} {...props}/>
  </ChartFigure>;
}
export function DonutChart({label,summary,showDataTable,height=240,data,categoryField,valueField,...props}:DonutChartProps){
  const {theme,animate}=useChartTheme();
  return <ChartFigure {...{label,summary,showDataTable,height,data}} fields={[categoryField,valueField]}>
    <Pie height={height} autoFit data={data} colorField={categoryField} angleField={valueField} innerRadius={.72} theme={theme} animate={animate} legend={{color:{position:'bottom',title:false}}} style={{stroke:'transparent',lineWidth:2}} {...props}/>
  </ChartFigure>;
}
/** A compact trend; the accessible caption should state its meaning and time range. */
export function Sparkline({label,summary,height=52,data,xField,yField,seriesField}:SparklineProps){
  const {theme,animate,mode}=useChartTheme();
  return <ChartFigure {...{label,summary,height,data}} fields={[xField,yField]} showDataTable={false}>
    <Line height={height} autoFit data={data} xField={xField} yField={yField} colorField={seriesField} theme={theme} animate={animate} axis={false} legend={false} tooltip={false} padding={2} margin={0} style={{lineWidth:1.8,stroke:chartPalettes[mode][0]}}/>
  </ChartFigure>;
}
