import {useState} from 'react';
import {InputGroup,ButtonGroup,RowActionButton,Select,Stack,TextInput} from '../dist/index.js';
export function ControlGroupPreview(){
 const [value,setValue]=useState('dev'),[align,setAlign]=useState('左对齐'),[status,setStatus]=useState(''),[query,setQuery]=useState('');
 return <Stack style={{width:'100%',maxWidth:440}}>
  <InputGroup aria-label="连接选择与操作" control={<Select aria-label="连接" value={value} onChange={setValue} options={[{value:'dev',label:'开发环境'},{value:'long',label:'一个用于检查窄屏截断的很长的测试环境名称'}]}/>} actions={<ButtonGroup aria-label="连接操作"><RowActionButton aria-label="刷新连接" motionIcon="refresh" onClick={()=>setStatus('已刷新连接')}>刷新</RowActionButton></ButtonGroup>}/>
  <InputGroup aria-label="搜索与操作" control={<TextInput aria-label="关键词" placeholder="搜索项目" value={query} onChange={e=>setQuery(e.target.value)}/>} actions={<ButtonGroup aria-label="搜索操作"><RowActionButton motionIcon="search" onClick={()=>setStatus(query?'已搜索':'请输入关键词')}>搜索</RowActionButton><RowActionButton disabled={!query} onClick={()=>setQuery('')}>清空</RowActionButton></ButtonGroup>}/>
  <ButtonGroup aria-label="对齐方式" style={{alignSelf:'flex-start'}}>{['左对齐','居中','右对齐'].map(label=><RowActionButton key={label} aria-pressed={align===label} onClick={()=>setAlign(label)}>{label}</RowActionButton>)}</ButtonGroup>
  <span role="status">{status}</span>
 </Stack>;
}
