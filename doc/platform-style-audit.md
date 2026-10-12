# 平台样式剩余差异清单

检查日期：2026-10-12。范围：boomerang-platform 的 pages/features 源码与共享组件展示页。源码命中用于定位，不能替代真实页面验收。

| 位置 | 发现 | 下一步 | 当前结论 |
| --- | --- | --- | --- |
| TargetVersion | 未知发布来源仍用原生 warning Tag | 已迁移 StatusTag，保留管理员入口与来源判定 | 已接入 |
| OperationsPanel | 当前版本使用 green Tag | 当前标记已迁移；版本标签保留分类用途 | 已接入 |
| docs/ui/handover-status | 自带文字、颜色、字号和 title | 保留未知状态回退与 title，再评估共享组件的属性透传 | 待接入，不能直接丢弃属性 |
| DatabaseWorkbench | 查询状态、DDL 权限、SQL 类型混用 Tag | 执行结果与截断已迁移；权限/类型保留分类 | 已分流 |
| TargetCard / ReleaseTagModal / TicketDetail | 多处 Descriptions | 保留 span、column、长文本行为；优先用主题统一 | 保留复杂业务组件 |
| API 文档、GlobalSearch | HTTP 方法、必填、分类标签 | 保留领域语义；检查明暗对比度 | 不作机械状态替换 |
| TargetCard 仓库地址 | link 风格按钮控制展开 | 已统一 RowActionButton、方向箭头和 aria-expanded | 已接入 |
| 弹窗/抽屉/菜单/表单反馈 | 尚缺完整状态展示与统一人工检查入口 | 已补组件展示页；真实平台逐页验收 | 展示页已补，平台全量验收未完成 |

部署状态与仓库展开已完成接入；后续核对交接状态属性透传及复杂详情的明暗显示。不要将“源码不再出现 Tag/Descriptions”作为完成标准。
