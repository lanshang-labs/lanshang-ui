import {readFileSync} from 'node:fs';
import {renderToStaticMarkup} from 'react-dom/server';
import {expect,it} from 'vitest';
import {Dock} from '@lanshang-labs/ui/dock';
it('renders the actual built public entry on the server without a Provider',()=>{
 const html=renderToStaticMarkup(<Dock label="应用入口" activeId="docs" items={[{id:'docs',label:'文档',icon:<svg/>,href:'/docs'}]}/>);
 expect(html).toContain('aria-label="应用入口"');expect(html).toContain('href="/docs"');expect(html).toContain('aria-current="page"');
 expect(readFileSync('dist/dock.d.ts','utf8')).toContain('DockProps');
 expect(readFileSync('dist/licenses/motion-primitives/LICENSE','utf8')).toBe(readFileSync('experiments/dock/upstream/LICENCE.md','utf8'));
});
