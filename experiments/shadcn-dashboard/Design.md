# 模板与扩展组件的组合规则

本目录继续保留为实验室对照，整体维护方向以 [架构说明](../../doc/architecture.md) 与 [展示站设计说明](../../website/Design.md) 为准：继续优化现有 Lanshang UI 的一致性。ShadcnStore 模板、Resources 材质对比及 coss 基础视觉候选不自动成为默认主题或全库迁移目标；可验证的局部改进按需吸收。

整体视觉使用固定来源的 ShadcnStore 模板：侧栏、页面栅格、字体层级、卡片、浅暗语义变量归模板所有。原始快照、MIT 和 provenance.json 保持原样。

Ant Design 承担本地表单、表格和弹层逻辑；沿用当前宿主 ConfigProvider。Lanshang 扩展提供图片叠放、滚轮切换、展开、键盘与失败重试，不管理页面路由、业务数据、图片预览弹层或全局主题。

## Resources

- 通过 `@lanshang-labs/ui/media` 与独立 `media.css` 消费本地候选包，不导入旧 `styles.css` 或 LanshangProvider。
- `src/resources.css` 在 `.resource-media-theme` 局部映射模板变量。组件内保留交互，模板映射不改变叠卡几何和 caption 高度。
- “原模板”沿用中性表面；“玻璃材质”仅改变媒体舞台和卡片背板，不改整站视觉。滤镜不可用时回退到不透明表面，减少动态偏好关闭过渡。
- 桌面是集合与当前画面两栏；窄屏合并为集合，全部素材保持两列，展开叠卡仍可点击预览。动作优先采用已有清晰图标，保留可访问名称与 Tooltip。
- 图片为 `src/resource-data.ts` 内的四张本地 SVG 示例，源自本仓库的图片叠卡示例，不请求外部图片，不包含业务素材。
- 材质、选中图片与弹层只存在内存；预览使用宿主 AntD Modal，关闭回到触发入口。

这是“模板视觉 + AntD 交互 + Lanshang 扩展”的第一份组合样例，不是完整玻璃应用，也不是新的全局主题框架。
