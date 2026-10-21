# Registry 与 CLI

Lanshang UI 使用 shadcn 4.21.4 的官方 `build` / `add`，不维护自定义安装器。基础组件通过版本包维护，应用持有复制后的区块源码。

## 本地提供 Registry

```sh
npm ci
npm run build:registry
npm run dev -- --port 5177 --strictPort
```

可发现目录为 `http://127.0.0.1:5177/r/registry.json`。`lanshang-provider` 安装 Provider、公共样式依赖；`lanshang-blocks` 安装三个区块并依赖 Provider。

## 新项目安装

使用 React / React DOM 18.3.1、TypeScript 和 Vite。仓库 `examples/registry-consumer` 是完整待安装模板，复制到一个新目录，运行 `npm install` 后：

```sh
npx shadcn@4.21.4 add http://127.0.0.1:5177/r/lanshang-blocks.json --dry-run
npx shadcn@4.21.4 add http://127.0.0.1:5177/r/lanshang-blocks.json
npm run build
npm run dev
```

`components.json` 与 tsconfig 的路径别名必须一致。此模板只使用 AntD 和 Lanshang 样式，没有 Tailwind；`tailwind.baseColor` 为 `""`，避免 CLI 额外下载 shadcn 基础色（Lanshang 自己拥有主题）。已有 shadcn 应用保留自己的配置和主题；本轮仅验证独立 Vite 模板。

CLI 创建 `src/components/lanshang/provider.tsx`、`blocks.tsx`。现有应用需要手动在入口包裹 `<AppUIProvider>`；不自动改写 App、路由或全局 CSS。样例 hash 链接、数据、权限需要应用替换。

## 分发包与部署

npm 包尚未发布。构建使用 `npm pack` 生成包含许可证的 tgz，由同站点 `packages/` 托管；文件名包含版本与 SHA-256 前缀，完整摘要位于 `r/build-info.json`，消费者 lockfile 记录包完整性。React/ReactDOM 保持应用依赖，AntD 安装基线 5.22.5。

`npm run build:docs` 使用 GitHub Pages 的完整子路径生成生产 Registry。`LANSHANG_REGISTRY_BASE` 可用于 `npm run build:registry` 的其他托管目录。发布必须包含 `r/` 与 `packages/`，并保留已发布的历史包地址；更换域名或移除历史包会影响干净安装。当前本地验证不代表线上端点已发布。

## 更新与验证

先 `--dry-run` / `--diff` 查看差异。相同文件重复安装会跳过；用户改动的文件会请求确认。不要默认传入 `--overwrite`，也不要用该命令覆盖已定制区块。基础组件升级通过包版本与 lockfile 管理。

运行 `npm run test:registry`，在全新临时目录执行真实 CLI 安装、独立 TypeScript/Vite 构建、重复安装与 dry-run 保留修改验证；需先启动本地 Registry。临时目录保留用于检查。联网安装依赖需要 npm 与 Registry 可达。

协议参考：[shadcn Registry](https://ui.shadcn.com/docs/registry/getting-started)、[Registry item schema](https://ui.shadcn.com/docs/registry/registry-item-json)。

## 历史版本与 CI

`releases/<version>/` 在 Git 中保存已发布包的原始字节、Registry 和 SHA-256 清单。构建校验后恢复全部旧 `packages/` 地址，并提供 `r/v<version>/` 固定入口；未带版本的 `r/` 指向当前构建。0.2.2 旧包地址保持不变，历史区块依赖固定到同版本 Provider。

升级流程：先运行 `npm run archive:published` 归档当前线上版本（已有归档无需重复），审核并提交，再递增 package.json/package-lock 版本。禁止覆盖已有归档或复用已发布版本号。Pages 发布前执行 `check:published-history`，线上不可达、未归档或摘要不一致均失败。不要删除历史归档，否则旧 lockfile 会失效。

CI 和 Pages 发布均执行 `npm run test:registry:ci`：启动临时 HTTP Registry，先逐一安装已归档版本生成旧 lockfile，再构建新版，使用全新 npm 缓存执行各旧项目 npm ci，最后验证新版 CLI 安装、构建、重复安装与 dry-run。临时服务器结束时关闭，不占用开发端口。此自动化不代表平台已上线。

0.2.4 版本包 `lanshang-labs-ui-0.2.4-86f9e6d775b0.tgz` 的 SHA-256 为 `86f9e6d775b01afbbc0a8945d13e5d3411157b35c90276ba4078f4c3fa44dacf`。Boomerang Platform 测试站已固定接入该包并验证页面资源与构建产物一致；这不代表所有组件或其他项目已经验收。0.2.5 仅修正文档与接入示例，其版本包 `lanshang-labs-ui-0.2.5-ae87395a6d01.tgz` 的 SHA-256 为 `ae87395a6d014ab24193eff6d8325ad240eb7b899b918c0c71d0f27c28e3f585`。两版已按线上原始摘要归档。

0.2.6 修复 WorkspaceLayout 在应用未使用全局 CSS reset 时的内容溢出；版本包 `lanshang-labs-ui-0.2.6-014dae5bcd05.tgz` 的 SHA-256 为 `014dae5bcd05d85e4fc762a5cee9260cbea753c56919e9c307b16dd294bfb61f`。新版不得复用已发布版本号或覆盖历史包。其他项目接入时须锁定包地址与完整性，并在自身 React 18 / Ant Design 5 环境验证；实际公开版本以同站点的 `r/build-info.json` 为准。

0.2.7 正式提供 `InfiniteCanvas` 与通用几何工具；版本包 `lanshang-labs-ui-0.2.7-c01203b30655.tgz` 的 SHA-256 为 `c01203b30655b313bc9d7d2dbca2ef4d410a8882e379f5c0671f4901e4f4e1b4`。运行代码与已完成样例消费验收的 `0.2.7-canvas.1` 一致，正式版更新包版本、README 和文档。线上 0.2.6 已按原始字节归档；本地候选包及消费者的旧包、审核反馈分别由其原所有者保留，升级样例不等于修改正式导出。


0.2.8 正式提供共用画框的 `ImageCard` 与 `ImageDeck`；版本包 `lanshang-labs-ui-0.2.8-2fe0726f1a39.tgz` 的 SHA-256 为 `2fe0726f1a393562d9792c183ea4f195c1e96b54cc0f186e083b4c925788d70a`。运行文件与已通过真实样例消费验证的 `0.2.8-image-deck.1` 逐字一致，正式版仅更新版本、README 与接入文档。线上 0.2.7 原包和 Registry 按原始字节归档；本地 .0 / .1 候选及消费者的原包、审核反馈继续保留。此次样例升级不改正式导出。
