import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,test,expect} from 'vitest';
import {BoomerangProvider,ThemeSwitch,DataTable,designTheme,themeVariables} from '../src';
afterEach(()=>{cleanup();localStorage.clear()});
test('theme switches preserve mounted input and persist the chosen namespace',()=>{
 render(<BoomerangProvider storageKey="demo.theme"><ThemeSwitch/><input aria-label="query" defaultValue="SELECT 1"/></BoomerangProvider>);
 const input=screen.getByLabelText('query'); fireEvent.change(input,{target:{value:'SELECT 2'}});
 fireEvent.click(screen.getByRole('button',{name:'浅色模式'}));
 expect(document.documentElement.dataset.theme).toBe('light');expect(localStorage.getItem('demo.theme')).toBe('light');
 expect(screen.getByLabelText('query')).toBe(input);expect((input as HTMLInputElement).value).toBe('SELECT 2');
});
test('AntD and CSS share light and dark colors',()=>{for(const mode of ['light','dark'] as const)expect(themeVariables(mode)['--ui-surface']).toBe(designTheme(mode).token?.colorBgContainer)});
