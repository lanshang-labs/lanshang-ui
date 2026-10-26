import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {ShadcnWorkbench} from '../experiments/shadcn-dashboard/src/lab-runtime';
import {pages} from '../website/catalog';
import {pageInstallation} from '../website/page-copy';

// Real Recharts layout is checked at 5177; jsdom cannot measure chart containers.
vi.mock('../experiments/shadcn-dashboard/src/app/dashboard-2/components/sales-chart',()=>({SalesChart:()=>null}));
vi.mock('../experiments/shadcn-dashboard/src/app/dashboard-2/components/revenue-breakdown',()=>({RevenueBreakdown:()=>null}));
vi.mock('../experiments/shadcn-dashboard/src/app/dashboard-2/components/customer-insights',()=>({CustomerInsights:()=>null}));
afterEach(cleanup);

it('retains the exact upstream source snapshot and full MIT notice',()=>{
 const root=resolve('experiments/shadcn-dashboard');
 const provenance=JSON.parse(readFileSync(join(root,'provenance.json'),'utf8'));
 expect(provenance.commit).toBe('65fc11224e96d56a62e224a58f7ed590aea5ac24');
 for(const file of provenance.files){const data=readFileSync(join(root,'upstream',file.path));expect(createHash('sha256').update(data).digest('hex')).toBe(file.sha256);}
 const license=readFileSync(join(root,'LICENSE.md'),'utf8');
 expect(license).toBe(readFileSync(join(root,'upstream/License.md'),'utf8'));
 expect(license).toContain('Copyright (c) 2025 ShadcnStore');
 expect(license).toContain('Permission is hereby granted, free of charge');
});

it('keeps both workbenches in the lab without installable component entries',()=>{
 for(const id of ['labs/admin-workbench','labs/shadcn-workbench']){
  const page=pages.find(p=>p.id===id)!;
  expect(page.localOnly).toBe(true);expect(page.group).toBe('实验室');expect(pageInstallation(page)).toBeUndefined();
 }
});

it('connects the upstream new-sale button to AntD validation and a real local record',async()=>{
 const {container}=render(<ShadcnWorkbench/>);
 fireEvent.click(within(container).getByText('New Sale').closest('button')!);
 fireEvent.click(screen.getByText('创建演示交易').closest('button')!);
 expect(await screen.findByText('请输入客户名称')).toBeTruthy();
 fireEvent.change(screen.getByLabelText('Customer name'),{target:{value:'Local Customer'}});
 fireEvent.change(screen.getByLabelText('Email'),{target:{value:'local@example.test'}});
 fireEvent.change(screen.getByLabelText('Amount (USD)'),{target:{value:'128'}});
 fireEvent.blur(screen.getByLabelText('Amount (USD)'));
 fireEvent.click(screen.getByText('创建演示交易').closest('button')!);
 await waitFor(()=>expect(container.querySelector('tr[data-row-key="TXN-006"]')?.textContent).toContain('Local Customer'));
 const row=container.querySelector('tr[data-row-key="TXN-006"]')!;
 expect(row.textContent).toContain('$128.00');expect(row.textContent).toContain('pending');
 fireEvent.click(within(row as HTMLElement).getByText('查看详情'));
 expect(await screen.findByText('Transaction details')).toBeTruthy();
 expect(screen.getAllByText('local@example.test').length).toBeGreaterThan(0);
});

it('recovers from an empty AntD table filter without losing sample data',async()=>{
 const {container}=render(<ShadcnWorkbench/>);
 fireEvent.click(within(container).getByText('Transactions').closest('a')!);
 fireEvent.change(screen.getByLabelText('筛选交易'),{target:{value:'no-matching-record'}});
 expect(await screen.findByText('没有匹配的交易')).toBeTruthy();
 fireEvent.click(screen.getByText('重置筛选').closest('button')!);
 await waitFor(()=>expect(container.querySelector('table')?.textContent).toContain('Olivia Martin'));
});

it('shares media selection with the template, retains it across materials and opens the host preview',async()=>{
 const rootStyle=document.documentElement.getAttribute('style');
 const rootTheme=document.documentElement.dataset.theme;
 const {container}=render(<ShadcnWorkbench/>);
 fireEvent.click(within(container).getByText('Resources').closest('a')!);
 expect(screen.getByRole('heading',{name:'Resource Library'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'下一张图片'}));
 const current=screen.getByRole('region',{name:'当前画面'});
 expect(within(current).getByRole('img',{name:'薄雾中层叠的灰绿色山峦'})).toBeTruthy();
 fireEvent.click(screen.getByRole('radio',{name:'玻璃材质'}));
 expect(screen.getByRole('status').textContent).toBe('02 / 04');
 expect(container.querySelector('[data-material="glass"]')).toBeTruthy();
 const trigger=screen.getByRole('button',{name:'预览山间 · 薄雾'});
 trigger.focus();fireEvent.click(trigger);
 const dialog=await screen.findByRole('dialog');
 expect(within(dialog).getByRole('img',{name:'薄雾中层叠的灰绿色山峦'})).toBeTruthy();
 expect(dialog.className).toContain('sd-ant-modal');
 fireEvent.click(within(dialog).getByRole('button',{name:'Close'}));
 await waitFor(()=>expect(document.activeElement).toBe(trigger));
 expect(document.documentElement.getAttribute('style')).toBe(rootStyle);
 expect(document.documentElement.dataset.theme).toBe(rootTheme);
});

it('retains the MIT-scoped coss reference source without changing its bytes',()=>{
 const root=resolve('experiments/shadcn-dashboard/foundation-reference');
 const provenance=JSON.parse(readFileSync(join(root,'provenance.json'),'utf8'));
 expect(provenance.commit).toBe('3d8ca28e7d90123e9e0f44665944dc240b026ccb');
 for(const file of provenance.files)expect(createHash('sha256').update(readFileSync(join(root,file.path))).digest('hex')).toBe(file.sha256);
 expect(readFileSync(join(root,'LICENSING.md'),'utf8')).toContain('apps/ui/');
 expect(readFileSync(join(root,'apps/origin/LICENSE.md'),'utf8')).toContain('MIT License');
});
