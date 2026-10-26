import {readFile, writeFile} from 'node:fs/promises';
const files=['src/licenses/ant-design-plots/LICENSE','node_modules/@antv/g2/LICENSE','LICENSE','THIRD_PARTY_NOTICES.md','src/beautiful-ui/LICENSE','node_modules/antd/LICENSE','node_modules/react-markdown/license','node_modules/remark-gfm/license','node_modules/remark-breaks/license','dist/math/THIRD_PARTY_NOTICES.txt','node_modules/katex/LICENSE','node_modules/react/LICENSE','node_modules/react-dom/LICENSE','node_modules/iconoir-react/LICENSE','node_modules/@fontsource-variable/inter/LICENSE','node_modules/@fontsource-variable/noto-sans-sc/LICENSE'];
files.push('experiments/shadcn-dashboard/LICENSE.md','experiments/shadcn-dashboard/DEPENDENCY_NOTICES.txt','experiments/shadcn-dashboard/foundation-reference/LICENSING.md','experiments/shadcn-dashboard/foundation-reference/apps/origin/LICENSE.md');
files.push('src/licenses/motion-primitives/LICENSE','experiments/dock/upstream/LICENCE.md','node_modules/motion/LICENSE.md','node_modules/framer-motion/LICENSE.md','node_modules/motion-dom/LICENSE.md','node_modules/motion-utils/LICENSE.md','node_modules/lucide-react/LICENSE');
const sections=await Promise.all(files.map(async path=>`=== ${path} ===\n\n${await readFile(path,'utf8')}`));
export const licenseText = sections.join('\n\n');
if (process.argv[1]?.endsWith('docs-notices.mjs')) {
await writeFile('site-dist/licenses.txt',licenseText);
await writeFile('site-dist/.nojekyll','');

}
