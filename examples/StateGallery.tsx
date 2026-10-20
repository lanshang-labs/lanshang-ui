import {Select} from '../dist/index.js';
import {MotionIcon,MotionButton} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
import {AsyncActionDemo} from './AsyncActionDemo';
import React, {useRef, useState} from 'react';
import {CountBadge as Badge,CategoryTag as Tag} from '../dist/index.js';
import {Form, LayoutSpace as Space, TabStrip as Tabs, Dialog as Modal, DrawerPanel as Drawer, MenuDropdown as Dropdown, HintTooltip as Tooltip} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {TextInput,TextArea} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {BeautifulSurface, BeautifulTabs, TaskRows, ContentState, DataTable, NavigationLink, RowActionButton, SearchField, StatusTag,Disclosure} from '../dist/index.js';

function StatePrimer(){
 const [selected,setSelected]=useState(true);
 return <section className="gallery-state-primer" aria-labelledby="gallery-states-title"><header><span>状态基准</span><h3 id="gallery-states-title">先区分操作位置与当前结果</h3><p>悬停和键盘焦点只提示“将要操作”；选中、禁用、加载和错误才表达持续状态。逐个点击或用 Tab 检查。</p></header><div className="gallery-state-grid">
  <div><strong>默认 / 悬停 / 焦点</strong><Button>将鼠标移入或按 Tab</Button><small>不改变已选项或业务结果</small></div>
  <div><strong>选中</strong><RowActionButton aria-pressed={selected} onClick={()=>setSelected(!selected)}>{selected?'当前视图':'切换视图'}</RowActionButton><small>底片持续，焦点仍独立显示</small></div>
  <div><strong>禁用 / 加载</strong><span className="gallery-state-actions"><Button disabled>不可操作</Button><Button loading>处理中</Button></span><small>保留文字，不触发重复操作</small></div>
  <div><strong>错误</strong><TextInput aria-label="错误状态示例" status="error" placeholder="请输入有效内容"/><small>描边与说明一起传达问题</small></div>
 </div></section>;
}

export function StateGallery(){
 const [modal,setModal]=useState(false),[drawer,setDrawer]=useState(false),[confirm,setConfirm]=useState(false),[query,setQuery]=useState(''),[notice,setNotice]=useState(''),[form]=Form.useForm();
 const [selected,setSelected]=useState<React.Key[]>(['project']),[tab,setTab]=useState('overview');
 const [menuOpen,setMenuOpen]=useState(false),[mainForm]=Form.useForm();
 const opener=useRef<HTMLElement|null>(null),menuTrigger=useRef<HTMLButtonElement>(null);
 const openOverlay=(kind:'edit'|'detail'|'delete',trigger:HTMLElement|null)=>{opener.current=trigger;if(kind==='edit'){form.resetFields();setModal(true)}else if(kind==='detail')setDrawer(true);else setConfirm(true)};
 const returnFocus=()=>{if(opener.current?.isConnected)opener.current.focus({preventScroll:true});opener.current=null};
 const rows=[{id:'project',name:'项目工作台',state:'正常'},{id:'docs',name:'文档中心',state:'待确认'}].filter(x=>x.name.includes(query));
 return <div className="gallery-stack"><StatePrimer/><Disclosure className="gallery-scenarios" label="展开完整交互场景：搜索、表格、表单与浮层"><div className="gallery-stack">
 <FeedbackPanel type="info" message="仅使用本地样例：无网络请求，不更改业务数据。可切换主题并用 Tab 检查焦点。"/>
 <BeautifulSurface title="01 / 搜索、链接与操作"><Space wrap><SearchField aria-label="筛选样例项目" placeholder="搜索项目" value={query} onChange={setQuery}/><Dropdown open={menuOpen} autoFocus onOpenChange={setMenuOpen} menu={{items:[{key:'detail',label:'查看详情'},{key:'disabled',label:'暂无权限',disabled:true},{key:'delete',label:'删除样例',danger:true}],onClick:({key})=>{setMenuOpen(false);openOverlay(key as 'detail'|'delete',menuTrigger.current)}}} trigger={['click']}><Button ref={menuTrigger} aria-haspopup="menu" aria-expanded={menuOpen} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setMenuOpen(true)}}}>更多操作<MotionIcon name="expand" active={menuOpen} size={14}/></Button></Dropdown></Space>
 <div className="gallery-gap"><DataTable rowKey="id" rowSelection={{selectedRowKeys:selected,onChange:setSelected,getCheckboxProps:row=>({name:row.id,"aria-label":`选择${row.name}`})}} pagination={false} dataSource={rows} locale={{emptyText:<ContentState title="没有匹配的项目" description="试试更短的关键词。" action={<Button onClick={()=>setQuery('')}>清空搜索</Button>}/>}} columns={[{title:'项目',dataIndex:'name',render:(name)=><NavigationLink href="#/guide/usage">{name}</NavigationLink>},{title:'状态',dataIndex:'state',render:(state)=><StatusTag tone={state==='正常'?'success':'warning'}>{state}</StatusTag>},{title:'操作',render:()=> <Space size={2}><RowActionButton size="small" onClick={event=>openOverlay('detail',event.currentTarget)}>详情</RowActionButton><RowActionButton size="small" motionIcon="edit" onClick={event=>openOverlay('edit',event.currentTarget)}>编辑</RowActionButton><RowActionButton size="small" motionIcon="delete" danger onClick={event=>openOverlay('delete',event.currentTarget)}>删除</RowActionButton></Space>} ]}/></div>
 <p className="gallery-note">名称链接保留外链标识，悬停时显示下划线；行内操作使用按钮。支持 Enter / ↓ 打开菜单、方向键跳过禁用项、Escape 关闭；关闭浮层后返回原操作按钮。</p></BeautifulSurface>
 <BeautifulSurface title="选中、悬停与键盘焦点"><p className="gallery-note">导航与页签用滑动底色标记当前项；悬停轻微提亮，键盘焦点独立显示，不改变当前内容。任务卡片展开详情，表格多选保留所有已选标识。</p><BeautifulTabs items={[{key:'overview',label:'概览'},{key:'activity',label:'活动'},{key:'disabled',label:'无权限',disabled:true}]} activeKey={tab} onChange={setTab}/><Tabs items={[{key:'summary',label:'基本信息',children:'使用 Tab 切换焦点，按 Enter 或空格选中。'},{key:'history',label:'变更记录',children:'焦点边框与滑动底色分别表达操作位置与当前内容。'}]}/><TaskRows labels={{completed:'已完成',failed:'失败'}} rows={[{key:'check',label:'检查项目配置',amount:'3 项',status:'done',details:[{label:'配置校验',meta:'通过'}]},{key:'build',label:'构建项目',amount:'等待开始',status:'queued',details:[{label:'构建队列',meta:'等待'}]}]}/></BeautifulSurface>
 <BeautifulSurface title="文字与图标对齐"><Space direction="vertical" size={16} style={{width:'100%'}}>
 <Space wrap><StatusTag tone="warning">待确认</StatusTag><StatusTag tone="success" icon={<MotionIcon name="save" size={14}/>}>已完成 Done</StatusTag><Tag>API v2.3</Tag><Tag closable>设计稿 Draft 12</Tag></Space>
 <Space wrap size={16}><Badge count={8} title="8 条消息"/><Badge count={12} title="12 条消息"/><Badge count={120} title="120 条消息"/><Badge count={8} size="small" title="8 条紧凑消息"/><Badge status="success" text="同步完成 Synced"/><Badge status="warning" text="待核对 12 项"/></Space>
 {(['small','middle','large'] as const).map(size=><Space wrap key={size}><Button size={size} type="primary" motionIcon="add" onClick={()=>setNotice('已点击创建样例。')}>创建 New</Button><Button size={size} motionIcon="download" onClick={()=>setNotice('已点击导出样例。')}>导出 12 项</Button><Button size={size} disabled motionIcon="save">已完成 Done</Button></Space>)}
 <p className="gallery-note">标签 12px，计数徽标 12px（紧凑型 11px）；数字等宽排列。图标随控件字号缩放，中英文使用同一行高，不对单个词语添加位置偏移。可切换浅暗主题检查。</p>
 </Space></BeautifulSurface>
 <BeautifulSurface title="02 / 表单与反馈"><div className="gallery-two"><Form name="gallery-main" form={mainForm} onFinishFailed={({errorFields})=>mainForm.getFieldInstance(errorFields[0]?.name)?.focus?.()} layout="vertical" onFinish={()=>setNotice('校验通过，仅演示提交反馈。')}><Form.Item label="项目名称" name="name" rules={[{required:true,message:'请填写项目名称'}]}><TextInput placeholder="留空提交以查看校验"/></Form.Item><Form.Item label="环境" name="environment" initialValue="test"><Select options={[{value:'test',label:'测试环境'},{value:'stage',label:'预发布环境'},{value:'product',label:'正式环境',disabled:true}]}/></Form.Item><Form.Item name="notify" valuePropName="checked"><Checkbox>启用通知</Checkbox></Form.Item><Button htmlType="submit" type="primary">验证表单</Button></Form><div className="gallery-stack"><TextInput aria-label="只读示例" value="只读内容仍可选择复制" readOnly/><TextInput aria-label="禁用示例" value="无权限编辑" disabled/><TextInput aria-label="错误状态示例" status="error" placeholder="错误状态"/><TextInput aria-label="警告状态示例" status="warning" placeholder="警告状态"/><Space wrap><Button disabled>不可操作</Button><Button loading>处理中</Button><Tooltip title="请先选择项目"><span><Button disabled>部署</Button></span></Tooltip></Space><p className="gallery-note">错误保留文字说明；禁用按钮如需解释，用旁边说明或 Tooltip。</p></div></div>{notice&&<FeedbackPanel className="gallery-gap" type="success" message={notice}/>}</BeautifulSurface>
 <BeautifulSurface title="03 / 加载、空状态与失败"><div className="gallery-two"><ContentState loading title="正在加载" description="加载中不提前展示空数据结论。"/><ContentState title="读取失败" description="未能连接样例服务。" action={<MotionButton motionIcon="retry" onClick={()=>setNotice('已点击重试，演示不发起请求。')}>重试</MotionButton>}/></div><Space wrap>{(['neutral','info','success','warning','error'] as const).map((tone,i)=><StatusTag key={tone} tone={tone}>{['未开始','进行中','已完成','待确认','失败'][i]}</StatusTag>)}</Space></BeautifulSurface>
 <AsyncActionDemo/>
 <Modal title="编辑项目 · 本地样例" open={modal} focusTriggerAfterClose={false} afterClose={returnFocus} afterOpenChange={open=>{if(open)form.getFieldInstance("name")?.focus?.()}} onCancel={()=>setModal(false)} onOk={()=>form.submit()} okText="保存" cancelText="取消"><Form name="gallery-edit" form={form} onFinishFailed={({errorFields})=>form.getFieldInstance(errorFields[0]?.name)?.focus?.()} layout="vertical" onFinish={()=>{setNotice('样例已保存，未写入业务系统。');setModal(false);}}><Form.Item name="name" label="名称" rules={[{required:true,message:'请填写名称'}]}><TextInput/></Form.Item><Form.Item name="description" label="说明"><TextArea rows={3}/></Form.Item></Form></Modal>
 <Drawer title="项目详情" open={drawer} afterOpenChange={open=>{if(!open)returnFocus()}} onClose={()=>setDrawer(false)} width="min(400px, 100vw)"><p>抽屉用于保留当前列表上下文的详情查看。</p><FeedbackPanel type="info" message="支持 Escape 关闭，关闭后检查焦点回到触发按钮。"/><Space className="gallery-gap"><StatusTag tone="success">正常</StatusTag><NavigationLink href="#/guide/usage" onClick={()=>{opener.current=null;setDrawer(false)}}>查看使用规范</NavigationLink></Space></Drawer>
 <Modal title="删除样例？" open={confirm} focusTriggerAfterClose={false} afterClose={returnFocus} onCancel={()=>setConfirm(false)} onOk={()=>{setConfirm(false);setNotice('已确认删除示例，列表数据未实际删除。');}} okText="确认删除" cancelText="取消" okButtonProps={{danger:true}}><p>真实业务应写明删除对象和影响，并由应用完成权限检查和请求。</p></Modal>
 </div></Disclosure></div>;
}

export function UsageGuide(){return <section id="usage" className="gallery-guide"><h2>组件选择与验收约定</h2><p>Beautiful UI 提供视觉方向，Ant Design 保留复杂交互，lanshang-ui 提供统一入口。业务状态、权限、请求由应用拥有。</p><DataTable rowKey="scenario" density="comfortable" pagination={false} scroll={{x:760}} dataSource={[
 ['项目名称、页面跳转','NavigationLink','使用真实 href；链接保留外链标识，悬停显示下划线；外链保留 target / rel。'],
 ['行内编辑、删除','RowActionButton','操作按钮不伪装成链接；删除用 danger，确认与权限由应用负责。'],
 ['搜索','SearchField','即时筛选用 onChange；提交式查询用 onSearch，明确清空行为。'],
 ['业务状态','StatusTag','应用明确映射语义；状态必须有文字，不能只靠颜色。'],
 ['版本、分类、HTTP 方法','CategoryTag','分类标签与业务状态分开；继承同一主题，不强行赋予成功/失败语义。'],
 ['悬停、选中与焦点','Provider / 公共交互样式','悬停用 raised，选中用 selected；键盘焦点用 2px accent 轮廓。焦点移动不等于业务选中，禁用项不显示可操作反馈。'],
 ['表格、表单、弹窗','DataTable / Form / Dialog','校验失败聚焦首个错误字段；打开编辑弹窗聚焦首个输入。记录实际触发按钮，在关闭动画结束后恢复焦点。'],
 ['菜单打开浮层','MenuDropdown / Dialog / DrawerPanel','菜单 autoFocus；Enter 或方向下键打开。菜单项打开浮层时，返回目标是菜单按钮；真正导航离页时不强制抢回焦点。'],
 ['空、加载、失败','ContentState / FeedbackPanel','根据真实请求状态显示；失败提供原因和可用的恢复入口。'],
 ].map(([scenario,component,requirement])=>({scenario,component,requirement}))} columns={[{title:"场景",dataIndex:"scenario",width:160},{title:"选用",dataIndex:"component",width:190},{title:"要求",dataIndex:"requirement"}]}/><h3>每次接入检查</h3><ul><li>浅色和暗色：正文、次要文字、边框和危险状态清晰可辨。</li><li>正常、悬停、键盘焦点、禁用、加载、错误和空结果均可理解。</li><li>窄窗口和长文本：工具栏换行，表格可横向滚动，操作入口可访问。</li><li>Tab、Enter、Escape 可操作；弹窗关闭后焦点返回，图标按钮具有名称。</li><li>设计稿、图片、代码语法与业务分类颜色不被整页主题覆盖。</li></ul><p>当前页是视觉与交互基准，不代表平台全部页面或辅助技术已完成验收。</p></section>}
