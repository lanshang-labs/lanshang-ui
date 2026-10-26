# 图片组件的独立接入（0.2.12）

ImageCard 和 ImageDeck 继续维护自己的交互，同时允许外部模板拥有主题。旧根入口、Provider 和 styles.css 保留；新增 `/media` 与 `/media.css` 子路径，自 0.2.12 正式发布。

## 最小接入

```tsx
import {ConfigProvider} from 'antd';
import {ImageCard, ImageDeck} from '@lanshang-labs/ui/media';
import '@lanshang-labs/ui/media.css';

const images = [
  {id: 'front', src: '/front.jpg', alt: '建筑正面', title: '正面'},
  {id: 'side', src: '/side.jpg', alt: '建筑侧面', title: '侧面'},
];

export function Resources() {
  return <ConfigProvider>
    <section className="my-media-theme">
      <ImageCard {...images[0]} onPreview={() => openImage(images[0])} />
      <ImageDeck items={images} onImageClick={openImage} aria-label="建筑参考" />
    </section>
  </ConfigProvider>;
}
```

`openImage` 由应用实现，例如打开自己的 AntD Modal。React 18 / React DOM 18 / AntD 5 仍是 peer，组件复用消费者的运行时。已有 ConfigProvider 可直接使用，不需要再包一层；不需要 LanshangProvider。按需样式不引入全局字体、主题、reset 或其他组件 CSS，不读写文档主题和主题持久化。

## 模板映射

模板使用局部选择器映射自己的变量，而不是修改组件源码或全局 AntD 类名。例如当前 ShadcnStore 实验：

```css
.my-media-theme {
  --ls-media-surface: var(--card);
  --ls-media-canvas: var(--muted);
  --ls-media-text: var(--card-foreground);
  --ls-media-secondary: var(--muted-foreground);
  --ls-media-line: var(--border);
  --ls-media-line-hover: var(--ring);
  --ls-media-focus: var(--foreground);
  --ls-media-radius: var(--radius);
  --ls-media-image-radius: calc(var(--radius) - 4px);
  --ls-media-font: var(--font-inter);
  --ls-media-shadow: 0 1px 3px #0000000a;
}
```

可选 `--ls-media-backdrop` 控制卡片背板滤镜；`--ls-media-control-hover` 控制叠卡图标按钮悬停背景。没有映射时优先回退到旧 Lanshang tokens，再回退中性浅色默认值。暗色由宿主提供变量或 Provider，不自动检测、更改全局主题。

尺寸、叠放几何和键盘逻辑仍归组件；模板只改语义颜色、材质、字体、边界与圆角。不要通过覆盖卡片 padding、caption 高度等内部几何规则改变叠卡排布。

## 实验与验证

- [Resources 页面](../experiments/shadcn-dashboard/src/resources-page.tsx)：同一份组件实例切换原模板和局部玻璃材质，保持当前图片；预览由宿主 AntD Modal 承担。
- [模板设计规则](../experiments/shadcn-dashboard/Design.md)：本地映射及素材来源。
- `npm run build` 后运行 `node scripts/check-media-entry.mjs`，检查实际公共入口的依赖和三文件 CSS 闭包。
- `npm test -- tests/media-standalone.test.tsx tests/image-card.test.tsx tests/image-deck.test.tsx tests/shadcn-workbench.test.tsx`，覆盖宿主 Provider、原交互及资源页接入。

本轮不迁移所有现存基础组件，也不将玻璃材质推广为默认全局主题。自 0.2.12 提供版本包与接入示例；消费项目仍需验证自己的业务交互。
