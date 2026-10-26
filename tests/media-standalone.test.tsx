import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {ConfigProvider} from 'antd';
import {afterEach,expect,it,vi} from 'vitest';
import {ImageCard,ImageDeck} from '@lanshang-labs/ui/media';

afterEach(cleanup);

it('uses the host AntD provider and keeps global theme state untouched through interactions',()=>{
 const rootStyle=document.documentElement.getAttribute('style');
 const rootTheme=document.documentElement.dataset.theme;
 const store=vi.spyOn(Storage.prototype,'setItem');
 const preview=vi.fn();
 const view=render(<ConfigProvider prefixCls="host-ant" theme={{token:{colorPrimary:'#8855aa'}}}>
  <ImageCard src="one.svg" alt="One" title="One" onPreview={preview}/>
  <ImageDeck aria-label="Independent" items={[{id:'one',src:'one.svg',alt:'One'},{id:'two',src:'two.svg',alt:'Two'}]}/>
 </ConfigProvider>);
 const next=screen.getByRole('button',{name:'下一张图片'});
 expect(next.className).toContain('host-ant-btn');
 fireEvent.click(next);
 expect(screen.getByRole('status').textContent).toBe('02 / 02');
 const expand=screen.getByRole('button',{name:'展开Independent，共 2 张'});
 expand.focus();fireEvent.click(expand);
 fireEvent.keyDown(screen.getByRole('button',{name:'收起图片'}),{key:'Escape'});
 expect(document.activeElement).toBe(screen.getByRole('button',{name:'展开Independent，共 2 张'}));
 fireEvent.click(screen.getByRole('button',{name:'查看One'}));
 expect(preview).toHaveBeenCalledOnce();
 expect(document.documentElement.getAttribute('style')).toBe(rootStyle);
 expect(document.documentElement.dataset.theme).toBe(rootTheme);
 expect(store).not.toHaveBeenCalled();
 view.unmount();store.mockRestore();
});
