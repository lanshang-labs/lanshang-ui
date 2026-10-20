import {useEffect, useRef, useState} from 'react';
import {Form, LayoutSpace as Space} from '../dist/index.js';
import {TextInput} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {DataTable, RowActionButton} from '../dist/index.js';

export function EditableTablePreview({virtualized=false}:{virtualized?:boolean}={}){
 const [rows,setRows]=useState([{id:1,name:'项目工作台',owner:'研发团队'},{id:2,name:'文档中心',owner:'设计团队'}]);
 const [editing,setEditing]=useState<number|null>(null),[saving,setSaving]=useState(false),[fail,setFail]=useState(false),[notice,setNotice]=useState('');
 const [form]=Form.useForm();
 const opener=useRef<number|null>(null),buttons=useRef(new Map<number,HTMLElement>()),timer=useRef<ReturnType<typeof setTimeout>>();
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 useEffect(()=>{if(editing===null){buttons.current.get(opener.current??-1)?.focus()}else{form.focusField('name')}},[editing,form]);
 function save(values:{name:string;owner:string}){
  if(saving)return;
  setSaving(true);setNotice('正在保存…');
  timer.current=setTimeout(()=>{
   setSaving(false);
   if(fail){setNotice('保存失败，输入已保留，请关闭失败模拟后重试。');return;}
   setRows(previous=>previous.map(row=>row.id===editing?{...row,name:values.name.trim(),owner:values.owner.trim()}:row));
   setNotice('已保存到本地样例。');setEditing(null);
  },650);
 }
 return <section aria-label="行编辑示例">
  <Space wrap><Checkbox checked={fail} disabled={saving} onChange={e=>setFail(e.target.checked)}>模拟保存失败</Checkbox><span className="docs-muted">同一时间编辑一行；保存失败保留输入。</span></Space>
  <Form form={form} component="form" onFinish={save} onFinishFailed={({errorFields})=>form.focusField(errorFields[0].name)} className="docs-demo-gap" aria-busy={saving}>
   <DataTable virtual={virtualized} rowKey="id" dataSource={rows} pagination={false} scroll={{x:580,y:virtualized?160:undefined}} columns={[
    {title:'项目名称',dataIndex:'name',width:210,render:(value,row)=>editing===row.id?<Form.Item name="name" rules={[{required:true,whitespace:true,message:'请输入项目名称'},{max:60,message:'最多 60 个字符'}]} style={{margin:0}}><TextInput size="small" aria-label="编辑项目名称" disabled={saving}/></Form.Item>:value},
    {title:'负责人',dataIndex:'owner',width:190,render:(value,row)=>editing===row.id?<Form.Item name="owner" rules={[{required:true,whitespace:true,message:'请输入负责人'}]} style={{margin:0}}><TextInput size="small" aria-label="编辑负责人" disabled={saving}/></Form.Item>:value},
    {title:'操作',key:'actions',width:180,render:(_,row)=>editing===row.id?<Space><RowActionButton size="small" motionIcon="save" htmlType="submit" loading={saving}>保存</RowActionButton><RowActionButton size="small" disabled={saving} onClick={()=>{form.resetFields();setEditing(null);setNotice('已取消，原记录保持不变。')}}>取消</RowActionButton></Space>:<RowActionButton size="small" motionIcon="edit" ref={node=>{if(node)buttons.current.set(row.id,node);else buttons.current.delete(row.id)}} aria-label={`编辑${row.name}`} disabled={editing!==null} onClick={event=>{opener.current=row.id;form.setFieldsValue({name:row.name,owner:row.owner});setEditing(row.id);setNotice('')}}>编辑</RowActionButton>},
   ]}/>
  </Form>
  <p role="status" className="docs-muted">{notice||'数据仅保存在本页内存中，刷新后重置。'}</p>
 </section>;
}
