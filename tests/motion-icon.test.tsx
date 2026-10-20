import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {MotionButton} from '../src/MotionButton';
import {MotionIcon} from '../src/MotionIcon';
import {RowActionButton} from '../src/RowActionButton';
import {controlSizes} from '../src/tokens';
import {ConfigProvider} from 'antd';
afterEach(cleanup);
it('matches the default and provider button icon sizes',()=>{
 const view=render(<MotionButton motionIcon="search">搜索</MotionButton>);
 expect((view.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.middle.icon}px`);
 view.rerender(<ConfigProvider componentSize="large"><MotionButton motionIcon="search">搜索</MotionButton></ConfigProvider>);
 expect((view.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.large.icon}px`);
});
it('keeps row-action button and icon sizes aligned with the provider',()=>{
 const view=render(<ConfigProvider componentSize="large"><RowActionButton motionIcon="edit">编辑</RowActionButton></ConfigProvider>);
 expect(view.container.querySelector('.bui-row-action.ant-btn-lg')).toBeTruthy();
 expect((view.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.large.icon}px`);
 view.rerender(<ConfigProvider componentSize="large"><RowActionButton size="small" motionIcon="edit">编辑</RowActionButton></ConfigProvider>);
 expect(view.container.querySelector('.bui-row-action.ant-btn-sm')).toBeTruthy();
 expect((view.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes.small.icon}px`);
});
it.each(['small','middle','large'] as const)('sizes shared motion icons with explicit %s controls',size=>{
 const {container,unmount}=render(<MotionButton size={size} motionIcon="search">搜索</MotionButton>);
 expect((container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes[size].icon}px`);
 unmount();
 const row=render(<RowActionButton size={size} motionIcon="search">搜索</RowActionButton>);
 expect((row.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe(`${controlSizes[size].icon}px`);
});
it('keeps state caller-owned and reverses without remounting paired SVG',()=>{
 const click=vi.fn();const {container,rerender}=render(<MotionButton motionIcon="play" iconActive={false} onClick={click}>播放</MotionButton>);
 const glyph=container.querySelector('.ls-motion-icon');fireEvent.click(screen.getByRole('button'));
 expect(click).toHaveBeenCalledTimes(1);expect(glyph?.getAttribute('data-turned')).toBe('false');
 rerender(<MotionButton motionIcon="play" iconActive>暂停</MotionButton>);
 expect(container.querySelector('.ls-motion-icon')).toBe(glyph);expect(glyph?.getAttribute('data-turned')).toBe('true');
 rerender(<MotionButton motionIcon="play" iconActive={false}>播放</MotionButton>);expect(glyph?.getAttribute('data-turned')).toBe('false');
});
it('replays single actions while preserving the button and form behavior',()=>{
 const click=vi.fn(),submit=vi.fn(e=>e.preventDefault());const {container}=render(<form onSubmit={submit}><MotionButton motionIcon="save" htmlType="submit" onClick={click}>保存</MotionButton></form>);
 const button=screen.getByRole('button'),initial=container.querySelector('.ls-motion-icon');fireEvent.click(button);
 expect(click).toHaveBeenCalledTimes(1);expect(submit).toHaveBeenCalledTimes(1);expect(screen.getByRole('button')).toBe(button);expect(container.querySelector('.ls-motion-icon')).not.toBe(initial);
});
it('preserves link navigation when an icon action plays',()=>{
 const {container}=render(<MotionButton type="text" motionIcon="forward" href="#/components/button" aria-label="下一页"/>);
 const link=screen.getByRole('link',{name:'下一页'});
 expect(link.getAttribute('href')).toBe('#/components/button');
 fireEvent.click(link);
 expect(container.querySelector('.ls-motion-icon.is-playing')).toBeTruthy();
 expect(link.getAttribute('href')).toBe('#/components/button');
});
it.each([MotionButton,RowActionButton])('blocks unavailable motion actions',Control=>{
 const click=vi.fn();const {rerender}=render(<Control motionIcon="delete" disabled onClick={click}>删除</Control>);
 fireEvent.click(screen.getByRole('button'));rerender(<Control motionIcon="delete" loading onClick={click}>删除</Control>);fireEvent.click(screen.getByRole('button'));rerender(<Control motionIcon="delete" aria-disabled onClick={click}>删除</Control>);fireEvent.click(screen.getByRole('button'));expect(click).not.toHaveBeenCalled();
});
it('keeps unavailable row links focusable without navigating',()=>{
 const click=vi.fn();
 const {rerender}=render(<RowActionButton href="#row-action" aria-disabled onClick={click}>查看详情</RowActionButton>);
 const link=screen.getByRole('link',{name:'查看详情'});
 link.focus();
 expect(document.activeElement).toBe(link);
 const blocked=new MouseEvent('click',{bubbles:true,cancelable:true});
 link.dispatchEvent(blocked);
 expect(blocked.defaultPrevented).toBe(true);
 expect(click).not.toHaveBeenCalled();
 rerender(<RowActionButton href="#row-action" onClick={click}>查看详情</RowActionButton>);
 const allowed=new MouseEvent('click',{bubbles:true,cancelable:true});
 link.dispatchEvent(allowed);
 expect(allowed.defaultPrevented).toBe(false);
 expect(click).toHaveBeenCalledOnce();
});
it('is decorative and idle on mount even with an active controlled state',()=>{
 const {container}=render(<MotionIcon name="theme" active/>);expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();expect(container.querySelector('.is-playing')).toBeNull();
});
