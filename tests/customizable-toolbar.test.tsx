import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {ConfigProvider} from 'antd';
import {CustomizableToolbar,ToolbarItem} from '../src/CustomizableToolbar';
import {controlSizes} from '../src/tokens';
const key='toolbar-test';
function Demo(){return <CustomizableToolbar storageKey={key}><ToolbarItem id="a" label="项目"><input aria-label="项目输入" defaultValue="private query"/></ToolbarItem><ToolbarItem id="b" label="关键词"><input aria-label="关键词输入"/></ToolbarItem><ToolbarItem id="save" label="查询" group="action"><button>查询</button></ToolbarItem></CustomizableToolbar>}
beforeEach(()=>localStorage.clear());afterEach(()=>{cleanup();vi.restoreAllMocks()});
function order(container:HTMLElement){return Array.from(container.querySelectorAll('[data-toolbar-id]')).map(e=>e.getAttribute('data-toolbar-id'))}
it('persists pinning and ordering, and reset restores defaults without storing query contents',()=>{
 const view=render(<Demo/>);fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));
 expect(view.container.querySelector('.ls-toolbar-settings-trigger .ls-motion-icon[data-effect="gear"].is-playing')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'下移项目'}));expect(order(view.container)).toEqual(['b','a','save']);
 fireEvent.click(screen.getByRole('button',{name:'固定关键词'}));expect(order(view.container)).toEqual(['a','save']);
 expect(localStorage.getItem(key)).not.toContain('private query');view.unmount();
 const next=render(<Demo/>);expect(order(next.container)).toEqual(['a','save']);fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));
 expect(screen.getByLabelText('关键词输入')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'重置布局'}));expect(order(next.container)).toEqual(['a','b','save']);
 next.unmount();expect(order(render(<Demo/>).container)).toEqual(['a','b','save']);
});
it('ignores corrupt preferences and unknown items rather than restoring unavailable actions',()=>{
 localStorage.setItem(key,JSON.stringify({version:1,items:[{id:'admin',pinned:true},{id:'a',pinned:false},{id:'a',pinned:true}]}));
 const view=render(<Demo/>);expect(order(view.container)).toEqual(['b','save']);expect(screen.queryByText('admin')).toBeNull();
 view.unmount();localStorage.setItem(key,'broken');expect(order(render(<Demo/>).container)).toEqual(['a','b','save']);
});
it('keeps changes usable if browser storage fails',()=>{
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota')});
 const view=render(<Demo/>);fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));fireEvent.click(screen.getByRole('button',{name:'固定项目'}));
 expect(order(view.container)).toEqual(['b','save']);expect(screen.getByRole('status').textContent).toContain('本次调整仍有效');
});

it('keeps action ordering independent from field ordering',()=>{
 const view=render(<Demo/>);fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));
 expect((screen.getByRole('button',{name:'下移关键词'}) as HTMLButtonElement).disabled).toBe(true);
 expect((screen.getByRole('button',{name:'上移查询'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'下移项目'}));
 expect(order(view.container)).toEqual(['b','a','save']);
 expect(view.container.querySelector('.ls-toolbar-actions [data-toolbar-id="save"]')).not.toBeNull();
});
it('keeps toolbar action icons aligned with the configured control size',()=>{
 const {container}=render(<ConfigProvider componentSize="large"><Demo/></ConfigProvider>);
 fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));
 const pin=screen.getByRole('button',{name:'固定项目'});
 expect(pin.classList.contains('ant-btn-lg')).toBe(true);
 expect(pin.querySelector('svg')?.getAttribute('width')).toBe(String(controlSizes.large.icon));
 expect(pin.querySelector('svg')?.getAttribute('stroke-width')).toBe('2.4');
 expect((container.querySelector('.ls-toolbar-settings-trigger .ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.large.icon}px`);
 expect(container.querySelector('.ls-toolbar-settings-trigger .ls-motion-icon svg')?.getAttribute('stroke-width')).toBe('2.4');
});

it('shows hidden active filters, excludes action activity, and returns focus after permission revocation',()=>{
 const view=render(<CustomizableToolbar storageKey="permissions"><ToolbarItem id="filter" label="状态" active defaultPinned={false}><input aria-label="状态值" value="running" readOnly/></ToolbarItem><ToolbarItem id="action" label="编辑" group="action" active><button>编辑</button></ToolbarItem></CustomizableToolbar>);
 expect(screen.getByRole('button',{name:'隐藏筛选仍生效：状态'})).toBeTruthy();
 const edit=screen.getByRole('button',{name:'编辑',exact:true});edit.focus();
 view.rerender(<CustomizableToolbar storageKey="permissions"><ToolbarItem id="filter" label="状态" defaultPinned={false}><input aria-label="状态值" value="" readOnly/></ToolbarItem></CustomizableToolbar>);
 expect(screen.queryByRole('button',{name:/隐藏筛选仍生效/})).toBeNull();expect(screen.queryByRole('button',{name:'编辑',exact:true})).toBeNull();
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'工具栏设置'}));
});
