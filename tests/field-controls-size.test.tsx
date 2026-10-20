import {afterEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react';
import {ConfigProvider,Form} from 'antd';
import EsForm from 'antd/es/form';
import dayjs from 'dayjs';
import {DateField,DateRangeField,NumberInput,SegmentedControl,TextArea,TextInput,ToggleSwitch} from '../src/FieldControls';
import {TabStrip} from '../src/ComplexControls';

afterEach(cleanup);

it('inherits the configured size across shared fields and the switch',()=>{
 const {container}=render(<ConfigProvider componentSize="small"><TextInput/><TextArea/><NumberInput/><DateField/><DateRangeField/><SegmentedControl options={['列表','网格']}/><ToggleSwitch/></ConfigProvider>);
 for(const selector of ['.ls-text-input.ant-input-sm','.ls-text-area.ant-input-sm','.ls-number-input.ant-input-number-sm','.ls-date-field.ant-picker-small','.ls-date-range-field.ant-picker-small','.ls-segmented-control.ant-segmented-sm','.ls-toggle-switch.ant-switch-small']){
  expect(container.querySelector(selector),selector).toBeTruthy();
 }
});

it('lets explicit field sizes override the configured size',()=>{
 const {container}=render(<ConfigProvider componentSize="small"><TextInput size="large"/><NumberInput size="large"/><DateField size="large"/><SegmentedControl size="large" options={['列表','网格']}/><ToggleSwitch size="default"/></ConfigProvider>);
 for(const selector of ['.ls-text-input.ant-input-lg','.ls-number-input.ant-input-number-lg','.ls-date-field.ant-picker-large','.ls-segmented-control.ant-segmented-lg','.ls-toggle-switch:not(.ant-switch-small)']){
  expect(container.querySelector(selector),selector).toBeTruthy();
 }
});

it('uses the shared clear icon without changing field clearing',()=>{
 const input=render(<ConfigProvider componentSize="small"><TextInput aria-label="项目名" allowClear defaultValue="Lanshang"/></ConfigProvider>);
 expect((input.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe('12px');
 fireEvent.click(screen.getByRole('button',{name:'清空输入'}));
 expect((screen.getByRole('textbox',{name:'项目名'}) as HTMLInputElement).value).toBe('');
 input.unmount();
 const area=render(<TextArea aria-label="说明" size="large" allowClear defaultValue="内容"/>);
 expect((area.container.querySelector('.ls-motion-icon') as HTMLElement).style.width).toBe('16px');
 fireEvent.click(screen.getByRole('button',{name:'清空文本'}));
 expect((screen.getByRole('textbox',{name:'说明'}) as HTMLTextAreaElement).value).toBe('');
 area.unmount();
 render(<TextInput aria-label="自定义字段" allowClear={{clearIcon:<span role="img" aria-label="自定义清空">×</span>}} defaultValue="保留"/>);
 expect(screen.getByRole('button',{name:'自定义清空'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'自定义清空'}));
 expect((screen.getByRole('textbox',{name:'自定义字段'}) as HTMLInputElement).value).toBe('');
});

it('shares date clear icons while preserving the caller icon and clear behavior',()=>{
 const date=dayjs('2026-10-13');
 const single=render(<DateField aria-label="截止日期" defaultValue={date}/>);
 expect(single.container.querySelector('.ls-date-field .ant-picker-suffix .ls-control-icon svg')).toBeTruthy();
 expect(single.container.querySelector('.anticon-calendar')).toBeNull();
 expect(screen.getByRole('button',{name:'清空已选日期'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'清空已选日期'}));
 expect((screen.getByRole('textbox',{name:'截止日期'}) as HTMLInputElement).value).toBe('');
 single.unmount();
 render(<DateRangeField defaultValue={[date,date.add(1,'day')]} clearIcon={<span role="img" aria-label="自定义日期清空">×</span>}/>);
 expect(screen.getByRole('button',{name:'自定义日期清空'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'自定义日期清空'}));
 expect(screen.getAllByRole('textbox').every(field=>(field as HTMLInputElement).value==='')).toBe(true);
});

it('keeps caller calendar and range-separator icons',()=>{
 const view=render(<DateRangeField defaultValue={[dayjs('2026-10-13'),dayjs('2026-10-14')]}/>);
 expect(view.container.querySelector('.ls-date-range-field .ant-picker-suffix .ls-control-icon svg')).toBeTruthy();
 expect(view.container.querySelector('.ls-date-range-separator svg')).toBeTruthy();
 expect(view.container.querySelector('.anticon-calendar,.anticon-swap-right')).toBeNull();
 view.rerender(<DateRangeField suffixIcon={<span data-testid="caller-calendar">日</span>} separator={<span data-testid="caller-separator">到</span>}/>);
 expect(screen.getByTestId('caller-calendar')).toBeTruthy();
 expect(screen.getByTestId('caller-separator')).toBeTruthy();
});

it('preserves form validation feedback beside the shared calendar icon',()=>{
 const view=render(<Form><Form.Item name="date" validateStatus="error" hasFeedback><DateField aria-label="截止日期"/></Form.Item></Form>);
 expect(view.container.querySelector('.ant-form-item-feedback-icon')).toBeTruthy();
 expect(view.container.querySelector('.ls-date-field .ant-picker-suffix .ls-control-icon')).toBeTruthy();
});
it('preserves ESM form feedback in the browser build',()=>{
 const view=render(<EsForm><EsForm.Item name="date" validateStatus="error" hasFeedback><DateField aria-label="截止日期"/></EsForm.Item></EsForm>);
 expect(view.container.querySelector('.ant-form-item-feedback-icon')).toBeTruthy();
 expect(view.container.querySelector('.ls-date-field .ant-picker-suffix .ls-control-icon')).toBeTruthy();
});

it('keeps the three switch silhouettes and existing default alias interactive',()=>{
 const {container}=render(<ConfigProvider componentSize="large"><ToggleSwitch aria-label="继承大号" defaultChecked/><ToggleSwitch size="middle" aria-label="中号"/><ToggleSwitch size="small" aria-label="小号"/><ToggleSwitch size="default" aria-label="旧默认号"/></ConfigProvider>);
 for(const [label,size] of [['继承大号','large'],['中号','middle'],['小号','small'],['旧默认号','middle']]){
  const control=screen.getByRole('switch',{name:label});
  expect(control.getAttribute('data-ls-size')).toBe(size);
 }
 fireEvent.click(screen.getByRole('switch',{name:'继承大号'}));
 expect(screen.getByRole('switch',{name:'继承大号'}).getAttribute('aria-checked')).toBe('false');
 expect(container.querySelector('.ls-toggle-switch[data-ls-size=small].ant-switch-small')).toBeTruthy();
});

it('keeps shared tabs at the standard size while honoring local and explicit sizes',()=>{
 const items=[{key:'one',label:'概览',children:'概览内容'},{key:'two',label:'活动',children:'活动内容'}];
 const view=render(<TabStrip items={items}/>);
 expect(view.container.querySelector('.ls-tab-strip.ant-tabs:not(.ant-tabs-small):not(.ant-tabs-large)')).toBeTruthy();
 expect(view.container.querySelector('.ant-tabs-nav-more .ls-control-icon')).toBeTruthy();
 expect(view.container.querySelector('.ant-tabs-nav-more svg')?.getAttribute('width')).toBe('14');
 view.rerender(<ConfigProvider componentSize="small"><TabStrip items={items}/></ConfigProvider>);
 expect(view.container.querySelector('.ls-tab-strip.ant-tabs-small')).toBeTruthy();
 expect(view.container.querySelector('.ant-tabs-nav-more svg')?.getAttribute('width')).toBe('12');
 view.rerender(<ConfigProvider componentSize="small"><TabStrip size="large" items={items}/></ConfigProvider>);
 expect(view.container.querySelector('.ls-tab-strip.ant-tabs-large')).toBeTruthy();
 expect(view.container.querySelector('.ant-tabs-nav-more svg')?.getAttribute('width')).toBe('16');
 fireEvent.click(screen.getByRole('tab',{name:'活动'}));
 expect(screen.getByText('活动内容')).toBeTruthy();
 view.rerender(<TabStrip moreIcon={<span data-testid="caller-more">更多</span>} items={items}/>);
 expect(screen.getByTestId('caller-more')).toBeTruthy();
});

it('owns responsive calendar styling while retaining caller popup classes',async()=>{
 const single=render(<ConfigProvider componentSize="small"><DateField placeholder="选择日期" popupClassName="caller-calendar"/></ConfigProvider>);
 fireEvent.click(screen.getByPlaceholderText('选择日期'));
 await waitFor(()=>expect(document.querySelector('.ls-date-popup.ls-date-popup-small.caller-calendar:not(.ant-picker-dropdown-hidden)')).toBeTruthy());
 single.unmount();
 render(<DateRangeField size="large" placeholder={['开始日期','结束日期']} popupClassName="caller-range"/>);
 fireEvent.click(screen.getByPlaceholderText('开始日期'));
 await waitFor(()=>expect(document.querySelector('.ls-date-popup.ls-date-popup-large.caller-range:not(.ant-picker-dropdown-hidden)')).toBeTruthy());
});
