import './style-study-preview.css';

export function StyleStudyPreview(){return <div className="ls-style-study-preview">
 <div className="ls-style-study-summary"><div><span>完整页面样板</span><h3>同一套组件如何组成工作台</h3><p>这里展示的不是另一套主题，而是导航、搜索筛选、项目列表、表单和反馈放在同一页面时的阅读顺序与空间关系。</p></div><a href="./style-study.html" target="_blank" rel="noreferrer">打开完整样板 ↗</a></div>
 <div className="ls-style-study-points"><span><strong>01</strong> 页面骨架与内容层级</span><span><strong>02</strong> 中号控件与操作分组</span><span><strong>03</strong> 主题、状态与反馈</span></div>
 <div className="ls-style-study-frame"><iframe title="Studio 工作台样板实时预览" src="./style-study.html" loading="lazy"/></div>
 <p className="ls-style-study-caption">上方为同源页面的实时预览；在完整样板中可操作搜索、筛选、表单和主题切换。</p>
 </div>}
