import {Select} from '../dist/index.js';
import {useEffect, useId, useState, type CSSProperties} from 'react';
import {TypographyScope} from '../dist/index.js';
import {Form, LayoutSpace as Space} from '../dist/index.js';
import {TextInput,TextArea} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {DataTable} from '../dist/index.js';
import './typography-preview.css';

const systemFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif';
const webFont = '"Inter Variable", "Noto Sans SC Variable", sans-serif';
const rows = [
  {id:1, name:'设计系统工作台', code:'UI-1024', amount:'12,580.00', state:'运行正常'},
  {id:2, name:'数据查询与权限管理', code:'API-0081', amount:'9,106.50', state:'等待审核'},
  {id:3, name:'文档中心 · Lanshang', code:'DOC-001', amount:'320.00', state:'已停用'},
];
const sample = '设计系统工作台数据查询与权限管理文档中心运行正常等待审核已停用项目名称说明负责人灰豆儿团队保存修改取消只读项目名称不能为空已保存中文标点，。；：（）￥数字辨识 Aa Bb Gg 0123456789 Il1 O0 UI-1024 API-0081 DOC-001 12,580.00';
export function TypographyPreview(){
  const [size,setSize]=useState(13), [name,setName]=useState('Lanshang UI 设计系统');
  const [description,setDescription]=useState('统一组件、交互与使用规范，让复杂业务界面保持清晰。');
  const [owner,setOwner]=useState('huidouer'), [message,setMessage]=useState('');
  const [fontState,setFontState]=useState('字体加载中，右侧暂用回退字体');
  const id=useId();
  useEffect(()=>{
    let current=true;
    Promise.all([400,500,600].flatMap(weight=>[
      document.fonts.load(`${weight} 13px "Inter Variable"`,sample),
      document.fonts.load(`${weight} 13px "Noto Sans SC Variable"`,sample),
    ])).then(results=>{if(current)setFontState(results.every(result=>result.length>0)?'对照字体已加载（400 / 500 / 600 字重）':'字体未完整加载，当前可能使用回退字体')},()=>{if(current)setFontState('字体加载失败，请刷新后重试；当前使用回退字体')});
    return ()=>{current=false};
  },[]);
  return <div className="type-comparison">
    <Space wrap><label htmlFor={`${id}-size`}>正文字号</label><Select id={`${id}-size`} value={size} onChange={setSize} options={[12,13,14].map(value=>({value,label:`${value}px`}))}/><span role="status">{fontState}</span></Space>
    <p className="docs-muted">两侧共用数据和输入值，仅字体不同。可切换全站浅暗主题，观察同一字号下的中文、数字、标点及字重。</p>
    <div className="type-comparison-grid">
      {[{key:'system',title:'当前系统字体',font:systemFont},{key:'web',title:'Inter + Noto Sans SC',font:webFont}].map(side=><TypographyScope key={side.key} fontFamily={side.font} fontSize={size}>
        <section aria-label={side.title} className="type-sample" style={{fontFamily:side.font,fontSize:size,'--ds-font':side.font} as CSSProperties}>
          <header><h3>{side.title}</h3><span>{side.key==='system'?'由当前操作系统选择字体':'本地托管的开源可变字体'}</span></header>
          <div className="type-sample-body">
            <p className="type-probe">清晰、紧凑，专注业务。<br/>Lanshang UI · Aa Bb Gg · Il1 O0<br/><span className="type-numbers">0123456789 · ￥12,580.00</span></p>
            <div className="type-weights">{[400,500,600].map(weight=><span key={weight} style={{fontWeight:weight}}>{weight} 项目概览 Overview</span>)}</div>
            <DataTable rowKey="id" pagination={false} dataSource={rows} scroll={{x:330}} columns={[{title:'项目',dataIndex:'name',width:150,render:(text,row)=><div>{text}<small className="type-record-code">{row.code}</small></div>},{title:'金额',dataIndex:'amount',width:95,align:'right',render:text=><span className="type-numbers">{text}</span>},{title:'状态',dataIndex:'state',width:85}]}/>
            <Form layout="vertical" onFinish={()=>setMessage(name.trim()?'已保存：'+name:'项目名称不能为空')}>
              <Form.Item label="项目名称" htmlFor={`${id}-${side.key}-name`} validateStatus={!name.trim()&&message?'error':undefined} help={!name.trim()&&message?'项目名称不能为空':undefined}>
                <TextInput id={`${id}-${side.key}-name`} value={name} onChange={event=>{setName(event.target.value);setMessage('')}} allowClear/>
              </Form.Item>
              <Form.Item label="项目说明" htmlFor={`${id}-${side.key}-description`}><TextArea id={`${id}-${side.key}-description`} value={description} onChange={event=>setDescription(event.target.value)} autoSize={{minRows:2,maxRows:4}}/></Form.Item>
              <Form.Item label="负责人" htmlFor={`${id}-${side.key}-owner`}><Select id={`${id}-${side.key}-owner`} value={owner} onChange={setOwner} options={[{value:'huidouer',label:'灰豆儿 · Yifan Wang'},{value:'team',label:'设计团队 · Design Team'}]}/></Form.Item>
              <Space wrap><Button type="primary" htmlType="submit">保存修改</Button><Button onClick={()=>{setName('Lanshang UI 设计系统');setDescription('统一组件、交互与使用规范，让复杂业务界面保持清晰。');setOwner('huidouer');setMessage('')}}>重置</Button><Button disabled>只读</Button></Space>
            </Form>
          </div>
        </section>
      </TypographyScope>)}
    </div>
    <p role="status">{message}</p>
  </div>;
}
