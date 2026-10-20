import {useState} from 'react';
import {zhCNDatePickerLocale as locale} from '../dist/index.js';
import {ButtonGroup,DateField,InputGroup,MotionButton,NumberStepper,RadioGroup,RowActionButton,SegmentedControl,Select,TabStrip,TextInput,ToggleSwitch,controlSizes,type ControlSize} from '../dist/index.js';
import './size-preview.css';

const sizes=[['small','小'],['middle','中'],['large','大']] as const;
const options=[{value:'design',label:'设计环境'},{value:'test',label:'测试环境'}];

export function SizePreview({reduce=false,narrow=false}:{reduce?:boolean;narrow?:boolean}){
 const [status,setStatus]=useState('选择任意尺寸的控件体验操作。');
 return <section className="motion-lab-rules ls-size-standard" data-ls-motion={reduce?'reduce':'system'} style={{maxWidth:narrow?320:undefined}} aria-label="控件尺寸规范">
  <h3>控件尺寸 · 大中小</h3>
  <p>小号面向 API 文档等高密度界面：更矮、更少留白，沿用同一圆润轮廓，表面阴影更轻；中号供常规表单，大号供宽松操作区。三档字段圆角依次为 8 / 10 / 12px，下拉卡片为 10 / 12 / 14px，选项高为 24 / 28 / 32px；日期弹层的面板、标题和日期格也随尺寸变化。分段与按钮式单选均保持胶囊形态。数值步进将减号、可输入的数值和加号收进同一外壳，三档随 size 缩放，达到上下限时禁用对应动作。组合按钮的外框、选中底片和子按钮随同一 size 缩放；同一操作行的字段与按钮使用相同 size。</p>
  <div className="ls-size-grid">{sizes.map(([size,label])=><SizeCard key={size} size={size} label={label} onAction={action=>setStatus(`已点击${label}号${action}`)}/>)}</div>
  <output role="status">{status}</output>
  <p>字号小 / 中 / 大为 {sizes.map(([size])=>controlSizes[size].fontSize).join(' / ')}px，图标为 {sizes.map(([size])=>controlSizes[size].icon).join(' / ')}px，控件间距为 {sizes.map(([size])=>controlSizes[size].gap).join(' / ')}px。复选框与普通单选框的标记固定 20px；开关依次为 {sizes.map(([size])=>`${controlSizes[size].switchWidth}×${controlSizes[size].switchHeight}`).join(' / ')}px，三档保持同一轮廓和切换动效。滑块轨道和手柄固定 8px / 18px，以周围留白适配密度。表格行内按钮显式使用小号时为 26px。</p>
 </section>;
}

function SizeCard({size,label,onAction}:{size:ControlSize;label:string;onAction:(action:'搜索'|'确认')=>void}){
 const tokens=controlSizes[size];
 const [alignment,setAlignment]=useState('靠左');
 return <div className="ls-size-card" data-size={size}>
  <header><strong>{label}号 · {size}</strong><span>{tokens.height}px 高 · {tokens.radius}px 圆角</span></header>
  <span className="ls-size-label">输入与按钮组合</span>
  <InputGroup size={size} aria-label={`${label}号输入与操作`} control={<TextInput size={size} aria-label={`${label}号搜索关键词`} placeholder="搜索项目"/>} actions={<ButtonGroup><RowActionButton size={size} motionIcon="search" onClick={()=>onAction('搜索')}>搜索</RowActionButton></ButtonGroup>}/>
  <span className="ls-size-label">选择器</span>
  <Select size={size} aria-label={`${label}号选择器`} defaultValue="design" options={options} getPopupContainer={node=>node.parentElement!}/>
  <span className="ls-size-label">日期选择</span>
  <DateField size={size} locale={locale} aria-label={`${label}号日期选择`} placeholder="选择日期" getPopupContainer={node=>node.parentElement!}/>
  <span className="ls-size-label">数值与按钮</span>
  <div className="ls-size-pair"><NumberStepper size={size} aria-label={`${label}号数字输入`} defaultValue={4} min={1} max={12}/><MotionButton size={size} onClick={()=>onAction('确认')}>确认</MotionButton></div>
  <span className="ls-size-label">分段与按钮式单选</span>
  <SegmentedControl size={size} aria-label={`${label}号分段选择`} options={['列表','网格']} defaultValue="列表"/>
  <RadioGroup size={size} name={`size-${size}`} aria-label={`${label}号按钮式单选`} optionType="button" options={[{label:'我的',value:'mine'},{label:'团队',value:'team'}]} defaultValue="mine"/>
  <span className="ls-size-label">组合按钮</span>
  <ButtonGroup size={size} aria-label={`${label}号组合按钮`}>{['靠左','居中'].map(value=><RowActionButton key={value} aria-pressed={alignment===value} onClick={()=>setAlignment(value)}>{value}</RowActionButton>)}</ButtonGroup>
  <span className="ls-size-label">页签与开关</span>
  <TabStrip size={size} items={[{key:'overview',label:'概览',children:<span className="ls-size-label">当前为概览</span>},{key:'activity',label:'活动',children:<span className="ls-size-label">当前为活动</span>}]}/>
  <ToggleSwitch size={size} aria-label={`${label}号开关`} defaultChecked/>
 </div>;
}
