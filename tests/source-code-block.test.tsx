import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {SourceCodeBlock} from '../src/SourceCodeBlock';
afterEach(()=>{cleanup();vi.restoreAllMocks()});
it('copies full source while collapsed and never renders source as HTML',async()=>{
 const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 const code='const a = 1;\n<script>alert(1)</script>\nconst b = 2;';
 render(<SourceCodeBlock code={code} previewLines={1}/>);
 expect(document.querySelectorAll('.ls-code-line').length).toBe(1);expect(document.querySelector('.ls-code-block script')).toBeNull();
 const wrapButton=screen.getByRole('button',{name:'换行'}),copyButton=screen.getByRole('button',{name:'复制'});
 expect(wrapButton.textContent).toBe('');expect(copyButton.textContent).toBe('');
 expect(wrapButton.getAttribute('aria-pressed')).toBe('false');
 const initialWrapIcon=wrapButton.querySelector('.ls-motion-icon[data-effect="wrap"]');
 expect(initialWrapIcon?.classList.contains('is-playing')).toBe(false);
 fireEvent.click(screen.getByRole('button',{name:'复制'}));await waitFor(()=>expect(writeText).toHaveBeenCalledWith(code));
 fireEvent.click(screen.getByRole('button',{name:'展开全部 3 行'}));expect(document.querySelectorAll('.ls-code-line').length).toBe(3);
 fireEvent.click(screen.getByRole('button',{name:'换行'}));expect(document.querySelector('pre')?.className).toBe('is-wrapped');
 expect(wrapButton.getAttribute('aria-pressed')).toBe('true');
 const playingWrapIcon=wrapButton.querySelector('.ls-motion-icon[data-effect="wrap"]');
 expect(playingWrapIcon).not.toBe(initialWrapIcon);
 expect(playingWrapIcon?.classList.contains('is-playing')).toBe(true);
 expect(playingWrapIcon?.getAttribute('data-turned')).toBe('true');
 fireEvent.click(wrapButton);
 expect(document.querySelector('pre')?.className).not.toBe('is-wrapped');
 expect(wrapButton.querySelector('.ls-motion-icon')?.getAttribute('data-turned')).toBe('false');
});
it('reports clipboard failure and resets feedback for changed code',async()=>{
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:vi.fn().mockRejectedValue(new Error('denied'))}});
 const {rerender}=render(<SourceCodeBlock code="abc"/>);
 fireEvent.click(screen.getByRole('button',{name:'复制'}));await screen.findByText('复制失败，请展开后手动选择代码');
 rerender(<SourceCodeBlock code="new source"/>);expect(screen.getByRole('status').textContent).toBe('');
});
it('legacy code block handles unavailable clipboard and clears failure after retry',async()=>{
 const {default:LegacyCodeBlock}=await import('../src/beautiful-ui/CodeBlock');
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});
 render(<LegacyCodeBlock code="const a = 1;"/>);
 expect(screen.getByRole('button',{name:'Copy'}).classList.contains('bui-row-action')).toBe(true);
 expect(screen.getByRole('button',{name:'Copy'}).textContent).toBe('');
 expect(screen.getByRole('button',{name:'Copy'}).title).toBe('Copy');
 fireEvent.click(screen.getByRole('button',{name:'Copy'}));await screen.findByRole('alert');
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:vi.fn().mockResolvedValue(undefined)}});
 fireEvent.click(screen.getByRole('button',{name:'Copy'}));await waitFor(()=>expect(screen.queryByRole('alert')).toBeNull());
 expect(screen.getByRole('button',{name:'Copy'}).getAttribute('data-copied')).toBe('true');
 expect(screen.getByRole('status').textContent).toBe('Copied');
});
it('copies large JSON exactly in collapsed, expanded and wrapped states and resets scroll',async()=>{
 const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 const code=JSON.stringify(Array.from({length:400},(_,id)=>({id,url:'https://example.test/'+ 'long-path/'.repeat(40),text:'中文 😀 <tag> & "value"'})),null,2)+'\n';
 const {rerender}=render(<SourceCodeBlock filename="large.json" language="json" code={code} previewLines={6}/>);
 const pre=screen.getByLabelText('large.json代码');
 expect(document.querySelectorAll('.ls-code-line').length).toBe(6);
 for(const action of ['copy','expand','wrap','collapse']){
  if(action==='expand')fireEvent.click(screen.getByRole('button',{name:/展开全部/}));
  if(action==='wrap'){
   pre.scrollLeft=500;pre.scrollTop=300;
   fireEvent.click(screen.getByRole('button',{name:'换行'}));
   expect(pre.scrollLeft).toBe(0);expect(pre.scrollTop).toBe(0);
  }
  if(action==='collapse'){
   pre.scrollTop=1000;fireEvent.click(screen.getByRole('button',{name:'收起代码'}));
   expect(pre.scrollTop).toBe(0);expect(document.querySelectorAll('.ls-code-line').length).toBe(6);
  }
  fireEvent.click(screen.getByRole('button',{name:'复制'}));
  await waitFor(()=>expect(writeText).toHaveBeenCalledTimes(['copy','expand','wrap','collapse'].indexOf(action)+1));
  expect(writeText.mock.calls.at(-1)?.[0]).toBe(code);
 }
 rerender(<SourceCodeBlock filename="large.json" language="json" code="{}"/>);
 expect(document.querySelector('footer')?.className).toBe('is-empty');
});
it('ignores a previous copy completion after the source changes',async()=>{
 let finish!:()=>void;
 const writeText=vi.fn().mockImplementationOnce(()=>new Promise<void>(resolve=>{finish=resolve})).mockResolvedValue(undefined);
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 const {rerender}=render(<SourceCodeBlock code="old"/>);
 fireEvent.click(screen.getByRole('button',{name:'复制'}));
 rerender(<SourceCodeBlock code="new"/>);finish();
 await new Promise(resolve=>setTimeout(resolve,0));
 expect(screen.getByRole('status').textContent).toBe('');
 fireEvent.click(screen.getByRole('button',{name:'复制'}));
 await screen.findByText('已复制完整代码');expect(writeText).toHaveBeenLastCalledWith('new');
});

it('keeps original source copy in the header menu without changing formatted copy',async()=>{
 const writeText=vi.fn().mockResolvedValue(undefined);Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 render(<SourceCodeBlock code={'{\n  "id": 1\n}'} language="json" previewLines={1} copyOptions={[{label:'复制原始日志',text:'{"id":1}\n'}]}/>);
 expect(screen.getByRole('button',{name:'复制',exact:true}).querySelector('.ls-motion-icon[data-effect="shift"]')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'复制',exact:true}));
 await waitFor(()=>expect(writeText).toHaveBeenLastCalledWith('{\n  "id": 1\n}'));
 const optionsButton=screen.getByRole('button',{name:'复制选项'});
 expect(optionsButton.querySelector('.ls-motion-icon[data-effect="turn"]')).toBeTruthy();
 fireEvent.click(optionsButton);
 expect(optionsButton.getAttribute('aria-expanded')).toBe('true');
 expect(optionsButton.querySelector('.ls-motion-icon')?.getAttribute('data-turned')).toBe('true');
 fireEvent.click(await screen.findByRole('menuitem',{name:'复制原始日志'}));
 await waitFor(()=>expect(writeText).toHaveBeenLastCalledWith('{"id":1}\n'));
});

it('keeps contextual controls outside copied code',async()=>{
 const action=vi.fn(),writeText=vi.fn().mockResolvedValue(undefined);
 Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText}});
 render(<SourceCodeBlock code="original" toolbar={<button onClick={action}>关联操作</button>} description="简短说明"/>);
 fireEvent.click(screen.getByRole('button',{name:'关联操作'}));expect(action).toHaveBeenCalledOnce();
 fireEvent.click(screen.getByRole('button',{name:'复制',exact:true}));
 await waitFor(()=>expect(writeText).toHaveBeenCalledWith('original'));
 expect(document.querySelector('header')?.textContent).toContain('关联操作');
});
