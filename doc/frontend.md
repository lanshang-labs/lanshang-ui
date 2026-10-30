# Lanshang 前端接入指南

“使用 devctl / lanshang-ui”表示：采用 Lanshang UI 的前端规范与共享组件，Ant Design 提供成熟控件和复杂交互，devctl 提供项目事实与规范发现入口。它不是新的 npm 包名或 CLI 子命令，也不意味着业务构建、运行必须依赖 devctl。

## 权责与阅读入口

Lanshang 维护默认的公共前端规范，涵盖视觉、组件组合、布局、交互、响应式、可访问性和前端验收。项目可以在自己的 Design.md 中维护差异；未声明的部分沿用 Lanshang。

| 所有者 | 负责内容 | 接手入口 |
| --- | --- | --- |
| Lanshang UI | 统一表面、尺寸、字体、主题、动效、组件与模板用法 | [通用设计准则](design.md)、[组件选择与验收](component-usage.md) |
| Ant Design | 表单校验、表格、树、选择器、弹层及焦点等成熟交互；不是另一套产品视觉标准 | 已安装组件类型与 [Lanshang 架构](architecture.md) |
| React / TypeScript | 渲染、组件状态和类型表达 | 消费项目固定的依赖和类型 |
| 业务项目 | 路由、请求、权限、数据、任务状态、存储、品牌差异及原生构建检查 | 项目 AGENTS、Design.md、Makefile / scripts / 包管理配置 |
| devctl | 项目身份、Design.md 的薄读取/声明检查/预览、规范路由 | `project show`、`design context`；不复制视觉规则、不执行通用前端治理 |
| 21st.dev 等参考来源 | 可选的布局、素材、组件和动效参考 | 保留来源与许可；经适配和验证再采用 |

本页是统一导航，不复制其他文件的全部规则。先读本页，再按任务读取上表中的所有者文档、组件 API 和实际实现。安全及业务语义不能被视觉需求覆盖；产品特例写入项目 Design.md，不能用无说明的全局 CSS 补丁替代公共规则。工程师确认的通用修正先落回 Lanshang 所属实现与规范，再升级消费者。

完整流程与可直接交给 AI 的提示见 [AI 前端开发与接手流程](frontend-workflow.md)；平台身份设计见 [品牌与 Logo](brand-design.md)，公共图标见 [图标规范](icons.md)。

需要应用组合参考时，从[样例与工作台目录](showcases.md)进入，按实际 checkout 读取入口、完整源码以及已提供的 README 或 HANDOFF；没有对应文件时不推导它已交付。局部交互和主题探索继续保留在实验室，不能把样例或实验当成公共设计规则或已发布能力。

## 默认规范与项目差异

默认使用 Lanshang。项目自己的 Design.md 可以明确品牌、配色、密度、布局、交互和技术栈等差异；在其适用范围内按项目约定执行，其他部分继续采用 Lanshang。Agent 不应为了“统一”而覆盖项目已经明确的选择，也不应把局部差异扩展到未声明的页面或控件。

差异写在普通 Markdown 正文中，按需说明适用范围、选择与原因，无需复制完整公共规范或增加 YAML 字段。例如：

```markdown
## 本项目差异

- 项目列表采用紧凑密度；详情和编辑表单沿用默认密度。
- 顶部品牌标识使用本项目 Logo；共享控件与图标继续采用 Lanshang。
- 保留现有路由和 Ant Design 版本，依赖升级另按项目需要处理。
- 其余未说明的视觉与交互沿用 Lanshang。
```

差异声明不能使未发布组件变成已安装能力，也不代替业务权限、用户授权或真实验证。项目差异不自动成为其他项目的公共默认；共性改进再回到 Lanshang 维护。

## 可选的 Agent Skill

Codex 的薄接手入口为 [`devctl-design`](../skills/devctl-design/SKILL.md)，源文件随本仓库维护。安装时复制整个 `skills/devctl-design` 目录到 Codex 的技能目录，保留 SKILL.md 和 agents/openai.yaml；CLI 不自动安装或更新 Skill。没有 Skill 时仍可直接按本指南开发。

Skill 负责发现项目约定、规范来源和原生验证入口。项目 Design.md 的明确差异优先于公共默认，未声明部分采用 Lanshang；完整工作流仍由本指南及其引用维护。

## AI 接手顺序

1. 读取项目 AGENTS 和需求，确认前端目录、已有改动、包管理器、运行入口及采用的参考类型。已有应用增量修改，不擅自重建工程或换技术栈。
2. 读取项目 Design.md；采用 devctl 时可运行 `devctl design context --workspace <项目根> --target <前端目录> --json`。文件不存在时依据已确认需求建立最小声明，目录以事实为准。命令不会获取外部指南，Agent 需自行读取 Lanshang 文档。
3. 核对项目 lockfile、已安装包的 exports / 类型与固定版本文档。Lanshang 的本地开发 checkout 不代表已发布包；源码候选不能被当成消费者已具备的 API。
4. 优先用现有组件和模板组合页面。未封装的 AntD 能力可在共享 Provider 下使用，仍遵守 Lanshang 约定；不要求把所有 AntD 组件再包装一次，也不以其默认演示样式决定页面外观。
5. 项目 CSS 负责业务排布和明确的品牌差异；共享控件、表面与状态规则优先复用。缺少能力时先局部组合，跨场景共性缺口再反馈到 Lanshang，不默认增加另一套基础 UI 运行时。
6. 运行项目原生类型检查、定向测试和构建，再检查真实主流程、浅暗主题、窄屏与键盘。记录未验证范围；不因 HTTP 200、构建或 Design check 通过而宣称业务或视觉验收完成。

项目 AGENTS 只需保留指向其 Design.md 和本指南的接手说明，不复制完整规范。没有 devctl 的 Agent 也能直接阅读相同文件并使用原生工具完成开发。

## 依赖与安装

当前已验证接入基线为 React / React DOM 18.3.1、Ant Design 5.22.5、TypeScript；构建工具沿用项目已有入口，新独立示例使用 Vite。不要自动升级 React 19 / AntD 6，也不要为套模板替换现有路由和数据层。

公开稳定包 0.2.12 使用版本化 tgz；发布到文档站不等于已发布到 npm Registry。新项目可以显式安装：

```sh
npm install react@18.3.1 react-dom@18.3.1 antd@5.22.5 https://lanshang-labs.github.io/lanshang-ui/packages/lanshang-labs-ui-0.2.12-01aa9216c470.tgz
```

包 SHA-256：`01aa9216c470d923a15e94e289ec58736dd1a1c981e527f3509425cbb14e7650`。固定版本来源为 [0.2.12 build-info](https://lanshang-labs.github.io/lanshang-ui/r/v0.2.12/build-info.json)。已有项目先核对已锁定版本与差异，不因阅读本页自动安装或升级。后续版本以所属发布清单为准，devctl 不保存另一份版本表。

```tsx
import {LanshangProvider} from '@lanshang-labs/ui';
import '@lanshang-labs/ui/styles.css';

<LanshangProvider storageKey="my-app.theme" defaultMode="light">
  <App />
</LanshangProvider>
```

一个应用文档使用一个根 Provider，显式选择项目主题存储键。基础组件升级通过版本包与 lockfile 获取；复制的业务区块由消费者维护，不自动覆盖定制。详见 [Registry 与分发](registry.md)。

- [主题与配色](theme.md)：当前已发布的明暗入口与本地候选边界；实际接口以固定包为准。
- [Dock](dock.md)：从 `/dock` 按需导入，显式安装 `motion@14.6.0`；基础入口不加载 Motion。
- [统计与图表](statistics-and-charts.md)：普通统计不需绘图引擎，`/charts` 消费者显式安装 `@ant-design/plots@2.6.8`。
- [独立媒体入口](media.md)：`/media`、`/media.css` 可供宿主局部主题接入；已有全局样式不重复加载独立样式。
- [Dock 工作台](workbench.md)、[复杂多栏布局](workspace-layout.md)：使用公开插槽组合，业务路由和状态仍由应用管理。

不要把实验室依赖、未发布源码或开发机绝对路径带进产品。21st.dev 不是运行时依赖；HeroUI、coss 和实验室样例不是默认替换底座。

## 两类已认可的产品参考

用户于 2026-10-29 明确认可 Boomerang Platform 和 Drama Studio 的页面方向。以下提取可复用的布局意图，不代表整站所有状态均通过验收，也不要求复制品牌、业务数据、服务地址或截图。类型名称只是文档中的选择，不是新的组件 API 或配置 DSL。

| 参考类型 | 适用场景 | 应复用的组合关系 | 允许差异 |
| --- | --- | --- | --- |
| 管理工作台：Boomerang Platform | 密集表格、项目管理、API 文档、部署等 | 全局侧栏与上下文栏；工具栏、页签和内容属于连贯工作区；需要时使用底部 Dock；文档资源树与正文独立滚动 | 列、筛选、领域状态、侧栏项目、权限与数据；高密度区域显式选用小号 |
| 创作工作室：Drama Studio | 聊天、图片/视频创作、作品库和品牌登录 | 低干扰侧栏与主要画布；作品卡片与内容优先；创作输入区靠近内容且保留稳定滚动边界；登录页保持单一焦点 | 品牌标识、局部色调、媒体比例、留白、模型与参数；不要求强加 Dock 或管理表格布局 |

两类参考共用 Lanshang 的组件语义、交互状态、图标、可访问性与主题基础；一致性不是强制同一种布局、密度或品牌色。浅色用底色差和轻阴影建立层级，暗色用克制明度与辅助边缘；结构分栏、数据线和字段边界保留各自语义，不把所有区域都做成浮卡。具体规则仍由 [通用设计准则](design.md) 唯一维护。

通用 ChatComposer / MessageList 不在 0.2.12 正式导出中。创作应用可先用 TextArea、Select、MotionButton、Markdown 等组合业务输入区，不假设已有公共组件。中文组合输入、重复提交防护、未知结果核对和移动键盘按真实交互验证；权限、幂等和任务恢复属于业务，不能靠按钮加载动画保证。

项目 Design.md 写明采用哪类参考、实现入口、允许差异和原生验证命令。登录页、浮层小表格、文档正文与全屏工作台按各自场景组合，不把任一截图推成全站固定结构。已有实验室继续保留，探索未经确认不能自动升级为默认规范。

## 验收与交付

按实际改动选择验证，完整细则见 [组件选择与验收](component-usage.md)：

- 主流程：有数据、成功空结果、首次加载、刷新、失败重试；已有内容、选择与草稿合理保留，未知业务结果不伪装成功。
- 布局：桌面和目标窄屏，长标题、长表格、代码与浮层分别检查；控件可达、无非预期页面横溢，内部横向滚动不截掉首尾操作。
- 操作：焦点可见，Tab / Enter / Space / Escape 与关闭回焦正确；图标优先仍需可访问名称，危险或含糊动作保留必要文字。
- 外观：浅暗主题的文字、表面、选中、禁用与错误均可辨；图片不受全局滤镜影响，产品差异不破坏同语义控件的一致性。
- 工程：构建、测试与检查在消费项目自身运行，不依赖 devctl、`.devctl` 或相邻私有仓库；机械通过与真实页面证据分别报告。

简单变更不强制新建报告、Storybook、测试矩阵或额外审批。提交、发布、部署、真实数据写入与付费调用仍遵守各自授权，不由“使用 devctl / lanshang-ui”自动授予。
