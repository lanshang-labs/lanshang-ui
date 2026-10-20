import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {Form,Input,Button} from 'antd';
import {FormGrid} from '../src/Stack';
afterEach(cleanup);
it('keeps long validation attached to its field, retains sibling input and submits corrected values',async()=>{
 const submit=vi.fn();const message='请输入小写标识。ValidationIdentifierWithoutSpaces_012345678901234567890123456789';
 render(<Form layout="vertical" onFinish={submit}><FormGrid>
 <Form.Item name="id" label="标识" rules={[{required:true,pattern:/^[a-z]+$/,message}]}><Input/></Form.Item>
 <Form.Item name="name" label="名称" rules={[{required:true}]}><Input/></Form.Item>
 </FormGrid><Button htmlType="submit">保存</Button></Form>);
 const id=screen.getByLabelText('标识'),name=screen.getByLabelText('名称');
 fireEvent.change(id,{target:{value:'BAD'}});fireEvent.change(name,{target:{value:'保留名称'}});fireEvent.click(screen.getByRole('button',{name:'保 存'}));
 expect(await screen.findByText(message)).toBeTruthy();expect(submit).not.toHaveBeenCalled();
 expect(id.getAttribute('aria-describedby')).toContain('id_help');expect((name as HTMLInputElement).value).toBe('保留名称');
 fireEvent.change(id,{target:{value:'valid'}});fireEvent.click(screen.getByRole('button',{name:'保 存'}));
 await waitFor(()=>expect(submit).toHaveBeenCalledWith({id:'valid',name:'保留名称'}));
});
