import React,{useState,type Key} from 'react';
import {projectSamples,createProjectSource,demoOwners,demoCategories} from '../website/mock-project-source';
import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import {ProjectListBlock,DetailBlock,EditFormBlock} from '../website/blocks';
import {ProjectListPreview} from '../website/block-previews';
afterEach(cleanup);
function ListHarness(){const [query,setQuery]=useState(''),[selected,setSelected]=useState<Key[]>([]);return <ProjectListBlock rows={projectSamples.filter(row=>row.name.includes(query))} query={query} selectedKeys={selected} onSelectionChange={setSelected} onFilterChange={next=>setQuery(next.query)} onOpen={()=>{}}/>}

it('hides stale detail and editing during loading, and exposes retry on failure',()=>{
 const retry=vi.fn();const {rerender}=render(<DetailBlock state="loading"/>);
 expect(screen.getByRole('status').textContent).toContain('正在加载');
 expect(screen.getByRole('status').closest('[aria-busy="true"]')).toBeNull();
 expect(screen.queryByRole('button',{name:'编辑项目'})).toBeNull();
 rerender(<DetailBlock state="error" onRetry={retry}/>);
 fireEvent.click(screen.getByRole('button',{name:'重新加载'}));expect(retry).toHaveBeenCalledOnce();
});
it('clears an unmatched search without losing project rows',()=>{
 render(<ListHarness/>);
 fireEvent.change(screen.getByRole('textbox',{name:'搜索项目'}),{target:{value:'no-match-xyz'}});
 expect(screen.getByText('没有匹配的项目')).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'清除筛选'}));
 expect(screen.getByRole('button',{name:'设计系统'})).toBeTruthy();
});
it('keeps the list search focused through consecutive async filter requests',async()=>{
 render(<ProjectListPreview/>);
 const input=await screen.findByRole('textbox',{name:'搜索项目'},{timeout:5000});
 input.focus();
 fireEvent.change(input,{target:{value:'文'}});
 expect(screen.getByRole('textbox',{name:'搜索项目'})).toBe(input);
 expect(document.activeElement).toBe(input);
 expect((input as HTMLInputElement).disabled).toBe(false);
 fireEvent.change(input,{target:{value:'文档'}});
 expect(document.activeElement).toBe(input);
 await waitFor(()=>expect(screen.queryByRole('button',{name:'设计系统'})).toBeNull(),{timeout:5000});
 expect(screen.getByRole('button',{name:'文档中心'})).toBeTruthy();
 expect(document.activeElement).toBe(input);
},15000);
it('retains form input after rejection and allows retry',async()=>{
 const save=vi.fn().mockRejectedValueOnce(new Error('保存失败，稍后重试')).mockResolvedValueOnce(undefined);
 render(<EditFormBlock record={projectSamples[0]} owners={demoOwners} categories={demoCategories} onSave={save}/>);
 const input=screen.getByRole('textbox',{name:'项目名称'});
 fireEvent.change(input,{target:{value:'保留我的修改'}});
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 await screen.findByText('保存失败，稍后重试');
 expect((input as HTMLInputElement).value).toBe('保留我的修改');
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 await waitFor(()=>expect(save).toHaveBeenCalledTimes(2));
 await screen.findByText('保存成功');
});
it('keeps edits when discard confirmation is cancelled',async()=>{
 const cancel=vi.fn();render(<EditFormBlock record={projectSamples[0]} owners={demoOwners} categories={demoCategories} onCancel={cancel}/>);
 const input=screen.getByRole('textbox',{name:'项目名称'});
 fireEvent.change(input,{target:{value:'未保存的内容'}});
 fireEvent.click(screen.getByRole('button',{name:'取 消'}));
 await screen.findByRole('dialog');expect(cancel).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'继续编辑'}));
 expect((input as HTMLInputElement).value).toBe('未保存的内容');
 expect(cancel).not.toHaveBeenCalled();
});
it('clears selection when search scope changes',()=>{
 render(<ListHarness/>);
 fireEvent.click(screen.getByRole('checkbox',{name:'选择设计系统'}));
 expect(screen.getByRole('region',{name:'批量操作'})).toBeTruthy();
 fireEvent.change(screen.getByRole('textbox',{name:'搜索项目'}),{target:{value:'文档'}});
 expect(screen.queryByRole('region',{name:'批量操作'})).toBeNull();
});

it('mock archive reports partial failures and mutates only successful rows',async()=>{const source=createProjectSource(0);const result=await source.archive(['PRJ-001','PRJ-002'],'partial');expect(result).toEqual({succeeded:['PRJ-002'],failed:['PRJ-001']});expect((await source.detail('PRJ-001')).record?.status).toBe('active');expect((await source.detail('PRJ-002')).record?.status).toBe('archived');});
it('mock save failure leaves source unchanged and successful save is visible in detail',async()=>{const source=createProjectSource(0);const next={...projectSamples[0],name:'新的名称'};await expect(source.save(next,true)).rejects.toThrow();expect((await source.detail(next.id)).record?.name).toBe(projectSamples[0].name);await source.save(next);const detail=await source.detail(next.id);expect(detail.record?.name).toBe('新的名称');expect(detail.activities[0].label).toBe('更新了项目信息');});
it('uses the server record as reset baseline and treats reverted fields as clean',async()=>{
 const saved={...projectSamples[0],name:'服务端规范名称'};
 render(<EditFormBlock record={projectSamples[0]} onSave={async()=>saved}/>);
 const input=screen.getByRole('textbox',{name:'项目名称'});
 fireEvent.change(input,{target:{value:'输入名称'}});fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 await screen.findByText('保存成功');expect((input as HTMLInputElement).value).toBe(saved.name);
 fireEvent.change(input,{target:{value:'再次修改'}});fireEvent.click(screen.getByRole('button',{name:'重 置'}));
 fireEvent.click(await screen.findByRole('button',{name:'放弃修改'}));
 await waitFor(()=>expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).value).toBe(saved.name));
});
it('maps server field errors onto the input and clears them when corrected',async()=>{
 const {ProjectFieldError}=await import('../website/blocks');
 render(<EditFormBlock record={projectSamples[0]} onSave={async()=>{throw new ProjectFieldError({name:['名称已被使用']})}}/>);
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));await screen.findByText('名称已被使用');
 const input=screen.getByRole('textbox',{name:'项目名称'});expect(document.activeElement).toBe(input);
 fireEvent.change(input,{target:{value:'未占用名称'}});
 await waitFor(()=>expect(screen.queryByText('名称已被使用')).toBeNull());
});
it('does not apply an old save response to a newly selected record',async()=>{
 let resolve!:(value:typeof projectSamples[number])=>void;
 const save=()=>new Promise<typeof projectSamples[number]>(done=>{resolve=done});
 const {rerender}=render(<EditFormBlock record={projectSamples[0]} onSave={save}/>);
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));await waitFor(()=>expect(resolve).toBeTruthy());
 rerender(<EditFormBlock record={projectSamples[1]} onSave={save}/>);
 resolve({...projectSamples[0],name:'过期响应'});
 await waitFor(()=>expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).value).toBe(projectSamples[1].name));
 expect(screen.queryByText('保存成功')).toBeNull();
});
it('blocks empty-result recovery actions while a refresh is pending',()=>{
 const filter=vi.fn();render(<ProjectListBlock rows={[]} query="missing" refreshing onFilterChange={filter}/>);
 const clear=screen.getByRole('button',{name:'清除筛选'}) as HTMLButtonElement;
 expect(clear.disabled).toBe(true);fireEvent.click(clear);expect(filter).not.toHaveBeenCalled();
});
it('reconciles an unknown save without executing it twice and returns focus',async()=>{
 const {ProjectSaveUnknown}=await import('../website/blocks');
 const lookup=vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({...projectSamples[0],name:'已确认版本'});
 const save=vi.fn().mockRejectedValue(new ProjectSaveUnknown(lookup));
 render(<EditFormBlock record={projectSamples[0]} onSave={save}/>);
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 const recover=await screen.findByRole('button',{name:'核对保存结果'});
 await waitFor(()=>expect(document.activeElement).toBe(recover));
 expect((screen.getByRole('button',{name:'保存项目'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.click(recover);await screen.findByText('暂时无法核对，输入和待核对请求已保留。');
 await waitFor(()=>expect(document.activeElement).toBe(recover));
 expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).disabled).toBe(true);
 fireEvent.click(recover);await screen.findByText('保存成功');
 expect(save).toHaveBeenCalledTimes(1);expect(lookup).toHaveBeenCalledTimes(2);
 expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).value).toBe('已确认版本');
 await waitFor(()=>expect(document.activeElement).toBe(screen.getByRole('button',{name:'保存项目'})));
 expect(document.querySelector('.ant-btn-loading')).toBeNull();
});
it('only reopens submission after a receipt confirms no execution',async()=>{
 const {ProjectSaveUnknown}=await import('../website/blocks');
 const save=vi.fn().mockRejectedValueOnce(new ProjectSaveUnknown(async()=>null)).mockResolvedValueOnce(undefined);
 render(<EditFormBlock record={projectSamples[0]} onSave={save}/>);
 fireEvent.change(screen.getByRole('textbox',{name:'项目名称'}),{target:{value:'我的草稿'}});
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 fireEvent.click(await screen.findByRole('button',{name:'核对保存结果'}));
 await screen.findByText('已确认未执行，可以重新保存。');
 expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).value).toBe('我的草稿');
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));await screen.findByText('保存成功');expect(save).toHaveBeenCalledTimes(2);
 expect(screen.queryByRole('alert')).toBeNull();
});
it('does not steal focus from another control when receipt lookup finishes',async()=>{
 const {ProjectSaveUnknown}=await import('../website/blocks');
 let resolve!:(record:typeof projectSamples[number])=>void;
 render(<><button>其他操作</button><EditFormBlock record={projectSamples[0]} onSave={async()=>{throw new ProjectSaveUnknown(()=>new Promise(done=>{resolve=done}))}}/></>);
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));
 const recover=await screen.findByRole('button',{name:'核对保存结果'});recover.focus();fireEvent.click(recover);
 const other=screen.getByRole('button',{name:'其他操作'});other.focus();
 resolve(projectSamples[0]);await screen.findByText('保存成功');expect(document.activeElement).toBe(other);
});
it('ignores a late receipt after the caller changes the record',async()=>{
 const {ProjectSaveUnknown}=await import('../website/blocks');
 let resolve!:(record:typeof projectSamples[number])=>void;
 const save=async()=>{throw new ProjectSaveUnknown(()=>new Promise<typeof projectSamples[number]>(done=>{resolve=done}))};
 const {rerender}=render(<EditFormBlock record={projectSamples[0]} onSave={save}/>);
 fireEvent.click(screen.getByRole('button',{name:'保存项目'}));fireEvent.click(await screen.findByRole('button',{name:'核对保存结果'}));
 rerender(<EditFormBlock record={projectSamples[1]} onSave={save}/>);
 const input=screen.getByRole('textbox',{name:'项目名称'});input.focus();resolve({...projectSamples[0],name:'过期核对结果'});
 await waitFor(()=>expect((input as HTMLInputElement).value).toBe(projectSamples[1].name));
 expect(document.activeElement).toBe(input);expect(screen.queryByText('保存成功')).toBeNull();expect(screen.queryByRole('button',{name:'核对保存结果'})).toBeNull();
});
it('keeps grouped form fields associated with the form after layout composition',async()=>{
 const save=vi.fn().mockResolvedValue(undefined);render(<EditFormBlock record={projectSamples[0]} onSave={save}/>);
 const input=screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement;
 fireEvent.change(input,{target:{value:'布局后的编辑'}});
 fireEvent.click(screen.getByRole('switch',{name:'接收项目更新通知'}));
 const submit=screen.getByRole('button',{name:'保存项目'}) as HTMLButtonElement;
 expect(submit.form).toBe(input.form);expect(submit.form).not.toBeNull();
 fireEvent.submit(submit.form!);await screen.findByText('保存成功');
 expect(save).toHaveBeenCalledWith(expect.objectContaining({name:'布局后的编辑',notifications:false}));
});
it('keeps an unsaved draft when the edit block briefly shows a loading state',()=>{
 const record=projectSamples[0];
 const view=render(<EditFormBlock record={record} state="ready"/>);
 fireEvent.change(screen.getByRole('textbox',{name:'项目名称'}),{target:{value:'尚未保存的名称'}});
 view.rerender(<EditFormBlock record={record} state="loading"/>);
 expect(screen.queryByRole('textbox',{name:'项目名称'})).toBeNull();
 view.rerender(<EditFormBlock record={record} state="ready"/>);
 expect((screen.getByRole('textbox',{name:'项目名称'}) as HTMLInputElement).value).toBe('尚未保存的名称');
});
