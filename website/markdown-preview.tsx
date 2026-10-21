import landscapeUrl from './markdown-landscape.svg?url&no-inline';
import {useState} from 'react';
import {Markdown,Dialog,MotionButton,TabStrip,SegmentedControl,Stack,type MarkdownImage} from '../dist/index.js';

const prompt=`## 硬约束

- **禁止**在画面中生成字幕、对白气泡、标题卡或 UI 叠层。
- 允许出现的文字仅限于场景中自然存在的实体文字，例如路牌、包装印刷。
- 不改变角色的既定形象、窗户方位与主通道。

### 镜头与参考

| 项目 | 内容 |
| :--- | :--- |
| 镜头组 | 1-1 #1 |
| 总时长 | 5.5s |
| 场景参考 | 深夜盘山公路 |
| 角色参考 | 苏墨 · 回忆形态 |

> 这是准备包中的原文。渲染只改变阅读方式，不改变提示词内容或审核记录。

### 检查清单

- [x] 保留完整角色构图
- [x] 检查场景空间关系
- [ ] 确认最终声音参考
`;
const document="# 让内容回到阅读本身\n\n正文支持 **重点**、*强调*、~~删除线~~、行内代码 `ImageCard` 和 [Lanshang UI](https://lanshang-labs.github.io/lanshang-ui/)。\n\n## 层级与结构\n\n1. 先说明目标，再给出细节。\n   - 嵌套列表保持相同节奏。\n   - 长标识会自然换行，不把正文撑出容器。\n2. 链接引用、分隔线与脚注同样保留语义。[^note]\n\n> 视觉是内容的秩序：标题建立层级，留白区分段落，交互只在需要时出现。\n\n### 代码与复制\n\n```tsx\nimport {Markdown} from '@lanshang-labs/ui';\n\nexport function Prompt({text}: {text: string}) {\n  return <Markdown>{text}</Markdown>;\n}\n```\n\n### 数学公式\n\n行内公式 $E=mc^2$ 随正文排版，独立公式可以水平滚动：\n\n$$\n\\frac{1}{n}\\sum_{i=1}^{n} x_i^2\n$$\n\n### 图片与表格\n\n![山间薄雾](./markdown-landscape.svg \"山间薄雾 · 自然比例\")\n\n| 能力 | 展示 | 说明 |\n| :--- | :---: | ---: |\n| 标题与列表 | 完整 | 保留语义层级 |\n| 代码与图片 | 共享组件 | 沿用已有交互 |\n| 公式与脚注 | 支持 | 不依赖外部 CDN |\n\n---\n\n[^note]: 每个 Markdown 实例有独立的脚注标识，点击可返回引用位置。\n";

export function MarkdownPreview(){
 const [preview,setPreview]=useState<MarkdownImage|null>(null);
 const [width,setWidth]=useState('宽容器');
 return <Stack style={{width:'100%',minWidth:0}}>
  <SegmentedControl aria-label="展示宽度" options={['宽容器','窄容器']} value={width} onChange={value=>setWidth(String(value))} style={{alignSelf:'flex-start'}}/>
  <div style={{width:'100%',maxWidth:width==='窄容器'?320:undefined,minWidth:0}}>
  <TabStrip defaultActiveKey="prompt" items={[
   {key:'prompt',label:'提示词',children:<Markdown breaks links="text" aria-label="准备包提示词">{prompt}</Markdown>},
   {key:'document',label:'完整语法',children:<Markdown aria-label="Markdown 完整语法" onImagePreview={setPreview}>{document.replace('./markdown-landscape.svg',landscapeUrl)}</Markdown>},
  ]}/>
  </div>
  <Dialog open={!!preview} title={preview?.title??preview?.alt} onCancel={()=>setPreview(null)} footer={<MotionButton onClick={()=>setPreview(null)}>关闭</MotionButton>} width={760}>
   {preview&&<img src={preview.src} alt={preview.alt} style={{display:'block',width:'100%',maxHeight:'70vh',objectFit:'contain'}}/>}
  </Dialog>
 </Stack>;
}
