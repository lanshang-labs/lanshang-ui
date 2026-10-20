import {useState} from 'react';
import {Form,TextInput,MotionButton as Button,Stack,Inline,FormGrid,Select,KeyboardKey,ActionPopover,Disclosure} from '../dist/index.js';
import {OverlayPreview} from './overlay-preview';
import {NotificationPreview} from './notification-preview';
import {TaskQueuePreview} from './task-queue-preview';
import {RemoteTaskQueuePreview} from './remote-task-queue-preview';
import {TaskProgressPreview} from './task-progress-preview';
import {TaskRecoveryPreview} from './task-recovery-preview';
import {ProjectListPreview,EditFormPreview,DetailPreview} from './block-previews';
import './layout-preview.css';

const gaps=[['xs',4],['sm',8],['md',12],['lg',16],['xl',24]] as const;
const scenarios=[['fields','并排表单字段'],['list','列表工具栏'],['edit','编辑表单'],['detail','详情卡片'],['queue','任务队列'],['remote','服务端队列'],['progress','任务进度'],['recovery','回执恢复'],['overlay','浮层表单'],['notification','通知反馈']].map(([value,label])=>({value,label}));

/** Layout primitives establish the rhythm; complete business scenes remain available below. */
export function LayoutPreview(){
 const [view,setView]=useState('fields');
 const [panelOpen,setPanelOpen]=useState(false);
 return <div className="ls-layout-spec">
  <section className="ls-layout-spec-section" aria-labelledby="layout-scale-title">
   <div className="ls-layout-spec-heading"><span>01 / 间距刻度</span><h3 id="layout-scale-title">只用一套间距组织内容</h3><p>从控件内部到页面区块，按 4 / 8 / 12 / 16 / 24px 递进。留白表达层级，不靠增加边框。</p></div>
   <div className="ls-layout-scale" aria-label="五档共享间距">{gaps.map(([name,value])=><div className="ls-layout-scale-row" key={name}><strong>{name}</strong><code>{value}px</code><span className="ls-layout-scale-track"><i style={{width:`${value*7}px`}}/></span><span>{name==='xs'?'紧贴图标':name==='sm'?'同组操作':name==='md'?'说明与内容':name==='lg'?'字段与卡片':'页面大区块'}</span></div>)}</div>
  </section>
  <section className="ls-layout-spec-section" aria-labelledby="layout-primitives-title">
   <div className="ls-layout-spec-heading"><span>02 / 排列规则</span><h3 id="layout-primitives-title">纵向、横向与响应式列</h3><p>Stack 管纵向节奏，Inline 管同行操作与换行，FormGrid 管表单列宽。窄屏按原顺序排列。</p></div>
   <div className="ls-layout-patterns">
    <div className="ls-layout-pattern"><strong>Stack · 纵向</strong><Stack gap="sm"><span className="ls-layout-demo-bar">标题</span><span className="ls-layout-demo-bar">说明</span><span className="ls-layout-demo-bar">内容</span></Stack><small>相邻项目只设置一处 gap</small></div>
    <div className="ls-layout-pattern"><strong>Inline · 横向 / 换行</strong><Inline gap="sm"><span className="ls-layout-demo-chip">筛选</span><span className="ls-layout-demo-chip">刷新</span><span className="ls-layout-demo-chip">新建项目</span></Inline><small>宽度不足时自动换行，顺序不变</small></div>
    <div className="ls-layout-pattern ls-layout-pattern-wide"><strong>FormGrid · 等宽列 / 单列</strong><FormGrid><span className="ls-layout-demo-field">项目名称</span><span className="ls-layout-demo-field">负责人</span></FormGrid><small>字段顶端对齐，窄容器自动变成单列</small></div>
   </div>
  </section>
  <section className="ls-layout-spec-section" aria-labelledby="layout-scenes-title"><div className="ls-layout-spec-heading"><span>03 / 场景检验</span><h3 id="layout-scenes-title">在真实页面中验证规则</h3><p>保留完整交互场景，检查操作行换行、长校验提示、浮层与任务内容的空间关系。</p></div>
   <Disclosure className="ls-layout-scenarios" label="展开组合场景"><div className="ls-layout-scenario-body">
    <Inline aria-label="快捷键示例"><span>全局检索</span><KeyboardKey aria-label="Command 加 K">⌘ K</KeyboardKey><KeyboardKey>Ctrl K</KeyboardKey><KeyboardKey>Esc</KeyboardKey><KeyboardKey>↵</KeyboardKey></Inline>
    <ActionPopover label="浮层操作示例" open={panelOpen} onOpenChange={setPanelOpen}><p>没有遮罩，保留页面视野。Esc 或完成关闭并返回触发按钮。</p><TextInput aria-label="浮层示例输入" placeholder="收起后保留输入"/></ActionPopover>
    <Select aria-label="布局示例切换" style={{width:240,maxWidth:'100%'}} value={view} onChange={setView} options={scenarios}/>
    <p className="docs-muted">切换场景会重置未持久化的演示状态；队列与回执恢复保留本标签页的模拟记录。</p>
    {view==='fields'?<Form layout="vertical"><FormGrid><Form.Item label="类型" name="kind" rules={[{required:true,message:'请选择类型。长校验提示也应留在当前字段内，不挤压相邻输入：ValidationIdentifierWithoutSpaces_012345678901234567890123456789'}]}><Select options={[{value:'bug',label:'问题'},{value:'idea',label:'建议'}]}/></Form.Item><Form.Item label="优先级" name="priority" rules={[{required:true,message:'请选择优先级'}]}><Select options={[{value:'normal',label:'普通'},{value:'high',label:'紧急'}]}/></Form.Item></FormGrid><Button htmlType="submit">验证字段</Button></Form>:view==='list'?<ProjectListPreview/>:view==='edit'?<EditFormPreview/>:view==='detail'?<DetailPreview/>:view==='queue'?<TaskQueuePreview/>:view==='remote'?<RemoteTaskQueuePreview/>:view==='progress'?<TaskProgressPreview/>:view==='recovery'?<TaskRecoveryPreview/>:view==='overlay'?<OverlayPreview/>:<NotificationPreview/>}
   </div></Disclosure>
  </section>
 </div>;
}
