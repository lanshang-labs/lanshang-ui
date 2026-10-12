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
