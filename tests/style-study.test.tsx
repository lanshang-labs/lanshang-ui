import {afterEach,expect,it} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {LanshangProvider} from '../dist/index.js';
import {StyleStudy} from '../website/style-study';
import {StyleStudyPreview} from '../website/style-study-preview';
afterEach(()=>{cleanup();localStorage.clear()});
function show(){return render(<LanshangProvider storageKey="study-test" defaultMode="dark"><StyleStudy/></LanshangProvider>)}
it('filters, resets and focuses search without stealing typing',()=>{show();fireEvent.change(screen.getByRole('textbox',{name:'搜索项目'}),{target:{value:'不存在'}});expect(screen.getByText('没有匹配的项目')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'重置',exact:true}));expect(screen.getByRole('button',{name:'编辑设计系统'}).classList.contains('ant-btn-sm')).toBe(true);expect(screen.getByRole('button',{name:'编辑文档工作台'})).toBeTruthy();expect(screen.getByRole('button',{name:'编辑项目协作'})).toBeTruthy();fireEvent.keyDown(document,{key:'/'});expect(document.activeElement).toBe(screen.getByRole('textbox',{name:'搜索项目'}));const name=screen.getByRole('textbox',{name:/项目名称/});name.focus();fireEvent.keyDown(name,{key:'/'});expect(document.activeElement).toBe(name)},15000);
it('validates, preserves form values and reports a local save',async()=>{show();fireEvent.click(screen.getByRole('button',{name:'新建项目'}));expect(document.activeElement).toBe(screen.getByRole('textbox',{name:/项目名称/}));fireEvent.click(screen.getByRole('button',{name:'保存更改'}));expect(screen.getByRole('alert').textContent).toContain('请输入项目名称');fireEvent.change(screen.getByRole('textbox',{name:/项目名称/}),{target:{value:'新的样例'}});fireEvent.click(screen.getByRole('button',{name:'保存更改'}));expect(screen.getByRole('button',{name:/保存中…/}).getAttribute('aria-busy')).toBe('true');await screen.findByText('已保存到本页样例');expect((screen.getByRole('textbox',{name:/项目名称/}) as HTMLInputElement).value).toBe('新的样例')},15000);
it('switches themes and restores the browser preference',()=>{const view=show();fireEvent.click(screen.getByRole('button',{name:'切换到浅色模式'}));expect(document.querySelector('[data-study-theme]')?.getAttribute('data-study-theme')).toBe('light');view.unmount();show();expect(screen.getByRole('button',{name:'切换到暗色模式'})).toBeTruthy()});

it('tracks the current Studio section in its sidebar',()=>{const previousHash=window.location.hash;try{window.history.replaceState(null,'','#study-guide');show();const navigation=screen.getByRole('navigation',{name:'样板导航'});expect(navigation.querySelector('a[aria-current="location"]')?.textContent).toContain('使用指南');fireEvent.click(screen.getByRole('link',{name:'空间设置'}));expect(navigation.querySelector('a[aria-current="location"]')?.textContent).toContain('空间设置');window.history.replaceState(null,'','#study-main');fireEvent(window,new Event('hashchange'));expect(navigation.querySelector('a[aria-current="location"]')?.textContent).toContain('项目空间')}finally{window.history.replaceState(null,'',previousHash||window.location.pathname)}});

it('filters with the shared Select and opens details from the visible project name',()=>{show();fireEvent.mouseDown(screen.getByRole('combobox',{name:'筛选状态'}));fireEvent.click(screen.getByText('待确认',{selector:'.ant-select-item-option-content'}));expect(screen.queryByRole('button',{name:'编辑设计系统'})).toBeNull();const project=screen.getByRole('button',{name:'选择文档工作台编辑详情'});fireEvent.click(project);expect(project.getAttribute('aria-pressed')).toBe('true');expect((screen.getByRole('textbox',{name:/项目名称/}) as HTMLInputElement).value).toBe('文档工作台');fireEvent.change(screen.getByRole('textbox',{name:/项目名称/}),{target:{value:'未保存修改'}});fireEvent.click(screen.getByRole('button',{name:'还原'}));expect((screen.getByRole('textbox',{name:/项目名称/}) as HTMLInputElement).value).toBe('文档工作台')},15000);

it('keeps Studio entry and documentation links inside a deployed subpath',()=>{
 render(<StyleStudyPreview/>);
 const site='https://example.test/lanshang-ui/';
 expect(new URL(screen.getByRole('link',{name:/打开完整样板/}).getAttribute('href')!,site).href).toBe(`${site}style-study.html`);
 expect(new URL(screen.getByTitle('Studio 工作台样板实时预览').getAttribute('src')!,site).href).toBe(`${site}style-study.html`);
 cleanup();show();
 const studio=`${site}style-study.html`;
 expect(new URL(screen.getByRole('link',{name:/lanshang/}).getAttribute('href')!,studio).href).toBe(site);
 expect(new URL(screen.getByRole('link',{name:/组件文档/}).getAttribute('href')!,studio).href).toBe(`${site}#/components/navigation-link`);
 expect(new URL(screen.getByRole('link',{name:/查看设计变量/}).getAttribute('href')!,studio).href).toBe(`${site}#/guide/theme`);
});
