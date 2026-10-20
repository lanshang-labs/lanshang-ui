import { readdir, mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
async function copy(dir='src') { for (const e of await readdir(dir,{withFileTypes:true})) { const path=join(dir,e.name); if(e.isDirectory()) { if(e.name!=='upstream') await copy(path); } else if(/\.(css)$/.test(e.name)||e.name==='LICENSE') {const dest=path.replace(/^src/,'dist');await mkdir(dirname(dest),{recursive:true});await copyFile(path,dest);} } }
await copy();

// Package self-hosted font files with relative URLs; no consumer CDN dependency.
let fontCss = '/* Inter and Noto Sans SC: SIL OFL 1.1, see each fonts directory LICENSE. */\n';
for (const name of ['inter', 'noto-sans-sc']) {
  const source = `node_modules/@fontsource-variable/${name}`;
  const target = `dist/fonts/${name}`;
  await mkdir(target, {recursive:true});
  const css = await readFile(`${source}/index.css`, 'utf8');
  const files = [...css.matchAll(/url\(\.\/files\/([^)]*)\)/g)].map(match=>match[1]);
  for (const file of new Set(files)) await copyFile(`${source}/files/${file}`, `${target}/${file}`);
  await copyFile(`${source}/LICENSE`, `${target}/LICENSE`);
  fontCss += css.replaceAll('./files/', `./fonts/${name}/`);
}
await writeFile('dist/fonts.css', fontCss);
