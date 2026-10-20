import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {it,expect,afterEach,vi} from 'vitest';
import {Alert} from '../src/Alert';
afterEach(cleanup);
it('preserves feedback actions, announcement and dismissal',async()=>{
 const retry=vi.fn(),close=vi.fn();
 render(<Alert type="error" showIcon message="连接中断" description="稍后重试" closable onClose={close} action={<button onClick={retry}>重试</button>}/>);
 expect(screen.getByRole('alert').classList.contains('bui-alert')).toBe(true);
 expect(screen.getByRole('alert').querySelector('.ant-alert-icon svg')).toBeTruthy();
 expect(screen.getByRole('alert').querySelector('.anticon-close-circle')).toBeNull();
 expect(screen.getByRole('button',{name:'关闭提示'}).querySelector('.ls-motion-icon')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'重试'}));expect(retry).toHaveBeenCalledOnce();
 fireEvent.click(screen.getByRole('button',{name:'关闭提示'}));expect(close).toHaveBeenCalledOnce();
 await waitFor(()=>expect(screen.queryByRole('alert')).toBeNull());
});
it('keeps caller status and close icons',()=>{
 render(<Alert type="warning" showIcon icon={<span data-testid="status-icon">!</span>} closable={{closeIcon:<span data-testid="close-icon">×</span>,'aria-label':'关闭自定义提示'}} message="自定义"/>);
 expect(screen.getByTestId('status-icon')).toBeTruthy();
 expect(screen.getByTestId('close-icon')).toBeTruthy();
 expect(screen.getByRole('button',{name:'关闭自定义提示'})).toBeTruthy();
});
