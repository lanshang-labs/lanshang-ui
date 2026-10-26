import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {DockPreview} from '../website/dock-preview';
afterEach(cleanup);
it('uses the public component for controlled views, disabled and reduced modes and native navigation',()=>{
 render(<DockPreview/>);fireEvent.click(screen.getByRole('button',{name:'资源',exact:true}));expect(screen.getByRole('heading',{name:'资源',exact:true})).toBeTruthy();
 fireEvent.click(screen.getByRole('checkbox',{name:'禁用 Dock'}));fireEvent.click(screen.getByRole('button',{name:'项目',exact:true}));expect(screen.queryByRole('heading',{name:'项目',exact:true})).toBeNull();
 fireEvent.click(screen.getByRole('checkbox',{name:'减少动态效果'}));expect(document.querySelector('.ls-dock-host')?.getAttribute('data-reduced')).toBe('true');
 expect(screen.getByRole('link',{name:'Markdown 文档'}).getAttribute('href')).toBe('#/components/markdown');
 expect(screen.getByLabelText('暂不可用').getAttribute('href')).toBeNull();
});
