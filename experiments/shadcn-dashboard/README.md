# ShadcnStore 后台模板实验 · 02

这是原模板源码的适配版本。上一版自行组合的 Studio Workspace 保留在 `experiments/workbench`，没有替换或删除。

## 来源和许可

- 21st 条目：[Shadcn Dashboard and Landing](https://21st.dev/@shadcnstore/templates/shadcn-dashboard-landing)。
- 页面明确指向的作者仓库：[shadcnstore/shadcn-dashboard-landing-template](https://github.com/shadcnstore/shadcn-dashboard-landing-template)。
- 与条目对应的固定提交：`65fc11224e96d56a62e224a58f7ed590aea5ac24`。使用其中 Vite 版本的 Dashboard 2 及其需要的视觉组件。
- MIT，Copyright (c) 2025 ShadcnStore；完整原文见 [LICENSE.md](LICENSE.md)。21st 的托管下载需要套餐，本次直接从其明确链接的公开上游获取同一提交，没有使用站内下载或购买服务。
- `upstream/` 保存逐字节原始文件；[provenance.json](provenance.json) 记录来源和各文件 SHA-256。`src/` 是适配副本。
- 没有复制远程头像素材，保留姓名缩写回退。原模板的 Logo 属于保留 MIT 声明的源码范围。

## 直接复用了什么

保留 Dashboard 2 的页面 JSX、七个区块、Tailwind 类、卡片与布局、Recharts 图表、侧栏与导航原语、浅暗 tokens。沿用原模板的黑白中性色、渐变卡片、字体层级和断点，不重新绘制为上一版的绿色视觉。

本地接入不是全量导入该仓库的所有营销、邮件、聊天、登录等页面。当前入口为总览、交易、客户、资源、设置和来源说明。

## 适配边界

- 现有 React / React DOM 保持 18.3.1，Ant Design 保持 5.22.5。新依赖只作为本地文档实验的 devDependencies，没有改变正式包入口或 peer 合同。
- 保留 Tailwind 4、Radix、Lucide 和 Recharts 的必要视觉依赖；没有强行把原模板所有底层控件替换成 AntD。
- 新建交易、表单校验、交易表、筛选、详情 Drawer、设置、操作菜单及报告预览直接使用 Ant Design。
- BaseLayout 去除上游付费推广和主题定制器，保留原始结构；侧栏只保留已接入页面，MemoryRouter 将导航限制在本地样例内。
- React 18 的 Button、SheetOverlay 通过 forwardRef 兼容；Recharts 3 的 tooltip / legend 类型调整，图表初始尺寸避免首次测量警告；补上 Recharts 3 新刻度类名，使深色轴标签继续使用原模板 muted-foreground。
- 修复上游时间选择器仅更新选择值的问题：现在实际截取对应月份数据。收入来源和移动标签支持键盘和可访问名称。
- 上游头像 URL 不请求外部媒体。侧栏状态仅保存在内存，不向同域其他预览写 cookie。
- 原始 tokens / 视觉组件保留；`lab.css` 只处理 AntD 链接默认色、字体接入和窄屏边界。
- 原模板指标和图表是独立固定样例；新增记录只更新本地交易列表。没有真实支付、邮件、后端、持久化或正式报告导出。

## 预览和构建

- 实验室：`http://127.0.0.1:5177/#/labs/shadcn-workbench`。
- 整页：`http://127.0.0.1:5177/shadcn-workbench-lab.html`。
- 原版：`http://127.0.0.1:5177/workbench-lab.html`。

复用现有 5177 Vite，无需第二个服务。独立 HTML 隔离 Tailwind 和旧 Lanshang 全局 CSS。两套实验室页相互链接，原模板整页头部也有对比入口。

`npm run build:lab-template` 编译只扫描当前实验目录的 CSS，并保存依赖版本和许可全文；`build:docs` 已组合此步骤。编辑 Tailwind 类后运行该命令即可在现有预览热更新。`npm run check:examples` 包含适配源码，排除只读 upstream 快照。

完整依赖声明见 [DEPENDENCY_NOTICES.txt](DEPENDENCY_NOTICES.txt)，也随文档许可证和来源页提供。其中部分 npm 包未附许可文件：Radix 统一原文来自 https://github.com/radix-ui/primitives/blob/main/LICENSE；react-remove-scroll-bar 原文来自 https://github.com/theKashey/react-remove-scroll-bar/blob/master/LICENSE（文件 Git blob `7c08c3990396ecefd90f99ff5d9a34f26f5b5616`）。两者均在 `licenses/` 保留。

本轮只做本地实验，没有提交、发版或部署。

## Lanshang 媒体扩展接入

Resources 使用本地构建的 `/media` 与 `/media.css` 子路径，未引入旧全局主题或 Provider。同一组 ImageDeck / ImageCard 可切换原模板和局部玻璃材质，状态不重置；原图预览使用宿主 AntD Modal。设计边界见 [Design.md](Design.md)，独立接入见 [媒体文档](../../doc/media.md)。

直达资源页：`http://127.0.0.1:5177/shadcn-workbench-lab.html?view=resources`。默认入口仍打开原总览。独立媒体入口自 0.2.12 提供；本地开发先执行 `npm run build`，再使用现有 5177 服务。

## 基础 UI 候选 · coss

Foundation 页面在保留 AntD 交互的前提下，参考 coss 中性视觉统一按钮、字段、选择、页签、复选框、表格、表单校验与 Modal。入口为 `shadcn-workbench-lab.html?view=foundation`，文档站为 `#/labs/foundation`。

[视觉来源与许可](foundation-reference/README.md) 固定了上游提交、目录级 MIT 声明、原始源码和摘要。没有执行或安装 coss 的 Base UI 运行时，也未把 21st 订阅权限当作源码再分发许可。

`src/foundation-profile.ts` 是局部候选主题，`lf-ant` 前缀和独立文档隔离旧全局 CSS。现行 Tokens 与候选切换保持草稿；对照不包含完整旧 CSS。原模板、现有媒体接入及正式组件默认值均保留。后续采纳按基础组件范围迁移，不整体覆盖已交付包。
