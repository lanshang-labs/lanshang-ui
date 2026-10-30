---
name: devctl-design
description: "默认采用 Lanshang UI 开发、调整或审查业务前端，遵守项目 Design.md 中的差异并通过原生工具验证页面；不用于开发 devctl CLI 或实现后端 API。"
---

# Devctl Design 前端接手

统一接手入口是 [Lanshang 前端指南](https://github.com/lanshang-labs/lanshang-ui/blob/main/doc/frontend.md)，完整流程由其 `doc/frontend-workflow.md` 维护。本 Skill 只路由项目事实、公共规范和验证入口，不另存视觉规则、版本表或组件模板。

默认采用 Lanshang。项目可以在自己的 Design.md 正文中维护明确差异；在其声明范围内遵守项目选择，未声明部分沿用 Lanshang。不要为了套用公共默认而覆盖项目差异，也不把局部差异扩展到整个项目；无需为此新增配置语法或重复公共规范。

## 读取项目与规范

- 先读需求、项目 AGENTS、当前改动、package.json / lockfile 和原生工程入口。用 `devctl project show --workspace <项目根> --json` 核对身份与权限；已有项目沿用其明确要求和技术栈，不因采用 Lanshang 自动重建或换栈。
- 已有 Design.md 时用 `devctl design context --workspace <项目根> --json`；前端位于子目录时显式传 `--target <相对目录>`。按返回的阅读入口继续读取文件，命令不会下载公共指南。没有 Design.md 时依据实际需求和工程入口建立最小声明，不虚构预览或依赖。
- 主动阅读项目声明的固定 Lanshang 指南来源，再按任务进入组件、布局、主题、图标、品牌及交互规范。公共链接不可用时，可使用任务已授权的源码 checkout 或随交付提供的文档快照，核对来源、修订或内容摘要；没有可用副本就报告缺口，不能把读取失败当成已采用规范。
- 核对实际固定包的 exports、类型、lockfile 和对应版本文档。Lanshang 拥有视觉与共享组合，Ant Design 提供成熟控件及复杂交互，业务项目拥有路由、请求、权限和状态。具体组合按指南与项目事实选择；实验室和未发布源码不能冒充已安装 API。

## 开发与验证

- 通过项目原生工具组合现有组件，业务差异写入项目 Design.md；共性能力缺口反馈 Lanshang。样板只是组合参考，21st.dev 等素材按来源和许可采用，不自动成为另一套底座。
- 对同一 workspace / target 执行 `devctl design check --workspace <项目根> --json`（子目标同样显式传 `--target`），它只验证声明与路径。运行项目自己的类型检查、定向测试和构建，按实际改动检查真实流程、浅暗主题、窄屏、键盘及加载失败恢复；声明检查或构建成功不等于页面验收。
- 优先复用正在运行的预览。需要查看已声明入口时用 `devctl design preview --workspace <项目根> --json` 获取计划；这个命令不启动进程。子目标没有独立工程入口时，显式读取仓库根 Design.md；不放宽路径边界或为通过检查补造命令。
- 项目未登记不等于有效策略明确拒绝；按用户已授权范围开展原生开发，保留未采用治理的事实，不自动修改 Registry。有效明确拒绝仍受约束，受控写入继续遵守其 CLI 守卫。
- 交付时说明实际改动、验证结果和缺口，区分本地候选、包发布、消费者升级与部署。业务构建和运行不依赖 devctl、`.devctl` 或开发机相邻仓库。

命令参数与错误以当前 `devctl design --help`、子命令 help 和输出为准；本 Skill 不提供额外 CLI 或自动安装动作。
