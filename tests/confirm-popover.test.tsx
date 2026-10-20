import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {ConfirmPopover} from '../src/ComplexControls';

afterEach(cleanup);

it('uses the shared default icon and keeps confirmation behavior',()=>{
 const confirm=vi.fn();
 render(<ConfirmPopover open title="归档项目？" okText="确认归档" cancelText="取消" onConfirm={confirm}><button>归档</button></ConfirmPopover>);
 expect(document.querySelector('.ls-confirm-popover .ls-confirm-icon svg')).toBeTruthy();
 expect(document.querySelector('.ls-confirm-popover .anticon-exclamation-circle')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'确认归档'}));
 expect(confirm).toHaveBeenCalledOnce();
});

it('respects hidden and custom confirmation icons',()=>{
 const view=render(<ConfirmPopover open title="确认？" icon={null}><button>打开</button></ConfirmPopover>);
 expect(document.querySelector('.ls-confirm-popover .ant-popconfirm-message-icon')).toBeNull();
 view.rerender(<ConfirmPopover open title="确认？" icon={<span data-testid="custom-confirm-icon">自定义</span>}><button>打开</button></ConfirmPopover>);
 expect(screen.getByTestId('custom-confirm-icon')).toBeTruthy();
 expect(document.querySelector('.ls-confirm-popover .ls-confirm-icon')).toBeNull();
});
