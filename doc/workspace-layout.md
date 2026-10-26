# 复杂工作台布局

自 0.2.12 正式提供。生产工作台、文档工作台与基础外壳共用 `components/workspace-layout` 文档页面。

## 组合方式

```tsx
import {WorkspaceLayout, WorkspaceHeader, WorkspacePanels} from '@lanshang-labs/ui';
import '@lanshang-labs/ui/styles.css';

export function Workbench() {
  return <WorkspaceLayout
    contentMode="panels"
    topbar={<WorkspaceHeader>应用导航</WorkspaceHeader>}
    footer="当前工作区状态"
  >
    <WorkspacePanels mainLabel="正文" panels={[
      {id:'projects', label:'项目', defaultWidth:180, content:<ProjectList/>},
      {id:'notes', label:'资料树', defaultWidth:220, content:<DocumentTree/>},
      {id:'outline', label:'目录', placement:'end', defaultWidth:200, content:<Outline/>},
    ]}>
      <DocumentContent/>
    </WorkspacePanels>
  </WorkspaceLayout>;
}
```

`ProjectList`、`DocumentTree`、`Outline`、`DocumentContent` 由消费者提供。应用一级导航可放到 `WorkspaceLayout.sidebar`；全宽应用栏用 `topbar`，只横跨正文的栏用 `header`。旧 `contentMode="content"` 是默认值，继续使用正文 padding、overflow:auto 和可选 reading 宽度。panels 模式正文没有额外 padding、外层滚动或 reading 最大宽度。

## 面板合同

- `panels` 顺序决定 start 栏和 end 栏各自的顺序，中间保留唯一主区。ID 必须唯一且非空；`main` 保留给主区。标签应简短、可区分。
- `content`、`header`、`footer` 分别是面板滚动内容与固定头尾；默认头部显示 label。主区可传 `mainHeader`、`mainFooter`。根节点继承普通 div 属性。
- `defaultWidth` 默认 220px，`minWidth` 默认 160px、下限 96px，`maxWidth` 默认 400px 且不小于 min。展开面板和手柄共同预留 `minMainWidth`（默认 320px，下限160px），不能让双侧独立扩宽挤没正文。
- `width` / `onWidthChange`、`collapsed` / `onCollapsedChange` 以单个面板为单位受控；省略受控值时使用 `defaultWidth` / `defaultCollapsed`。回调可被消费者拒绝，不内部漂移。非法数值仅按显示约束归整，不改写消费者数据。
- `resizable=false` 保留面板切换与折叠，但不展示调宽手柄。手柄支持拖动、←/→、Shift 加速、Home / End；尾栏随屏幕方向反向增减宽度。separator 的 ARIA 宽度使用像素。
- `breakpoint` 默认 760px；容器不足该值，或不足所有展开栏与主区最小宽度总和时，自动进入单面板模式。依据容器 ResizeObserver，而非页面宽度。过小视口下主区自身宽度随容器缩小，长表格/代码由其局部滚动处理。
- `activePanel` / `defaultActivePanel` / `onActivePanelChange` 管理窄屏当前面板（默认 `main`）。无效 ID 显示 main。桌面 collapsed 偏好不阻止窄屏直接访问面板；回到桌面恢复原偏好。
- `immersive` / `defaultImmersive` / `onImmersiveChange` 仅改变面板可见性，不卸载 children。退出恢复先前宽度、折叠与窄屏活动栏；始终保留具名退出按钮。

根组件需放在有明确高度的容器里；`WorkspaceLayout` 默认占满100dvh，也可通过 style/className 指定嵌入高度。各栏正文各自滚动、头尾固定。隐藏栏使用 hidden，保留实例和内容状态，但不暴露Tab路径；断点和外部受控变化隐藏当前焦点时，返回可见入口。

## 消费者职责

业务数据、权限、请求、路由、草稿保存、偏好持久化及编辑器归应用。多个实例使用独立状态及ID。目录定位必须先切换到主区，再定位当前实例的正文。布局不执行安装、发布或业务写入，也不包含富文本编辑器。
