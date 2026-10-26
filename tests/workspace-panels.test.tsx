import {act,cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {WorkspacePanels,type WorkspacePanelItem} from '../src/WorkspacePanels';
let observers:{callback:ResizeObserverCallback;node?:Element}[]=[];
beforeEach(()=>{observers=[];vi.stubGlobal('ResizeObserver',class {entry={callback:(()=>{}) as ResizeObserverCallback,node:undefined as Element|undefined};constructor(callback:ResizeObserverCallback){this.entry.callback=callback;observers.push(this.entry);}observe(node:Element){this.entry.node=node;}disconnect(){}unobserve(){}});});
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function measure(width:number,index=0){act(()=>observers[index].callback([{target:observers[index].node,contentRect:{width}}] as ResizeObserverEntry[],{} as ResizeObserver));}
const panels=():WorkspacePanelItem[]=>[{id:'notes',label:'资料树',content:<input aria-label="树搜索" defaultValue="原始资料"/>},{id:'outline',label:'目录',placement:'end',content:<button>定位正文</button>}];
it('preserves mounted inputs while switching narrow panels and immersive view',()=>{
 const view=render(<WorkspacePanels panels={panels()} mainLabel="正文"><textarea aria-label="正文草稿" defaultValue="原稿"/></WorkspacePanels>);
 measure(390);const input=screen.getByRole('textbox',{name:'正文草稿'});fireEvent.change(input,{target:{value:'尚未保存的内容'}});
 fireEvent.click(screen.getByRole('button',{name:'资料树',exact:true}));expect(screen.queryByRole('textbox',{name:'正文草稿'})).toBeNull();
 expect(screen.getByRole('textbox',{name:'树搜索'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'进入沉浸模式'}));expect(screen.getByRole('textbox',{name:'正文草稿'})).toBe(input);
 fireEvent.click(screen.getByRole('button',{name:'退出沉浸模式'}));expect(screen.getByRole('textbox',{name:'树搜索'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'正文',exact:true}));expect(screen.getByRole('textbox',{name:'正文草稿'})).toBe(input);expect((input as HTMLTextAreaElement).value).toBe('尚未保存的内容');view.unmount();
});
it('uses container width and preserves the main budget with fractional measurements',()=>{
 const {container}=render(<WorkspacePanels breakpoint={700} panels={panels()}>正文</WorkspacePanels>);measure(800.5);
 expect(container.firstElementChild?.getAttribute('data-narrow')).toBe('false');
 const handle=screen.getByRole('separator',{name:'调整资料树宽度'});fireEvent.keyDown(handle,{key:'End'});
 expect(handle.getAttribute('aria-valuenow')).toBe('242.5');expect(handle.getAttribute('aria-valuemax')).toBe('242.5');expect(container.firstElementChild?.getAttribute('data-narrow')).toBe('false');
 measure(500);expect(container.firstElementChild?.getAttribute('data-narrow')).toBe('true');expect(screen.queryByRole('separator')).toBeNull();
});
it('keeps fractional controlled and default widths inside the declared ARIA range',()=>{
 const items=panels();items[0]={...items[0],width:242.5};const view=render(<WorkspacePanels breakpoint={700} panels={items}>正文</WorkspacePanels>);measure(800.5);
 let handle=screen.getByRole('separator',{name:'调整资料树宽度'});expect(handle.getAttribute('aria-valuenow')).toBe('242.5');expect(handle.getAttribute('aria-valuemax')).toBe('242.5');
 view.rerender(<WorkspacePanels breakpoint={700} panels={[{...panels()[0],defaultWidth:242.5},panels()[1]]}>正文</WorkspacePanels>);handle=screen.getByRole('separator',{name:'调整资料树宽度'});expect(handle.getAttribute('aria-valuenow')).toBe('242.5');expect(handle.getAttribute('aria-valuemax')).toBe('242.5');
});
it('requests controlled changes without drifting when the consumer rejects them',()=>{
 const onWidthChange=vi.fn(),onCollapsedChange=vi.fn(),onActivePanelChange=vi.fn(),onImmersiveChange=vi.fn();
 const items=[{...panels()[0],width:200,collapsed:false,onWidthChange,onCollapsedChange}];
 const view=render(<WorkspacePanels panels={items} activePanel="main" onActivePanelChange={onActivePanelChange} immersive={false} onImmersiveChange={onImmersiveChange}>正文</WorkspacePanels>);measure(1100);
 const handle=screen.getByRole('separator');fireEvent.keyDown(handle,{key:'ArrowRight'});expect(onWidthChange).toHaveBeenCalledWith(208);expect(handle.getAttribute('aria-valuenow')).toBe('200');
 fireEvent.click(screen.getByRole('button',{name:'资料树',exact:true}));expect(onCollapsedChange).toHaveBeenCalledWith(true);expect(screen.getByRole('region',{name:'资料树'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'进入沉浸模式'}));expect(onImmersiveChange).toHaveBeenCalledWith(true);expect(screen.queryByRole('button',{name:'退出沉浸模式'})).toBeNull();
 measure(390);fireEvent.click(screen.getByRole('button',{name:'资料树',exact:true}));expect(onActivePanelChange).toHaveBeenCalledWith('notes');expect(screen.queryByRole('textbox',{name:'树搜索'})).toBeNull();
 view.rerender(<WorkspacePanels panels={items} activePanel="notes" immersive>正文</WorkspacePanels>);expect(screen.queryByRole('textbox',{name:'树搜索'})).toBeNull();
});
it('resizes the end panel in screen direction and retains width/collapse preferences after immersive mode',()=>{
 render(<WorkspacePanels panels={panels()}>正文</WorkspacePanels>);measure(1200);
 const end=screen.getByRole('separator',{name:'调整目录宽度'});fireEvent.keyDown(end,{key:'ArrowLeft'});expect(end.getAttribute('aria-valuenow')).toBe('228');
 fireEvent.click(screen.getByRole('button',{name:'资料树',exact:true}));expect(screen.queryByRole('region',{name:'资料树'})).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'进入沉浸模式'}));fireEvent.click(screen.getByRole('button',{name:'退出沉浸模式'}));expect(screen.queryByRole('region',{name:'资料树'})).toBeNull();expect(screen.getByRole('separator').getAttribute('aria-valuenow')).toBe('228');
});
it('moves focus from a disappearing separator and narrow main toggle to visible controls',()=>{
 const {container}=render(<WorkspacePanels panels={panels()} mainLabel="正文">正文</WorkspacePanels>);measure(1200);
 screen.getByRole('separator',{name:'调整目录宽度'}).focus();measure(390);expect(document.activeElement).toBe(screen.getByRole('button',{name:'正文',exact:true}));
 measure(1200);expect(document.activeElement).toBe(container.querySelector('.is-main .ls-workspace-pane-scroll'));
});
it('moves focus after external collapse and external immersive requests',()=>{
 const view=render(<WorkspacePanels panels={panels()}>正文</WorkspacePanels>);measure(1200);screen.getByRole('textbox',{name:'树搜索'}).focus();
 view.rerender(<WorkspacePanels panels={panels().map(p=>({...p,collapsed:p.id==='notes'}))}>正文</WorkspacePanels>);expect(document.activeElement).toBe(screen.getByRole('button',{name:'资料树',exact:true}));
 view.rerender(<WorkspacePanels panels={panels()} immersive>正文</WorkspacePanels>);expect(document.activeElement).toBe(screen.getByRole('button',{name:'退出沉浸模式'}));
});
it('keeps nested workspace focus ownership local',()=>{
 render(<WorkspacePanels aria-label="outer" panels={[]}><WorkspacePanels aria-label="inner" mainLabel="内层正文" panels={panels()}>内层内容</WorkspacePanels></WorkspacePanels>);
 const inner=observers.findIndex(x=>x.node?.getAttribute('aria-label')==='inner'),outer=observers.findIndex(x=>x.node?.getAttribute('aria-label')==='outer');measure(1200,outer);measure(1200,inner);
 screen.getByRole('separator',{name:'调整资料树宽度'}).focus();measure(390,inner);expect(document.activeElement).toBe(screen.getByRole('button',{name:'内层正文',exact:true}));
});
it('returns nested input focus when its outer panel is hidden without stealing external focus',()=>{
 const content=<WorkspacePanels panels={[]}><input aria-label="内层输入"/></WorkspacePanels>;
 const view=render(<><button>外部操作</button><WorkspacePanels aria-label="outer" panels={[{id:'aux',label:'外层辅助栏',content}]}>外层正文</WorkspacePanels></>);
 const outer=observers.findIndex(x=>x.node?.getAttribute('aria-label')==='outer');measure(1200,outer);screen.getByRole('textbox',{name:'内层输入'}).focus();
 view.rerender(<><button>外部操作</button><WorkspacePanels aria-label="outer" panels={[{id:'aux',label:'外层辅助栏',content,collapsed:true}]}>外层正文</WorkspacePanels></>);
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'外层辅助栏',exact:true}));screen.getByRole('button',{name:'外部操作'}).focus();
 view.rerender(<><button>外部操作</button><WorkspacePanels aria-label="outer" panels={[{id:'aux',label:'外层辅助栏',content}]} immersive>外层正文</WorkspacePanels></>);expect(document.activeElement).toBe(screen.getByRole('button',{name:'外部操作'}));
});
