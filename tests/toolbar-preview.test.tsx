import {afterEach,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {LanshangProvider} from '../dist/index.js';
import {CustomToolbarPreview} from '../website/custom-toolbar-preview';
afterEach(()=>{cleanup();localStorage.clear()});
it('keeps the controlled keyword when moved into settings and restores the layout without clearing it',()=>{
 render(<LanshangProvider><CustomToolbarPreview/></LanshangProvider>);
 const input=screen.getByRole('textbox',{name:'示例关键词'});
 expect(input.closest('.bui-search-field')).toBeTruthy();
 fireEvent.change(input,{target:{value:'保留关键词'}});
 fireEvent.click(screen.getByRole('button',{name:'工具栏设置'}));
 fireEvent.click(screen.getByRole('button',{name:'固定关键词'}));
 expect((screen.getByRole('textbox',{name:'示例关键词'}) as HTMLInputElement).value).toBe('保留关键词');
 fireEvent.click(screen.getByRole('button',{name:'重置布局'}));
 fireEvent.click(screen.getByRole('button',{name:'完成'}));
 fireEvent.click(screen.getByRole('button',{name:'查询任务'}));
 expect(screen.getByRole('status').textContent).toContain('关键词：保留关键词；状态：all');
});
