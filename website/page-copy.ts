import type {DocPage} from './catalog';
import {publicExampleSource} from './public-example-source';
import {registryCommand} from './registry';

export function pageInstallation(page:DocPage):{description:string;command?:string}|undefined {
 if(!page.id.startsWith('components/')&&!page.id.startsWith('blocks/'))return;
 if(page.localOnly)return {description:'该组件尚未发布。请在本地仓库执行 npm run build 和 npm pack，再安装生成的 tgz；当前线上 Registry 尚不包含此组件。'};
 return {description:'使用 shadcn CLI 安装；首次接入先配置 components.json，再将生成的 Provider 挂到应用根部。',command:registryCommand(page.source?'lanshang-blocks':'lanshang-provider')};
}

/** Copy the sections the reader can use, including required source files. */
export function pageMarkdown(page:DocPage,agentNotes?:readonly string[]):string {
 const sections=[`# ${page.title}`,page.description];
 const installation=pageInstallation(page);
 if(installation)sections.push(`## 安装与接入\n\n${installation.description}${installation.command?`\n\n\`\`\`bash\n${installation.command}\n\`\`\``:''}`);
 if(page.code)sections.push(`## 使用方式\n\n\`\`\`\n${publicExampleSource(page.code)}\n\`\`\``);
 if(page.source&&publicExampleSource(page.source)!==publicExampleSource(page.code||''))sections.push(`## 完整示例源码\n\n\`\`\`tsx\n${publicExampleSource(page.source)}\n\`\`\``);
 if(page.assets?.length)sections.push(`## 配套源码\n\n${page.assets.map(asset=>`### ${asset.filename}\n\n\`\`\`${asset.language||''}\n${publicExampleSource(asset.code)}\n\`\`\``).join('\n\n')}`);
 if(page.notes?.length)sections.push(`## 交互与边界\n\n${page.notes.map(note=>`- ${note}`).join('\n')}`);
 if(agentNotes?.length)sections.push(`## Agent 接入要点\n\n${agentNotes.map((note,index)=>`${index+1}. ${note}`).join('\n')}`);
 if(page.props?.length){
  const cell=(value:string)=>value.replace(/\|/g,'\\|').replace(/\n/g,' ');
  sections.push(`## API 参考\n\n| 属性 | 类型 | 说明 |\n| --- | --- | --- |\n${page.props.map(row=>`| ${row.map(cell).join(' | ')} |`).join('\n')}`);
 }
 return sections.join('\n\n');
}
