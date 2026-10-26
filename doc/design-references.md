# 21st.dev 精选参考与第一轮一致性优化

方向：现代、简洁、美观的产品界面，继续优化现有 Lanshang UI。保留 AntD 底座、现有组件 API、共享主题和特色组件，实验室不删除、不自动升格为默认主题。

## 第一批参考

本轮于 2026-10-25 核对以下 21st 公开条目。选择产品控件及完整工作台层级；没有使用付费复制／下载、AI 生成或添加新的组件运行时。

| 参考 | 借鉴点 | Lanshang 中的处理 |
| --- | --- | --- |
| [Origin UI Button / Button with Icon](https://21st.dev/@originui/components/button/button-with-icon) | 主次操作层级与紧凑图标组合 | 保留 MotionButton／RowActionButton，统一普通主操作的中性填充与反色文字 |
| [coss Button](https://21st.dev/@coss.com/components/coss-button) | 一套视觉下覆盖尺寸、禁用与加载 | 保留已有三档尺寸与加载守卫，验证浅暗主题主按钮文字对比 |
| [coss Input Group](https://21st.dev/@coss.com/components/input-group) | 输入与附加操作共用外轮廓 | 普通字段与 InputGroup 共用控制边界和紧凑阴影，组合内部保持单层描边 |
| [coss Combobox](https://21st.dev/@coss.com/components/combobox) | 字段、选项与状态的清晰关系 | 保留 Select 搜索、键盘、禁用、错误恢复及浮层逻辑，统一字段轮廓 |
| [coss Project Segmented Navigation](https://21st.dev/@coss.com/components/p-navigation-2) | 轻轨道与明确的当前项 | 对齐 Segmented／Radio 选中 token 和已有共享滑动表面 |
| [ShadcnStore Dashboard and Landing](https://21st.dev/@shadcnstore/templates/shadcn-dashboard-landing) | 成套页面层级与克制的表面分工 | 原实验室保留；吸收“字段、内联反馈、卡片各有层级”，收紧现有 Alert，而非整体换肤 |

## 复用与许可边界

这里记录视觉参考，不把 21st 全站订阅权限当作任意源码再分发许可。本轮没有新增上游代码拷贝；coss 和 ShadcnStore 已保留的固定源码、许可与摘要仍在 `experiments/shadcn-dashboard` 中，维持原状。后续若复用新源码，按具体条目和上游文件核对许可并保留署名。

21st 条目可能与其上游当前版本不同。借鉴的是上表明确的视觉原则；运行逻辑仍由现有 AntD 和 Lanshang 实现，不声称逐字移植其组件，也不新增 Base UI、Radix 或 HeroUI 作为正式底座。

## 第一轮落点

共享修改仅涉及 `src/theme.ts`、`src/surfaces.css`、`src/controls.css`：中性主操作、普通字段与组合字段的边界／阴影、单选选中 token，以及内联 Alert 的圆角与留白。现有三档尺寸、字体、焦点蓝色、状态色和交互合同保持。

以现有组件页及表单、列表、浮层组合场景检查浅暗与窄屏表现。失败恢复、草稿、键盘和焦点不能因为视觉优化被重置。局部问题回到共享实现修正，不用页面 CSS 另起一套基础样式。

这些参考先经过本地一致性验证，再随 0.2.12 发布；许可明确的实验室及其独立入口保留。
