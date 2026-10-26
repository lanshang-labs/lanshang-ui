# 组件使用与视觉验收

本规范对应展示站的组件页面与交互示例。Lanshang UI 提供视觉 token、控件外观与通用交互；业务请求、权限、表单数据和状态机仍由应用负责。组件包内部可使用 Ant Design 保留成熟的键盘和浮层语义，应用的可见控件优先从 `@lanshang-labs/ui` 接入。

## 组件选择

| 场景 | 组件 | 约定 |
| --- | --- | --- |
| 名称链接 | NavigationLink | 真实 href、常显下划线；保留新窗口打开及复制地址能力 |
| 跳转入口 | NavigationLink variant=action | 箭头提示跳转；外链使用恰当 target、rel |
| 行内动作 | RowActionButton | 编辑、授权、展开等动作；删除使用 danger；禁止以 href=# 模拟操作 |
| 主要动作 | MotionButton | 每个操作区突出主要动作；可使用 `motionIcon` 表达语义反馈，危险确认使用 danger |
| 即时筛选 | SearchField onChange | 应用保存筛选值，保持原有大小写、分页重置策略 |
| 提交搜索 | SearchField onSearch | Enter / 搜索按钮提交；当前组件清空也提交空字符串，应用明确处理 |
| 业务状态 | StatusTag | 应用映射 neutral/info/success/warning/error，必须保留文字 |
| 分类和版本 | CategoryTag | 无需改成成功/失败；继续继承 Provider 主题 |
| 列表 | DataTable | 保留 AntD columns、pagination、selection、scroll；业务负责数据获取 |
| 简单详情 | MetadataList | 单列键值信息；复杂跨列 Descriptions 不机械替换 |
| 多栏工作台 | WorkspaceLayout + WorkspacePanels | 平面分区、独立滚动、容器窄屏切换；详见[布局合同](workspace-layout.md) |
| 表单/选择器 | Form、TextInput、PasswordInput、TextArea、Select、Checkbox、RadioGroup、ToggleSwitch | 默认中号；仅表格行内与 API 文档等高密度区域显式用小号。密码可见性使用带名称的语义按钮；保留 label、校验、只读与禁用语义 |
| 页签 | TabStrip | 保留受控选中、禁用与键盘切换；内容和页签共用清晰的容器层级 |
| 加载/空/失败 | ContentState 或 Alert | 请求状态由应用给出；加载期间不能提前断言空数据；失败给出恢复方式 |
| 弹窗/抽屉/菜单 | Dialog、DrawerPanel、MenuDropdown、ConfirmPopover | 保留 Escape、焦点管理和禁用菜单；所有业务副作用由应用实现 |

## 视觉与交互检查

- 明暗主题分别检查正文、说明、placeholder、边框、选中、错误、禁用状态。禁止只凭颜色表达状态。
- Tab 遍历必须看到焦点；Enter/Space 激活按钮；Escape 关闭浮层；关闭后焦点返回触发位置。自定义触发控件需要转发 ref。
- 图标按钮有可访问名称，带文本的装饰图标不应污染名称。Tooltip 不作为唯一错误说明。
- 表单使用可关联的 label 和错误文本；只读允许复制，禁用表示不能操作，两者不得混用。
- 主动作、行内动作和跳转链接分开；不要将整行链接与多操作按钮叠加成嵌套交互元素。
- 长文本、窄窗口检查换行与横向滚动，不以裁掉操作列解决拥挤。
- 视觉语义优先：复制、关闭、重试等明确动作可使用有动效的图标按钮，同时提供可访问名称；文字保留给含义不明确或风险较高的动作。
- 表格分页可能在窄屏换行。固定高度列表必须按页眉和分页的实际高度计算可滚动区域，不能使用固定预留值让末行落到分页下方。
- 图片、设计稿、代码高亮、透明棋盘格不受全局颜色滤镜影响。
- 使用局部语义 token；不要覆盖全局 `.ant-*` 选择器来补一个页面。

## 验证边界

展示页仅用本地内存样例，无网络请求。表单提交、删除确认、重试都明确展示本地反馈；不代表真实权限、上传、部署或网络恢复已验收。公共接口或 token 变化需增加包版本并验证消费者；仅文档和展示页变化无需重新发包。

### 页面与区块加载

使用 LoadingContainer 的 hasContent 明确标识成功快照（含空结果），loading 表示当前读取，error 提供失败说明，onRetry 调用应用自身的重新读取。variant="page" / "block" 共用行为；首次加载可选 skeleton 或 indicator，刷新与刷新失败保留 children。不要用 Skeleton 包住已有内容进行刷新。见 website/Design.md 的“页面和区块加载”和本地展示页 #/components/loading-container。组件不自动发请求或重试；本轮不发布。

## 基础视觉一致性

主操作沿用统一中性实心按钮，浅暗主题使用相反的文字／填充层级；链接与键盘焦点继续使用 accent，危险和业务状态使用各自语义颜色。不要在页面单独把主按钮改成另一套默认主色。

普通字段、选择器、数字／日期字段和组合输入复用共享控制边界与轻微阴影，保持 26／32／38px 尺寸与原有焦点、校验、禁用语义。卡片边界不能替代字段边界，组合内也不重复描边。Alert 使用紧凑内联反馈表面，不用大圆角和投影制造额外卡片层级。

外部组件只作有来源的参考，见 [第一轮参考清单](design-references.md)；实验室继续保留，正式组件仍由现有 Lanshang UI 维护。

表格展开详情不叠加卡片投影，分页跳页输入与 small 控件对齐；复杂表格继续显式提供 scroll 与稳定 rowKey。Form 中 showCount 多行输入自动预留计数行，不要在页面再次叠加 margin 补丁。

Dialog／DrawerPanel 默认划分标题、可滚动正文和操作区，长内容无需额外添加 ls-form-* 或页面专用限高样式。自定义 footer 可使用 Inline 组合，保留明确的取消／保存文字；footer=null 用于短预览。Portal 不应定位在滚动正文内。表单状态、busy、未知结果核对、取消及焦点恢复仍按原接口由消费方维护。

导航的当前项、分组展开与键盘焦点保持独立。TabStrip 的顶部／底部普通页签共用轨道，左右页签保留列表结构，卡片页签保留面板连接；不要通过页面样式统一抹成同一种形状。MenuDropdown、折叠导航弹层和页签溢出选择共享紧凑导航密度，仍保留菜单／listbox 的原生行为。ResourceTree 的禁用、展开、选中和完整名称提示继续沿用现有接口。

ContentState 的 loading 只切换加载外观；它默认为 status，错误可显式使用 alert，不自动把自身置为 busy。aria-live／aria-busy 显式配置继续生效。数据区域的忙碌状态由应用维护，或直接组合 LoadingContainer；刷新失败应保留已成功内容，成功空结果不继续等待。

重试成功替换原操作按钮时，消费方应给出明确的程序化焦点目标，仅在本次操作移除了当前焦点、且用户没有移到别处时恢复；FeedbackPanel 不自行决定业务焦点或执行重试。通知托盘拥有浮层阴影，通知关闭与业务结果分开管理。页面无需为同样的反馈重新添加彩色背景、卡片投影或加载定时器。


展示卡片沿用共享 12px 面板圆角与紧凑留白；ImageCard／ImageDeck 保留自然比例、纸片画框及图片原色。独立 media 入口仍支持宿主主题变量，中号图标操作默认 32px。Markdown 自带工具栏时统一包围模式与正文；已有工作台可用 toolbar=false 保持无外框正文，图片和代码继续复用共享组件。

SourceCodeBlock 的长行与 Markdown 原文在自身区域滚动，复制始终取完整源字符串。兼容 CodeBlock 的复制按钮使用图标、可访问名称与提示，成功播报只由剪贴板调用结果触发。StatisticCard／ChartCard 使用统一边距与圆角，图表原始数据表具备独立边界和键盘焦点；不要为统一外观改写原始数据、分类颜色或比较口径。统计读取期间保留当前入口焦点并守卫重复请求，恢复交接仅在本次操作实际移除当前焦点时进行。


Dock通过@lanshang-labs/ui/dock按需接入，显式安装Motion可选peer，样式使用dock.css或已有styles.css。items使用唯一稳定id与可访问label，activeId由应用管理；原生链接href保留浏览器行为，action用于一次性动作。方向键只移焦、不采纳选中；禁用链接不保留href。独立主题映射、源码安装与更多示例见[Dock接入指南](dock.md)。自 0.2.12 正式提供。
