---
schema_version: devctl.design.v1alpha1
project: lanshang-ui
platform: web
authority:
  implementation: src
routes:
  implementation: src
read_order:
  - Design.md
  - doc/frontend.md
  - doc/frontend-workflow.md
  - package.json
commands:
  preview:
    command: make preview
    cwd: .
    url: http://127.0.0.1:5177/
---

# Lanshang UI 仓库接手

公共前端规范从[统一接入指南](doc/frontend.md)进入。默认采用 Lanshang；消费项目在自己的 Design.md 中记录差异，在其声明范围内执行，未声明部分沿用公共默认。

## 当前工程与采用

组件实现与公共导出位于 src，文档站入口为 website/main.tsx 和 website/catalog.tsx，包入口和依赖以 package.json、package-lock.json 为准。当前 main 的组件包版本是 0.2.12；本次接入指南和 Skill 交付不更改包版本、组件实现或既有发布产物。

可用的布局和实验源码入口见[目录说明](doc/showcases.md)。本地完整应用、品牌页面、多配色和液态玻璃探索不因文档存在而变成当前 main 或固定包的能力。网站自身的差异见 [website/Design.md](website/Design.md)。

## 原生工程入口

使用 npm ci 安装锁定依赖；npm run check:examples 检查示例类型；定向测试使用 node node_modules/vitest/vitest.mjs run <受影响测试文件>。npm run build 构建组件包；npm run build:docs 构建文档与分发产物，各自会写入对应输出目录，不能当作只读检查。

make preview 使用现有 Vite 入口在 5177 启动。已有服务时直接复用；devctl design preview --json 只取启动计划，不再启动进程。HTTP 就绪、构建或 Design 声明检查不等于视觉和业务验收。

公共规则、Skill、包发布、文档站部署和消费项目采用分别维护。业务构建与运行不依赖 devctl、.devctl 或开发机相邻源码。
