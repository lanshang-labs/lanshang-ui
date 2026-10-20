import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,it,expect} from 'vitest';
import {LanshangProvider,ThemeSwitch} from '../src/Provider';
import {ConfigProvider} from 'antd';
import {controlSizes} from '../src/tokens';
afterEach(()=>{cleanup();localStorage.clear()});
it('toggles in place, preserves focus and restores persisted theme',()=>{
 const view=render(<LanshangProvider storageKey="toggle-test"><ThemeSwitch variant="toggle"/></LanshangProvider>);
 const button=screen.getByRole('button',{name:'切换到浅色模式'});button.focus();fireEvent.click(button);
 expect(document.activeElement).toBe(button);
 expect(screen.getByRole('button',{name:'切换到暗色模式'})).toBe(button);
 expect(localStorage.getItem('toggle-test')).toBe('light');
 view.unmount();render(<LanshangProvider storageKey="toggle-test"><ThemeSwitch variant="toggle"/></LanshangProvider>);
 fireEvent.click(screen.getByRole('button',{name:'切换到暗色模式'}));
 expect(document.documentElement.dataset.theme).toBe('dark');
});
it('uses the shared button and icon size in the compact theme action',()=>{
 const {container}=render(<LanshangProvider><ThemeSwitch variant="toggle"/></LanshangProvider>);
 expect((container.querySelector('.bui-theme-toggle .ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.middle.icon}px`);
 cleanup();
 const compact=render(<LanshangProvider><ConfigProvider componentSize="small"><ThemeSwitch variant="toggle"/></ConfigProvider></LanshangProvider>);
 expect(compact.container.querySelector('.bui-theme-toggle.ant-btn-sm')).toBeTruthy();
 expect((compact.container.querySelector('.bui-theme-toggle .ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.small.icon}px`);
});
it('keeps the existing explicit light and dark controls',()=>{
 render(<LanshangProvider><ThemeSwitch/></LanshangProvider>);
 expect(screen.getByRole('group',{name:'主题切换'})).toBeTruthy();
 expect(screen.getAllByRole('button')).toHaveLength(2);
});
it('inherits the standard medium size for both grouped theme actions',()=>{
 const view=render(<LanshangProvider><ThemeSwitch/></LanshangProvider>);
 expect(view.container.querySelectorAll('.platform-theme-switch .bui-row-action')).toHaveLength(2);
 expect(view.container.querySelector('.platform-theme-switch .ant-btn-sm')).toBeNull();
 view.rerender(<LanshangProvider><ConfigProvider componentSize="small"><ThemeSwitch/></ConfigProvider></LanshangProvider>);
 expect(view.container.querySelectorAll('.platform-theme-switch .ant-btn-sm')).toHaveLength(2);
});
it('keeps one sliding surface and current theme when another choice receives focus',()=>{
 const {container}=render(<LanshangProvider defaultMode="light"><ThemeSwitch/></LanshangProvider>);
 const surface=container.querySelector('.ls-button-group-indicator');expect(surface).toBeTruthy();
 const dark=screen.getByRole('button',{name:'暗色模式'});dark.focus();
 expect(screen.getByRole('button',{name:'浅色模式'}).getAttribute('aria-pressed')).toBe('true');
 fireEvent.click(dark);
 expect(container.querySelector('.ls-button-group-indicator')).toBe(surface);
 expect(dark.getAttribute('aria-pressed')).toBe('true');
});
