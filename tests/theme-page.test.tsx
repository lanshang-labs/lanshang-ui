import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {LanshangProvider} from '../dist/index.js';
import {pages} from '../website/catalog';

afterEach(()=>{cleanup();localStorage.clear()});

it('lets the theme reference page switch the shared controls without hiding either palette',()=>{
 const demo=pages.find(page=>page.id==='guide/theme')?.demo;
 expect(demo).toBeTruthy();
 render(<LanshangProvider storageKey="theme-page-test" defaultMode="light">{demo?.()}</LanshangProvider>);
 expect(screen.getByRole('group',{name:'主题切换'})).toBeTruthy();
 expect(screen.getByRole('button',{name:'浅色模式'}).getAttribute('aria-pressed')).toBe('true');
 fireEvent.click(screen.getByRole('button',{name:'暗色模式'}));
 expect(document.documentElement.dataset.theme).toBe('dark');
 expect(screen.getByRole('button',{name:'暗色模式'}).getAttribute('aria-pressed')).toBe('true');
 expect(screen.getByRole('heading',{name:'浅色'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'暗色'})).toBeTruthy();
});
