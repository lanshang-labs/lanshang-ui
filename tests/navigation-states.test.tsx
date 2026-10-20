import {afterEach, expect, it} from 'vitest';
import {cleanup, fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {NavigationStatesPreview} from '../website/navigation-states-preview';
afterEach(cleanup);
it('keeps selection on focus and returns menu selection focus to the trigger',async()=>{
 render(<NavigationStatesPreview/>);
 const trigger=screen.getByRole('button',{name:'切换视图'});
 fireEvent.keyDown(trigger,{key:'ArrowDown',keyCode:40});
 const activity=await screen.findByRole('menuitem',{name:'活动记录'});
 expect(trigger.getAttribute('aria-expanded')).toBe('true');
 expect(trigger.querySelector('.ls-motion-icon')?.getAttribute('data-turned')).toBe('true');
 activity.focus();expect(screen.getByRole('status').textContent).toBe('当前视图：项目概览');
 fireEvent.click(activity);
 await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('当前视图：活动记录'));
 expect(document.activeElement).toBe(trigger);
 expect(trigger.getAttribute('aria-expanded')).toBe('false');
 expect(trigger.querySelector('.ls-motion-icon')?.getAttribute('data-turned')).toBe('false');
 expect(screen.getByRole('button',{name:'活动记录'}).getAttribute('aria-current')).toBe('page');
 expect((screen.getByRole('button',{name:'无权限'}) as HTMLButtonElement).disabled).toBe(true);
});
it('keeps the panel selected until Enter activates the focused tab',()=>{
 render(<NavigationStatesPreview/>);
 const tabs=screen.getAllByRole('tab',{name:'活动记录'});
 tabs[0].focus();expect(tabs[0].getAttribute('aria-selected')).toBe('false');
 fireEvent.keyDown(tabs[0],{key:'Enter',keyCode:13,which:13});
 expect(tabs[0].getAttribute('aria-selected')).toBe('true');
 expect(screen.getAllByRole('tab',{name:'项目概览'})[0].getAttribute('aria-selected')).toBe('false');
});
it('preserves independent selection groups and disabled controls',()=>{
 render(<NavigationStatesPreview/>);
 const comfortable=screen.getByRole('radio',{name:'舒适'});
 comfortable.focus();expect((screen.getByRole('radio',{name:'紧凑'}) as HTMLInputElement).checked).toBe(true);
 fireEvent.click(comfortable);expect((comfortable as HTMLInputElement).checked).toBe(true);
 expect(screen.getByText('显示密度：舒适')).toBeTruthy();
 fireEvent.click(screen.getByRole('radio',{name:'团队项目'}));
 expect(screen.getByText('项目范围：团队项目')).toBeTruthy();
 expect((comfortable as HTMLInputElement).checked).toBe(true);
 expect((screen.getByRole('radio',{name:'不可用'}) as HTMLInputElement).disabled).toBe(true);
 expect((screen.getByRole('radio',{name:'全部项目'}) as HTMLInputElement).disabled).toBe(true);
});

it('keeps tree navigation selected while a different destination receives focus',async()=>{
 const {BeautifulNavigation}=await import('../src/beautiful-ui/Navigation');
 render(<BeautifulNavigation items={[{key:'home',label:'工作台'},{key:'tasks',label:'任务'}]} selectedKeys={['home']} openKeys={[]} onOpenChange={()=>{}} onClick={()=>{}}/>);
 const home=screen.getByRole('button',{name:'工作台'}),tasks=screen.getByRole('button',{name:'任务'});
 fireEvent.mouseEnter(tasks);tasks.focus();
 expect(home.getAttribute('aria-current')).toBe('page');
 expect(tasks.getAttribute('aria-current')).toBeNull();
});

it('keeps content and card tabs selected while other tabs are hovered or focused',()=>{
 render(<NavigationStatesPreview/>);
 const selected=screen.getAllByRole('tab',{name:'项目概览'});
 const others=screen.getAllByRole('tab',{name:'活动记录'});
 others.forEach((tab,i)=>{fireEvent.mouseEnter(tab);tab.focus();expect(selected[i].getAttribute('aria-selected')).toBe('true');expect(tab.getAttribute('aria-selected')).toBe('false');});
 screen.getAllByRole('tab',{name:'无权限'}).forEach(tab=>expect(tab.getAttribute('aria-disabled')).toBe('true'));
});

it('activates card tabs with Space without changing the independent content tabs',()=>{
 render(<NavigationStatesPreview/>);
 const activity=screen.getAllByRole('tab',{name:'活动记录'})[1];
 activity.focus();
 expect(activity.getAttribute('aria-selected')).toBe('false');
 fireEvent.keyDown(activity,{key:' ',keyCode:32,which:32});
 expect(activity.getAttribute('aria-selected')).toBe('true');
 expect(screen.getAllByRole('tab',{name:'项目概览'})[0].getAttribute('aria-selected')).toBe('true');
});
it('keeps vertical tabs interactive and independent of the other tab examples',()=>{
 const {container}=render(<NavigationStatesPreview/>);
 const vertical=container.querySelector('.ant-tabs-left') as HTMLElement;
 const activity=within(vertical).getByRole('tab',{name:'活动记录'});
 fireEvent.click(activity);
 expect(activity.getAttribute('aria-selected')).toBe('true');
 expect(within(vertical).getByText('活动记录内容。')).toBeTruthy();
 expect(screen.getAllByRole('tab',{name:'项目概览'})[0].getAttribute('aria-selected')).toBe('true');
});

it('moves one navigation surface only after selection and removes it for no current route',async()=>{
 const {BeautifulTabs}=await import('../src/beautiful-ui/Navigation');
 const items=[{key:'a',label:'概览'},{key:'b',label:'活动'}];
 const {container,rerender}=render(<BeautifulTabs items={items} activeKey="a"/>);
 const indicator=container.querySelector('.ls-nav-indicator');
 expect(indicator).toBeTruthy();
 screen.getByRole('button',{name:'活动'}).focus();
 expect(screen.getByRole('button',{name:'概览'}).getAttribute('aria-current')).toBe('page');
 rerender(<BeautifulTabs items={items} activeKey="b"/>);
 expect(container.querySelector('.ls-nav-indicator')).toBe(indicator);
 expect(screen.getByRole('button',{name:'活动'}).getAttribute('aria-current')).toBe('page');
 rerender(<BeautifulTabs items={items} activeKey="missing"/>);
 expect(container.querySelector('.ls-nav-indicator')).toBeNull();
});
