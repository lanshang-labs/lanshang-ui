import {afterEach,expect,test} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {PasswordInput} from '../src/FieldControls';

afterEach(cleanup);

test('password visibility stays named and keeps the typed value',()=>{
 render(<PasswordInput aria-label="密码" autoComplete="current-password"/>);
 const input=screen.getByLabelText('密码') as HTMLInputElement;
 fireEvent.change(input,{target:{value:'example-value'}});
 expect(input.type).toBe('password');
 expect(input.autocomplete).toBe('current-password');
 fireEvent.click(screen.getByRole('button',{name:'显示密码'}));
 expect(input.type).toBe('text');
 expect(input.value).toBe('example-value');
 fireEvent.click(screen.getByRole('button',{name:'隐藏密码'}));
 expect(input.type).toBe('password');
 expect(input.value).toBe('example-value');
});
