import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {ConfigProvider} from 'antd';
import {InputGroup,ButtonGroup} from '../src/ControlGroup';
import {RowActionButton} from '../src/RowActionButton';
import {TextInput} from '../src/FieldControls';
import {Select} from '../src/control-icons';
afterEach(cleanup);
it('keeps explicit button group size in sync with its actions',()=>{
 const {container,rerender}=render(<ConfigProvider componentSize="large"><ButtonGroup size="small"><RowActionButton>第一项</RowActionButton><RowActionButton>第二项</RowActionButton></ButtonGroup></ConfigProvider>);
 expect(container.querySelector('.ls-button-group')?.getAttribute('data-ls-size')).toBe('small');
 expect(screen.getByRole('button',{name:'第一项'}).className).toContain('ant-btn-sm');
 rerender(<ConfigProvider componentSize="small"><ButtonGroup size="large"><RowActionButton>第一项</RowActionButton><RowActionButton>第二项</RowActionButton></ButtonGroup></ConfigProvider>);
 expect(container.querySelector('.ls-button-group')?.getAttribute('data-ls-size')).toBe('large');
 expect(screen.getByRole('button',{name:'第一项'}).className).toContain('ant-btn-lg');
});
it('exposes explicit small, middle and large geometry without changing input behavior',()=>{
 const {container,rerender}=render(<InputGroup control={<input aria-label="尺寸输入"/>} actions={<ButtonGroup><RowActionButton>执行</RowActionButton></ButtonGroup>}/>);
 const group=container.querySelector('.ls-input-group');
 expect(group?.getAttribute('data-ls-size')).toBe('middle');
 expect(screen.getByRole('button',{name:'执行'}).className).not.toContain('ant-btn-sm');
 for(const size of ['small','large'] as const){
  rerender(<InputGroup size={size} control={<input aria-label="尺寸输入"/>} actions={<ButtonGroup><RowActionButton>执行</RowActionButton></ButtonGroup>}/>);
  expect(group?.getAttribute('data-ls-size')).toBe(size);
  fireEvent.change(screen.getByRole('textbox',{name:'尺寸输入'}),{target:{value:size}});
  expect((screen.getByRole('textbox',{name:'尺寸输入'}) as HTMLInputElement).value).toBe(size);
 }
});
it('inherits a configured size and applies an explicit group size to its fields and actions',()=>{
 const controls=()=>({control:<TextInput aria-label="配置搜索"/>,actions:<ButtonGroup><RowActionButton>执行</RowActionButton></ButtonGroup>});
 const {container,rerender}=render(<ConfigProvider componentSize="small"><InputGroup {...controls()}/></ConfigProvider>);
 expect(container.querySelector('.ls-input-group')?.getAttribute('data-ls-size')).toBe('small');
 expect(container.querySelector('.ls-text-input.ant-input-sm')).toBeTruthy();
 expect(container.querySelector('.bui-row-action.ant-btn-sm')).toBeTruthy();
 rerender(<ConfigProvider componentSize="large"><InputGroup size="small" {...controls()}/></ConfigProvider>);
 expect(container.querySelector('.ls-input-group')?.getAttribute('data-ls-size')).toBe('small');
 expect(container.querySelector('.ls-text-input.ant-input-sm')).toBeTruthy();
 expect(container.querySelector('.bui-row-action.ant-btn-sm')).toBeTruthy();
});
it('keeps select keyboard selection working inside a sized input group',()=>{
 const change=vi.fn();
 const {container}=render(<ConfigProvider componentSize="large"><InputGroup size="small" control={<Select aria-label="环境" onChange={change} options={[{value:'dev',label:'开发环境'},{value:'test',label:'测试环境'}]}/>} actions={<ButtonGroup><RowActionButton>刷新</RowActionButton></ButtonGroup>}/></ConfigProvider>);
 expect(container.querySelector('.ls-select.ant-select-sm')).toBeTruthy();
 const select=screen.getByRole('combobox',{name:'环境'});
 fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});
 fireEvent.keyDown(select,{key:'ArrowDown',keyCode:40});
 fireEvent.keyDown(select,{key:'Enter',keyCode:13});
 expect(change.mock.calls.at(-1)?.[0]).toBe('test');
});
it('preserves independent input and action behavior without submitting a surrounding form',()=>{
 const submit=vi.fn(),refresh=vi.fn(),change=vi.fn();
 render(<form onSubmit={submit}><InputGroup aria-label="连接配置" control={<input aria-label="连接" onChange={change}/>} actions={<ButtonGroup aria-label="连接操作"><RowActionButton onClick={refresh}>刷新</RowActionButton><RowActionButton disabled onClick={refresh}>保存</RowActionButton></ButtonGroup>}/></form>);
 fireEvent.change(screen.getByRole('textbox',{name:'连接'}),{target:{value:'local'}});
 expect(change).toHaveBeenCalledTimes(1);
 const actions=within(screen.getByRole('group',{name:'连接操作'}));
 fireEvent.click(actions.getByRole('button',{name:'刷新'}));
 fireEvent.click(actions.getByRole('button',{name:'保存'}));
 expect(refresh).toHaveBeenCalledTimes(1);expect(submit).not.toHaveBeenCalled();
});
it('keeps a loading action unavailable without disabling the input',()=>{
 const action=vi.fn();render(<InputGroup control={<input aria-label="搜索"/>} actions={<ButtonGroup><RowActionButton aria-label="搜索" loading onClick={action}>搜索</RowActionButton></ButtonGroup>}/>);
 fireEvent.click(screen.getByRole('button',{name:'搜索'}));expect(action).not.toHaveBeenCalled();
 expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(false);
 expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
});

it('moves one persistent selection surface and leaves ordinary or multiple actions independent',()=>{
 const buttons=(left:boolean,right:boolean)=><ButtonGroup><RowActionButton aria-pressed={left}>Left</RowActionButton><RowActionButton aria-pressed={right}>Right</RowActionButton></ButtonGroup>;
 const {container,rerender}=render(buttons(true,false));
 const indicator=container.querySelector('.ls-button-group-indicator');
 expect(indicator).not.toBeNull();expect(indicator?.getAttribute('aria-hidden')).toBe('true');
 rerender(buttons(false,true));expect(container.querySelector('.ls-button-group-indicator')).toBe(indicator);
 expect(screen.getByRole('button',{name:'Right'}).getAttribute('aria-pressed')).toBe('true');
 rerender(buttons(true,true));expect(container.querySelector('.ls-button-group-indicator')).toBeNull();
 rerender(<ButtonGroup><RowActionButton>Refresh</RowActionButton></ButtonGroup>);expect(container.querySelector('.ls-button-group-indicator')).toBeNull();
});
it('restarts search feedback on each click without duplicating the action',()=>{
 const action=vi.fn();const {container}=render(<RowActionButton iconMotion="search" icon={<svg/>} onClick={action}>Search</RowActionButton>);
 const button=screen.getByRole('button',{name:'Search'});
 expect(container.querySelector('.ls-action-search')?.hasAttribute('data-active')).toBe(false);
 fireEvent.click(button);const first=container.querySelector('.ls-action-search');
 expect(first?.getAttribute('data-active')).toBe('true');
 fireEvent.click(button);expect(container.querySelector('.ls-action-search')).not.toBe(first);
 expect(action).toHaveBeenCalledTimes(2);
});
