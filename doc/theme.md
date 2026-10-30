# 主题与配色接入

公共视觉默认由[设计准则](design.md)维护；消费项目的 Design.md 可声明默认明暗、品牌和布局等差异。实际可用接口以固定包类型为准，本次文档交付不增加主题 API。

## 0.2.12 的公开入口

```tsx
import {LanshangProvider, ThemeSwitch} from '@lanshang-labs/ui';
import '@lanshang-labs/ui/styles.css';

<LanshangProvider storageKey="my-app.theme" defaultMode="light">
  <ThemeSwitch />
  <App />
</LanshangProvider>
```

一个应用文档使用一个根 Provider，显式选择项目自己的 storageKey。defaultMode 选择 light 或 dark；ThemeSwitch 和 useTheme 的 mode/setMode 处理明暗偏好。默认值与其他公开参数读取固定版本类型，不从文档示意推断额外能力。

业务草稿、请求与选择不保存在主题存储项中。切换主题不应重挂载业务页面或清空输入，图片、原始 Markdown 和代码保持原内容。项目 CSS 负责业务排布和明确差异，公共控件继续继承共享主题。

## 本地探索的边界

多强调色、PaletteSwitch、defaultColorScheme、系统模式及液态玻璃属于后续本地候选或实验，未包含在这次接手文档交付中；不能直接用于 0.2.12 或从 README 链接推断已有正式实现。实验室继续保留，后续按源码、固定版本和真实验证决定采用。

验证应覆盖受影响的明暗状态、窄屏、键盘、Portal 与输入／选择保留。提交、包发布、Registry 更新和消费者部署分别依据实际授权执行。
