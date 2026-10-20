import {render,screen,cleanup,act} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {WorkspaceLayout,WorkspaceSidebar} from '../src/WorkspaceLayout';
import {WorkspaceHeader} from '../src/WorkspaceHeader';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
it('keeps navigation separate from the scrollable main landmark',()=>{
 render(<WorkspaceLayout sidebar={<WorkspaceSidebar collapsed={false}>Menu</WorkspaceSidebar>} header={<WorkspaceHeader>Tabs</WorkspaceHeader>}><button>Content action</button></WorkspaceLayout>);
 expect(screen.getByRole('complementary').textContent).toBe('Menu');
 expect(screen.getByRole('main').contains(screen.getByRole('button',{name:'Content action'}))).toBe(true);
 expect(screen.getByRole('main').textContent).not.toContain('Tabs');
});
it('restores the desktop sidebar preference after a narrow-screen collapse',()=>{
 let change:()=>void=()=>{};
 const query={matches:false,addEventListener:vi.fn((_:string,fn:()=>void)=>change=fn),removeEventListener:vi.fn()};
 vi.stubGlobal('matchMedia',vi.fn(()=>query));
 const onCollapsedChange=vi.fn();
 const view=render(<WorkspaceSidebar collapsed={false} onCollapsedChange={onCollapsedChange}/>);
 expect(onCollapsedChange).not.toHaveBeenCalled();
 act(()=>{query.matches=true;change();});
 expect(onCollapsedChange).toHaveBeenCalledWith(true);
 view.rerender(<WorkspaceSidebar collapsed onCollapsedChange={onCollapsedChange}/>);
 expect(screen.getByRole('complementary').style.getPropertyValue('--ls-sidebar-width')).toBe('72px');
 onCollapsedChange.mockClear();act(()=>{query.matches=false;change();});
 expect(onCollapsedChange).toHaveBeenCalledWith(false);
 view.unmount();expect(query.removeEventListener).toHaveBeenCalledWith('change',change);
});
it('keeps a manually collapsed desktop sidebar collapsed after returning from narrow screens',()=>{
 let change:()=>void=()=>{};
 const query={matches:false,addEventListener:vi.fn((_:string,fn:()=>void)=>change=fn),removeEventListener:vi.fn()};
 vi.stubGlobal('matchMedia',vi.fn(()=>query));
 const onCollapsedChange=vi.fn();
 const view=render(<WorkspaceSidebar collapsed onCollapsedChange={onCollapsedChange}/>);
 act(()=>{query.matches=true;change();});
 expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
 onCollapsedChange.mockClear();act(()=>{query.matches=false;change();});
 expect(onCollapsedChange).toHaveBeenLastCalledWith(true);
 view.unmount();
});
