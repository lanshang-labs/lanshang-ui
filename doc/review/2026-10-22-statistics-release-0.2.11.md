# 0.2.11 统计与图表正式包验收

从线上 0.2.10 对应源码建立隔离发布分支；原开发工作区和本地审核资料保持原样。只纳入统计、图表及必需的 LoadingContainer，不发布其他待定的复杂布局、Markdown 新模式或全局视觉调整。

基础入口：StatisticCard、RankingBarList、ChartCard、LoadingContainer 及类型。独立 /charts：LineChart、AreaChart、ColumnChart、BarChart、DonutChart、Sparkline、chartPalettes、createChartTheme 及类型。绘图引擎 @ant-design/plots 是可选 peer，基础入口不导入引擎。既有 React 18.3.1、React DOM 18.3.1、AntD 5.22.5 验证基线不变。

## 已完成验证

- 构建和示例类型检查通过。
- 82 个测试文件、436 项测试通过；发布安装文档最终调整后，page-copy、docs-navigation、site-self-hosting 三文件的 12 项检查再次通过。
- 独立临时项目从实际 tgz 安装，基础组件类型检查和打包通过；未自动安装 plots，基础打包依赖图含 0 个 AntV／plots 模块。显式安装 plots 后，六类图表的公开类型检查与独立打包通过。
- 336 个包文件含运行代码、类型、样式与许可证，不包含网站、审核样本或测试文件。
- 0.2.10 原包和 Registry 原始字节已归档；全部历史 manifest 的摘要一致。既有依赖的版本、来源与完整性没有改变，新增 85 个图表开发依赖条目。
- 历史 0.2.2–0.2.10 的旧 lockfile 均通过空缓存 npm ci；新 Registry 的 CLI 安装、独立构建、重复安装与 dry-run 保留定制内容验证通过。
- 生产文档构建通过；固定版本 Registry、10 个版本入口、历史包和许可 bundle 均存在。生产包摘要与独立消费者安装的候选包一致，图表保留独立延迟加载 chunk。已有大 chunk 提示保留，不扩大为全站包体改造。
- 七个实现／示例文件与已审阅的现有 5177 源码逐字一致。独立 Astra 审查已覆盖浅暗主题、390px、两系列正式示例及六色样本；面积多层混色限制写入规范。原审查反馈与截图留在开发工作区。

正式分发继续使用同站点版本化 tgz 和 Registry，不向 npm Registry 发布，也不更新业务消费者或正式业务导出。原包、原文和审核资料保持原有所有权。

包 SHA-256：`c27403664b2c2a7404d04caade43671a959b83046297e95ef99a51e9f15b6e6e`。最终线上版本与下载地址以 `r/build-info.json` 为准。

真实业务接入、完整读屏／色觉差异认证和大数据量性能不在本次验收结论内。
