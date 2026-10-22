import {useEffect,useState} from 'react';
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {LoadingContainer} from '../src/LoadingContainer';
import {LoadingContainerPreview} from '../website/loading-container-preview';
afterEach(()=>{cleanup();vi.useRealTimers();});

it('replaces stale children for a first load and announces once outside the busy subtree',()=>{
  vi.useFakeTimers();
  const retry=vi.fn();
  render(<LoadingContainer title="概览" hasContent={false} loading error="旧错误" onRetry={retry}><button>旧内容</button></LoadingContainer>);
  expect(screen.queryByText('旧内容')).toBeNull();
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.getByRole('status').closest('[aria-busy="true"]')).toBeNull();
  expect(document.querySelector('.ls-loading-container-body')?.getAttribute('aria-busy')).toBe('true');
  const placeholder=document.querySelector('.ls-skeleton-placeholder') as HTMLElement;
  expect(placeholder.style.visibility).toBe('hidden');
  act(()=>vi.advanceTimersByTime(149));expect(placeholder.style.visibility).toBe('hidden');
  act(()=>vi.advanceTimersByTime(1));expect(placeholder.style.visibility).toBe('visible');
  act(()=>vi.advanceTimersByTime(60000));expect(retry).not.toHaveBeenCalled();
  expect(document.querySelector('.ls-loading-container')?.getAttribute('data-state')).toBe('loading');
});

it('keeps successful content, local state, DOM and focus through refresh and failure',()=>{
  const unmount=vi.fn();
  function Draft(){const [value,setValue]=useState('');useEffect(()=>unmount,[]);return <input aria-label="草稿" value={value} onChange={e=>setValue(e.target.value)}/>;}
  const view=render(<LoadingContainer hasContent><Draft/></LoadingContainer>);
  const input=screen.getByRole('textbox',{name:'草稿'}) as HTMLInputElement;
  fireEvent.change(input,{target:{value:'保留我的输入'}});input.focus();
  view.rerender(<LoadingContainer hasContent loading><Draft/></LoadingContainer>);
  expect(screen.getByRole('textbox')).toBe(input);expect(input.value).toBe('保留我的输入');expect(document.activeElement).toBe(input);
  expect(screen.getByRole('status').textContent).toContain('保留上次内容');
  view.rerender(<LoadingContainer hasContent error="刷新失败"><Draft/></LoadingContainer>);
  expect(screen.getByRole('textbox')).toBe(input);expect(document.activeElement).toBe(input);
  expect(screen.getByRole('alert').textContent).toContain('上次成功读取');
  expect(document.querySelector('.ls-pixel-loader')).toBeNull();
  view.rerender(<LoadingContainer hasContent><Draft/></LoadingContainer>);
  expect(screen.queryByRole('alert')).toBeNull();expect(unmount).not.toHaveBeenCalled();
});

it('provides a first-failure recovery only when supplied, and delegates retry to the caller',()=>{
  const retry=vi.fn();
  const view=render(<LoadingContainer hasContent={false} error="网络不可用" onRetry={retry}/>);
  expect(screen.getByRole('alert').textContent).toContain('网络不可用');
  expect(screen.queryByText('当前仍显示上次成功读取的内容。')).toBeNull();
  fireEvent.click(screen.getByRole('button',{name:'重试'}));expect(retry).toHaveBeenCalledTimes(1);
  expect(document.querySelector('.ls-loading-container')?.getAttribute('data-state')).toBe('error');
  view.rerender(<LoadingContainer hasContent={false} error="仍未恢复"/>);
  expect(screen.queryByRole('button',{name:'重试'})).toBeNull();
});

it('treats an empty successful result as content and stops waiting after cancellation',()=>{
  const view=render(<LoadingContainer hasContent loading><p>暂无记录</p></LoadingContainer>);
  expect(screen.getByText('暂无记录')).toBeTruthy();
  view.rerender(<LoadingContainer hasContent><p>暂无记录</p></LoadingContainer>);
  expect(screen.getByRole('status').textContent).toBe('');
  expect(document.querySelector('.ls-loading-container-body')?.getAttribute('aria-busy')).toBe('false');
  view.rerender(<LoadingContainer hasContent={false}/>);
  expect(screen.getByText('尚未加载')).toBeTruthy();
});

it('supports page headings, caller names and indicator-only first loading',()=>{
  render(<LoadingContainer variant="page" title="页面概览" aria-label="项目读取" data-testid="region" hasContent={false} loading presentation="indicator" loadingLabel="正在读取项目"/>);
  expect(screen.getByRole('heading',{name:'页面概览',level:2})).toBeTruthy();
  expect(screen.getByRole('region',{name:'项目读取'})).toBe(screen.getByTestId('region'));
  expect(screen.getByRole('status').textContent).toBe('正在读取项目');
  expect(document.querySelector('.ls-skeleton')).toBeNull();
});

it('demonstrates initial load, refresh failure and retry without discarding the draft',()=>{
  vi.useFakeTimers();render(<LoadingContainerPreview/>);
  expect(screen.getByRole('status').textContent).toContain('正在读取生产概览');
  act(()=>vi.advanceTimersByTime(1600));
  const input=screen.getByRole('textbox',{name:'本地备注'}) as HTMLInputElement;
  fireEvent.change(input,{target:{value:'本地核对备注'}});input.focus();
  fireEvent.click(screen.getByRole('button',{name:'模拟刷新失败'}));
  expect(screen.getByRole('textbox',{name:'本地备注'})).toBe(input);
  expect(document.activeElement).toBe(input);
  act(()=>vi.advanceTimersByTime(1600));
  expect(screen.getByRole('alert').textContent).toContain('本次示例读取失败');
  expect(input.value).toBe('本地核对备注');
  fireEvent.click(screen.getByRole('button',{name:'重试'}));
  expect(screen.queryByRole('alert')).toBeNull();
  act(()=>vi.advanceTimersByTime(1600));
  expect(screen.getByText('第 2 次成功读取')).toBeTruthy();expect(screen.getByRole('textbox')).toBe(input);
});

it('demonstrates first-load failure and successful empty results',()=>{
  vi.useFakeTimers();render(<LoadingContainerPreview/>);act(()=>vi.advanceTimersByTime(1600));
  fireEvent.click(screen.getByRole('button',{name:'模拟首次失败'}));expect(screen.queryByRole('textbox')).toBeNull();
  act(()=>vi.advanceTimersByTime(1600));expect(screen.getByRole('alert')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'重试'}));act(()=>vi.advanceTimersByTime(1600));
  fireEvent.click(screen.getByRole('button',{name:'空结果'}));expect(screen.getByText('暂无生产记录')).toBeTruthy();
  fireEvent.click(screen.getByRole('button',{name:'刷新概览'}));expect(screen.getByText('暂无生产记录')).toBeTruthy();
  act(()=>vi.advanceTimersByTime(1600));expect(screen.queryByText('正在更新概览，保留上次内容')).toBeNull();
});
