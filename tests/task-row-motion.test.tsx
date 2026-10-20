import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import TaskRows from '../src/beautiful-ui/TaskRows';
afterEach(cleanup);
it('keeps disclosure usable without animation and preserves the same detail content',()=>{
 const onToggleRow=vi.fn();
 const {container}=render(<TaskRows animated={false} onToggleRow={onToggleRow} rows={[{key:'check',label:'检查配置',amount:'1 项',status:'done',details:[{label:'校验结果',meta:'通过'}]}]}/>);
 const trigger=screen.getByRole('button',{name:/检查配置/});
 const detail=container.querySelector('.ls-task-row-details');
 expect(container.querySelector('[data-ls-motion=reduce]')).toBeTruthy();
 expect(detail?.getAttribute('aria-hidden')).toBe('true');
 fireEvent.click(trigger);
 expect(trigger.getAttribute('aria-expanded')).toBe('true');
 expect(detail?.getAttribute('aria-hidden')).toBe('false');
 fireEvent.click(trigger);
 expect(container.querySelector('.ls-task-row-details')).toBe(detail);
 expect(onToggleRow.mock.calls).toEqual([['check',true],['check',false]]);
});
