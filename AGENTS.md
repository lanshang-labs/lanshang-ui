# Boomerang UI

- 本仓库拥有公共视觉 tokens、Provider 和通用展示组件；业务请求、权限、状态机归消费者。
- 保留 Beautiful UI 的来源、原始快照和 MIT 声明。
- 使用 npm ci / npm test / npm run build / npm pack；验证独立包和平台消费者。
- 公共依赖 React、React DOM、Ant Design 保持 peer dependencies；避免重复运行时。
- 不提交凭据或业务数据。不在未授权时公开发布 npm 或部署消费者。
