import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {LanshangProvider,motion} from '../dist/index.js';
import {MotionPreview} from '../website/motion-preview';
afterEach(cleanup);
it('keeps state and actions functional with reduced motion and narrow preview',()=>{
 const {container}=render(<MotionPreview/>);
 const stage=within(container.querySelector('.motion-lab-stage') as HTMLElement);
 fireEvent.click(screen.getByRole('switch',{name:'减少样例动态效果'}));
 expect(container.querySelector('[data-ls-motion="reduce"]')).not.toBeNull();
 fireEvent.click(screen.getByRole('switch',{name:'320px 窄屏样例'}));
 expect((container.querySelector('.motion-lab-stage') as HTMLElement).style.maxWidth).toBe('320px');
 expect((container.querySelector('.ls-size-standard') as HTMLElement).style.maxWidth).toBe('320px');
 fireEvent.click(stage.getByRole('button',{name:'右对齐'}));
 expect(stage.getByRole('button',{name:'右对齐'}).getAttribute('aria-pressed')).toBe('true');
 fireEvent.change(stage.getByRole('textbox',{name:'动效关键词'}),{target:{value:'文档'}});
 fireEvent.click(stage.getByRole('button',{name:'动效搜索'}));expect(stage.getByText('已搜索：文档')).toBeTruthy();
 fireEvent.click(stage.getByRole('button',{name:'清空'}));expect((stage.getByRole('textbox',{name:'动效关键词'}) as HTMLInputElement).value).toBe('');
},20000);
it('uses the shared table for motion parameters with the same documented values',()=>{
 const {container}=render(<MotionPreview/>);
 const table=within(container.querySelector('.motion-lab-table') as HTMLElement);
 expect(table.getByRole('table')).toBeTruthy();
 expect(table.getAllByRole('row')).toHaveLength(8);
 expect(table.getByText(`${motion.duration.selection}ms`)).toBeTruthy();
 expect(table.getByText(motion.easing.selection)).toBeTruthy();
});
it('ends loading only through explicit completion and blocks duplicate starts',()=>{
 const {container}=render(<MotionPreview/>),stage=within(container.querySelector('.motion-lab-stage') as HTMLElement);
 const start=stage.getByRole('button',{name:'开始模拟请求'}),end=stage.getByRole('button',{name:'结束请求'});
 expect((end as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(start);expect(start.getAttribute('aria-busy')).toBe('true');
 fireEvent.click(start);expect(stage.getByText('模拟请求进行中')).toBeTruthy();
 fireEvent.click(end);expect(start.getAttribute('aria-busy')).toBe('false');expect(stage.getByText('模拟请求已结束')).toBeTruthy();
 expect((end as HTMLButtonElement).disabled).toBe(true);
});

it('uses the root provider for theme changes and shares motion values across themes',()=>{
 localStorage.removeItem('motion-test');
 render(<LanshangProvider storageKey="motion-test" defaultMode="light"><MotionPreview/></LanshangProvider>);
 expect(document.documentElement.dataset.theme).toBe('light');
 fireEvent.click(screen.getByRole('switch',{name:'样例暗色主题'}));
 expect(document.documentElement.dataset.theme).toBe('dark');
 expect(document.documentElement.style.getPropertyValue('--ls-motion-selection')).toBe(`${motion.duration.selection}ms`);
 for(const name of ['loading','progressCycle','iconSpin'] as const){
  expect(document.documentElement.style.getPropertyValue(`--ls-motion-${name}`)).toBe(`${motion.duration[name]}ms`);
 }
 fireEvent.click(screen.getByRole('switch',{name:'样例暗色主题'}));expect(document.documentElement.dataset.theme).toBe('light');
 localStorage.removeItem('motion-test');
});
it('keeps the documented selection examples independent in reduced mode',()=>{
 const {container}=render(<MotionPreview/>),stage=within(container.querySelector('.motion-lab-stage') as HTMLElement);
 fireEvent.click(screen.getByRole('switch',{name:'减少样例动态效果'}));
 fireEvent.click(stage.getByRole('button',{name:'活动',exact:true}));
 expect(stage.getByRole('button',{name:'活动',exact:true}).getAttribute('aria-current')).toBe('page');
 expect(stage.getByRole('tab',{name:'概览',exact:true}).getAttribute('aria-selected')).toBe('true');
 fireEvent.click(stage.getByRole('radio',{name:'舒适',exact:true}));
 fireEvent.click(stage.getByRole('radio',{name:'团队项目',exact:true}));
 expect((stage.getByRole('radio',{name:'舒适',exact:true}) as HTMLInputElement).checked).toBe(true);
 expect((stage.getByRole('radio',{name:'团队项目',exact:true}) as HTMLInputElement).checked).toBe(true);
 expect((stage.getByRole('radio',{name:'全部项目',exact:true}) as HTMLInputElement).disabled).toBe(true);
},20000);
it('keeps scoped select and menu overlays inside the reduced-motion preview',async()=>{
 const {container}=render(<MotionPreview/>);
 fireEvent.click(screen.getByRole('switch',{name:'减少样例动态效果'}));
 const stage=container.querySelector('.motion-lab-stage') as HTMLElement;
 expect(stage.getAttribute('data-ls-motion')).toBe('reduce');
 fireEvent.mouseDown(within(stage).getByRole('combobox',{name:'动效连接'}));
 await waitFor(()=>expect(stage.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toBeTruthy());
 fireEvent.click(within(stage).getByRole('button',{name:'切换视图'}));
 await waitFor(()=>expect(stage.querySelector('.ant-dropdown:not(.ant-dropdown-hidden)')).toBeTruthy());
 fireEvent.click(within(stage).getByText('活动', {selector:'.ant-dropdown-menu-title-content'}));
 expect(within(stage).getByRole('button',{name:'活动',exact:true}).getAttribute('aria-current')).toBe('page');
},20000);
