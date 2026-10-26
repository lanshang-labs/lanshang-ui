import {afterEach,expect,it,vi} from 'vitest';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {Button,ConfigProvider} from 'antd';
import {LanshangProvider} from '../src/Provider';
import {designTheme} from '../src/theme';
import {controlSizes,palettes} from '../src/tokens';
import {ButtonPreview} from '../website/control-previews';
afterEach(()=>{cleanup();vi.useRealTimers()});
it('uses neutral interaction colors and consistent geometry in both themes',()=>{
 for(const mode of ['light','dark'] as const){const theme=designTheme(mode);const b=theme.components!.Button!;expect(b.borderRadiusSM).toBe(controlSizes.small.radius);expect(b.controlHeightSM).toBe(controlSizes.small.height);expect(b.paddingInlineSM).toBe(controlSizes.small.paddingInline);expect(b.defaultHoverColor).toBe(b.defaultColor);expect(b.defaultShadow).toBe('none');expect(b.defaultHoverBg).not.toBe(b.defaultBg)}
});
it('preserves natural Chinese spacing and consumer override',()=>{
 render(<LanshangProvider><Button>取消</Button><ConfigProvider button={{autoInsertSpace:true}}><Button>确认</Button></ConfigProvider></LanshangProvider>);
 expect(screen.getByRole('button',{name:'取消'}).textContent).toBe('取消');expect(screen.getByRole('button',{name:/确.*认/}).textContent).toBe('确 认');
});
it('keeps focus during loading and prevents disabled or repeated actions',()=>{
 vi.useFakeTimers();render(<LanshangProvider><ButtonPreview/></LanshangProvider>);const save=screen.getByRole('button',{name:'保存修改'});save.focus();fireEvent.click(save);fireEvent.click(save);expect(save.getAttribute('aria-busy')).toBe('true');expect(document.activeElement).toBe(save);const cancel=screen.getByRole('button',{name:'取消'});expect((cancel as HTMLButtonElement).disabled).toBe(true);fireEvent.click(cancel);expect(screen.getByRole('status').textContent).toBe('正在保存');act(()=>vi.advanceTimersByTime(700));expect(screen.getByRole('status').textContent).toBe('保存成功');expect(document.activeElement).toBe(save);expect(save.getAttribute('aria-busy')).toBe('false');
});

it('keeps primary button text contrast above 4.5 in both themes and all action states',()=>{
 const luminance=(hex:string)=>{const rgb=hex.replace('#','').match(/../g)!.map(c=>parseInt(c,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
 for(const mode of ['light','dark'] as const){const b=designTheme(mode).components!.Button!;for(const key of ['colorPrimary','colorPrimaryHover','colorPrimaryActive'] as const){const ink=luminance(b.primaryColor as string),fill=luminance(b[key] as string);expect((Math.max(ink,fill)+.05)/(Math.min(ink,fill)+.05)).toBeGreaterThanOrEqual(4.5)}}
});
it('separates readable danger text from filled danger button colors',()=>{
 const luminance=(hex:string)=>{const rgb=hex.replace('#','').match(/../g)!.map(c=>parseInt(c,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
 for(const mode of ['light','dark'] as const){
  const p=palettes[mode];
  expect(designTheme(mode).components!.Button!.colorError).toBe(p['error-text']);
  for(const key of ['danger-fill','danger-fill-hover','danger-fill-active'] as const){
   expect(1.05/(luminance(p[key])+.05)).toBeGreaterThanOrEqual(4.5);
  }
 }
});

it.each(['light','dark'] as const)('keeps primary actions neutral while links, focus and danger retain their semantics (%s)',mode=>{
 const config=designTheme(mode),button=config.components!.Button!,palette=palettes[mode];
 expect(button.colorPrimary).toBe(palette.text);
 expect(button.primaryColor).toBe(palette.surface);
 expect(config.token!.colorLink).toBe(palette['link-text']);
 expect(config.token!.colorPrimary).toBe(palette.accent);
 expect(button.colorPrimary).not.toBe(button.colorError);
});
