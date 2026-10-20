import {SourceCodeBlock} from '../dist/index.js';
const endpoint='https://example.test/api/projects/'+ 'long-project-name/'.repeat(18)+'configuration?view=complete';
const payload=JSON.stringify({items:Array.from({length:400},(_,id)=>({id,name:`项目 ${id} · 中文 😀`,description:'长文本/'.repeat(32),url:endpoint}))},null,2)+'\n';
export function CodeStressPreview(){return <div style={{display:'grid',gap:16,minWidth:0}}><SourceCodeBlock filename="长服务地址" language="text" code={endpoint}/><SourceCodeBlock filename="大段 JSON · 400 条记录" language="json" code={payload} previewLines={6}/></div>}
