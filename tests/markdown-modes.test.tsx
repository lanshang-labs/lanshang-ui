import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {Markdown} from '../src/Markdown';

afterEach(()=>{cleanup();vi.restoreAllMocks()});
const original='## 原始标题\r\n\r\n- **完整内容**\r\n<script>不可执行</script>\r\n';
function clipboard(writeText=vi.fn().mockResolvedValue(undefined)){
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 return writeText;
}

it('switches between rendered content and exact selectable source without executing HTML',()=>{
 render(<Markdown>{original}</Markdown>);
 expect(screen.getByRole('tab',{name:'视图'}).getAttribute('aria-selected')).toBe('true');
 expect(screen.getByRole('heading',{name:'原始标题'})).toBeTruthy();
 fireEvent.click(screen.getByRole('tab',{name:'原文'}));
 expect(screen.queryByRole('heading',{name:'原始标题'})).toBeNull();
 expect(screen.getByLabelText('原始 Markdown').textContent).toBe(original);
 expect(document.querySelector('script')).toBeNull();
 expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(screen.getByRole('tab',{name:'原文'}).id);
 fireEvent.click(screen.getByRole('tab',{name:'视图'}));
 expect(screen.getByRole('heading',{name:'原始标题'})).toBeTruthy();
});
it('copies the entire untouched Markdown string in either mode',async()=>{
 const writeText=clipboard();render(<Markdown>{original}</Markdown>);
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 expect(await screen.findByText('已复制原始 Markdown')).toBeTruthy();
 fireEvent.click(screen.getByRole('tab',{name:'原文'}));
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 await waitFor(()=>expect(writeText).toHaveBeenCalledTimes(2));
 expect(writeText.mock.calls.map(call=>call[0])).toEqual([original,original]);
});
it('supports controlled mode and a toolbar-free renderer',()=>{
 const onModeChange=vi.fn();const view=render(<Markdown mode="source" onModeChange={onModeChange}>{original}</Markdown>);
 fireEvent.click(screen.getByRole('tab',{name:'视图'}));
 expect(onModeChange).toHaveBeenCalledWith('preview');
 expect(screen.getByRole('tab',{name:'原文'}).getAttribute('aria-selected')).toBe('true');
 view.rerender(<Markdown mode="preview" toolbar={false}>{original}</Markdown>);
 expect(screen.queryByRole('tab')).toBeNull();expect(screen.queryByRole('button')).toBeNull();
 expect(screen.getByRole('heading',{name:'原始标题'})).toBeTruthy();
});
it('reports clipboard failure and keeps the source available for manual copying',async()=>{
 clipboard(vi.fn().mockRejectedValue(new Error('Denied')));
 render(<Markdown defaultMode="source">{original}</Markdown>);
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 expect(await screen.findByRole('status')).toHaveProperty('textContent','复制失败，请切换原文后手动选择复制');
 expect(screen.getByLabelText('原始 Markdown').textContent).toBe(original);
});
it('ignores stale clipboard results after the source changes and blocks duplicate pending writes',async()=>{
 let resolveOld!:()=>void;const writeText=clipboard(vi.fn().mockImplementationOnce(()=>new Promise<void>(resolve=>{resolveOld=resolve})).mockResolvedValue(undefined));
 const view=render(<Markdown>{original}</Markdown>);
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 expect(writeText).toHaveBeenCalledTimes(1);
 view.rerender(<Markdown>{'## 新原文\n'}</Markdown>);
 resolveOld();await Promise.resolve();expect(screen.queryByRole('status')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'复制原始 Markdown'}));
 expect(await screen.findByRole('status')).toHaveProperty('textContent','已复制原始 Markdown');
 expect(writeText).toHaveBeenLastCalledWith('## 新原文\n');
});
