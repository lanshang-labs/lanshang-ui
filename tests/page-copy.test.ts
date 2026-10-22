import {expect,it} from 'vitest';
import {pages} from '../website/catalog';
import {pageMarkdown} from '../website/page-copy';

it('copies public imports and the helpers shown with composed examples',()=>{
 const page=pages.find(item=>item.id==='patterns/overlay-recovery');
 expect(page).toBeTruthy();
 const markdown=pageMarkdown(page!);
 expect(markdown).toContain('### overlay-popup-container.ts');
 expect(markdown).toContain("from '@lanshang-labs/ui'");
 expect(markdown).not.toContain("from '../dist/index.js'");
});

it('keeps installation and API details aligned with the visible page',()=>{
 const button=pages.find(item=>item.id==='components/button')!;
 const buttonCopy=pageMarkdown(button);
 expect(buttonCopy).toContain('## 安装与接入');
 expect(buttonCopy).toContain('该组件尚未发布');
 expect(buttonCopy).toContain('| 属性 | 类型 | 说明 |');
 expect(buttonCopy).toContain('button \\| submit \\| reset');
 const block=pages.find(item=>item.id==='blocks/list')!;
 expect(pageMarkdown(block)).toContain('r/lanshang-blocks.json');
});

it('gives every component page a discoverable API reference',()=>{
 const missing=pages.filter(page=>page.id.startsWith('components/')&&!page.props?.length).map(page=>page.id);
 expect(missing).toEqual([]);
});

it('publishes chart installation with its optional engine and public source entrypoint',()=>{
 const page=pages.find(item=>item.id==='components/analytics')!;
 const markdown=pageMarkdown(page);
 expect(markdown).not.toContain('该组件尚未发布');
 expect(markdown).toContain('npm install @ant-design/plots@2.6.8');
 expect(markdown).toContain("from '@lanshang-labs/ui/charts'");
 expect(markdown).not.toContain('../dist/charts.js');
});
