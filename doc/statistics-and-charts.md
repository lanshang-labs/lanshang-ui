# 统计展示与可选图表入口

Lanshang 自行维护指标、排行、容器与视觉合同，参考 Tremor 的紧凑看板组织。统计图由 Ant Design Plots / AntV G2 渲染，不复制 Tremor 源码或同时引入 Recharts。

## 接入

基础组件从 `@lanshang-labs/ui` 导入：StatisticCard、ChartCard、RankingBarList。它们没有图表引擎依赖。

绘图消费者安装 `@ant-design/plots@2.6.8`，从 `@lanshang-labs/ui/charts` 导入 LineChart、AreaChart、ColumnChart、BarChart、DonutChart、Sparkline；沿用 LanshangProvider 与基础 styles.css。plots 是 optional peer，项目自行管理其安装和版本。自正式 0.2.11 版本包提供；沿用同站点版本化 tgz / Registry 交付，不是 npm Registry 发布。固定版本入口为 r/v0.2.11/。

普通图表必填 label、data 和字段名；多系列提供 seriesField。统一主题来自 Provider，底层 axis、tooltip、scale、style、onReady/onEvent 等配置仍可使用。label 保留为图表的语义名称；需要底层数据标注可使用引擎 labels 等配置。Sparkline 的 label/summary 应表达时间范围与真实趋势。

ChartCard 接受 LoadingContainer 的 hasContent/loading/error/onRetry，成功空结果的 hasContent 也为 true。刷新与读取失败保留 children，组件不发请求、不聚合数据、不自动重试。StatisticCard 保留0、显式格式化字符串；null和非有限数值显示破折号。上升不自动代表好消息，trend.tone 由调用方决定。

RankingBarList 用于非负数量比较，保留调用方顺序，非法或负值不被伪装成数量条。数据表在展开后才挂载，默认保留所有原始行与零值。Canvas图形提供文本摘要和HTML数据读取替代路径，尚未作完整屏幕阅读器交互认证。

## 验证与范围

本地示例：`#/components/analytics`，包括两种时间范围、四种趋势图、环形分布、微型趋势、排行、刷新错误与重试、空数据。首版不包含地图、关系图、业务聚合/导出或大数据性能承诺。

引擎放在独立入口，展示站也使用 React.lazy/Suspense 在进入统计页后加载。一个最小 StatisticCard 消费者的构建依赖图含0个AntV/plots模块；折线消费者的实测压缩体积约457KB(gzip)，因此不把它并入基础入口。实际应用应按路由拆分并测量自身包体。

面积图适合少量可解释重叠；密集多系列优先折线、分面或交互筛选，避免透明面积混色妨碍逐系列比较。
