# coss ui 视觉参考快照

固定上游：`https://github.com/cosscom/ui`，提交 `3d8ca28e7d90123e9e0f44665944dc240b026ccb`。
发现入口：21st 的 coss / Origin UI 目录，以及 coss 官方文档。当前 21st CLI 搜索未返回 coss 作者条目，使用官方公开上游读取了以下文件，没有使用付费下载或托管 AI 生成。

`provenance.json` 保留各文件路径和 SHA-256。目录中的上游文件逐字节保留；不执行其中的安装脚本或 Next.js 应用。

## 许可范围

上游 `LICENSING.md` 明确将 `apps/ui/`、`apps/origin/` 列为 MIT；`apps/ui/package.json` 同样声明 MIT。此处保留了该声明，以及 `apps/origin/LICENSE.md` 中完整的 MIT 许可与 coss.com / Origin UI 版权文本。上游其他目录默认 AGPL，不纳入本次组件来源。这里的许可范围不外推到整个仓库或其他收费产品。

组件参考来自 `apps/ui` 的按钮、输入和 neutral 颜色；完整 MIT 文本保留原有署名，不声称上游把本地 AntD 适配作为官方实现。

## 实际复用边界

运行时仍使用现有 Ant Design 5 和 React 18。没有安装 Base UI、HeroUI，也没有执行上游组件的 React 19 / Next.js 页面。`src/foundation-profile.ts` 将中性颜色、32px 桌面密度、细边界、微小底部阴影和统一焦点映射到 AntD；`src/foundation.css` 是本地适配，不是上游原生 CSS 的逐字复制。

对照选项“现行主题 Tokens”只调用现有 designTheme；候选页没有装载旧 styles.css，不将它冒充完整旧站视觉。更改只在该独立文档生效，未替换 Lanshang 默认主题或正式组件 API。

上游基础视觉文档：<https://coss.com/ui/docs/styling>。
