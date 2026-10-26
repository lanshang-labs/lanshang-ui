import {cleanup,fireEvent,render,screen,waitFor,within} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import {FoundationPage} from '../experiments/shadcn-dashboard/src/foundation-page';
// Test the actual form, filters and portals without re-rendering the unrelated template shell.
vi.mock('../experiments/shadcn-dashboard/src/components/layouts/base-layout',()=>({BaseLayout:({children}:{children:React.ReactNode})=>children}));
vi.mock('../experiments/shadcn-dashboard/src/lab-context',()=>({useLab:()=>({dark:false})}));
afterEach(cleanup);

it('preserves foundation drafts, tabs and validation across visual profile changes',async()=>{
 const {container}=render(<FoundationPage/>);
 const name=screen.getByLabelText('空间名称');
 fireEvent.change(name,{target:{value:'保留的草稿'}});
 fireEvent.click(screen.getByText('活动').closest('[role=tab]')!);
 fireEvent.click(screen.getByLabelText('现行主题 Tokens'));
 expect(container.querySelector('[data-candidate="false"]')).toBeTruthy();
 expect(screen.getByLabelText('空间名称')).toBe(name);
 expect((name as HTMLInputElement).value).toBe('保留的草稿');
 expect(screen.getByText('活动').closest('[role=tab]')!.getAttribute('aria-selected')).toBe('true');
 fireEvent.click(screen.getByLabelText('候选方案'));
 fireEvent.change(name,{target:{value:'  '}});
 fireEvent.click(screen.getByText('保存更改').closest('button')!);
 expect(await screen.findByText('请输入空间名称')).toBeTruthy();
 fireEvent.change(name,{target:{value:'已验证的空间'}});
 fireEvent.click(screen.getByText('保存更改').closest('button')!);
 expect(await screen.findByText('已保存「已验证的空间」的本地设置')).toBeTruthy();
});

it('creates a local foundation space through its namespaced portal and recovers empty filters',async()=>{
 const {container}=render(<FoundationPage/>);
 fireEvent.click(screen.getByText('新建空间').closest('button')!);
 const dialog=await screen.findByRole('dialog');
 expect(dialog.className).toContain('lf-ant-modal');
 fireEvent.click(within(dialog).getByText('创建空间').closest('button')!);
 expect(await screen.findByText('请输入新空间名称')).toBeTruthy();
 fireEvent.change(within(dialog).getByLabelText('新空间名称'),{target:{value:'新空间样例'}});
 fireEvent.click(within(dialog).getByText('创建空间').closest('button')!);
 await waitFor(()=>expect(screen.queryByRole('dialog')).toBeNull());
 fireEvent.change(screen.getByLabelText('搜索空间'),{target:{value:'新空间样例'}});
 expect(await screen.findByRole('button',{name:'查看新空间样例'})).toBeTruthy();
 expect(screen.getByRole('heading',{name:'项目空间 5'})).toBeTruthy();
 fireEvent.change(screen.getByLabelText('搜索空间'),{target:{value:'不存在的空间'}});
 expect(await screen.findByText('没有匹配的空间')).toBeTruthy();
 fireEvent.click(screen.getByText('重置筛选').closest('button')!);
 expect(await screen.findByRole('button',{name:'查看设计系统'})).toBeTruthy();
});
