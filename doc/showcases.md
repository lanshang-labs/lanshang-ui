# 样例、工作台与实验室

公共默认由[前端指南](frontend.md)和[设计准则](design.md)维护。样例提供组合参考，实验室保存视觉或交互探索；项目可以在自己的 Design.md 中记录品牌、密度与布局等差异。

## 当前 main 中的入口

在仓库根使用 make preview 后读取相应 HTML。每个入口依赖其完整源码和固定依赖，单个文件不是独立可运行工程。

| 入口 | 用途 | 源码 |
| --- | --- | --- |
| [workspace-layout.html](../workspace-layout.html) | 多栏布局和 Dock 工作台组合 | website/workspace-showcase-entry.tsx 及其引用 |
| [workbench-lab.html](../workbench-lab.html) | Studio 工作台实验对照 | experiments/workbench/main.tsx 及其引用 |
| [shadcn-workbench-lab.html](../shadcn-workbench-lab.html) | ShadcnStore 模板与本地扩展对照 | experiments/shadcn-dashboard/main.tsx；保留目录中的许可与来源 |

组件用法以实际固定包的 exports 和类型为准，业务路由、数据、请求与权限仍由项目维护。实验中的本地交互不作为正式业务验收。

## 尚未随本次文档交付的候选

完整 Lanshang Workspace 应用样板、品牌设计页面、多配色与液态玻璃组件组／工作台仍是本地探索。其本地 templates 或 labs 路由及 HANDOFF 不能被当成当前公开 main 已有文件，也不是当前固定包的导出。

本次仅补接手文档和 Skill，不移动或删除已有实验，不新增站点菜单，也不升级样板或实验的成熟度。后续采用应核对实际 checkout、来源许可、依赖与相称验证；液态玻璃是主题实验，不是完整应用样板。
