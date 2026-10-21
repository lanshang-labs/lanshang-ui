import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {ImageDeck,type ImageDeckItem} from '../src/ImageDeck';
const items:ImageDeckItem[]=Array.from({length:4},(_,i)=>({id:String(i),src:`image-${i}.png`,alt:`Image ${i}`,title:`Card ${i}`}));
afterEach(()=>{cleanup();vi.useRealTimers();});
const opener=()=>screen.getByRole('button',{name:'展开Test，共 4 张'});
function wheel(target:Element,deltaY=80,extra:WheelEventInit={}){
 const event=new WheelEvent('wheel',{deltaY,bubbles:true,cancelable:true,...extra});fireEvent(target,event);return event;
}
it('cycles a collapsed stack with wheel thresholds and throttles trackpad bursts',()=>{
 vi.useFakeTimers();vi.setSystemTime(1000);render(<ImageDeck aria-label="Test" items={items}/>);
 expect(wheel(opener(),12).defaultPrevented).toBe(true);expect(screen.getByRole('status').textContent).toBe('01 / 04');
 wheel(opener(),22);expect(screen.getByRole('status').textContent).toBe('02 / 04');
 wheel(opener(),200);expect(screen.getByRole('status').textContent).toBe('02 / 04');
 vi.advanceTimersByTime(250);wheel(opener(),80);expect(screen.getByRole('status').textContent).toBe('03 / 04');
 vi.advanceTimersByTime(250);wheel(opener(),-80);expect(screen.getByRole('status').textContent).toBe('02 / 04');
});
it('preserves page scrolling for expanded, single and disabled decks, and browser zoom modifiers',()=>{
 const view=render(<ImageDeck aria-label="Test" items={items}/>);
 expect(wheel(view.container.querySelector('.ls-deck-stage')!).defaultPrevented).toBe(false);
 expect(wheel(opener(),80,{ctrlKey:true}).defaultPrevented).toBe(false);
 expect(wheel(opener(),10,{deltaX:100}).defaultPrevented).toBe(false);
 fireEvent.click(opener());expect(wheel(view.container.querySelector('.ls-deck-stage')!).defaultPrevented).toBe(false);
 view.rerender(<ImageDeck aria-label="Test" items={items} expanded={false} disabled/>);expect(wheel(opener()).defaultPrevented).toBe(false);
 view.rerender(<ImageDeck aria-label="Test" items={items.slice(0,1)}/>);expect(wheel(view.container.querySelector('.ls-deck-stage')!).defaultPrevented).toBe(false);
});
it('expands the same cards, invokes consumer preview and returns keyboard focus on Escape',()=>{
 const preview=vi.fn(),view=render(<ImageDeck aria-label="Test" items={items} onImageClick={preview}/>);
 const cards=[...view.container.querySelectorAll('figure')];opener().focus();fireEvent.click(opener());
 expect(view.container.querySelectorAll('figure')[0]).toBe(cards[0]);expect(screen.getByRole('button',{name:'收起图片'}).getAttribute('aria-expanded')).toBe('true');
 fireEvent.click(screen.getByRole('button',{name:'查看Card 2'}));expect(preview).toHaveBeenCalledWith(items[2],2);
 fireEvent.keyDown(screen.getByRole('button',{name:'查看Card 2'}),{key:'Escape'});expect(document.activeElement).toBe(opener());
});
it('supports keyboard and touch-equivalent buttons, wrapping while keeping the current image after collapse',()=>{
 render(<ImageDeck aria-label="Test" items={items}/>);fireEvent.keyDown(opener(),{key:'ArrowLeft'});expect(screen.getByRole('status').textContent).toBe('04 / 04');
 fireEvent.keyDown(opener(),{key:'Home'});expect(screen.getByRole('status').textContent).toBe('01 / 04');
 fireEvent.keyDown(opener(),{key:'End'});fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));expect(screen.getByRole('status').textContent).toBe('01 / 04');
 fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));fireEvent.click(opener());fireEvent.click(screen.getByRole('button',{name:'收起图片'}));expect(screen.getByRole('status').textContent).toBe('02 / 04');
});
it('treats controlled updates as proposals without adopting values rejected by the parent',()=>{
 const change=vi.fn(),expand=vi.fn();const view=render(<ImageDeck aria-label="Test" items={items} activeId="0" expanded={false} onActiveChange={change} onExpandedChange={expand}/>);
 fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));
 expect(change.mock.calls.map(call=>call[0])).toEqual(['1','1']);expect(screen.getByRole('status').textContent).toBe('01 / 04');
 fireEvent.click(opener());expect(expand).toHaveBeenCalledWith(true);expect(opener()).toBeTruthy();
 view.rerender(<ImageDeck aria-label="Test" items={items} activeId="1" expanded onActiveChange={change}/>);expect(screen.getByRole('button',{name:'收起图片'})).toBeTruthy();
});
it('keeps stable identity through reorder and falls back safely when the current image is removed',()=>{
 const view=render(<ImageDeck aria-label="Test" items={items} defaultActiveId="2"/>);
 view.rerender(<ImageDeck aria-label="Test" items={[items[2],items[0],items[1]]}/>);expect(screen.getByRole('status').textContent).toBe('01 / 03');expect(view.container.querySelector('.ls-deck-current-title')?.textContent).toBe('Card 2');
 view.rerender(<ImageDeck aria-label="Test" items={items.slice(0,2)}/>);expect(screen.getByRole('status').textContent).toBe('01 / 02');expect(view.container.querySelector('.ls-deck-current-title')?.textContent).toBe('Card 0');
 view.rerender(<ImageDeck aria-label="Test" items={[]} emptyState="Nothing here"/>);expect(screen.getByText('Nothing here')).toBeTruthy();expect(screen.queryByRole('button')).toBeNull();
 view.rerender(<ImageDeck aria-label="Test" items={items}/>);expect(wheel(opener()).defaultPrevented).toBe(true);
});
it('does not trigger callbacks when disabled and leaves optional image previews noninteractive',()=>{
 const change=vi.fn(),expand=vi.fn(),preview=vi.fn();const view=render(<ImageDeck aria-label="Test" items={items} disabled onActiveChange={change} onExpandedChange={expand} onImageClick={preview}/>);
 fireEvent.click(opener());fireEvent.keyDown(opener(),{key:'ArrowRight'});fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));expect(change).not.toHaveBeenCalled();expect(expand).not.toHaveBeenCalled();
 view.rerender(<ImageDeck aria-label="Test" items={items} expanded/>);expect(screen.queryByRole('button',{name:'查看Card 0'})).toBeNull();
});
