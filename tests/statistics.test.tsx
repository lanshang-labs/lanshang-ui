import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {ChartCard,RankingBarList,StatisticCard} from '../src/Statistics';
afterEach(cleanup);
it('distinguishes zero from missing values without inferring whether an increase is good',()=>{
  const view=render(<StatisticCard label="任务" value={0} trend={{direction:'up',label:'增加 3'}}/>);
  expect(screen.getByText('0')).toBeTruthy();
  expect(document.querySelector('.ls-statistic-trend')?.getAttribute('data-tone')).toBe('neutral');
  view.rerender(<StatisticCard label="任务" value={null}/>);expect(screen.getByText('—')).toBeTruthy();
  view.rerender(<StatisticCard label="任务" value={NaN}/>);expect(screen.getByText('—')).toBeTruthy();
  view.rerender(<StatisticCard label="任务" value="1,024" trend={{direction:'down',label:'下降 2%',tone:'success'}}/>);
  expect(screen.getByText('1,024')).toBeTruthy();expect(document.querySelector('.ls-statistic-trend')?.getAttribute('data-tone')).toBe('success');
});
it('preserves caller order, zero and exact values; invalid ranking data does not become a valid magnitude',()=>{
  render(<RankingBarList aria-label="资源" max={100} items={[{key:'b',label:'B',value:0},{key:'a',label:'A',value:25},{key:'invalid',label:'无效',value:-5}]}/>);
  const rows=screen.getAllByRole('listitem');
  expect(rows.map(row=>row.textContent)).toEqual(['B0','A25','无效—']);
  expect((rows[1].querySelector('.ls-ranking-bar-fill') as HTMLElement).style.width).toBe('25%');
});
it('retains a chart subtree during refresh and refresh errors',()=>{
  const view=render(<ChartCard title="产出" hasContent><input aria-label="筛选" defaultValue="设计组"/></ChartCard>);
  const input=screen.getByRole('textbox');input.focus();
  view.rerender(<ChartCard title="产出" hasContent loading><input aria-label="筛选" defaultValue="设计组"/></ChartCard>);
  expect(screen.getByRole('textbox')).toBe(input);expect(document.activeElement).toBe(input);
  view.rerender(<ChartCard title="产出" hasContent error="超时"><input aria-label="筛选" defaultValue="设计组"/></ChartCard>);
  expect(screen.getByRole('textbox')).toBe(input);expect(screen.getByRole('alert').textContent).toContain('上次成功');
});
