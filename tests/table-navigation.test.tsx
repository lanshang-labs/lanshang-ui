import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {TablePreview} from '../website/table-preview';
afterEach(cleanup);
it('keeps the picker and tabs in sync and preserves a visited example state',()=>{
 render(<TablePreview/>);
 expect(screen.getByRole('combobox',{name:'选择表格示例'})).toBeTruthy();
 fireEvent.click(screen.getByRole('tab',{name:'跨屏合并'}));
 expect(document.querySelector('.docs-table-picker .ant-select-selection-item')?.textContent).toBe('跨屏合并');
 fireEvent.click(screen.getByLabelText('每 20 行合并分组'));
 fireEvent.click(screen.getByRole('tab',{name:'树形懒加载'}));
 expect(screen.getByRole('region',{name:'树形懒加载示例'})).toBeTruthy();
 fireEvent.click(screen.getByRole('tab',{name:'跨屏合并'}));
 expect((screen.getByLabelText('每 20 行合并分组') as HTMLInputElement).checked).toBe(false);
 expect(within(screen.getByRole('tabpanel',{name:'跨屏合并'})).getByRole('region',{name:'span-example.tsx'})).toBeTruthy();
},15000);
