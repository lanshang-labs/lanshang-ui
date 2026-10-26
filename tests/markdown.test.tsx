import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {ConfigProvider} from 'antd';
import {Markdown} from '../src/Markdown';
afterEach(()=>{cleanup();vi.restoreAllMocks()});

it('renders the prompt as semantic headings, paragraphs and nested lists instead of source markers',()=>{
 render(<Markdown>{'## 硬约束\n\n禁止 **字幕**，保留 `参考图`。\n\n- 保持形象\n  - 保留构图\n\n1. 检查场景\n2. 检查声音\n\n> 原文不改变\n\n---'}</Markdown>);
 expect(screen.getByRole('heading',{name:'硬约束',level:2})).toBeTruthy();
 expect(document.querySelector('strong')?.textContent).toBe('字幕');
 expect(document.querySelector('p code')?.textContent).toBe('参考图');
 expect(document.querySelectorAll('ul ul')).toHaveLength(1);
 expect(document.querySelectorAll('ol li')).toHaveLength(2);
 expect(document.querySelector('blockquote')?.textContent).toContain('原文不改变');
 expect(document.querySelector('hr')).toBeTruthy();
});
it('supports GFM aligned tables, read-only tasks, strikeout and autolinks',()=>{
 render(<Markdown>{'| 名称 | 数量 |\n| :--- | ---: |\n| 参考 | 4 |\n\n- [x] 已检查\n- [ ] 待确认\n\n~~旧文本~~ https://example.test/docs'}</Markdown>);
 expect(screen.getByRole('table')).toBeTruthy();expect(screen.getByRole('region',{name:'Markdown 表格'}).tabIndex).toBe(0);
 expect(screen.getByRole('columnheader',{name:'数量'}).style.textAlign).toBe('right');
 const checks=screen.getAllByRole('checkbox') as HTMLInputElement[];
 expect(checks.map(item=>[item.checked,item.disabled])).toEqual([[true,true],[false,true]]);
 expect(document.querySelector('del')?.textContent).toBe('旧文本');
 expect(screen.getByRole('link',{name:'https://example.test/docs'}).getAttribute('rel')).toBe('noopener noreferrer');
});
it('uses the shared code block and copies the complete original code beyond the preview',async()=>{
 const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 const code='const x = 1;\nconst y = 2;\nconsole.log(x + y);';
 render(<Markdown codePreviewLines={1}>{'```ts\n'+code+'\n```'}</Markdown>);
 expect(document.querySelector('.ls-code-block')).toBeTruthy();expect(screen.getByRole('button',{name:'复制'})).toBeTruthy();
 expect(screen.getByRole('button',{name:'展开全部 3 行'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'复制'}));expect(writeText).toHaveBeenCalledWith(code);
 expect(await screen.findByRole('status')).toBeTruthy();
});
it('keeps unsupported fences as readable text without executing them',()=>{
 render(<Markdown>{'```mermaid\ngraph LR\n A-->B\n```\n\n```python\nprint("hello")\n```'}</Markdown>);
 expect(document.querySelectorAll('.ls-code-block')).toHaveLength(2);
 expect(screen.getByText('A-->B')).toBeTruthy();
 expect(document.querySelector('.mermaid')).toBeNull();
});
it('uses natural-ratio ImageCard and lets the application open a preview',()=>{
 const onImagePreview=vi.fn();const view=render(<Markdown onImagePreview={onImagePreview}>{'文字\n\n![山谷](scene.png "场景参考")'}</Markdown>);
 expect(document.querySelector('p figure')).toBeNull();expect(document.querySelector('figure.ls-image-card')).toBeTruthy();
 expect(screen.getByRole('img',{name:'山谷'}).getAttribute('src')).toBe('scene.png');
 fireEvent.click(screen.getByRole('button',{name:'查看场景参考'}));expect(onImagePreview).toHaveBeenCalledWith({src:'scene.png',alt:'山谷',title:'场景参考'});
 view.rerender(<Markdown onImagePreview={onImagePreview}>{'[![山谷](scene.png)](https://example.test/original.png)'}</Markdown>);
 expect(document.querySelector('a button')).toBeNull();expect(screen.queryByRole('button',{name:'查看山谷'})).toBeNull();
 expect(screen.getByRole('link').getAttribute('href')).toBe('https://example.test/original.png');
});
it('ignores executable HTML and removes unsafe links and image URLs',()=>{
 render(<Markdown>{'<script>window.attacked=true</script>\n\n<img src="x" onerror="alert(1)">\n\n[危险](javascript:alert%281%29)\n\n![危险图](javascript:alert%281%29)'}</Markdown>);
 expect(document.querySelector('script')).toBeNull();expect(document.querySelector('[onerror]')).toBeNull();
 expect(screen.getByText('危险').closest('a')).toBeNull();expect(document.querySelector('img')).toBeNull();
});
it('renders inline and block math, rejects trusted HTML commands and can disable the extension',()=>{
 const view=render(<Markdown>{'公式 $E=mc^2$\n\n$$\n\\frac{1}{n}\\sum x_i\n$$\n\n$\\href{javascript:alert(1)}{bad}$'}</Markdown>);
 expect(document.querySelectorAll('.katex')).toHaveLength(3);expect(document.querySelector('math')).toBeTruthy();
 expect(document.querySelector('.katex-display')).toBeTruthy();expect(document.querySelector('[href^="javascript:"]')).toBeNull();
 view.rerender(<Markdown math={false}>{'价格 $5 和 $10；公式 $E=mc^2$'}</Markdown>);
 expect(document.querySelector('.katex')).toBeNull();expect(screen.getByText('价格 $5 和 $10；公式 $E=mc^2$')).toBeTruthy();
});
it('isolates footnote IDs and navigates inside the component without changing hash routes',()=>{
 const source='内容[^a]\n\n[^a]: 注释内容';render(<><Markdown>{source}</Markdown><Markdown>{source}</Markdown></>);
 const links=screen.getAllByRole('link',{name:'1'});expect(links).toHaveLength(2);expect(links[0].getAttribute('href')).not.toBe(links[1].getAttribute('href'));
 expect(links[0].getAttribute('aria-describedby')).not.toBe(links[1].getAttribute('aria-describedby'));
 const href=links[0].getAttribute('href')!;const target=document.getElementById(href.slice(1))!;
 const scroll=vi.fn();target.scrollIntoView=scroll;
 const event=new MouseEvent('click',{bubbles:true,cancelable:true});links[0].dispatchEvent(event);
 expect(event.defaultPrevented).toBe(true);expect(scroll).toHaveBeenCalledOnce();expect(document.activeElement).toBe(target);
});
it('inherits global medium sizing and honors explicit small and large overrides',()=>{
 const view=render(<Markdown aria-label="文档">内容</Markdown>);expect(screen.getByLabelText('文档').getAttribute('data-ls-size')).toBe('middle');
 view.rerender(<ConfigProvider componentSize="small"><Markdown aria-label="文档">内容</Markdown></ConfigProvider>);expect(screen.getByLabelText('文档').getAttribute('data-ls-size')).toBe('small');
 view.rerender(<ConfigProvider componentSize="small"><Markdown size="large" aria-label="文档">内容</Markdown></ConfigProvider>);expect(screen.getByLabelText('文档').getAttribute('data-ls-size')).toBe('large');
});
it('retains normal CommonMark soft and hard breaks and safely replaces previous content',()=>{
 const view=render(<Markdown>{'普通\n换行\n\n明确  \n换行'}</Markdown>);expect(document.querySelectorAll('br')).toHaveLength(1);
 view.rerender(<Markdown>{''}</Markdown>);expect(document.querySelector('.ls-markdown-content')?.textContent).toBe('');
 view.rerender(<Markdown>{'## 新内容'}</Markdown>);expect(screen.getByRole('heading',{name:'新内容'})).toBeTruthy();
});

it('can keep offline documents from requesting external or any image resources',()=>{
 const text='![远程](https://example.test/a.png)\n\n![相对](./assets/a.png)\n\n![跨域](//example.test/b.png)';
 const view=render(<Markdown images="local">{text}</Markdown>);
 expect(document.querySelectorAll('img')).toHaveLength(1);expect(screen.getByRole('img',{name:'相对'}).getAttribute('src')).toBe('./assets/a.png');
 expect(screen.getByRole('img',{name:'远程，未加载'})).toBeTruthy();
 view.rerender(<Markdown images="none">{text}</Markdown>);expect(document.querySelector('img')).toBeNull();
});

it('only creates locally resolved images after browser path normalization in offline mode',()=>{
 const slash=String.fromCharCode(92);
 const variants=['//example.test/a.png',slash.repeat(4)+'example.test/a.png','/'+slash.repeat(2)+'example.test/a.png','https://example.test/a.png'];
 render(<Markdown images="local">{variants.map((url,index)=>`![外链${index}](<${url}>)`).join('\n\n')}</Markdown>);
 for(const image of document.querySelectorAll('img'))expect(new URL(image.getAttribute('src')!, 'https://local.test/').origin).toBe('https://local.test');
 expect(screen.getByRole('img',{name:'外链0，未加载'})).toBeTruthy();
 expect(screen.getByRole('img',{name:'外链3，未加载'})).toBeTruthy();
 expect(screen.getAllByRole('img')).toHaveLength(4);
});

it('does not turn unsupported prompt identifier protocols into empty navigation links',()=>{
 render(<Markdown>{'参考 <realform:example:form-1>；[其他](unsupported:record-2)'}</Markdown>);
 expect(screen.queryByRole('link')).toBeNull();expect(screen.getByText(/realform:example:form-1/)).toBeTruthy();
});
it('can preserve prompt soft breaks without doubling hard breaks or changing fenced code',()=>{
 render(<Markdown breaks>{'镜头组：1\n总时长：5.5s  \n角色：示例\n场景：山谷\n\n```text\nline one\nline two\n```'}</Markdown>);
 expect(document.querySelectorAll('p br')).toHaveLength(3);
 expect(document.querySelector('.ls-code-block')?.textContent).toContain('line one');
 expect(document.querySelector('.ls-code-block')?.textContent).toContain('line two');
});

it('can show business prompt link labels as plain text while documents keep normal navigation',()=>{
 const source='参考 real[form:sample:1](character) 和 [文档](./guide.md)';
 const view=render(<Markdown links="text">{source}</Markdown>);expect(screen.queryByRole('link')).toBeNull();expect(screen.getByText(/form:sample:1/)).toBeTruthy();
 view.rerender(<Markdown>{source}</Markdown>);expect(screen.getAllByRole('link')).toHaveLength(2);expect(screen.getByRole('link',{name:'文档'}).getAttribute('href')).toBe('./guide.md');
});
