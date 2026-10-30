# 图标与操作的一致性

公共操作图标以 Iconoir 7.12.1（MIT）为主，通过 `@lanshang-labs/ui/icons` 导入。导航、工具栏、字段、表格、浮层和特色组件采用相同语义；品牌 Logo 作为独立资产，不使用普通操作图标冒充产品身份。可用名称以固定包的 exports 和类型为准。后续本地图标目录页不属于本次文档交付，不能从其预览推导已安装包的导出。

## 尺寸、描边与状态

- 12／14／16px 分别对应 26／32／38px 控件，画布通常为 24。公共适配图标使用 1em，描边由固定版本的共享图标实现提供。应用可调整外层字号，不复制图形。
- 普通动效和成对状态图标保持同类控件的视觉粗细。已有保存对号／圆弧、设置齿轮以及自绘主题／文件夹等保留光学校正；比较的是最终尺寸下的粗细，不机械改写所有 SVG 内部数字。
- 稳定选中、悬停、键盘焦点、不可用和等待分别表达。图标动效短暂反馈操作，真实结果与请求状态由应用提供；减少动态效果时关闭装饰运动。
- 常见操作优先图标，保留可访问名称和提示；保存、危险确认或对象不明的操作使用必要文字。新增图标先明确语义映射，避免同一图形同时表示项目、数据库和网络。

## 可访问性与接入

```tsx
import {MotionButton} from '@lanshang-labs/ui';
import {DatabaseOutlined} from '@lanshang-labs/ui/icons';

<MotionButton aria-label="打开项目数据库" title="打开项目数据库"
  icon={<span aria-hidden="true"><DatabaseOutlined /></span>} />

// 独立信息图形可以在包装层命名。
<span role="img" aria-label="数据库">
  <span aria-hidden="true"><DatabaseOutlined /></span>
</span>
```

装饰图标从包装层设置 `aria-hidden`，避免英文别名污染按钮名称；独立信息图形在外层提供语义和名称。0.2.12 的别名包含外层 span，不能假设传给 SVG 的属性会命名或隐藏整个组件。内部 SVG 不独立进入焦点顺序，操作焦点留在原生按钮／链接。旧 `*Outlined` 别名保留，不能从名字推断仍在使用 Ant 图库。

## 21st.dev 与来源

21st 用作语义搜索、同义图形对照和缺口参考，不成为运行时依赖。其官方图标目录聚合多个家族，保留各自许可和署名，订阅不将它们统一重新授权。采用新图形时核对原家族、固定版本、具体许可证和必要声明；既有 Iconoir 足够时优先复用，不同时把多个图库装进业务页。

参考：[21st Icons 官方介绍](https://news.21st.dev/blog/introducing-icons)、[Iconoir](https://github.com/iconoir-icons/iconoir)。实验室原样模板可保留其单独图库和许可，不自动迁入公共图标入口。
