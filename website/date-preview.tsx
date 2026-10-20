import {useId,useRef,useState} from 'react';
import {zhCNDatePickerLocale as locale} from '../dist/index.js';
import dayjs,{type Dayjs} from 'dayjs';
import 'dayjs/locale/zh-cn';
import {DateField,DateRangeField,FeedbackPanel,Inline,MotionButton,Stack} from '../dist/index.js';
import './date-preview.css';
type DateRange=[Dayjs,Dayjs]|null;
export const demoDate=dayjs('2026-10-13');
export function rangeError(value:DateRange){
 if(!value)return '';
 if(value.some(date=>!date.isValid()))return '请输入有效日期';
 const days=value[1].startOf('day').diff(value[0].startOf('day'),'day');
 return days<0?'结束日期不能早于开始日期':days>30?'最多选择 31 个自然日（含首尾）':'';
}
export function expiryError(value:Dayjs|null){
 if(!value)return '请选择有效期截止日期';
 if(!value.isValid())return '请输入有效日期';
 return value.isBefore(demoDate,'day')?'截止日期不能早于生效日期':'';
}
export function DatePreview({primary='range'}:{primary?:'single'|'range'}={}){
 const id=useId();
 const [range,setRange]=useState<DateRange>([demoDate.subtract(6,'day'),demoDate]);
 const [filter,setFilter]=useState('尚未应用筛选'),[filterError,setFilterError]=useState('');
 const [expiry,setExpiry]=useState<Dayjs|null>(demoDate.add(30,'day'));
 const [saved,setSaved]=useState('2026-11-12'),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const rangeRef=useRef<React.ComponentRef<typeof DateRangeField>>(null),expiryRef=useRef<React.ComponentRef<typeof DateField>>(null);
 const rangeCard=<section key="range" className="ls-date-card"><Stack>
   <header><h3>时间筛选</h3><p className="docs-muted">按自然日筛选任务记录；最多 31 天，清空表示不限日期。</p></header>
   <label htmlFor={id+'-start'}>任务日期范围</label>
   <DateRangeField ref={rangeRef} id={{start:id+'-start',end:id+'-end'}} locale={locale} format="YYYY-MM-DD" value={range} defaultPickerValue={[demoDate,demoDate.add(1,'month')]} className="ls-date-control"
    placeholder={['开始日期','结束日期']} status={filterError?'error':undefined}
    onChange={value=>{setRange(value as DateRange);setFilterError('')}}/>
   <Inline><MotionButton type="primary" onClick={()=>{const problem=rangeError(range);setFilterError(problem);if(problem){rangeRef.current?.focus();return}setFilter(range?range.map(v=>v.format('YYYY-MM-DD')).join(' 至 '):'不限日期')}}>应用筛选</MotionButton><MotionButton onClick={()=>{setRange(null);setFilterError('')}}>清空日期范围</MotionButton><MotionButton onClick={()=>{setRange([demoDate.subtract(6,'day'),demoDate]);setFilterError('')}}>最近 7 天样例</MotionButton></Inline>
   {filterError&&<FeedbackPanel type="error" role="alert" message={filterError}/>}
   <p role="status">已应用：{filter}。修改日期不会自动发送请求。</p>
  </Stack></section>;
 const expiryCard=<section key="single" className="ls-date-card"><Stack>
   <header><h3>有效期设置</h3><p className="docs-muted">样例生效日期固定为 2026-10-13，截止日期包含当天；不随电脑日期改变。</p></header>
   <label htmlFor={id+'-expiry'}>有效期截止日期（必填）</label>
   <DateField ref={expiryRef} id={id+'-expiry'} locale={locale} value={expiry} format="YYYY-MM-DD" defaultPickerValue={demoDate} className="ls-date-control"
    status={error?'error':undefined} aria-invalid={!!error} aria-describedby={error?id+'-error':undefined}
    onChange={value=>{setExpiry(value);setError('');setNotice('')}}/>
   <Inline><MotionButton type="primary" onClick={()=>{const problem=expiryError(expiry);setError(problem);if(problem){expiryRef.current?.focus();return}setSaved(expiry!.format('YYYY-MM-DD'));setNotice('有效期已保存')}}>保存有效期</MotionButton><MotionButton onClick={()=>{setExpiry(null);setError('');setNotice('')}}>清空截止日期</MotionButton><MotionButton onClick={()=>{setExpiry(dayjs(saved));setError('');setNotice('已恢复最近保存值')}}>撤销修改</MotionButton></Inline>
   {error&&<div id={id+'-error'}><FeedbackPanel type="error" role="alert" message={error}/></div>}
   <p role="status">{notice||'修改暂存本页'} · 已保存截止日期：{saved}</p>
  </Stack></section>;
 return <Stack>
  {primary==='single'?[expiryCard,rangeCard]:[rangeCard,expiryCard]}
  <p className="docs-muted">可输入 YYYY-MM-DD 或打开日历选择；方向键移动日期，Enter 选择，Escape 关闭。两个清空按钮均可由键盘访问。示例仅模拟，不发送请求。</p>
 </Stack>;
}
