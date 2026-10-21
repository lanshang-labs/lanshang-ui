import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {MarkdownPreview} from '../website/markdown-preview';
afterEach(cleanup);
it('shows the prompt hierarchy and the complete example with real shared code, math, image and footnotes',()=>{
 render(<MarkdownPreview/>);
 expect(screen.getByRole('heading',{name:'硬约束'})).toBeTruthy();
 expect(screen.getByRole('checkbox',{name:'保留完整角色构图'})).toBeTruthy();
 fireEvent.click(screen.getByRole('tab',{name:'完整语法'}));
 expect(document.querySelector('.ls-code-block')).toBeTruthy();
 expect(document.querySelector('.katex-display')).toBeTruthy();
 expect(screen.getByRole('img',{name:'山间薄雾'}).getAttribute('src')).toContain('markdown-landscape.svg');
 expect(screen.getByRole('button',{name:'查看山间薄雾 · 自然比例'})).toBeTruthy();
 expect(screen.getByRole('link',{name:'1'})).toBeTruthy();
});
