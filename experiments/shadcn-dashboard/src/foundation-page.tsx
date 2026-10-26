import {useState} from 'react';
import {Alert,Button,Checkbox,ConfigProvider,Empty,Form,Input,Modal,Segmented,Select,Switch,Table,Tabs,Tag,Tooltip} from 'antd';
import {ArrowUpRight,Check,Eye,Plus,RotateCcw,Search,Settings2} from 'lucide-react';
import {BaseLayout} from './components/layouts/base-layout';
import {useLab} from './lab-context';
import {foundationTheme} from './foundation-profile';
import './foundation.css';

type Space={id:string;name:string;description:string;owner:string;status:'active'|'pending'|'archived'};
const initialSpaces:Space[]=[
 {id:'DS-001',name:'设计系统',description:'组件、规范与视觉基准',owner:'设计团队',status:'active'},
 {id:'WS-002',name:'协作工作台',description:'项目资料与协作记录',owner:'产品团队',status:'active'},
 {id:'DOC-003',name:'文档中心',description:'接口与交付文档',owner:'研发团队',status:'pending'},
 {id:'ARC-004',name:'历史归档',description:'已结束项目的参考资料',owner:'设计团队',status:'archived'},
];
const statusLabels={active:'进行中',pending:'待确认',archived:'已归档'};

export function FoundationPage(){
 const {dark}=useLab();
 const [candidate,setCandidate]=useState(true);
 return <BaseLayout><div className="foundation-page px-6 space-y-6">
  <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight">界面基础</h1><p className="text-muted-foreground mt-2">统一日常控件与工作界面，保留成熟的业务交互。</p></div><Segmented aria-label="基础视觉对比" value={candidate?'candidate':'current'} onChange={value=>setCandidate(value==='candidate')} options={[{label:'现行主题 Tokens',value:'current'},{label:'候选方案',value:'candidate'}]}/></header>
  <ConfigProvider prefixCls="lf-ant" iconPrefixCls="lf-icon" componentSize="middle" wave={{disabled:true}} button={{autoInsertSpace:false}} theme={foundationTheme(dark,candidate)}>
   <div className="foundation-scope" data-candidate={candidate} data-mode={dark?'dark':'light'}><FoundationContent/></div>
  </ConfigProvider>
 </div></BaseLayout>;
}
function FoundationContent(){
 const [form]=Form.useForm();const [createForm]=Form.useForm();
 const [spaces,setSpaces]=useState(initialSpaces);
 const [query,setQuery]=useState(''),[filter,setFilter]=useState('all'),[saved,setSaved]=useState('');
 const [createOpen,setCreateOpen]=useState(false),[selected,setSelected]=useState<Space|null>(null);
 const filtered=spaces.filter(space=>space.name.includes(query.trim())&&(filter==='all'||space.status===filter));
 const resetFilter=()=>{setQuery('');setFilter('all');};
 return <>
  <div className="foundation-grid">
   <section className="foundation-panel foundation-controls" aria-labelledby="foundation-controls-title"><header className="foundation-panel-header"><div><h2 id="foundation-controls-title">交互与状态</h2><p>紧凑尺寸、统一边界与清晰反馈。</p></div><span className="foundation-icon"><Settings2 size={16} aria-hidden="true"/></span></header>
    <div className="foundation-panel-body">
     <div className="foundation-sample"><span className="foundation-label">操作层级</span><div className="foundation-inline"><Button type="primary" icon={<Plus size={14}/>} onClick={()=>setCreateOpen(true)}>创建空间</Button><Button onClick={()=>setSelected(spaces[0])}>查看详情</Button><Tooltip title="重置筛选"><Button type="text" aria-label="重置筛选" icon={<RotateCcw size={15}/>} onClick={resetFilter}/></Tooltip><Button disabled>无权限</Button></div></div>
     <div className="foundation-sample"><span className="foundation-label">内容切换</span><Tabs defaultActiveKey="overview" items={[{key:'overview',label:'概览',children:<p className="foundation-tab-copy">所有资料与团队成员保持在同一个空间。</p>},{key:'activity',label:'活动',children:<p className="foundation-tab-copy">当前没有新的活动记录。</p>},{key:'access',label:'权限',children:<p className="foundation-tab-copy">仅团队成员可以访问此空间。</p>}]}/></div>
     <div className="foundation-sample foundation-toggle-grid"><Checkbox defaultChecked>接收更新提醒</Checkbox><Checkbox>包含归档项目</Checkbox><label className="foundation-switch-row"><span>紧凑视图</span><Switch size="small" defaultChecked aria-label="紧凑视图"/></label><label className="foundation-switch-row"><span>自动同步</span><Switch size="small" disabled aria-label="自动同步"/></label></div>
     <Alert type="info" showIcon message="更改仅保存在当前演示会话"/>
    </div>
   </section>
   <section className="foundation-panel foundation-settings" aria-labelledby="foundation-settings-title"><header className="foundation-panel-header"><div><h2 id="foundation-settings-title">空间设置</h2><p>字段、选择与保存使用同一套尺寸。</p></div><Tooltip title="重置设置"><Button type="text" aria-label="重置空间设置" icon={<RotateCcw size={15}/>} onClick={()=>{form.resetFields();setSaved('');}}/></Tooltip></header>
    <div className="foundation-panel-body"><Form form={form} name="foundation-settings" layout="vertical" initialValues={{name:'设计系统',access:'team',description:'让组件、规范与协作资料保持一致。'}} onFinish={values=>setSaved(`已保存「${values.name.trim()}」的本地设置`)} onValuesChange={()=>setSaved('')}>
     <Form.Item name="name" label="空间名称" rules={[{required:true,whitespace:true,message:'请输入空间名称'}]}><Input placeholder="为空间命名" maxLength={40}/></Form.Item>
     <Form.Item name="access" label="访问范围"><Select options={[{value:'team',label:'团队成员'},{value:'private',label:'仅自己'},{value:'public',label:'所有项目成员'}]}/></Form.Item>
     <Form.Item name="description" label="说明"><Input.TextArea rows={2} placeholder="补充简短说明" maxLength={120}/></Form.Item>
     <div className="foundation-form-footer"><span role="status" className="foundation-save-status">{saved&&<><Check size={14} aria-hidden="true"/>{saved}</>}</span><Button type="primary" htmlType="submit">保存更改</Button></div>
    </Form></div>
   </section>
  </div>
  <section className="foundation-panel foundation-spaces" aria-labelledby="foundation-spaces-title"><header className="foundation-panel-header"><div><h2 id="foundation-spaces-title">项目空间 <span className="foundation-count">{spaces.length}</span></h2><p>资料、成员与当前状态。</p></div><Button type="primary" icon={<Plus size={14}/>} onClick={()=>setCreateOpen(true)}>新建空间</Button></header>
   <div className="foundation-panel-body"><div className="foundation-toolbar"><Input aria-label="搜索空间" prefix={<Search size={14} aria-hidden="true"/>} placeholder="搜索空间…" allowClear value={query} onChange={event=>setQuery(event.target.value)}/><Select aria-label="筛选空间状态" value={filter} onChange={setFilter} options={[{value:'all',label:'全部状态'},...Object.entries(statusLabels).map(([value,label])=>({value,label}))]}/><Tooltip title="清除筛选"><Button aria-label="清除空间筛选" icon={<RotateCcw size={14}/>} onClick={resetFilter}/></Tooltip></div>
    <Table<Space> size="small" rowKey="id" dataSource={filtered} scroll={{x:590}} pagination={{pageSize:3,size:'small',showSizeChanger:false,hideOnSinglePage:true}} locale={{emptyText:<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="没有匹配的空间"><Button onClick={resetFilter}>重置筛选</Button></Empty>}} columns={[
     {title:'空间',dataIndex:'name',render:(_,space)=><div className="foundation-space-name"><strong>{space.name}</strong><span>{space.description}</span></div>},
     {title:'负责人',dataIndex:'owner',width:120},
     {title:'状态',dataIndex:'status',width:100,render:(status:Space['status'])=><Tag className={`foundation-status is-${status}`}>{statusLabels[status]}</Tag>},
     {title:'操作',width:64,align:'center',render:(_,space)=><Tooltip title="查看详情"><Button type="text" size="small" aria-label={`查看${space.name}`} icon={<Eye size={14}/>} onClick={()=>setSelected(space)}/></Tooltip>},
    ]}/>
   </div>
  </section>
  <footer className="foundation-source-note"><span>coss ui 中性视觉参考 · Ant Design 业务交互 · 本地候选</span><a href="https://coss.com/ui/docs/styling" target="_blank" rel="noreferrer">查看视觉来源 <ArrowUpRight size={12} aria-hidden="true"/></a></footer>
  <Modal title="新建空间" open={createOpen} onCancel={()=>setCreateOpen(false)} footer={null} destroyOnClose><Form form={createForm} name="foundation-create" layout="vertical" preserve={false} onFinish={values=>{setSpaces(current=>[...current,{id:`LOCAL-${current.length+1}`,name:values.name.trim(),description:'当前演示会话新建',owner:'当前用户',status:'pending'}]);createForm.resetFields();setCreateOpen(false);}}><Form.Item name="name" label="新空间名称" rules={[{required:true,whitespace:true,message:'请输入新空间名称'}]}><Input autoFocus maxLength={40}/></Form.Item><div className="foundation-modal-actions"><Button onClick={()=>setCreateOpen(false)}>取消</Button><Button type="primary" htmlType="submit">创建空间</Button></div></Form></Modal>
  <Modal title={selected?.name??'空间详情'} open={!!selected} onCancel={()=>setSelected(null)} footer={null}><dl className="foundation-detail">{selected&&<><div><dt>空间编号</dt><dd>{selected.id}</dd></div><div><dt>负责人</dt><dd>{selected.owner}</dd></div><div><dt>状态</dt><dd>{statusLabels[selected.status]}</dd></div><div><dt>说明</dt><dd>{selected.description}</dd></div></>}</dl></Modal>
 </>;
}
