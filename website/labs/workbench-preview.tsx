import './workbench-preview.css';
export function WorkbenchPreview(){
 return <div className="ls-workbench-preview"><div className="ls-workbench-intro"><div><span>模板实验 / 01</span><strong>Studio Workspace</strong><p>React + Ant Design 交互基础，组合独立的完整视觉。</p></div><div className="ls-workbench-links"><a href="./workbench-lab.html" target="_blank" rel="noreferrer">打开整页预览 <span aria-hidden="true">↗</span></a><a href="#/labs/shadcn-workbench">对比现成模板 →</a></div></div><iframe src="./workbench-lab.html" title="Lanshang Studio 后台工作台实验" loading="lazy"/><p className="ls-workbench-preview-note">可体验项目筛选、新建、详情、完成操作、团队与设置、浅暗主题、加载和失败恢复。数据仅保存在本地演示页面。</p></div>;
}
