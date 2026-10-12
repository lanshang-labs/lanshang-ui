import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button} from 'antd';
import {ArrowUpRight} from 'iconoir-react';
import {LanshangProvider, ThemeSwitch, SearchField, DataTable} from '../dist/index.js';
import {pages} from './catalog';
import '../dist/styles.css';
import '../examples/gallery.css';
import './site.css';
const route=()=>location.hash.replace(/^#\/?/,'')||'guide/introduction';
function CodeExample({source}:{source:string}){
 const [message,setMessage]=useState('');
 useEffect(()=>setMessage(''),[source]);
 return <details className="docs-code"><summary>查看示例代码</summary><div className="docs-code-head"><span>TSX / CSS</span><Button onClick={async()=>{try{await navigator.clipboard.writeText(source);setMessage('已复制');}catch{setMessage('复制失败，请选择代码手动复制');}}}>复制代码</Button></div><pre tabIndex={0}><code>{source}</code></pre><span role="status" className="docs-copy-state">{message}</span></details>;
}
function Site(){
 const [id,setId]=useState(route),[search,setSearch]=useState(''),[menu,setMenu]=useState(false);
 const page=pages.find(p=>p.id===id), index=pages.findIndex(p=>p.id===id);
 useEffect(()=>{const changed=()=>{setId(route());setMenu(false);};window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
 useEffect(()=>{document.title=`${page?.title||'页面未找到'} · Lanshang UI`;window.scrollTo(0,0);},[id]);
 const visible=pages.filter(p=>`${p.title} ${p.en} ${p.description}`.toLowerCase().includes(search.trim().toLowerCase()));
 return <div className="docs-shell"><a className="docs-skip" href="#docs-content" onClick={e=>{e.preventDefault();document.getElementById('docs-content')?.focus();}}>跳到正文</a><header className="docs-header"><a className="docs-brand" href="#/guide/introduction"><ArrowUpRight width={24} height={24}/><strong>lanshang<span>.</span></strong><span className="docs-brand-label">UI</span></a><span className="docs-header-caption">清晰、紧凑，专注业务</span><span className="docs-version">0.2.0</span><Button className="docs-menu-toggle" aria-expanded={menu} aria-controls="docs-navigation" onClick={()=>setMenu(!menu)}>目录</Button><ThemeSwitch/></header>
 <aside id="docs-navigation" className={`docs-sidebar ${menu?'is-open':''}`}><SearchField aria-label="搜索文档" placeholder="搜索组件或指南" value={search} onChange={setSearch}/><nav aria-label="文档目录">{[...new Set(pages.map(p=>p.group))].map(group=>{const items=visible.filter(p=>p.group===group);return items.length>0&&<section key={group}><h2>{group}</h2>{items.map(p=><a key={p.id} href={`#/${p.id}`} aria-current={id===p.id?'page':undefined} onClick={()=>setMenu(false)}><span>{p.title}</span><small>{p.en}</small></a>)}</section>})}{!visible.length&&<p className="docs-muted" role="status">没有匹配的文档</p>}</nav><footer>Ant Design · Beautiful UI · Iconoir<br/>MIT 开源 · 示例不连接业务服务</footer></aside>
 <main id="docs-content" className="docs-main" tabIndex={-1}>{page?<><div className="docs-breadcrumb">{page.group}<span>/</span>{page.en}</div><h1>{page.title}</h1><p className="docs-description">{page.description}</p><div className="docs-jump"><a href="#demo" onClick={e=>{e.preventDefault();document.getElementById('demo')?.scrollIntoView({behavior:'smooth'});}}>示例与说明</a>{page.props&&<a href="#api" onClick={e=>{e.preventDefault();document.getElementById('api')?.scrollIntoView({behavior:'smooth'});}}>参数</a>}</div><section id="demo">{page.demo&&<div className={`docs-example ${page.id==='patterns/states'?'docs-example-full':''}`}>{React.createElement(page.demo)}</div>}{page.code&&<CodeExample source={page.code}/>}</section>{page.notes&&<section className="docs-notes"><h2>使用说明</h2><ul>{page.notes.map(note=><li key={note}>{note}</li>)}</ul></section>}{page.props&&<section id="api" className="docs-api"><h2>参数</h2><DataTable rowKey="name" pagination={false} scroll={{x:520}} columns={[{title:'属性',dataIndex:'name'},{title:'类型',dataIndex:'type',render:v=><code>{v}</code>},{title:'说明',dataIndex:'description'}]} dataSource={page.props.map(([name,type,description])=>({name,type,description}))}/></section>}<div className="docs-pager">{index>0?<a href={`#/${pages[index-1].id}`}>← {pages[index-1].title}</a>:<span/>}{index<pages.length-1&&<a href={`#/${pages[index+1].id}`}>{pages[index+1].title} →</a>}</div></>:<><h1>页面未找到</h1><p>该地址不在当前版本的文档中。</p><a href="#/guide/introduction">返回介绍</a></>}<footer className="docs-footer">Lanshang UI · 组件与业务逻辑各有归属。<a href="#/guide/releases">版本与来源</a><a href="./licenses.txt">许可证</a><a href="https://github.com/lanshang-labs/lanshang-ui">GitHub</a></footer></main></div>;
}
createRoot(document.getElementById('root')!).render(<LanshangProvider storageKey="lanshang-docs.theme"><Site/></LanshangProvider>);
