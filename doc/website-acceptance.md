# 文档站与 0.2.0 验证

- 文档站包含 16 个分类页面、交互示例、代码复制、参数说明、明暗主题。
- 包名改为 @lanshang-labs/ui，LanshangProvider 为推荐入口，旧 Provider 保持兼容。
- 验证入口：npm test、npm run build:docs、npm pack；平台消费者执行 typecheck、受影响组件测试和隔离目录构建。
- 样例仅使用内存数据；构建不包含平台业务数据。
- GitHub Actions 手动发布 site-dist；npm 发布与业务平台部署是独立动作。
- Vite 对文档单一 JS bundle 有体积提示；不影响构建，后续按文档增长考虑分包。
