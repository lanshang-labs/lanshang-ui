import {readFileSync,readdirSync} from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it} from 'vitest';
import {Markdown} from '../dist/index.js';
it('renders the shipped math bundle during SSR without depending on consumer overrides',()=>{
 const html=renderToStaticMarkup(<Markdown>{'## 提示词\n\n公式 $E=mc^2$\n\n$$\n\\frac{1}{n}\\sum x_i\n$$'}</Markdown>);
 expect(html).toContain('<h2>提示词</h2>');expect(html).toContain('katex-display');expect(html).toContain('<math');
 const versions=JSON.parse(readFileSync('dist/math/runtime-versions.json','utf8'));
 expect(versions.katex).toBe('0.19.0');
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 for(const name of ['katex','remark-math','rehype-katex'])expect(pkg.dependencies[name]).toBeUndefined();
 expect(readFileSync('dist/Markdown.js','utf8')).toContain('./markdown-math.js');
 expect(readFileSync('dist/markdown-math.js','utf8')).not.toMatch(/from ['"](?:katex|remark-math|rehype-katex)['"]/);
});
it('ships the complete local math font closure and bundled licenses',()=>{
 const css=readFileSync('dist/math/katex.css','utf8');
 const fonts=readdirSync('dist/math/fonts');
 for(const match of css.matchAll(/url\([^)]*fonts\/([^)'"?]+)[^)]*\)/g))expect(fonts).toContain(match[1]);
 const notices=readFileSync('dist/math/THIRD_PARTY_NOTICES.txt','utf8');
 for(const name of ['katex@0.19.0','remark-math@6.0.0','rehype-katex@7.0.1'])expect(notices).toContain(name);
 expect(readFileSync('dist/licenses/remark-math/LICENSE','utf8')).toContain('Permission is hereby granted');
});
