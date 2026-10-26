import {createRef} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {act,cleanup,createEvent,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {Dock,type DockItem} from '../src/dock';
afterEach(()=>{cleanup();vi.restoreAllMocks()});
const items:DockItem[]=[{id:'home',label:'工作台',icon:<svg/>},{id:'disabled',label:'不可用',icon:<svg/>,disabled:true},{id:'assets',label:'资源',icon:<svg/>}];
it('detects constrained trays and remeasures when destinations change',()=>{
 let width=224;
 vi.spyOn(Element.prototype,'clientWidth','get').mockImplementation(function(this:Element){return this.classList.contains('ls-dock-host')?width:0});
 vi.spyOn(Element.prototype,'scrollWidth','get').mockImplementation(function(this:Element){return this.classList.contains('ls-dock-host')?248:0});
 vi.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(function(this:HTMLElement){
  const isHost=this.classList.contains('ls-dock-host'),offset=this.closest('.ls-dock-host')?.scrollLeft||0;
  const left=isHost?84:(this.getAttribute('aria-label')==='资源'?291:93)-offset;
  const w=isHost?width:32;
  return {left,right:left+w,top:0,bottom:32,width:w,height:32,x:left,y:0,toJSON:()=>({})} as DOMRect;
 });
 const view=render(<Dock size="small" items={items}/>);
 expect(view.container.querySelector('.ls-dock-host')?.getAttribute('data-overflow')).toBe('true');
 const first=screen.getByRole('button',{name:'工作台'});first.focus();fireEvent.keyDown(first,{key:'End'});
 const host=view.container.querySelector<HTMLElement>('.ls-dock-host')!;
 expect(host.scrollLeft).toBe(23);
 const last=screen.getByRole('button',{name:'资源'});expect(last.getBoundingClientRect().right).toBeLessThanOrEqual(300);
 fireEvent.keyDown(last,{key:'Home'});expect(first.getBoundingClientRect().left).toBeGreaterThanOrEqual(92);
 view.rerender(<Dock size="small" items={items} onFocusCapture={event=>event.preventDefault()}/>);
 host.scrollLeft=0;fireEvent.keyDown(first,{key:'End'});expect(host.scrollLeft).toBe(0);
 width=640;view.rerender(<Dock size="small" items={[...items,{id:'settings',label:'设置',icon:<svg/>}]}/>);
 expect(view.container.querySelector('.ls-dock-host')?.getAttribute('data-overflow')).toBe('false');
});
it('keeps selection controlled, moves focus without selecting and skips disabled items',()=>{
 const select=vi.fn();render(<Dock items={items} activeId="home" onSelect={select}/>);
 const first=screen.getByRole('button',{name:'工作台'}),last=screen.getByRole('button',{name:'资源'});
 first.focus();fireEvent.keyDown(first,{key:'ArrowRight'});expect(document.activeElement).toBe(last);expect(select).not.toHaveBeenCalled();
 fireEvent.click(last);expect(select.mock.calls[0].slice(0,2)).toEqual(['assets',items[2]]);
 expect(first.getAttribute('aria-pressed')).toBe('true');expect(last.getAttribute('aria-pressed')).toBe('false');
 fireEvent.keyDown(last,{key:'Home'});expect(document.activeElement).toBe(first);
 fireEvent.keyDown(first,{key:'End'});expect(document.activeElement).toBe(last);
 fireEvent.click(screen.getByRole('button',{name:'不可用'}));expect(select).toHaveBeenCalledTimes(1);
});
it('uses native links, protects blank targets and leaves modified navigation to the browser',()=>{
 const select=vi.fn((_id,_item,event)=>event.preventDefault());
 render(<Dock items={[{id:'docs',label:'文档',icon:<svg/>,href:'/docs',target:'_blank',rel:'external'}]} activeId="docs" onSelect={select}/>);
 const link=screen.getByRole('link',{name:'文档'});
 expect(link.getAttribute('href')).toBe('/docs');expect(link.getAttribute('aria-current')).toBe('page');expect(link.getAttribute('aria-pressed')).toBeNull();
 expect(link.getAttribute('rel')?.split(' ')).toEqual(['external','noopener','noreferrer']);
 for(const key of ['ctrlKey','metaKey','shiftKey','altKey'])fireEvent.click(link,{[key]:true});
 expect(select).not.toHaveBeenCalled();fireEvent.click(link);expect(select).toHaveBeenCalledOnce();
});
it('blocks global disabled callbacks and link navigation while keeping actions separate from views',()=>{
 const select=vi.fn();const mixed=[...items,{id:'docs',label:'文档',icon:<svg/>,href:'/docs'},{id:'theme',label:'主题',icon:<svg/>,action:true}];
 const view=render(<Dock items={mixed} activeId="theme" onSelect={select}/>);
 expect(screen.getByRole('button',{name:'主题'}).getAttribute('aria-pressed')).toBeNull();
 view.rerender(<Dock items={mixed} activeId="home" disabled onSelect={select}/>);
 const link=screen.getByLabelText('文档');expect(link.getAttribute('href')).toBeNull();expect(link.getAttribute('aria-disabled')).toBe('true');expect(link.tabIndex).toBe(-1);
 const event=createEvent.click(link);fireEvent(link,event);expect(event.defaultPrevented).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'工作台'}));expect(select).not.toHaveBeenCalled();
});
it('forwards host attributes and refs without requiring a Provider or mutating the global theme',()=>{
 const theme=document.documentElement.getAttribute('style'),mode=document.documentElement.dataset.theme,store=vi.spyOn(Storage.prototype,'setItem');
 const ref=createRef<HTMLDivElement>();render(<Dock ref={ref} items={items} className="consumer-dock" data-owner="app" label="应用导航"/>);
 expect(ref.current?.classList.contains('consumer-dock')).toBe(true);expect(ref.current?.dataset.owner).toBe('app');
 expect(screen.getByRole('navigation',{name:'应用导航'})).toBeTruthy();
 expect(screen.getAllByRole('button').every(button=>button.getAttribute('type')==='button')).toBe(true);
 expect(document.documentElement.getAttribute('style')).toBe(theme);expect(document.documentElement.dataset.theme).toBe(mode);expect(store).not.toHaveBeenCalled();
});
it('lets the consumer prevent default keyboard navigation and preserves stable item identity',()=>{
 const view=render(<Dock items={items} activeId="home" onKeyDown={event=>event.preventDefault()}/>);
 const first=screen.getByRole('button',{name:'工作台'});first.focus();fireEvent.keyDown(first,{key:'End'});expect(document.activeElement).toBe(first);
 view.rerender(<Dock items={[items[2],items[0]]} activeId="home"/>);
 expect(screen.getByRole('button',{name:'工作台'})).toBe(first);expect(first.getAttribute('aria-pressed')).toBe('true');
});
it('renders nothing for empty items and rejects ambiguous ids',()=>{
 const view=render(<Dock items={[]}/>);expect(screen.queryByRole('navigation')).toBeNull();
 view.rerender(<Dock items={items}/>);expect(screen.getByRole('navigation')).toBeTruthy();view.unmount();
 expect(()=>renderToStaticMarkup(<Dock items={[items[0],items[0]]}/>)).toThrow('unique');
});
it('follows dynamic system reduced motion and explicit consumer reduction',()=>{
 let reduced=false;const listeners=new Set<()=>void>();vi.spyOn(window,'matchMedia').mockImplementation(query=>({media:query,get matches(){return reduced},onchange:null,addListener:vi.fn(),removeListener:vi.fn(),dispatchEvent:()=>true,addEventListener:(_name,fn)=>listeners.add(fn as ()=>void),removeEventListener:(_name,fn)=>listeners.delete(fn as ()=>void)}));
 const view=render(<Dock items={items}/>);const host=()=>view.container.querySelector('.ls-dock-host');expect(host()?.getAttribute('data-reduced')).toBe('false');
 act(()=>{reduced=true;listeners.forEach(fn=>fn())});expect(host()?.getAttribute('data-reduced')).toBe('true');
 view.rerender(<Dock items={items} reducedMotion={false}/>);expect(host()?.getAttribute('data-reduced')).toBe('true');
 act(()=>{reduced=false;listeners.forEach(fn=>fn())});view.rerender(<Dock items={items} reducedMotion/>);expect(host()?.getAttribute('data-reduced')).toBe('true');
});

it('uses the smaller tray without changing selection or keyboard navigation',()=>{
 const {container,rerender}=render(<Dock size="small" items={items} activeId="home"/>);
 expect(container.querySelector('.ls-dock-host')?.getAttribute('data-size')).toBe('small');
 const first=screen.getByRole('button',{name:'工作台'});expect(first.style.width).toBe('32px');
 first.focus();fireEvent.keyDown(first,{key:'End'});expect(document.activeElement).toBe(screen.getByRole('button',{name:'资源'}));
 expect(first.getAttribute('aria-pressed')).toBe('true');
 rerender(<Dock items={items} activeId="home"/>);expect(first.style.width).toBe('36px');
});
