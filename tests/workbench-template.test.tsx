import {act,cleanup,configure,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {Workbench} from '../experiments/workbench/workbench';
import {deliveryData,initialProjects} from '../experiments/workbench/data';

// Canvas painting is checked in the real 5177 browser. Keep AntD interactions real.
configure({defaultHidden:true});
vi.mock('@ant-design/plots',()=>({Area:()=> <div data-testid="delivery-plot"/>}));
afterEach(()=>{cleanup();vi.useRealTimers();});

it('keeps trend ranges chronological and consistent with the initial project snapshot',()=>{
 const completed=initialProjects.reduce((sum,p)=>sum+p.done,0);
 expect(deliveryData(30).filter(p=>p.series==='已完成').reduce((sum,p)=>sum+p.value,0)).toBe(completed);
 expect(deliveryData(7)[0].date).toBe('10/19');
 expect(deliveryData(7).at(-1)?.date).toBe('10/25');
});

it('recovers the project table after an unmatched search',async()=>{
 const {container}=render(<Workbench/>);
 const panel=within(container.querySelector<HTMLElement>('.wb-projects-panel')!);
 const input=panel.getByRole('textbox',{name:'搜索项目'});
 fireEvent.change(input,{target:{value:'不存在的项目'}});
 expect(await panel.findByText('没有匹配的项目')).toBeTruthy();
 fireEvent.click(panel.getByRole('button',{name:'重置筛选'}));
 expect((input as HTMLInputElement).value).toBe('');
 expect(within(panel.getByRole('table')).getByRole('button',{name:'品牌官网重构'})).toBeTruthy();
});

it('filters project rows through the attention status tab',()=>{
 const {container}=render(<Workbench/>);
 const panel=within(container.querySelector<HTMLElement>('.wb-projects-panel')!);
 const tab=panel.getByRole('tab',{name:/需关注/});
 fireEvent.click(tab);
 expect(tab.getAttribute('aria-selected')).toBe('true');
 const table=within(panel.getByRole('table'));
 expect(table.getByRole('button',{name:'客户服务工作台'})).toBeTruthy();
 expect(table.queryByRole('button',{name:'品牌官网重构'})).toBeNull();
});

it('validates project creation and updates the table and completion state',async()=>{
 const {container}=render(<Workbench/>);
 fireEvent.click(within(container).getByText('新建项目').closest('button')!);
 fireEvent.click(screen.getByText('创建项目').closest('button')!);
 expect(await screen.findByText('给项目起一个名字')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('项目名称'),{target:{value:'组合模板验收'}});
 fireEvent.click(screen.getByText('创建项目').closest('button')!);
 await waitFor(()=>expect(container.querySelector('table')?.textContent).toContain('组合模板验收'));
 fireEvent.click(container.querySelector('table')!.querySelector('button')!);
 fireEvent.click(await screen.findByText('标记为已完成'));
 await waitFor(()=>expect(screen.getByText('项目已完成').closest('button')?.disabled).toBe(true));
 const row=container.querySelector('tr[data-row-key="PRJ-025"]')!;
 expect(row.textContent).toContain('已完成');
 expect(row.textContent).toContain('100%');
});

it('retains the successful snapshot after refresh failure and recovers only on retry',async()=>{
 const {container}=render(<Workbench/>);
 fireEvent.click(screen.getByLabelText('模拟读取失败'));
 vi.useFakeTimers();
 fireEvent.click(container.querySelector('button[aria-label="刷新工作空间"]')!);
 expect(container.querySelector('[role="status"]')?.textContent).toContain('保留当前内容');
 await act(async()=>{vi.advanceTimersByTime(900);});
 expect(container.querySelector('[role="alert"]')?.textContent).toContain('当前保留上次成功读取的内容');
 expect(container.querySelector('table')).toBeTruthy();
 fireEvent.click(container.querySelector('[role="alert"] button')!);
 await act(async()=>{vi.advanceTimersByTime(900);});
 expect(container.querySelector('[role="alert"]')).toBeNull();
 expect((screen.getByLabelText('模拟读取失败') as HTMLInputElement).checked).toBe(false);
});
