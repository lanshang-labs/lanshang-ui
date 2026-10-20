import {afterEach,it,expect} from 'vitest';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {NumberSliderPreview} from '../website/number-slider-preview';
import {FormFoundationPreview} from '../website/form-foundations-preview';
afterEach(cleanup);
it('puts an independently usable slider first on the slider page',()=>{
 render(<NumberSliderPreview primary="slider"/>);
 const slider=screen.getByRole('slider',{name:'预览宽度'});
 expect(slider.getAttribute('aria-valuenow')).toBe('40');
 fireEvent.keyDown(slider,{key:'ArrowRight',keyCode:39});
 expect(slider.getAttribute('aria-valuenow')).toBe('41');
 expect(screen.getByText('当前草稿：41%')).toBeTruthy();
 expect(screen.getByRole('spinbutton',{name:'生成数量精确值'})).toBeTruthy();
});
it('shares numeric input and keyboard slider values, including boundaries and defaults',()=>{
 render(<NumberSliderPreview/>);
 const input=screen.getByRole('spinbutton',{name:'生成数量精确值'}),slider=screen.getByRole('slider',{name:'生成数量滑动调节'});
 fireEvent.click(screen.getByRole('button',{name:'生成数量精确值增加'}));expect((input as HTMLInputElement).value).toBe('5');
 fireEvent.change(input,{target:{value:'8'}});expect(slider.getAttribute('aria-valuenow')).toBe('8');
 fireEvent.keyDown(slider,{key:'ArrowRight',keyCode:39});expect((input as HTMLInputElement).value).toBe('9');
 fireEvent.keyDown(slider,{key:'End',keyCode:35});expect((input as HTMLInputElement).value).toBe('12');
 fireEvent.keyDown(slider,{key:'Home',keyCode:36});expect((input as HTMLInputElement).value).toBe('1');
 const duration=screen.getByRole('slider',{name:'片段时长滑动调节'});fireEvent.keyDown(duration,{key:'ArrowRight',keyCode:39});expect((screen.getByRole('spinbutton',{name:'片段时长精确值'}) as HTMLInputElement).value).toBe('6.5');
 fireEvent.click(screen.getByRole('button',{name:'恢复默认参数'}));expect((input as HTMLInputElement).value).toBe('4');expect(duration.getAttribute('aria-valuenow')).toBe('6');
});
it('preserves empty values and disables both adjustment paths',()=>{
 render(<NumberSliderPreview/>);const input=screen.getByRole('spinbutton',{name:'生成数量精确值'}),slider=screen.getByRole('slider',{name:'生成数量滑动调节'});
 fireEvent.change(input,{target:{value:''}});expect(screen.getByRole('status').textContent).toContain('未填写');expect(slider.getAttribute('aria-valuetext')).toContain('未填写');
 expect(screen.getByRole('button',{name:'生成数量精确值减少'}).hasAttribute('disabled')).toBe(false);
 fireEvent.keyDown(slider,{key:'ArrowRight',keyCode:39});expect((input as HTMLInputElement).value).toBe('2');
 fireEvent.click(screen.getByRole('checkbox',{name:'禁用参数调整'}));expect((input as HTMLInputElement).disabled).toBe(true);expect(slider.getAttribute('aria-disabled')).toBe('true');
 expect(screen.getByRole('button',{name:'生成数量精确值增加'}).hasAttribute('disabled')).toBe(true);
 fireEvent.keyDown(slider,{key:'End',keyCode:35});expect((input as HTMLInputElement).value).toBe('2');
});
it('validates empty and off-step input and retains the saved numeric baseline',async()=>{
 render(<FormFoundationPreview generation/>);const count=screen.getByRole('spinbutton',{name:'生成数量精确值'});
 fireEvent.change(count,{target:{value:''}});fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(document.activeElement?.getAttribute('aria-label')).toBe('生成数量精确值'));await waitFor(()=>expect(screen.getByText('请输入生成数量')).toBeTruthy());
 fireEvent.change(count,{target:{value:'8'}});const duration=screen.getByRole('spinbutton',{name:'片段时长精确值'});fireEvent.change(duration,{target:{value:'6.3'}});fireEvent.click(screen.getByRole('button',{name:'保存配置'}));
 await waitFor(()=>expect(screen.getByText('时长需为 0.5 秒的倍数')).toBeTruthy());
 fireEvent.change(duration,{target:{value:'6.5'}});fireEvent.click(screen.getByRole('button',{name:'保存配置'}));await waitFor(()=>expect(screen.getByText('已保存，基准已更新')).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'恢复默认参数'}));expect((count as HTMLInputElement).value).toBe('4');expect(screen.getByText('有未保存的修改')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'撤销未保存修改'}));expect((count as HTMLInputElement).value).toBe('8');expect((duration as HTMLInputElement).value).toBe('6.5');
},10000);
