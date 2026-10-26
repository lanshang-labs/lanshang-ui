import React, {useEffect, useRef, useState} from 'react';
import {version} from '../package.json';
import {createRoot} from 'react-dom/client';
import {ArrowUpRight} from '../dist/icons.js';
import {MotionButton, LanshangProvider, ThemeSwitch, ButtonGroup, RowActionButton, SearchField, DataTable, SourceCodeBlock, zhCNLocale} from '../dist/index.js';
import {matchesSearch,pages, type DocPage} from './catalog';
import {navigationGroups,navigationGroupFor,orderedDocPages} from './navigation';
import {agentGuidance} from './agent-guidance';
import {publicExampleSource} from './public-example-source';
import {pageMarkdown,pageInstallation} from './page-copy';
import {siteThemeStorageKey} from './site-config';
import '../dist/styles.css';
import '../examples/gallery.css';
import './site.css';
import './docs-layout.css';
const route=()=>location.hash.replace(/^#\/?/,'')||'guide/introduction';
const orderedPages=orderedDocPages(pages);
function CopyButton({text,label='复制代码'}:{text:string;label?:string}){const [message,setMessage]=useState('');useEffect(()=>setMessage(''),[text]);return <><MotionButton type="text" size="middle" motionIcon="copy" aria-label={label} title={message||label} onClick={async()=>{try{await navigator.clipboard.writeText(text);setMessage('已复制')}catch{setMessage('复制失败，请手动选择')}}}/><span className="docs-sr-only" role="status">{message}</span></>}
function Code({source}:{source:string}){const shell=/^(npx|npm) /.test(source.trim());return <SourceCodeBlock code={source} filename={shell?'terminal.sh':'example.tsx'} language={shell?'bash':'tsx'}/>}
const primaryNavigation=[['guide','文档','guide/introduction'],['patterns','规范','patterns/motion'],['components','组件','components/button'],['layouts','布局','workspace-layout.html'],['blocks','区块','blocks/list'],['labs','实验室','labs/admin-workbench']] as const;

function DocsNavigation({visible,id,search,openGroup,onToggle,onNavigate}:{visible:DocPage[];id:string;search:string;openGroup:string;onToggle:(key:string)=>void;onNavigate:()=>void}){
 return <nav aria-label="文档目录">{navigationGroups.map(group=>{
  const items=visible.filter(page=>(group.pageGroups as readonly string[]).includes(page.group));
  if(!items.length)return null;
  const expanded=!!search.trim()||openGroup===group.key;
  return <section className="docs-nav-section" key={group.key}>
   <h2><MotionButton size="middle" type="text" motionIcon="expand" iconActive={expanded} className="docs-nav-heading" aria-expanded={expanded} aria-controls={`docs-nav-${group.key}`} onClick={()=>onToggle(group.key)}>{group.label}<span className="docs-nav-count">{items.length}</span></MotionButton></h2>
   <div id={`docs-nav-${group.key}`} className="docs-nav-items" hidden={!expanded}>{items.map(page=><a key={page.id} href={`#/${page.id}`} aria-current={id===page.id?'page':undefined} onClick={onNavigate}>{page.title}</a>)}</div>
  </section>;
 })}{!visible.length&&<p className="docs-muted" role="status">没有匹配的文档</p>}</nav>;
}

function Example({page}:{page:DocPage}){const [showCode,setShowCode]=useState(false);return <section id="demo" tabIndex={-1} className="docs-preview-panel"><div className="docs-preview-toolbar"><ButtonGroup aria-label="示例视图"><RowActionButton aria-pressed={!showCode} onClick={()=>setShowCode(false)}>预览</RowActionButton><RowActionButton aria-pressed={showCode} disabled={!page.code&&!page.source} onClick={()=>setShowCode(true)}>代码</RowActionButton></ButtonGroup><span>Lanshang UI · React</span></div>{showCode?<Code source={publicExampleSource(page.code||page.source||'')}/>:<div className={`docs-example ${page.id==='patterns/states'||page.previewLayout==='workspace'?'docs-example-full':''}`}>{page.demo?React.createElement(page.demo):<p className="docs-muted">阅读下方接入说明与示例代码。</p>}</div>}</section>}
function jump(id:string){document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.getElementById(id)?.focus({preventScroll:true})}
function Site(){
 const [id,setId]=useState(route),[search,setSearch]=useState(''),[menu,setMenu]=useState(false),[activeSection,setActiveSection]=useState('demo');
 const [narrow,setNarrow]=useState(()=>window.matchMedia('(max-width: 760px)').matches);
 const menuButton=useRef<React.ComponentRef<typeof MotionButton>>(null);
 const menuPanel=useRef<HTMLElement>(null);
 const body=useRef<HTMLDivElement>(null);
 const focusContentOnRoute=useRef(false);
 const page=orderedPages.find(p=>p.id===id),index=orderedPages.findIndex(p=>p.id===id);
 const agentNotes=page&&agentGuidance[page.id];
 const currentGroup=page&&navigationGroupFor(page);
 const [openGroup,setOpenGroup]=useState<string>(()=>{const initial=pages.find(p=>p.id===route());return navigationGroupFor(initial||{id:'',group:'开始使用'})?.key||'guide';});
 const section= id.startsWith('blocks/')?'blocks':id.startsWith('components/')?'components':'guide';
 const primarySection=currentGroup?.key==='labs'?'labs':currentGroup?.key==='blocks'?'blocks':currentGroup?.key==='guide'?'guide':currentGroup?.key==='patterns'?'patterns':'components';
 const sections=[...(page?.demo?[['demo','预览与代码']]:[]),...(section==='components'||section==='blocks'?[['installation','安装与接入']]:[]),...(page?.code?[['usage','使用方式']]:[]),...(page?.assets?.length?[['assets','配套源码']]:[]),...(page?.notes?[['notes','交互与边界']]:[]),...(agentNotes?[['agent','Agent 接入']]:[]),...(page?.props?[['api','API 参考']]:[])];
 useEffect(()=>{const changed=()=>{setId(route());setMenu(false)};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed)},[]);
 useEffect(()=>{if(!menu||!narrow)return;const key=(e:KeyboardEvent)=>{
  if(e.key==='Escape'){e.preventDefault();setMenu(false);menuButton.current?.focus();return}
  if(e.key!=='Tab')return;
  const panel=menuPanel.current;
  if(!panel)return;
  const focusable=Array.from(panel.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(node=>node.getClientRects().length>0);
  const first=focusable[0],last=focusable[focusable.length-1];
  if(!first||!last){e.preventDefault();panel.focus();return}
  if(!panel.contains(document.activeElement)||document.activeElement===panel){e.preventDefault();(e.shiftKey?last:first).focus();return}
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 };window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[menu,narrow]);
 useEffect(()=>{if(menu&&narrow)menuPanel.current?.focus({preventScroll:true})},[menu,narrow]);
 useEffect(()=>{const element=body.current;if(!element)return;element.inert=menu&&narrow;return()=>{element.inert=false}},[menu,narrow]);
 useEffect(()=>{if(!menu&&focusContentOnRoute.current&&route()===id){focusContentOnRoute.current=false;document.getElementById('docs-content')?.focus({preventScroll:true})}},[menu,id]);
 useEffect(()=>{const media=window.matchMedia('(max-width: 760px)');const syncWidth=()=>{setNarrow(media.matches);if(!media.matches)setMenu(false)};media.addEventListener('change',syncWidth);return()=>media.removeEventListener('change',syncWidth)},[]);
 useEffect(()=>{document.title=`${page?.title||'页面未找到'} · Lanshang UI`;window.scrollTo(0,0);setActiveSection('demo');if(currentGroup)setOpenGroup(currentGroup.key);setSearch(current=>page&&matchesSearch(page,current)?current:'');const observer=new IntersectionObserver(entries=>{const entry=entries.find(item=>item.isIntersecting);if(entry)setActiveSection(entry.target.id)},{rootMargin:'-80px 0px -55% 0px'});document.querySelectorAll('.docs-main > section[id]').forEach(el=>observer.observe(el));return()=>observer.disconnect()},[id]);
 const visible=orderedPages.filter(p=>matchesSearch(p,search));
 const source=page?.source&&publicExampleSource(page.source);
 const pageText=page?pageMarkdown(page,agentNotes||undefined):'';
 const install=page&&pageInstallation(page);
 const toggleGroup=(key:string)=>setOpenGroup(group=>group===key?'':key);
 return <div className="docs-shell" data-lab-workspace={page?.previewLayout==='workspace'}><a className="docs-skip" href="#docs-content" onClick={e=>{e.preventDefault();document.getElementById('docs-content')?.focus()}}>跳到正文</a>
 <header className="docs-header"><a className="docs-brand" href="#/guide/introduction"><ArrowUpRight width={24} height={24}/><strong>lanshang<span>.</span></strong><span className="docs-brand-label">UI</span></a><nav className="docs-top-links" aria-label="站点导航">{primaryNavigation.map(([key,label,target])=><a key={key} href={key==='layouts'?'./workspace-layout.html':`#/${target}`} aria-current={primarySection===key?'page':undefined}>{label}</a>)}</nav><div className="docs-top-search"><SearchField size="middle" aria-label="搜索文档" placeholder="搜索组件与文档…" value={search} onChange={value=>{setSearch(value);if(value)setMenu(true)}}/></div><a className="docs-github" href="https://github.com/lanshang-labs/lanshang-ui">GitHub ↗</a><span className="docs-version">{version}</span><MotionButton ref={menuButton} size="middle" motionIcon="sidebar" iconActive={menu} className="docs-menu-toggle" aria-label="目录" title="目录" aria-expanded={menu} aria-controls="docs-navigation" onClick={()=>setMenu(!menu)}/><ThemeSwitch compact variant="toggle"/></header>
 {menu&&narrow&&<MotionButton type="text" tabIndex={-1} className="docs-menu-backdrop" aria-label="关闭目录" onClick={()=>{setMenu(false);menuButton.current?.focus()}}/>}
 <aside ref={menuPanel} id="docs-navigation" tabIndex={-1} role={menu&&narrow?'dialog':undefined} aria-modal={menu&&narrow?'true':undefined} aria-label={menu&&narrow?'文档目录':undefined} className={`docs-sidebar ${menu?'is-open':''}`}><div className="docs-mobile-search"><SearchField size="middle" aria-label="搜索目录" placeholder="搜索组件与文档…" value={search} onChange={setSearch}/></div><DocsNavigation visible={visible} id={id} search={search} openGroup={openGroup} onToggle={toggleGroup} onNavigate={()=>{focusContentOnRoute.current=menu;setMenu(false)}}/><footer>Beautiful UI · Ant Design · Iconoir<br/>MIT 开源 · 样例不连接业务服务</footer></aside>
 <div ref={body} className="docs-body"><main id="docs-content" className="docs-main" tabIndex={-1}>{page?<><nav className="docs-breadcrumb" aria-label="面包屑">{currentGroup?<a href={`#/${currentGroup.order[0]}`}>{currentGroup.label}</a>:<span>{page.group}</span>}<span aria-hidden="true">/</span><span aria-current="page">{page.title}</span></nav><div className="docs-title-row"><h1>{page.title}</h1><div className="docs-page-tools"><CopyButton text={pageText} label="复制页面"/>{index>0&&<MotionButton type="text" size="middle" motionIcon="back" aria-label="上一页" title={orderedPages[index-1].title} href={`#/${orderedPages[index-1].id}`}/>}{index<orderedPages.length-1&&<MotionButton type="text" size="middle" motionIcon="forward" aria-label="下一页" title={orderedPages[index+1].title} href={`#/${orderedPages[index+1].id}`}/>}</div></div><p className="docs-description">{page.description}</p>{page.id==='components/workspace-layout'&&<p><a href="./workspace-layout.html#dock">进入独立布局工作台 ↗</a></p>}
 {page.demo&&<Example key={id} page={page}/>}
 {install&&<section id="installation" tabIndex={-1} className="docs-section"><h2>安装与接入</h2><p className="docs-muted">{install.description}</p>{install.command&&<Code source={install.command}/>}<a href="#/guide/registry">查看完整接入指南 →</a>{source&&<p><a download={`${page.id.split('/').pop()}-example.tsx`} href={`data:text/plain;charset=utf-8,${encodeURIComponent(source)}`}>下载示例源码 ↓</a><span className="docs-muted"> · 复制后由应用维护，示例数据需替换。</span></p>}</section>}
 {page.code&&<section id="usage" tabIndex={-1} className="docs-section"><h2>使用方式</h2><Code source={publicExampleSource(page.code)}/></section>}
 {!!page.assets?.length&&<section id="assets" tabIndex={-1} className="docs-section docs-assets"><h2>配套源码</h2><p className="docs-muted">复制完整示例时，请一并保存这些样式或辅助文件。</p>{page.assets.map(asset=><SourceCodeBlock key={asset.filename} filename={asset.filename} language={asset.language} code={publicExampleSource(asset.code)}/>)}</section>}
 {page.notes&&<section id="notes" tabIndex={-1} className="docs-notes"><h2>交互与边界</h2><ul>{page.notes.map(note=><li key={note}>{note}</li>)}</ul></section>}
 {agentNotes&&<section id="agent" tabIndex={-1} className="docs-agent"><div className="docs-agent-title"><h2>给 Agent 的接入要点</h2><CopyButton text={`Lanshang UI · ${page.title}\n${agentNotes.map((note,index)=>`${index+1}. ${note}`).join('\n')}`} label="复制要点"/></div><ol>{agentNotes.map(note=><li key={note}>{note}</li>)}</ol></section>}
 {page.props&&<section id="api" tabIndex={-1} className="docs-api"><h2>API 参考</h2><DataTable size="small" rowKey="name" pagination={false} scroll={{x:520}} columns={[{title:'属性',dataIndex:'name'},{title:'类型',dataIndex:'type',render:v=><code>{v}</code>},{title:'说明',dataIndex:'description'}]} dataSource={page.props.map(([name,type,description])=>({name,type,description}))}/></section>}
 <div className="docs-pager">{index>0?<a href={`#/${orderedPages[index-1].id}`}>← {orderedPages[index-1].title}</a>:<span/>}{index<orderedPages.length-1&&<a href={`#/${orderedPages[index+1].id}`}>{orderedPages[index+1].title} →</a>}</div></>:<><h1>页面未找到</h1><a href="#/guide/introduction">返回介绍</a></>}<footer className="docs-footer"><span>Lanshang UI · 清晰、紧凑，专注业务。</span><a href="#/guide/releases">版本</a><a href="./licenses.txt">许可证</a></footer></main>
 {page&&<aside className="docs-toc" aria-label="页内目录"><strong>本页内容</strong>{sections.map(([target,label])=><a key={target} href={`#${target}`} aria-current={activeSection===target?'location':undefined} onClick={e=>{e.preventDefault();jump(target);setActiveSection(target)}}>{label}</a>)}</aside>}</div></div>;
}
createRoot(document.getElementById('root')!).render(<LanshangProvider storageKey={siteThemeStorageKey} locale={zhCNLocale}><Site/></LanshangProvider>);
