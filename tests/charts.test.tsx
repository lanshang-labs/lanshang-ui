import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
const calls=vi.hoisted(()=>({current:{} as Record<string,unknown>}));
vi.mock('@ant-design/plots',()=>{
  const Plot=(props:Record<string,unknown>)=>{calls.current=props;return <div data-testid="plot"/>;};
  return {Line:Plot,Area:Plot,Column:Plot,Bar:Plot,Pie:Plot};
});
import {LineChart,AreaChart,ColumnChart,BarChart,DonutChart} from '../src/charts';
import {LanshangProvider} from '../src/Provider';
import {createChartTheme} from '../src/chart-theme';
import {AnalyticsPreview} from '../website/analytics-preview';
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();});
const data=[{day:'周一',count:0},{day:'周二',count:7}];
it('passes original values and native options without guessing aggregation or dropping zeros',()=>{
  const event=vi.fn();
  render(<LineChart label="产出" data={data} xField="day" yField="count" axis={false} onReady={event}/>);
  expect(calls.current.data).toBe(data);expect(calls.current.axis).toBe(false);expect(calls.current.onReady).toBe(event);
  expect(calls.current.xField).toBe('day');expect(calls.current.yField).toBe('count');
  expect(screen.getByRole('figure',{name:'产出'})).toBeTruthy();
});
it('offers raw HTML values lazily for keyboard and text readers',()=>{
  render(<LineChart label="产出" data={data} xField="day" yField="count"/>);
  expect(screen.queryByRole('table')).toBeNull();
  const details=document.querySelector('details')!;details.open=true;fireEvent(details,new Event('toggle'));
  expect(screen.getByRole('table',{name:'产出原始数据'})).toBeTruthy();expect(screen.getByRole('cell',{name:'0'})).toBeTruthy();
  expect(screen.getByRole('region',{name:'产出数据表'}).getAttribute('tabindex')).toBe('0');
});
it('uses an empty state and does not mount a renderer for empty data',()=>{
  render(<LineChart label="产出" data={[]} xField="day" yField="count"/>);
  expect(screen.getByText('暂无图表数据')).toBeTruthy();expect(screen.queryByTestId('plot')).toBeNull();
});
it.each(['light','dark'] as const)('maps chart theme explicitly to the provider (%s)',mode=>{
  render(<LanshangProvider storageKey={`test-chart-${mode}`} defaultMode={mode}><ColumnChart label="产出" data={data} xField="day" yField="count"/></LanshangProvider>);
  expect(calls.current.theme).toEqual(createChartTheme(mode));
});
it('disables canvas animation when the system requests reduced motion and responds to preference changes',()=>{
  let reduced=true;const listeners=new Set<()=>void>();
  vi.spyOn(window,'matchMedia').mockImplementation(query=>({media:query,get matches(){return reduced;},addEventListener:(_name,fn)=>listeners.add(fn as ()=>void),removeEventListener:(_name,fn)=>listeners.delete(fn as ()=>void),addListener:vi.fn(),removeListener:vi.fn(),dispatchEvent:()=>true,onchange:null}));
  render(<AreaChart label="产出" data={data} xField="day" yField="count"/>);expect(calls.current.animate).toBe(false);
  act(()=>{reduced=false;listeners.forEach(fn=>fn());});expect(calls.current.animate).not.toBe(false);
});
it('supports the other native renderer families with consistent field mapping',()=>{
  const view=render(<BarChart label="产出" data={data} xField="day" yField="count"/>);expect(calls.current.xField).toBe('day');
  view.rerender(<DonutChart label="分布" data={data} categoryField="day" valueField="count"/>);
  expect(calls.current.colorField).toBe('day');expect(calls.current.angleField).toBe('count');expect(calls.current.innerRadius).toBe(.72);
});
it('keeps the successful time range on a failed read and adopts it only after explicit retry succeeds',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);
  expect(screen.queryByText('95')).toBeNull();
  act(()=>vi.advanceTimersByTime(1200));expect(screen.getByText('95')).toBeTruthy();
  fireEvent.click(screen.getByRole('checkbox',{name:'模拟读取失败'}));
  fireEvent.click(screen.getByRole('button',{name:'近 14 天'}));
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByRole('alert').textContent).toContain('上次成功读取');
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button',{name:'重试'}));act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByRole('button',{name:'近 14 天'}).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('checkbox',{name:'请求空结果'}));
  expect(screen.getByText('95')).toBeTruthy();
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getAllByText('暂无图表数据')).toHaveLength(2);
  expect(screen.getByText('暂无排行数据')).toBeTruthy();
});
it('does not clear a successful dashboard when an empty-result request fails',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  const before=[...document.querySelectorAll('[data-testid=plot]')];
  fireEvent.click(screen.getByRole('checkbox',{name:'模拟读取失败'}));
  fireEvent.click(screen.getByRole('button',{name:'近 14 天'}));act(()=>vi.advanceTimersByTime(1200));
  fireEvent.click(screen.getByRole('checkbox',{name:'请求空结果'}));
  expect(screen.getByText('95')).toBeTruthy();expect(screen.queryByText('暂无排行数据')).toBeNull();
  expect([...document.querySelectorAll('[data-testid=plot]')]).toEqual(before);
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByText('95')).toBeTruthy();expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button',{name:'重试'}));act(()=>vi.advanceTimersByTime(1200));
  expect(screen.queryByText('95')).toBeNull();expect(screen.getByText('暂无排行数据')).toBeTruthy();
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
  expect((screen.getByRole('checkbox',{name:'模拟读取失败'}) as HTMLInputElement).checked).toBe(false);
});
it('stops every initial skeleton on first failure and recovers the whole snapshot',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  fireEvent.click(screen.getByRole('checkbox',{name:'模拟读取失败'}));
  fireEvent.click(screen.getByRole('button',{name:'重新首次加载'}));
  expect(screen.queryByText('95')).toBeNull();
  expect(document.querySelectorAll('.ls-pixel-loader')).toHaveLength(1);
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  expect(document.querySelector('.ls-pixel-loader')).toBeNull();
  expect(document.querySelector('.ls-skeleton')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'重试'}));act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByText('95')).toBeTruthy();expect(document.querySelectorAll('.ls-chart-card')).toHaveLength(3);
});
it('uses one coherent cumulative snapshot and derives the fixed seven-day comparison',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByText('较 7 天前增加 7 集')).toBeTruthy();
  const table=document.querySelector('details')!;table.open=true;fireEvent(table,new Event('toggle'));
  const values=screen.getByRole('table',{name:'生产趋势原始数据'});
  const rows=[...values.querySelectorAll('tbody tr')].map(row=>[...row.querySelectorAll('td')].map(cell=>cell.textContent));
  expect(rows.at(-2)).toEqual(['10/14','31','已完成']);expect(rows.at(-1)).toEqual(['10/14','28','已核对']);
  for(let index=0;index<rows.length;index+=2){
    expect(Number(rows[index+1][1])).toBeLessThanOrEqual(Number(rows[index][1]));
    if(index>0)expect(Number(rows[index][1])).toBeGreaterThanOrEqual(Number(rows[index-2][1]));
  }
});

it('keeps refresh focus, blocks duplicate reads and preserves the expanded data table through recovery',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  const details=document.querySelector('details')!;details.open=true;fireEvent(details,new Event('toggle'));
  const table=screen.getByRole('table',{name:'生产趋势原始数据'});
  fireEvent.click(screen.getByRole('checkbox',{name:'模拟读取失败'}));
  const refresh=screen.getByRole('button',{name:'刷新统计'});refresh.focus();fireEvent.click(refresh);
  expect(document.activeElement).toBe(refresh);expect(refresh.getAttribute('aria-disabled')).toBe('true');
  fireEvent.click(screen.getByRole('button',{name:'近 14 天'}));
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.getByRole('table',{name:'生产趋势原始数据'})).toBe(table);
  const retry=screen.getByRole('button',{name:'重试'});retry.focus();fireEvent.click(retry);
  act(()=>vi.advanceTimersByTime(20));
  expect(document.activeElement).toBe(screen.getByLabelText('统计成功快照'));
  act(()=>vi.advanceTimersByTime(1200));
  expect(screen.queryByRole('alert')).toBeNull();expect(details.open).toBe(true);
  expect(screen.getByRole('table',{name:'生产趋势原始数据'})).toBe(table);
  expect(screen.getByRole('button',{name:'近 7 天'}).getAttribute('aria-pressed')).toBe('true');
});
it('does not take focus away from another control when retry was triggered without focus ownership',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  const checkbox=screen.getByRole('checkbox',{name:'模拟读取失败'});
  fireEvent.click(checkbox);fireEvent.click(screen.getByRole('button',{name:'刷新统计'}));act(()=>vi.advanceTimersByTime(1200));
  checkbox.focus();fireEvent.click(screen.getByRole('button',{name:'重试'}));act(()=>vi.advanceTimersByTime(20));
  expect(document.activeElement).toBe(checkbox);
});

it('keeps the empty-result trigger focused while blocking another request during the pending read',()=>{
  vi.useFakeTimers();render(<AnalyticsPreview/>);act(()=>vi.advanceTimersByTime(1200));
  const empty=screen.getByRole('checkbox',{name:'请求空结果'}) as HTMLInputElement;
  empty.focus();fireEvent.click(empty);expect(document.activeElement).toBe(empty);
  expect(empty.getAttribute('aria-disabled')).toBe('true');expect(empty.checked).toBe(true);
  fireEvent.click(empty);expect(empty.checked).toBe(true);
  act(()=>vi.advanceTimersByTime(1200));
  expect(document.activeElement).toBe(empty);expect(empty.checked).toBe(true);
  expect(screen.getAllByText('暂无图表数据')).toHaveLength(2);expect(screen.getByText('暂无排行数据')).toBeTruthy();
});
