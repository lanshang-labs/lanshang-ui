import {IconMotionPreview} from './icon-motion-preview';
import {MotionSelectionPreview} from './motion-selection-preview';
import {SizePreview} from './size-preview';
import {useState} from 'react';
import {InputGroup,ButtonGroup,RowActionButton,Select,Alert,DataTable,motion,foundations,useTheme,TextInput,ToggleSwitch} from '../dist/index.js';
import './motion-preview.css';
export function MotionPreview(){
 const {mode,setMode}=useTheme();
 const [reduce,setReduce]=useState(false),[narrow,setNarrow]=useState(false),[selected,setSelected]=useState('居中'),[value,setValue]=useState('dev'),[query,setQuery]=useState(''),[status,setStatus]=useState('等待操作'),[busy,setBusy]=useState(false);
 return <div className="motion-lab">
  <div className="motion-lab-controls motion-lab-controls--preview">
   <label><ToggleSwitch aria-label="样例暗色主题" checked={mode==='dark'} onChange={checked=>setMode(checked?'dark':'light')}/> 暗色</label>
   <label><ToggleSwitch aria-label="320px 窄屏样例" checked={narrow} onChange={setNarrow}/> 窄屏</label>
   <label><ToggleSwitch aria-label="减少样例动态效果" checked={reduce} onChange={setReduce}/> 减少动态效果</label>
  </div>
  <SizePreview reduce={reduce} narrow={narrow}/>
  <div className="motion-lab-stage" data-ls-motion={reduce?'reduce':'system'} style={{maxWidth:narrow?320:520}}>
   <section><h3>输入与动作</h3>
    <InputGroup aria-label="动效连接示例" control={<Select aria-label="动效连接" value={value} onChange={setValue} getPopupContainer={node=>node.parentElement!} options={[{value:'dev',label:'开发环境'},{value:'long',label:'生产环境 · 华东一区 · 长名称截断与选择验证'},{value:'disabled',label:'维护中（不可选）',disabled:true}]}/>} actions={<ButtonGroup><RowActionButton aria-label="动效刷新" motionIcon="refresh" onClick={()=>setStatus('刷新反馈已触发')} title="刷新"/></ButtonGroup>}/>
    <InputGroup aria-label="动效搜索示例" control={<TextInput aria-label="动效关键词" placeholder="搜索项目" value={query} onChange={e=>setQuery(e.target.value)}/>} actions={<ButtonGroup><RowActionButton aria-label="动效搜索" motionIcon="search" onClick={()=>setStatus(query?'已搜索：'+query:'请输入关键词')} title="搜索"/><RowActionButton disabled={!query} onClick={()=>setQuery('')} motionIcon="close" aria-label="清空" title="清空"/></ButtonGroup>}/>
   </section>
   <section><h3>持续选择</h3><ButtonGroup aria-label="动效对齐方式">{['左对齐','居中','右对齐'].map(label=><RowActionButton key={label} aria-pressed={selected===label} onClick={()=>setSelected(label)}>{label}</RowActionButton>)}</ButtonGroup></section>
   <MotionSelectionPreview/>
   <section><h3>中性反馈表面</h3><Alert showIcon type="info" message="配置已就绪" description="纯色表面与克制投影表达层次，状态用图标、标题和文字说明。"/></section>
   <section><h3>异步状态</h3><div className="motion-lab-controls"><RowActionButton aria-label="开始模拟请求" loading={busy} onClick={()=>{setBusy(true);setStatus('模拟请求进行中');}}>开始请求</RowActionButton><RowActionButton disabled={!busy} onClick={()=>{setBusy(false);setStatus('模拟请求已结束');}}>结束请求</RowActionButton></div><p>手动结束模拟请求，加载状态持续到结束；旋转与搜索反馈不代表请求完成。</p></section>
   <output aria-live="polite">{status}</output>
  </div>
  <section className="motion-lab-rules" data-ls-motion={reduce?'reduce':'system'}><h3>图标动效 · 共享接入</h3>
   <p>MotionIcon 提供已确认的 30 种图标；MotionButton 保留 AntD Button 的类型、链接、表单、ref、禁用与 loading。行内操作使用 RowActionButton 的 motionIcon 属性。</p>
   <ul><li>一次动作：设置 motionIcon="delete"、"search"、"refresh" 等，点击仅播放一次。保存使用自绘的粗线对号；点击后收笔，布尔 loading 为 true 时过渡到单段圆弧并持续旋转，结束后恢复对号。圆弧仅表示等待，保存成功或失败仍由业务结果与文字反馈决定。删除仍经过原确认流程。</li>
   <li>成对状态：expand、theme、fullscreen、sidebar、folder、visibility、lock、sort、play 由 iconActive 控制。false 为初始图形，true 为第二状态：展开、月亮、退出全屏、收起侧栏、打开文件夹、隐藏、解锁、降序、暂停。外部状态变化直接同步，不能用点击次数代替真实状态。</li>
   <li>数据库、云存储、文档仅轻微反馈；设置轻转一次。不要为静态入口自动循环，也不要叠加旧旋转或波纹。</li>
   <li>直接使用 MotionIcon 时，active 控制状态，replay 递增触发一次反馈；默认 size=16。它是装饰图标，按钮必须提供文字或 aria-label，状态语义用 aria-expanded / aria-pressed 表达。</li>
   <li>紧凑工具栏中，换行、复制等含义清楚且图形可区分的操作优先使用图标按钮；不要重复排列图标与文字。换行箭头在切换时短促折返，减少动态效果时直接切换状态。图标按钮仍保持中号命中区、aria-label、悬停提示和可见键盘焦点；持续状态使用 aria-pressed 或 aria-expanded，操作结果用文字反馈。含糊或危险的动作保留文字与必要确认。</li>
   <li>颜色继承 currentColor，时长取 motion，浅暗主题共用形状；系统 prefers-reduced-motion 与局部 data-ls-motion="reduce" 都让动效瞬时完成并保留状态切换。选择器、日期和菜单等带入场状态的浮层必须立即可见，不能停在初始透明态。禁用和 loading 期间不触发重复操作。</li></ul>
   <pre><code>{`<MotionButton motionIcon="delete" onClick={openDeleteConfirmation}>删除</MotionButton>
<RowActionButton motionIcon="sidebar" iconActive={expanded} aria-expanded={expanded} onClick={toggleSidebar}>侧栏</RowActionButton>`}</code></pre>
   <div style={{maxWidth:narrow?320:undefined}}><IconMotionPreview/></div>
  </section>
   <section className="motion-lab-rules"><h3>统一规则</h3><ul><li>输入与操作采用上方尺寸规范：TextInput、Select、InputNumber、DatePicker、普通 Button 和 InputGroup 在同一操作行使用相同 size。小号 26px 用于 API 文档等密集场景，保持相同轮廓并收轻表面阴影；中号 32px 为全站默认，用于常规表单；大号 38px 用于宽松操作区。字段圆角依次为 8 / 10 / 12px，下拉卡片圆角依次为 10 / 12 / 14px，选项高为 24 / 28 / 32px；选择器已选项只保留右侧对勾；悬停和键盘定位才显示选项底色。分段和按钮式单选始终保持胶囊形。组合控件内部接缝平直；普通行内动作保持 32px 中号命中区，密集表格单元格内才显式使用 26px 小号。聚焦不改变底色；错误、警告和禁用语义仍由控件负责。</li><li>表单标签与字段间距 8px，字段组间距 20px。复选框采用 20px / 7px 圆角方形、圆头勾线与半选短横线；普通单选框采用 20px 圆形、居中圆点。两者以中性色面表示选中，仅让标记淡入，不缩放或扩散。开关采用 44×24px 轨道和 18px 居中滑块，切换时平稳水平移动；禁用和键盘焦点保持独立语义。</li><li>滑块使用 8px 中性轨道和 18px 白底手柄；悬停、拖动只加深描边，不缩放或扩散，键盘焦点独立可见。日期与范围选择保留日历日期和范围语义，弹层与输入框使用同源边界；上传拖放区与文件卡片使用同源表面，状态色仅用于进度和结果。窄屏弹层不得横向溢出。</li><li>InputGroup 默认中号 {foundations.inputGroupHeight}px / {foundations.inputGroupRadius}px；密集场景显式传入 small，外壳、输入与动作均使用相同 size。内部接缝平直，动作背景铺满分段。</li><li>Provider 关闭默认点击波纹；普通按钮使用色调反馈，单选切换保留滑动底片。选择器选中项仅用对号标记，选项底色跟随指针或键盘导航。</li><li>内容页签用滑动底色标记当前项，悬停仅提亮文字；卡片页签保留面板边界。菜单与树结构悬停为灰底；浅色选中为带轻阴影的白面，暗色选中为中性灰面，勾选与键盘焦点独立显示。</li><li>可展开卡片统一箭头和详情过渡；纯展示卡片不增加悬停反馈。</li><li>鼠标操作无外框；键盘焦点保持可见，禁用与加载期间不触发重复操作。</li><li>使用顶部开关检查主题和窄屏。减少动态效果仅取消动画，状态与操作仍然有效；系统偏好始终优先。</li></ul></section>
  <section className="motion-lab-rules"><h3>表面层次 · 黑白主题规范</h3>
   <p>使用根 Provider 与共享样式提供的 --ls-surface-* 变量。浅色以淡灰底座承托白色控件和内容卡片，使用柔和阴影表达轻拟物立体感，细边缘只作辅助；不得以强描边代替表面层级。暗色使用纯色深浅层次，不使用渐变、顶部高光或凸起阴影。正文、次要说明、弱提示及状态文字在常用中性底色上至少保持 4.5:1 对比度，状态文字在各自浅色底上也需清晰。页面不再复制渐变、阴影或按主题写控件覆盖。</p>
   <ul>
    <li>face 表示控件和反馈卡片表面，edge 为细边界，highlight 保留为透明兼容变量，shadow 为浅色低层投影；track 表示单选滑块轨道，stage 用于展示区衬底。</li>
    <li>输入组合只绘制一个外表面，内部按钮和输入保持平直接缝；不为每一段叠加阴影。键盘焦点、错误和禁用状态继续使用各控件原有语义。</li>
    <li>ButtonGroup、轻量导航、内容 Tab、Segmented 与按钮式 RadioGroup 共用浮片材质，仍只移动一个选中底片。卡片页签保留连接面板结构。</li>
    <li>Alert、FeedbackPanel 和任务卡片采用轻层次；普通内容与表格行保持平面。菜单阴影表达浮层关系，选中项仅显示对勾，不画凸起选项。</li>
    <li>色彩集中在状态图标、提示标题和主要动作；强调蓝用于焦点与小型图形，链接、信息标题和代码关键字使用可阅读的 link-text。不要增加大面积彩色渐变、毛玻璃或装饰性悬停抬升。装饰表面不使用渐变、高光或内凹阴影；加载文字和骨架屏的扫光仅表达加载状态，继续保留。表面变化不新增动画，不改变现有时长或请求状态。</li>
   </ul>
  </section>
  <section className="motion-lab-rules"><h3>组件选择与接入 · 展示站自举</h3>
   <ul>
    <li>展示站与示例统一消费组件包导出，作为实际消费者验证。输入与选择使用 TextInput、TextArea、Checkbox、ToggleSwitch、NumberInput、RangeSlider、DateField、DateRangeField、SegmentedControl、Select、RadioGroup；表单、内容页签和浮层分别使用 Form、TabStrip、Dialog、DrawerPanel、MenuDropdown 等共享入口。不要直接导入上游同类控件，也不要在页面重写选中样式。</li>
    <li>TextInput、TextArea、SearchField、Select、DateField 和 DateRangeField 的默认清空入口使用共享关闭图标，并随字段尺寸缩放；Select 多选标签的移除图标沿用同一图形。清空立即更新原有值与回调；输入框保留焦点，日期控件继续遵循原有日历焦点行为。传入自定义 clearIcon 时保留调用方图标。</li>
    <li>搜索、数据表格、状态标签、进度和主题切换使用 SearchField、DataTable、StatusTag、Progress、ThemeSwitch。不要从 src 深层路径导入来绕过包导出；页面局部 CSS 不覆盖共享主题变量。表格汇总可使用 Table.Summary。高级设置、筛选折叠区和说明问答统一使用 FilterDisclosure：整块卡片、右侧旋转箭头，内容折叠后保留挂载；defaultOpen 仅设置首次展开状态。导航分组、表格行展开、任务卡片和分隔面板保留各自语义与交互，不套叠通用折叠卡片。</li>
    <li>滚动条由共享样式统一：原生滚动与虚拟列表使用主题中性色、细圆角滑块，保留拖拽操作区；页面不要另画高对比轨道。持续加载使用 loading（{motion.duration.loading}ms）、progressCycle（{motion.duration.progressCycle}ms）与 iconSpin（{motion.duration.iconSpin}ms）循环参数，循环不代表任务完成。</li>
    <li>应用根节点使用 LanshangProvider，并引入 @lanshang-labs/ui/styles.css；Provider 统一浅暗主题与关闭默认波纹。使用 motion 与 CSS 变量，不另写动画时长。</li>
    <li>页面导航用 BeautifulTabs；切换关联内容面板用 TabStrip；紧凑的单值选项用 SegmentedControl；表单单选统一用 RadioGroup，按钮式选项设置 optionType="button"，普通选项保留圆点形态。共享封装负责视觉与尺寸，原有键盘和表单语义继续有效。</li>
    <li>组合动作使用 InputGroup + ButtonGroup + RowActionButton。只有单个 aria-pressed=true 的持续选择才使用滑动底片；普通动作不伪装成选中状态。</li>
    <li>可关闭查询标签使用 Tabs type="editable-card"，保留面板边界及关闭功能；不强行改成胶囊。表格多选、复选框、资源树保持各自的已选标识，不套用单选规则。</li>
    <li>Select 优先从 Lanshang UI 导入。只有菜单时使用单个带箭头的触发按钮；确有独立默认动作时才使用组合按钮。</li>
    <li>浮层内的列表挂载到当前 Modal 或 Drawer 的非滚动内容外壳，避免正文裁切和挤压定位；仍留在当前浮层键盘上下文中。多行选项用小圆角和适当宽度，不使用单行胶囊圆角包住长文本。</li>
   </ul>
  </section>
  <section className="motion-lab-rules"><h3>禁止叠加的旧样式</h3><ul>
   <li>不要为已选菜单项持续铺底色，也不要把菜单自动 active 状态当作悬停。选择标记与探索反馈分开。</li>
   <li>不要在滑动底片下再叠加选中背景、hover/active 伪元素底色或 AntD wave 点击扩散；切换过程中和结束后都只能看到一层选中底片。</li>
   <li>不要让悬停另一项清掉当前选中状态；键盘焦点独立可见，不靠改变选择表示焦点。</li>
   <li>页面样式必须限定在自己的直接控件上，避免宽泛后代选择器和 !important 把嵌套 Tabs 强制变成方角或旧色调。</li>
  </ul></section>
  <section className="motion-lab-rules"><h3>新增页面验收</h3><ol>
   <li>在浅暗主题下快速往返切换；将鼠标移回旧项，确认无双重底色、闪烁或扩散。</li>
   <li>用 Tab 定位、Enter / Space 确认，检查禁用项、焦点恢复和输入保留。带 name 的 RadioGroup 支持方向键切换；Tabs 与 Segmented 保留当前版本自身的键盘行为。</li>
   <li>检查窄屏、长名称和多行选项；滚动浮层后，触发器与弹出列表仍保持正确位置。</li>
   <li>开启系统或样例的减少动态效果，检查状态与操作仍有效；加载持续时间由真实请求决定，不能用动画结束代替请求完成。</li>
  </ol><p>扩展对照：<a href="#/patterns/navigation-states">导航交互状态</a> · <a href="#/patterns/overlay-recovery">浮层确认与恢复</a> · <a href="#/patterns/states">控件状态与交互</a></p></section>
  <div className="motion-lab-table" role="region" aria-labelledby="motion-duration-title"><h3 id="motion-duration-title">共享动效参数 · motion.duration（ms）</h3><DataTable rowKey="key" density="comfortable" pagination={false} scroll={{x:560}} dataSource={([['状态反馈','state','移出或释放'],['下拉展开','enter','展开完成'],['下拉收起','exit','关闭完成'],['箭头旋转','chevron','开合状态到位'],['选择底片','selection','到达当前选项'],['搜索反馈','search','单次播放完成'],['刷新反馈','refresh','单次转动完成']] as const).map(([label,key,end])=>({label,key,end,duration:`${motion.duration[key]}ms`,easing:key==='selection'?motion.easing.selection:key==='search'||key==='refresh'?motion.easing.feedback:motion.easing.standard}))} columns={[{title:'场景',dataIndex:'label'},{title:'时长',dataIndex:'duration'},{title:'缓动',dataIndex:'easing',render:value=><code>{value}</code>},{title:'结束条件',dataIndex:'end'}]}/></div>
 </div>;
}
