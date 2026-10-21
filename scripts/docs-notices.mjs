import {readFile, writeFile} from 'node:fs/promises';
const files=['LICENSE','THIRD_PARTY_NOTICES.md','src/beautiful-ui/LICENSE','node_modules/antd/LICENSE','node_modules/react-markdown/license','node_modules/remark-gfm/license','node_modules/remark-breaks/license','dist/math/THIRD_PARTY_NOTICES.txt','node_modules/katex/LICENSE','node_modules/react/LICENSE','node_modules/react-dom/LICENSE','node_modules/iconoir-react/LICENSE','node_modules/@fontsource-variable/inter/LICENSE','node_modules/@fontsource-variable/noto-sans-sc/LICENSE'];
const sections=await Promise.all(files.map(async path=>`=== ${path} ===\n\n${await readFile(path,'utf8')}`));
export const licenseText = sections.join('\n\n');
if (process.argv[1]?.endsWith('docs-notices.mjs')) {
await writeFile('site-dist/licenses.txt',licenseText);
await writeFile('site-dist/.nojekyll','');

}
