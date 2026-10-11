# Boomerang UI

`@lanshang-labs/boomerang-ui` 是基于 Ant Design 5、Beautiful UI 适配源码和 Iconoir 的共享设计系统。当前验证 React 18.3.1 / AntD 5.22.5；尚未验证 AntD 6 或 React 19。

## 接入

```tsx
import { BoomerangProvider, DataTable, ThemeSwitch } from '@lanshang-labs/boomerang-ui';
import '@lanshang-labs/boomerang-ui/styles.css';
// 可选：应用自行引入 @fontsource-variable/inter。
<BoomerangProvider storageKey="my-app.theme"><ThemeSwitch /><DataTable columns={[]} dataSource={[]} /></BoomerangProvider>
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

Beautiful UI 原始快照、来源与 MIT 声明保存在 `src/beautiful-ui`；改编部分保留其许可证。自有源码当前未授予开源许可。
