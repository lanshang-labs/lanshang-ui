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


## 统计与图表（0.2.11）

基础入口提供 StatisticCard / ChartCard / RankingBarList / LoadingContainer；绘图从独立 /charts 入口导入，应用显式安装可选 @ant-design/plots@2.6.8。只有图表消费者加载引擎，普通 UI 不导入 AntV。详见[接入与范围](statistics-and-charts.md)。
