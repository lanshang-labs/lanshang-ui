import fs from 'node:fs';
import postcss from 'postcss';
const root=postcss.parse(fs.readFileSync(new URL('./upstream/styles.css.txt',import.meta.url),'utf8'));
root.walkAtRules('font-face',r=>r.remove());
root.walkRules(r=>{
 let parent=r.parent;while(parent){if(parent.type==='atrule'&&parent.name.includes('keyframes'))return;parent=parent.parent;}
 const selectors=r.selectors.filter(s=>!s.includes('body')&&!s.includes('html')&&!s.includes('__className')&&!s.includes('__variable')&&!s.includes('nextjs'));
 if(!selectors.length){r.remove();return;}
 r.selectors=selectors.map(s=>s===':root'?'.bui':s==='.dark'?':root[data-theme="dark"] .bui':s.startsWith(':root')?s.replace(':root','.bui'):':is(.bui,.bui *):is('+s+')');
});
fs.writeFileSync(new URL('./beautiful-ui.css',import.meta.url),'/* Beautiful UI compiled CSS, scoped adapter. MIT — see LICENSE. */\n'+root.toString());
