import {cleanup,render,screen,fireEvent} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {WorkspaceLayout,WorkspaceSidebar} from '../src/WorkspaceLayout';
import {WorkbenchPage} from '../src/WorkbenchPage';
afterEach(cleanup);
it('keeps Dock navigation outside the main landmark with or without a sidebar',()=>{
 const view=render(<WorkspaceLayout variant="dock" sidebar={<WorkspaceSidebar collapsed={false}>Global navigation</WorkspaceSidebar>} footer={<nav aria-label="Dock">Views</nav>}><WorkbenchPage toolbar={<input aria-label="Search"/>}>Content</WorkbenchPage></WorkspaceLayout>);
 expect(screen.getByRole('main').contains(screen.getByRole('navigation',{name:'Dock'}))).toBe(false);
 const search=screen.getByRole('textbox',{name:'Search'});fireEvent.change(search,{target:{value:'retain'}});
 view.rerender(<WorkspaceLayout variant="dock" footer={<nav aria-label="Dock">Views</nav>}><WorkbenchPage toolbar={<input aria-label="Search"/>}>Content</WorkbenchPage></WorkspaceLayout>);
 expect(screen.queryByRole('complementary')).toBeNull();
 expect(screen.getByRole('textbox',{name:'Search'})).toBe(search);
 expect((search as HTMLInputElement).value).toBe('retain');
});
it('keeps toolbar and page navigation above a managed editor and status below it',()=>{
 const {container}=render(<WorkbenchPage aria-label="Editor workspace" toolbar={<button>Refresh</button>} navigation={<nav aria-label="Sections">Sections</nav>} contentPadding="none" scroll="managed" footer={<span role="status">Saved</span>}><textarea aria-label="Draft"/></WorkbenchPage>);
 const body=container.querySelector('.ls-workbench-content')!;
 expect(body.contains(screen.getByRole('textbox',{name:'Draft'}))).toBe(true);
 expect(body.contains(screen.getByRole('button',{name:'Refresh'}))).toBe(false);
 expect(body.contains(screen.getByRole('navigation',{name:'Sections'}))).toBe(false);
 expect(body.contains(screen.getByRole('status'))).toBe(false);
 expect(screen.getByRole('region',{name:'Editor workspace'})).toBeTruthy();
});
