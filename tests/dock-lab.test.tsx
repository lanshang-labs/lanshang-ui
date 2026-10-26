import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {Dock} from '../experiments/dock/Dock';
import {DockPreview} from '../website/labs/dock-preview';
afterEach(()=>{cleanup();vi.restoreAllMocks()});
const items=[{id:'one',label:'工作台',icon:<svg/>},{id:'two',label:'不可用',icon:<svg/>,disabled:true},{id:'three',label:'资源',icon:<svg/>}];
it('moves focus with arrows without changing selection, skips disabled items and preserves controlled state',()=>{
 const select=vi.fn();render(<Dock items={items} activeId="one" onSelect={select}/>);
 const first=screen.getByRole('button',{name:'工作台'}),last=screen.getByRole('button',{name:'资源'});
 first.focus();fireEvent.keyDown(first,{key:'ArrowRight'});
 expect(document.activeElement).toBe(last);expect(select).not.toHaveBeenCalled();
 fireEvent.click(last);expect(select).toHaveBeenCalledWith('three');
 expect(first.getAttribute('aria-pressed')).toBe('true');expect(last.getAttribute('aria-pressed')).toBe('false');
 fireEvent.keyDown(last,{key:'Home'});expect(document.activeElement).toBe(first);
 fireEvent.click(screen.getByRole('button',{name:'不可用'}));expect(select).toHaveBeenCalledTimes(1);
});
it('keeps native button names and fixed compact sizing with no business side effects',()=>{
 render(<Dock items={items} onSelect={()=>{}}/>);
 const buttons=screen.getAllByRole('button');expect(buttons.every(button=>button.tagName==='BUTTON'&&button.getAttribute('type')==='button')).toBe(true);
 expect(buttons.every(button=>button.style.width==='36px')).toBe(true);
 expect(screen.getByRole('navigation',{name:'快捷入口'})).toBeTruthy();
});
it('switches local preview content through named actions',()=>{
 render(<DockPreview/>);fireEvent.click(screen.getByRole('button',{name:'资源',exact:true}));
 expect(screen.getByRole('heading',{name:'资源',exact:true})).toBeTruthy();
 expect(screen.getByRole('button',{name:'资源',exact:true}).getAttribute('aria-pressed')).toBe('true');
 expect(screen.getByText('图片、文档与灵感，保持清晰的归属。')).toBeTruthy();
});

it('responds immediately when the system reduced-motion preference changes',()=>{
 let reduced=false;const listeners=new Set<()=>void>();
 vi.spyOn(window,'matchMedia').mockImplementation(query=>({media:query,get matches(){return reduced},onchange:null,addListener:vi.fn(),removeListener:vi.fn(),dispatchEvent:()=>true,addEventListener:(_name,fn)=>listeners.add(fn as ()=>void),removeEventListener:(_name,fn)=>listeners.delete(fn as ()=>void)}));
 const view=render(<Dock items={items} onSelect={()=>{}}/>);
 expect(view.container.querySelector('.ls-dock-host')?.getAttribute('data-reduced')).toBe('false');
 act(()=>{reduced=true;listeners.forEach(fn=>fn())});
 expect(view.container.querySelector('.ls-dock-host')?.getAttribute('data-reduced')).toBe('true');
 expect(screen.getAllByRole('button').every(button=>button.style.width==='36px')).toBe(true);
});
