import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {IconMotionPreview} from '../website/icon-motion-preview';

afterEach(()=>{cleanup();vi.useRealTimers()});

it('shows the shared save icon and previews its check-to-spinner lifecycle',()=>{
 vi.useFakeTimers();
 const {container}=render(<IconMotionPreview/>);
 const save=screen.getByRole('button',{name:'保存，点击播放动效'});
 expect(save.querySelector('.ls-motion-icon[data-effect="save"] .ls-icon-save-check')).toBeTruthy();
 fireEvent.click(save);
 expect(save.getAttribute('aria-busy')).toBe('true');
 expect(save.querySelector('.ls-motion-icon[data-pending="true"] .ls-icon-save-arc')).toBeTruthy();
 act(()=>vi.advanceTimersByTime(1200));
 expect(save.getAttribute('aria-busy')).toBe('false');
 expect(save.querySelector('.ls-motion-icon[data-pending="false"] .ls-icon-save-check')).toBeTruthy();
 fireEvent.change(screen.getByRole('textbox',{name:'搜索图标'}),{target:{value:'保存'}});
 expect(container.querySelectorAll('.icon-review-tile')).toHaveLength(1);
});
