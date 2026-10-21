# Lanshang UI

`@lanshang-labs/ui` 是基于 Ant Design 5、Beautiful UI 适配源码和 Iconoir 的共享设计系统。当前验证 React 18.3.1 / AntD 5.22.5；尚未验证 AntD 6 或 React 19。

## 接入

```tsx
import { LanshangProvider, DataTable, ThemeSwitch } from '@lanshang-labs/ui';
import '@lanshang-labs/ui/styles.css';
// styles.css 已包含本地 Inter + Noto Sans SC 字体声明。
<LanshangProvider storageKey="my-app.theme"><ThemeSwitch /><DataTable columns={[]} dataSource={[]} /></LanshangProvider>
```

Provider 管理文档级主题变量，单页面使用一个根 Provider。默认暗色，支持 defaultMode、storageKey 和 AntD locale。主题持久化在浏览器本地；无存储权限时仍可切换。图标从 `/icons` 导入；兼容原 AntD 图标命名。

库不包含请求、路由、权限、数据库类型推导或部署状态机。组件接收真实状态，应用负责业务行为。复杂 Table/Form/Tree/Select 继续使用 AntD，可叠加本库主题。CSS 必须显式引入一次。

## 开发与交付

```sh
npm ci
npm test
npm run build
npm run dev -- --port 5177
npm pack
```

v0 使用版本化 tgz 接入消费者并锁定完整性，避免依赖开发机绝对路径。更改公共 API 或视觉 tokens 后增加版本、测试、打包，在平台验证后更新平台 vendor 包和 lockfile。不要覆盖已经交付的版本包。后续可接私有 registry；当前未公开发布 npm。

Beautiful UI 原始快照、来源与 MIT 声明保存在 `src/beautiful-ui`；改编部分保留其许可证。自有源码采用 MIT，见根目录 LICENSE；第三方代码保留原有版权声明。

## 页面标题（0.1.1）

```tsx
import { PageHeader } from '@lanshang-labs/ui';
<PageHeader title="用户管理" description="管理成员账号与项目授权。" meta="12 位成员" />
```

`title` 为页面标题，`description` 为简短说明，`meta` 为应用提供的数量或状态，`actions` 可放操作按钮。组件不推算数量、不附加权限判断。窄屏自动换行。

## 加载与空状态（0.1.2）

`ContentState` 提供 title、description、icon、action 和 loading。通过 role=status 通知辅助技术；loading 仅显示加载动画，不推断请求结果，不自动转成成功。业务错误及重试由调用方决定。

## 分组导航（0.1.3）

BeautifulNavigation 的 collapsed 开启图标栏模式；分组通过点击浮层访问子项。selectedKeys/openKeys/onOpenChange/onClick 仍由调用方控制，权限过滤与路由映射由应用提供。原生按钮支持 Enter/Space；Escape 关闭浮层并返回触发入口。普通图标入口保留名称提示。平台持有宽度、断点和持久化偏好，库不读取业务路由或存储权限。

## 键值信息（0.1.4）

MetadataList 接收 items: {key, label, value}[]，用语义化 dl/dt/dd 显示详情；value 支持 ReactNode，长文本换行，窄屏切换为上下布局。项目名称、权限和数据获取仍由消费者提供。

## 控件状态展示与使用规范

运行 `npm run build`、`npm run check:examples` 后用 `npm run dev -- --port 5177` 打开本地展示页。“控件状态与交互”覆盖真实表单校验、弹窗、抽屉、危险确认、下拉菜单、搜索空结果和明暗主题；所有反馈仅保存在页面内存。

- [组件选择与验收约定](doc/component-usage.md)
- [平台剩余样式差异清单](doc/platform-style-audit.md)

展示页与业务验收分开：上传、权限、部署和真实服务请求仍由平台负责验证。


## 组件文档站

```sh
npm run build:docs
npm run dev -- --port 5177
# 单独查看静态产物
npm run preview:docs -- --port 5178
```

网站源码在 `website/`，从本库构建产物导入组件。构建输出 `site-dist/`，与 npm 包的 `dist/` 分离；使用相对资源和 hash 路由，可部署到 GitHub Pages 的项目子路径。原展示页保留在开发入口 `/gallery.html`。

`.github/workflows/docs.yml` 提供手动 Pages 发布流程：仓库 Pages Source 设置为 GitHub Actions 后，在 Actions 手动运行 Publish component docs。当前工作流不会因普通 push 自动部署。公开仓库前应检查 Git 历史与待提交内容；发布文档不等同于发布 npm 包。

静态构建包含 `licenses.txt`，保留自有与主要第三方许可。交互示例只使用页面内存数据，无业务服务请求。组件说明按实际导出和类型维护；`doc/website-acceptance.md` 记录本轮验证与边界。

## 0.2.0 名称迁移

项目以 **Lanshang UI** 独立维护，GitHub 仓库为 [lanshang-labs/lanshang-ui](https://github.com/lanshang-labs/lanshang-ui)，组件包为 `@lanshang-labs/ui`。维护者：[灰豆儿 · Yifan Wang](https://github.com/huidouer)。

将旧包导入替换为 `@lanshang-labs/ui`，样式路径替换为 `@lanshang-labs/ui/styles.css`，Provider 推荐使用 `LanshangProvider`。`BoomerangProvider` 保留为兼容别名；默认主题存储键暂时保留以兼容既有偏好，新应用应显式传入自己的 `storageKey`。CSS 类名保持兼容，业务权限、路由与请求不进入本库。

本仓库开源不代表已发布 npm 包。当前可运行 `npm ci && npm pack` 生成版本化 tgz，再由项目安装；MIT 和第三方许可包含在包内。


## 0.2.1 API 补齐

`StatusTagProps` 继承 AntD TagProps（排除 color，由 tone 管理），支持 title、style、className、aria 属性、关闭事件和 ref。未知状态的文字与提示仍由业务映射。

`SearchField` 支持 `ref<SearchFieldRef>` 的 focus/blur/select；onChange 返回字符串，可直接与 Form.Item name 绑定。Enter 在中文输入组合中或被 onPressEnter.preventDefault() 取消时不会查询；清空继续调用 onClear 和 onSearch("")。

兼容性基线：React / React DOM 18.3.1、AntD 5.22.5；旧 BoomerangProvider 别名保留。React 19、AntD 6 和 SSR 尚未验证，不扩大 peer 声明。


## 0.2.2 展示组件 API

PageHeader、ContentState、MetadataList 支持根元素的标准 HTML 属性和 ref（各自内容槽位由专用 props 提供）。PageHeader 的 headingLevel 默认 2，可按文档结构选择 1–6；headingId 用于标题关联，meta={0} 仍然显示。ContentState 默认为 role=status / polite，错误可用 role=alert / assertive；aria-live 可显式覆盖，aria-busy 始终由 loading 决定。组件不自动重试或推断成功。MetadataList 保留 dl/dt/dd 语义以及零值、空字符串和富文本。

### 架构与组合区块

[架构与分发](doc/architecture.md)说明基础组件、AntD 适配与应用源码区块的边界。文档站提供三栏导航、交互预览、代码和列表/详情/侧栏区块源码下载。区块可复制定制，核心仍通过版本包维护；Registry 安装通过官方 shadcn CLI 实现，见 [Registry 接入](doc/registry.md)。

### 默认与自定义字体

默认使用 Inter + Noto Sans SC，字体文件与 OFL 许可证随包分发。`styles.css` 使用相对 URL、`font-display: swap` 和中文 `unicode-range` 分片；加载期间回退到系统字体。

业务可使用 `<LanshangProvider fontFamily="Business Sans, system-ui, sans-serif">` 覆盖 AntD 和公共组件字体；自定义字体资源由业务自行加载。一个文档只使用一个根 Provider，代码区保持等宽字体。新字体方案与覆盖属性尚未发布，当前请从本地源码构建接入。

### 单按钮主题切换

`<ThemeSwitch variant="toggle" />` 以太阳/月亮图标显示下一次切换的目标主题，适合登录页等简洁界面。按钮保留可访问名称、原位焦点与 Provider 的主题记忆；默认分段形态不变。页面负责按钮位置，建议在窄屏留出安全边距。

### 全局工作区布局（本地预览）

`WorkspaceLayout` 组合 `sidebar`、`header` 和内容；内容默认铺满，`contentWidth="reading"` 可限制为 1500px。`WorkspaceSidebar` 默认展开 224px / 收起 72px，在 992px 以下通过 `onCollapsedChange(true)` 通知应用收起，回到宽屏时再通知恢复进入窄屏前的展开偏好；手动切换与偏好存储由应用控制。`WorkspaceHeader` 默认 48px，组合 `BeautifulTabs` 形成顶部导航，窄屏允许账户区换行。侧栏导航和内容各自滚动，主题继承 `LanshangProvider`。

标准交互样例位于文档站「布局与展示 / 全局布局」。路由、权限、登录状态、搜索与业务数据仍归消费者；布局不依赖任何平台品牌或 API。

## 无限画布（0.2.7）

`InfiniteCanvas<T>` 提供平移、指针锚点缩放、节点拖动、键盘移动和标准图标工具栏。应用持有 `nodes`（id、x、y、width、height、data、可选 label）与 `viewport`（x、y、scale），通过 `onNodesChange` / `onViewportChange` 接受变更提议；组件不请求资源或保存业务数据。

```tsx
import { useState } from 'react';
import { InfiniteCanvas, type CanvasNode } from '@lanshang-labs/ui';

export function Board() {
  const [nodes, setNodes] = useState<CanvasNode<string>[]>([
    { id: 'card', label: '内容卡片', x: 0, y: 0, width: 240, height: 160, data: '内容' },
  ]);
  const [viewport, setViewport] = useState({ x: 24, y: 24, scale: 1 });
  return <InfiniteCanvas nodes={nodes} viewport={viewport}
    onNodesChange={setNodes} onViewportChange={setViewport}
    renderNode={(node, { dragHandleProps }) => <article>
      <div {...dragHandleProps}>{node.label}</div>
      <div data-canvas-interactive>{node.data}</div>
    </article>} />;
}
```

移动柄透传 `dragHandleProps`；按钮、输入和链接保留自身行为，滚动面板或图片预览区域使用 `data-canvas-interactive`。`ref<InfiniteCanvasRef>` 提供 fitView、zoomIn、zoomOut、resetView、arrange、focus、getViewportSize。`arrange` 仅提议节点位置；应用接受后可调用 fitView，或组合导出的 `arrangeCanvasNodes`、`fitCanvasViewport` 同步更新节点和视口。完整 API 和可运行示例见[无限画布文档](https://lanshang-labs.github.io/lanshang-ui/#/components/infinite-canvas)。


## 图片卡片与叠卡（0.2.8）

`ImageCard` 与 `ImageDeck` 共用纸片画框、内嵌标题和预览入口。单图默认保留自然比例与完整构图；叠卡可通过滚轮或方向键切换，点击后展开为自适应网格，Escape 收起。触屏可使用上一张、下一张与展开按钮。浅暗主题不改变图片颜色，减少动态效果时直接显示目标状态。

```tsx
import { ImageCard, ImageDeck } from '@lanshang-labs/ui';

const images = [
  { id: 'front', src: '/images/front.jpg', alt: '正面形态', title: '正面' },
  { id: 'side', src: '/images/side.jpg', alt: '侧面形态', title: '侧面' },
];

<ImageCard src={images[0].src} alt={images[0].alt}
  title="形态参考" description="按原始比例完整展示" />
<ImageDeck items={images} aria-label="形态参考" objectFit="contain" />
```

原图、资源权限与审核反馈由应用持有。`ImageCard.onPreview` 与 `ImageDeck.onImageClick` 将打开原图或详情的动作交给应用，不自动导航。缩略图可通过 `fallbackSrc` 回退原图；再次失败显示可重新加载的占位。`activeId` / `expanded` 可受控，回调只提议更新，父组件接受后才改变。完整属性与交互示例见[图片卡片](https://lanshang-labs.github.io/lanshang-ui/#/components/image-card)和[图片叠卡](https://lanshang-labs.github.io/lanshang-ui/#/components/image-deck)。
