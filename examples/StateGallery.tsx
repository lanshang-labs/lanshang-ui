import React, {useState} from 'react';
import {Alert, Button, Checkbox, Drawer, Dropdown, Form, Input, Modal, Select, Space, Tooltip} from 'antd';
import {BeautifulSurface, ContentState, DataTable, NavigationLink, RowActionButton, SearchField, StatusTag} from '../dist/index.js';

export function StateGallery(){
 const [modal,setModal]=useState(false),[drawer,setDrawer]=useState(false),[confirm,setConfirm]=useState(false),[query,setQuery]=useState(''),[notice,setNotice]=useState(''),[form]=Form.useForm();
 const rows=[{id:'project',name:'项目工作台',state:'正常'},{id:'docs',name:'文档中心',state:'待确认'}].filter(x=>x.name.includes(query));
 return <div className="gallery-stack">
 <Alert type="info" showIcon message="仅使用本地样例：无网络请求，不更改业务数据。可切换主题并用 Tab 检查焦点。"/>
 <BeautifulSurface title="01 / 搜索、链接与操作"><Space wrap><SearchField aria-label="筛选样例项目" placeholder="搜索项目" value={query} onChange={setQuery}/><Dropdown menu={{items:[{key:'detail',label:'查看详情'},{key:'disabled',label:'暂无权限',disabled:true},{key:'delete',label:'删除样例',danger:true}],onClick:({key})=>key==='delete'?setConfirm(true):setDrawer(true)}} trigger={['click']}><Button>更多操作</Button></Dropdown></Space>
 <div className="gallery-gap"><DataTable rowKey="id" pagination={false} dataSource={rows} locale={{emptyText:<ContentState title="没有匹配的项目" description="试试更短的关键词。" action={<Button onClick={()=>setQuery('')}>清空搜索</Button>}/>}} columns={[{title:'项目',dataIndex:'name',render:(name)=><NavigationLink href="#usage">{name}</NavigationLink>},{title:'状态',dataIndex:'state',render:(state)=><StatusTag tone={state==='正常'?'success':'warning'}>{state}</StatusTag>},{title:'操作',render:()=> <Space size={2}><RowActionButton onClick={()=>setDrawer(true)}>详情</RowActionButton><RowActionButton onClick={()=>{form.resetFields();setModal(true);}}>编辑</RowActionButton><RowActionButton danger onClick={()=>setConfirm(true)}>删除</RowActionButton></Space>} ]}/></div>
 <p className="gallery-note">名称链接始终带下划线；行内操作使用按钮。此处链接跳至本页使用规范。</p></BeautifulSurface>
 <BeautifulSurface title="02 / 表单与反馈"><div className="gallery-two"><Form name="gallery-main" layout="vertical" onFinish={()=>setNotice('校验通过，仅演示提交反馈。')}><Form.Item label="项目名称" name="name" rules={[{required:true,message:'请填写项目名称'}]}><Input placeholder="留空提交以查看校验"/></Form.Item><Form.Item label="环境" name="environment" initialValue="test"><Select options={[{value:'test',label:'测试环境'},{value:'product',label:'正式环境',disabled:true}]}/></Form.Item><Form.Item name="notify" valuePropName="checked"><Checkbox>启用通知</Checkbox></Form.Item><Button htmlType="submit" type="primary">验证表单</Button></Form><div className="gallery-stack"><Input aria-label="只读示例" value="只读内容仍可选择复制" readOnly/><Input aria-label="禁用示例" value="无权限编辑" disabled/><Input aria-label="错误状态示例" status="error" placeholder="错误状态"/><Input aria-label="警告状态示例" status="warning" placeholder="警告状态"/><Space wrap><Button disabled>不可操作</Button><Button loading>处理中</Button><Tooltip title="请先选择项目"><span><Button disabled>部署</Button></span></Tooltip></Space><p className="gallery-note">错误保留文字说明；禁用按钮如需解释，用旁边说明或 Tooltip。</p></div></div>{notice&&<Alert className="gallery-gap" type="success" showIcon message={notice}/>}</BeautifulSurface>
 <BeautifulSurface title="03 / 加载、空状态与失败"><div className="gallery-two"><ContentState loading title="正在加载" description="加载中不提前展示空数据结论。"/><ContentState title="读取失败" description="未能连接样例服务。" action={<Button onClick={()=>setNotice('已点击重试，演示不发起请求。')}>重试</Button>}/></div><Space wrap>{(['neutral','info','success','warning','error'] as const).map((tone,i)=><StatusTag key={tone} tone={tone}>{['未开始','进行中','已完成','待确认','失败'][i]}</StatusTag>)}</Space></BeautifulSurface>
 <Modal title="编辑项目 · 本地样例" open={modal} onCancel={()=>setModal(false)} onOk={()=>form.submit()} okText="保存" cancelText="取消"><Form name="gallery-edit" form={form} layout="vertical" onFinish={()=>{setNotice('样例已保存，未写入业务系统。');setModal(false);}}><Form.Item name="name" label="名称" rules={[{required:true,message:'请填写名称'}]}><Input/></Form.Item><Form.Item name="description" label="说明"><Input.TextArea rows={3}/></Form.Item></Form></Modal>
 <Drawer title="项目详情" open={drawer} onClose={()=>setDrawer(false)} width={400}><p>抽屉用于保留当前列表上下文的详情查看。</p><Alert showIcon type="info" message="支持 Escape 关闭，关闭后检查焦点回到触发按钮。"/><Space className="gallery-gap"><StatusTag tone="success">正常</StatusTag><NavigationLink href="#usage" onClick={()=>setDrawer(false)}>查看使用规范</NavigationLink></Space></Drawer>
 <Modal title="删除样例？" open={confirm} onCancel={()=>setConfirm(false)} onOk={()=>{setConfirm(false);setNotice('已确认删除示例，列表数据未实际删除。');}} okText="确认删除" cancelText="取消" okButtonProps={{danger:true}}><p>真实业务应写明删除对象和影响，并由应用完成权限检查和请求。</p></Modal>
 </div>;
}

export function UsageGuide(){return <section id="usage" className="gallery-guide"><h2>组件选择与验收约定</h2><p>Beautiful UI 提供视觉方向，Ant Design 保留复杂交互，lanshang-ui 提供统一入口。业务状态、权限、请求由应用拥有。</p><table><thead><tr><th>场景</th><th>选用</th><th>要求</th></tr></thead><tbody>{[
 ['项目名称、页面跳转','NavigationLink','使用真实 href；名称链接常显下划线；外链保留 target / rel。'],
 ['行内编辑、删除','RowActionButton','操作按钮不伪装成链接；删除用 danger，确认与权限由应用负责。'],
 ['搜索','SearchField','即时筛选用 onChange；提交式查询用 onSearch，明确清空行为。'],
 ['业务状态','StatusTag','应用明确映射语义；状态必须有文字，不能只靠颜色。'],
 ['版本、分类、HTTP 方法','AntD Tag','分类标签与业务状态分开；继承同一主题，不强行赋予成功/失败语义。'],
 ['表格、表单、弹窗','DataTable / AntD','保留分页、校验、焦点和键盘行为；通过 Provider 统一主题。'],
 ['空、加载、失败','ContentState / Alert','根据真实请求状态显示；失败提供原因和可用的恢复入口。'],
 ].map(row=><tr key={row[0]}>{row.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table><h3>每次接入检查</h3><ul><li>浅色和暗色：正文、次要文字、边框和危险状态清晰可辨。</li><li>正常、悬停、键盘焦点、禁用、加载、错误和空结果均可理解。</li><li>窄窗口和长文本：工具栏换行，表格可横向滚动，操作入口可访问。</li><li>Tab、Enter、Escape 可操作；弹窗关闭后焦点返回，图标按钮具有名称。</li><li>设计稿、图片、代码语法与业务分类颜色不被整页主题覆盖。</li></ul><p>当前页是视觉与交互基准，不代表平台全部页面或辅助技术已完成验收。</p></section>}
