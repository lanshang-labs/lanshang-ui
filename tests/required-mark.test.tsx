import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {Form,Input} from 'antd';
import {LanshangProvider} from '../src/Provider';
import {NavigationLink} from '../src/NavigationLink';
afterEach(cleanup);
it('preserves required semantics, validation and optional fields',async()=>{
 const submit=vi.fn();render(<LanshangProvider><Form onFinish={submit}><Form.Item label="项目名称" name="name" rules={[{required:true,message:'请输入项目名称'}]}><Input/></Form.Item><Form.Item label="说明" name="description"><Input/></Form.Item><button type="submit">保存</button></Form></LanshangProvider>);
 expect(screen.getByLabelText('项目名称').getAttribute('aria-required')).toBe('true');
 expect(screen.getByLabelText('说明').hasAttribute('aria-required')).toBe(false);
 fireEvent.click(screen.getByRole('button',{name:'保存'}));
 expect(await screen.findByText('请输入项目名称')).toBeTruthy();expect(submit).not.toHaveBeenCalled();
});
it('keeps native action link attributes and an accessible text-only name',()=>{
 render(<NavigationLink variant="action" href="/preview" target="_blank" rel="noopener">预览</NavigationLink>);
 const link=screen.getByRole('link',{name:'预览'});expect(link.getAttribute('href')).toBe('/preview');expect(link.getAttribute('target')).toBe('_blank');link.focus();expect(document.activeElement).toBe(link);expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
});
it('uses the same decorative arrow for name links without changing their accessible name',()=>{
 render(<NavigationLink href="/project">项目名称</NavigationLink>);
 const link=screen.getByRole('link',{name:'项目名称'});
 expect(link.getAttribute('href')).toBe('/project');
 expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
});
