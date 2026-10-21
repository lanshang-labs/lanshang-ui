import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {ImageCard} from '../src/ImageCard';
afterEach(cleanup);
it('preserves image meaning, caption and consumer preview without adding an action to a passive image',()=>{
 const view=render(<ImageCard src="original.png" alt="Scene panorama" title="Scene" description="Frozen reference" index="01"/>);
 expect(screen.getByRole('img',{name:'Scene panorama'}).getAttribute('src')).toBe('original.png');expect(screen.getByText('Frozen reference')).toBeTruthy();expect(screen.queryByRole('button')).toBeNull();
 const preview=vi.fn();view.rerender(<ImageCard src="original.png" alt="Scene panorama" title="Scene" onPreview={preview}/>);fireEvent.click(screen.getByRole('button',{name:'查看Scene'}));expect(preview).toHaveBeenCalledTimes(1);
});
it('retries a different fallback only once and exposes an explicit failure instead of a broken image',()=>{
 render(<ImageCard src="thumb.png" fallbackSrc="original.png" alt="Character"/>);
 fireEvent.error(screen.getByRole('img',{name:'Character'}));expect(screen.getByRole('img',{name:'Character'}).getAttribute('src')).toBe('original.png');
 fireEvent.error(screen.getByRole('img',{name:'Character'}));expect(screen.getByRole('img',{name:'Character，图片暂不可用'})).toBeTruthy();expect(document.querySelector('img')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'重新加载Character'}));expect(screen.getByRole('img',{name:'Character'}).getAttribute('src')).toBe('thumb.png');
});
it('clears failure state when the source changes, including the fallback source',()=>{
 const view=render(<ImageCard src="bad.png" alt="Reference"/>);fireEvent.error(screen.getByRole('img',{name:'Reference'}));
 view.rerender(<ImageCard src="new.png" alt="Reference"/>);expect(screen.getByRole('img',{name:'Reference'}).getAttribute('src')).toBe('new.png');
 fireEvent.error(screen.getByRole('img',{name:'Reference'}));view.rerender(<ImageCard src="new.png" fallbackSrc="backup.png" alt="Reference"/>);expect(screen.getByRole('img',{name:'Reference'}).getAttribute('src')).toBe('new.png');
});
it('does not loop when fallback equals the failed source or request an empty URL',()=>{
 const view=render(<ImageCard src="bad.png" fallbackSrc="bad.png" alt="Unavailable"/>);fireEvent.error(screen.getByRole('img',{name:'Unavailable'}));expect(document.querySelector('img')).toBeNull();
 view.rerender(<ImageCard src="" alt="Missing"/>);expect(document.querySelector('img')).toBeNull();expect(screen.getByRole('img',{name:'Missing，未提供图片'})).toBeTruthy();
});
it('keeps disabled previews inactive while retaining the image and native attributes',()=>{
 const preview=vi.fn();render(<ImageCard src="image.png" alt="Readable" title="Reference" disabled onPreview={preview} aria-label="Frozen image" data-source="snapshot"/>);
 fireEvent.click(screen.getByRole('button',{name:'查看Reference'}));expect(preview).not.toHaveBeenCalled();expect(screen.getByRole('img',{name:'Readable'})).toBeTruthy();expect(screen.getByLabelText('Frozen image').getAttribute('data-source')).toBe('snapshot');
});
