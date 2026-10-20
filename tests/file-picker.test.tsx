import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {FilePicker} from '../src/FilePicker';
afterEach(cleanup);
it('selects, retains on chooser cancel, removes and allows same-file selection',()=>{
 const change=vi.fn(),file=new File(['zip'],'long-name.zip');
 const view=render(<FilePicker label="ZIP 文件" accept=".zip" onChange={change}/>);
 const input=screen.getByLabelText('ZIP 文件');fireEvent.change(input,{target:{files:[file]}});expect(change).toHaveBeenCalledWith(file);
 view.rerender(<FilePicker label="ZIP 文件" file={file} onChange={change}/>);
 expect(screen.getByText('long-name.zip')).toBeTruthy();change.mockClear();fireEvent.change(input,{target:{files:[]}});expect(change).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'移除文件'}));expect(change).toHaveBeenCalledWith(undefined);
 fireEvent.change(input,{target:{files:[file]}});expect(change).toHaveBeenLastCalledWith(file);
});
