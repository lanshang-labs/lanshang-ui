# Dock 工作台模板

由 React + Ant Design + Lanshang 的公共布局和表面规则组合。模板不包含业务路由、数据请求、权限、偏好存储或部署逻辑。此模板自 0.2.12 正式发布；本地继续沿用现有5177预览。

```tsx
import {WorkspaceLayout, WorkspaceHeader, WorkbenchPage, SearchField, DataTable} from '@lanshang-labs/ui';
import {Dock} from '@lanshang-labs/ui/dock';
import '@lanshang-labs/ui/styles.css';
import '@lanshang-labs/ui/dock.css';

<WorkspaceLayout variant="dock" sidebar={sidebar}
  header={<WorkspaceHeader>{projectContext}</WorkspaceHeader>}
  footer={<Dock size="small" items={destinations} activeId={page} onSelect={setPage}/>}>
  <WorkbenchPage toolbar={filtersAndActions} contentPadding="none" scroll="managed">
    {tableOrEditor}
  </WorkbenchPage>
</WorkspaceLayout>
```

`variant="dock"` 的侧栏贯穿全高，footer 对齐主区；隐藏侧栏时主区与 Dock 一起铺满。可选 topbar 独占顶部整行。默认 WorkspaceLayout 不变。Dock 标签和向上浮层可以越过页脚，正文不渲染在 Dock 下方。实际入口超出宿主宽度时允许水平滚动，并额外留40px容纳提示标签；焦点移动只滚动 Dock 自身，首尾入口保留8px焦点区。恢复宽容器后回到配置高度，不改变默认非模板 Dock 的尺寸。

`WorkbenchPage` 用 toolbar 提供筛选与操作，navigation 提供独立的页内导航，footer 提供状态或底部动作。三者均为可选 ReactNode。无 navigation 的表格仍使用同一个主面板。

- 普通文档、卡片：`contentPadding="normal" scroll="body"`，正文拥有滚动。
- 表格、编辑器：`contentPadding="none" scroll="managed"`，内部控件拥有滚动。容器提供确定高度，消费者按内部视口测量，不从窗口高度重复减固定数值。
- 带内容的 TabStrip：作为 managed 的直接子内容，页签与正文保留 AntD 的语义关联；模板统一页签栏的边界和内边距，页签正文独立滚动。

在模板根的 style 中一次性配置 CSS 自定义属性；CSSProperties 可显式声明交叉类型以承载自定义属性。

| 配置 | 默认值 |
| --- | --- |
| --ls-workbench-gutter | 16px，700px以下12px |
| --ls-workbench-gap | 16px |
| --ls-workbench-radius | 12px |
| --ls-workbench-body-padding | 20px，窄屏12px |
| --ls-workbench-dock-height | 76px，窄屏68px |
| --ls-workbench-dock-width | 640px |
| --ls-workbench-surface / edge / shadow | 共享表面、轻边缘与阴影 |

浅色是灰色底座、白色浮起面板；暗色继承公共中性表面，边缘辅助识别。不为每张业务卡片再定义模板级阴影。示例见 `/workspace-layout.html#dock`，完整交互样例代码保留在布局文档中。实验室的独立视觉和已有历史包继续保留。
