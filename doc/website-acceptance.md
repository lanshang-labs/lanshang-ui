# 文档站与 0.2.2 验证

- 文档站包含 23 个分类页面、交互示例、代码复制、参数说明、明暗主题。
- 包名改为 @lanshang-labs/ui，LanshangProvider 为推荐入口，旧 Provider 保持兼容。
- 验证入口：npm test、npm run build:docs、npm pack；平台消费者执行 typecheck、受影响组件测试和隔离目录构建。
- 样例仅使用内存数据；构建不包含平台业务数据。
- GitHub Actions 手动发布 site-dist；npm 发布与业务平台部署是独立动作。
- Vite 对文档单一 JS bundle 有体积提示；不影响构建，后续按文档增长考虑分包。

本轮验证：组件库 14 项测试通过；新增表单绑定、ref 聚焦/选择、输入组合与取消提交、标签属性和关闭取消覆盖。本地浏览器验证表单必填、提交、重置及明暗切换。平台交接状态接入新包，保留原 title 和未知状态。0.2.1 是本地候选，线上文档仍为 0.2.0。

0.2.2 补充 PageHeader、ContentState、MetadataList 标准属性与 ref，零值与富文本说明，并避免嵌套加载区域重复播报。新增行内加载文档页；保持 React 18 / AntD 5 已验证范围。

0.2.2 验证：组件库 18 项测试、平台 ProjectsPage/OBSExplorer 12 项测试、两库类型检查与构建通过。本地浏览器确认 h3 示例/h1 平台标题、零值和加数交互、错误重试与主题切换。

站点结构升级：顶部分类与搜索、左侧组件目录、右侧页内导航、预览/源码切换、复制页面和源码下载。新增架构说明以及列表、详情、侧栏三个同源区块；独立临时项目通过 0.2.2 tgz 安装 React 18/AntD 5，区块 TypeScript 检查通过。浏览器验证 1440px 三栏、390px 目录搜索、明暗主题、列表筛选、详情展开与侧栏折叠。当前仅本地验证，Registry/CLI 分发尚未实现，未发布站点或 npm。

Registry 试点：官方 shadcn 4.21.4 build/add/list；两个条目（Provider、组合区块），版本包与 JSON 由站点托管。npm run test:registry 在全新临时 React 18/Vite 项目验证安装、构建、相同文件重装跳过和 dry-run 保留修改。另在交互终端验证修改后的 blocks.tsx 出现覆盖确认，回答 no 后自定义内容保留。浏览器验证独立应用的主题、筛选、详情展开和侧栏选择。线上发布状态以 GitHub Pages 工作流与远程安装验证为准。
