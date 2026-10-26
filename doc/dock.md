# Dock 接入指南（0.2.12）

Dock 已进入组件源码和按需公共导出，原实验室、上游快照及审核反馈保留。自 0.2.12 正式提供，通过版本包及同站点 Registry 接入。

## 安装

先按 Registry 安装共享包，再添加可选 peer；已有项目也可使用 build-info.json 中固定的版本包 URL：

```sh
npx shadcn@4.21.4 add https://lanshang-labs.github.io/lanshang-ui/r/v0.2.12/lanshang-provider.json
npm install motion@14.6.0
```

`@lanshang-labs/ui/dock` 是独立入口，未使用 Dock 的基础入口不导入 Motion。React、React DOM 沿用消费项目的现有运行时。基础包的 AntD peer 合同不变。

```tsx
import {useState} from 'react';
import {Dock, type DockItem} from '@lanshang-labs/ui/dock';
import {HomeSimple, FolderOutlined} from '@lanshang-labs/ui/icons';
import '@lanshang-labs/ui/dock.css';

const items: DockItem[] = [
  {id: 'home', label: '工作台', icon: <HomeSimple />},
  {id: 'projects', label: '项目', icon: <FolderOutlined />},
];
export function AppDock() {
  const [activeId, setActiveId] = useState('home');
  return <Dock label="工作区快捷入口" items={items} activeId={activeId}
    onSelect={id => setActiveId(id)} />;
}
```

已有 `styles.css` 包含同样的 Dock 样式，只引入一次即可。Dock 不自动引入 CSS、创建 Provider 或改写文档主题／localStorage。

## 原生链接、路由器与动作

```tsx
<Dock label="页面导航" activeId="projects" items={[
  {id: 'projects', label: '项目', icon: <FolderOutlined />, href: '/projects'},
  {id: 'docs', label: '文档', icon: <HomeSimple />, href: '/docs', target: '_blank'},
  {id: 'settings', label: '设置', icon: <HomeSimple />, action: true},
]} onSelect={(id, item, event) => {
  if (id === 'settings') openSettings();
  // 路由器若需要接管普通链接，可显式 event.preventDefault() 后导航。
}} />
```

`openSettings` 由消费应用提供。按钮选择不会自行采纳 activeId；链接当前项使用 aria-current=page，视图按钮使用 aria-pressed，action=true 的按钮不伪装成可选视图。Ctrl／Command／Shift／Alt 点击原生链接不触发 onSelect，保留浏览器原有行为；_blank 补齐 noopener noreferrer。

单项 disabled 或全局 disabled 阻止选择与链接跳转；禁用链接移除 href、标为 aria-disabled 且退出 Tab 顺序。空数组不绘制空条；id 必须非空且唯一。列表使用稳定id，重排不会换绑元素。是否可操作、路由状态、权限及动作成功均由应用拥有。

## 键盘与动效

左右方向键、Home、End 在非禁用项间移动焦点，不触发选择；Enter 与按钮的 Space 保持原生激活。链接 Space 继续滚动页面，Tab 可进入和离开 Dock。自定义 onKeyDown 可先 preventDefault 接管某个键。

工作台可使用 `size="small"`：宽容器38px、最多放大到60px，窄容器固定32px；底座与间距同步收紧，提示文字仍为12px。

宽容器默认44px，鼠标距离映射最多放大到72px；容器不足480px时固定36px，过窄只在 Dock 内横向滚动。触屏不触发放大。`magnify={false}` 可关闭放大；系统减少动态效果或 `reducedMotion` 为 true 时固定尺寸并取消提示过渡。系统偏好优先，显式false不覆盖系统要求。组件不接管页面滚轮，也不定位为全局fixed条；位置和安全区由页面布局负责。

## 局部主题与边界

默认继承现有Lanshang变量，使用单独 dock.css 时也有中性浅色fallback。宿主模板可在局部映射：

```css
.app-dock {
  --ls-dock-surface: var(--card);
  --ls-dock-item: var(--muted);
  --ls-dock-text: var(--foreground);
  --ls-dock-secondary: var(--muted-foreground);
  --ls-dock-line: var(--border);
  --ls-dock-focus: var(--ring);
  --ls-dock-shadow: none;
  --ls-dock-font: system-ui, sans-serif;
}
```

通过 className="app-dock" 传入；不要求覆盖全局按钮类。尺寸与距离模型属于组件，不建议用CSS直接修改内部宽高。label为导航名称，ref指向外部滚动容器，style／aria-*及普通HTML属性透传。

## 来源与验证

改编自 Motion Primitives Dock，MIT，Copyright (c) 2024 ibelick。固定上游提交 `120f64f6ca60348e251f929e9c81f11ccbe45eda`，原始文件和摘要保留于 experiments/dock/upstream；完整许可随包进入 dist/licenses/motion-primitives/LICENSE。Motion作为可选peer，由其自身包保留运行时许可证。

5177正式文档入口：#/components/dock；实验室入口仍为#/labs/dock。包构建后执行 `node scripts/check-dock-entry.mjs` 核对按需JS及单文件CSS闭包。源码测试覆盖选择、链接、禁用、事件、原文档示例和无Provider接入；真实浏览器另核浅暗、320／390px和原生键盘，不把单测当成视觉审核。
