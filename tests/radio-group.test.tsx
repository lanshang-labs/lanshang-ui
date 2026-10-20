import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {RadioGroup} from '../src/RadioGroup';
import {ConfigProvider} from 'antd';
afterEach(cleanup);
it('keeps native named radios and one persistent indicator through selection',()=>{
 const change=vi.fn();const {container}=render(<RadioGroup name="scope" optionType="button" defaultValue="a" onChange={change} options={[{value:'a',label:'我的'},{value:'b',label:'团队'},{value:'c',label:'禁用',disabled:true}]}/>);
 const indicator=container.querySelector('.ls-radio-indicator');expect(indicator).toBeTruthy();
 fireEvent.click(screen.getByRole('radio',{name:'团队'}));
 expect((screen.getByRole('radio',{name:'团队'}) as HTMLInputElement).checked).toBe(true);
 expect(screen.getByRole('radio',{name:'团队'}).getAttribute('name')).toBe('scope');
 expect(container.querySelector('.ls-radio-indicator')).toBe(indicator);expect(change).toHaveBeenCalledTimes(1);
 expect((screen.getByRole('radio',{name:'禁用'}) as HTMLInputElement).disabled).toBe(true);
});
it('does not add a moving surface to ordinary radio options',()=>{
 const {container}=render(<RadioGroup defaultValue="a" options={[{value:'a',label:'普通'}]}/>);
 expect(container.querySelector('.ls-radio-indicator')).toBeNull();
});
it('inherits configured size and keeps explicit size on both track and radio buttons',()=>{
 const options=[{value:'mine',label:'我的'},{value:'team',label:'团队'}];
 const {container,rerender}=render(<ConfigProvider componentSize="small"><RadioGroup optionType="button" options={options} defaultValue="mine"/></ConfigProvider>);
 expect(container.querySelector('.ls-radio-group[data-ls-size="small"] .ant-radio-group-small')).toBeTruthy();
 rerender(<ConfigProvider componentSize="small"><RadioGroup size="large" optionType="button" options={options} defaultValue="mine"/></ConfigProvider>);
 expect(container.querySelector('.ls-radio-group[data-ls-size="large"] .ant-radio-group-large')).toBeTruthy();
 fireEvent.click(screen.getByRole('radio',{name:'团队'}));
 expect((screen.getByRole('radio',{name:'团队'}) as HTMLInputElement).checked).toBe(true);
});
