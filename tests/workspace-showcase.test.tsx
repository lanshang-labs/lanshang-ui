import {afterEach,it,expect} from 'vitest';
import {cleanup,fireEvent,render,screen,within} from '@testing-library/react';
import {WorkspaceShowcase} from '../website/workspace-showcase';
afterEach(()=>{cleanup();location.hash='';});
it('keeps project drafts when changing dock destinations and layout examples',()=>{
 render(<WorkspaceShowcase/>);
 const dock=within(screen.getByRole('navigation',{name:'项目工作台导航'}));
 fireEvent.click(dock.getByRole('button',{name:'项目信息'}));
 fireEvent.change(screen.getByLabelText('项目说明'),{target:{value:'保留工作台草稿'}});
 fireEvent.click(dock.getByRole('button',{name:'部署'}));
 expect(dock.getByRole('button',{name:'部署'}).getAttribute('aria-pressed')).toBe('true');
 fireEvent.click(screen.getByRole('button',{name:'生产多栏工作台'}));
 fireEvent.click(screen.getByRole('button',{name:'Dock 项目工作台'}));
 fireEvent.click(within(screen.getByRole('navigation',{name:'项目工作台导航'})).getByRole('button',{name:'项目信息'}));
 expect((screen.getByLabelText('项目说明') as HTMLTextAreaElement).value).toBe('保留工作台草稿');
});
it('can enter the whole-page experience and return to layout selection',()=>{
 render(<WorkspaceShowcase/>);
 fireEvent.click(screen.getByRole('button',{name:'进入整页体验'}));
 expect(screen.queryByRole('button',{name:'生产多栏工作台'})).toBeNull();
 fireEvent.keyDown(window,{key:'Escape'});
 expect(screen.getByRole('button',{name:'生产多栏工作台'})).toBeTruthy();
});
