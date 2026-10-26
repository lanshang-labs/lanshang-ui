import {afterEach,beforeEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,act} from '@testing-library/react';
import {UploadPreview,uploadFileError} from '../website/upload-preview';
import {UploadControl} from '../src/SupportingControls';
beforeEach(()=>{vi.useFakeTimers();vi.stubGlobal('URL',Object.assign(URL,{createObjectURL:vi.fn(()=> 'blob:sample'),revokeObjectURL:vi.fn()}))});
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks();vi.unstubAllGlobals()});
it('validates file types, empty files and size',()=>{
 expect(uploadFileError(new File(['x'],'image.png'))).toBe('');
 expect(uploadFileError(new File(['x'],'video.mp4'))).toBe('');
 expect(uploadFileError(new File(['x'],'script.html'))).toContain('类型');
 expect(uploadFileError(new File([],'empty.txt'))).toContain('空文件');
 const file=new File(['x'],'large.pdf');Object.defineProperty(file,'size',{value:51*1024*1024});expect(uploadFileError(file)).toContain('50 MB');
});
it('cancels progress, retries failure and completes without duplicate timers',()=>{
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('checkbox',{name:'模拟上传失败'}));fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 act(()=>vi.advanceTimersByTime(400));const bar=screen.getByRole('progressbar',{name:'预览图片.png'});expect(bar.getAttribute('aria-valuenow')).toBe('25');
 const cancel=screen.getByRole('button',{name:'取消上传 预览图片.png'});cancel.focus();fireEvent.click(cancel);act(()=>vi.advanceTimersByTime(2000));expect(bar.getAttribute('aria-valuenow')).toBe('25');expect(document.activeElement).toBe(cancel);
 fireEvent.click(screen.getByRole('button',{name:'重新上传 预览图片.png'}));act(()=>vi.advanceTimersByTime(800));expect(bar.getAttribute('aria-valuetext')).toContain('失败');
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟上传失败'}));fireEvent.click(screen.getByRole('button',{name:'重新上传 预览图片.png'}));act(()=>vi.advanceTimersByTime(1600));expect(bar.getAttribute('aria-valuenow')).toBe('100');expect(bar.getAttribute('aria-valuetext')).toContain('已完成');
});
it('limits the queue and releases resources on remove and unmount',()=>{
 const clear=vi.spyOn(globalThis,'clearInterval');const view=render(<UploadPreview/>);for(let i=0;i<3;i++)fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 expect(screen.getAllByRole('article')).toHaveLength(5);expect(screen.getByRole('region',{name:'最近一次文件校验'}).textContent).toContain('最多');
 fireEvent.click(screen.getAllByRole('button',{name:'移除 预览图片.png'})[0]);expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);expect(document.activeElement).toBe(screen.getAllByRole('button',{name:'预览 交付说明.txt'})[0]);
 view.unmount();expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3);expect(clear.mock.calls.length).toBeGreaterThanOrEqual(5);
});
it('accepts a selected video without starting a network upload',async()=>{
 render(<UploadPreview/>);const input=document.querySelector('input[type=file]')!;
 await act(async()=>{fireEvent.change(input,{target:{files:[new File(['video'],'clip.webm',{type:'video/webm'})]}})});
 expect(screen.getByRole('article',{name:'clip.webm'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button',{name:'预览 clip.webm'}));expect(document.querySelector('video')?.getAttribute('src')).toBe('blob:sample');fireEvent.error(document.querySelector('video')!);expect(screen.getByRole('alert').textContent).toContain('无法预览');
});

it('isolates simultaneous files and ignores an old attempt after cancel and retry',()=>{
 const schedule=vi.spyOn(globalThis,'setInterval');
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 const old=schedule.mock.calls[0][0] as ()=>void;
 const cancel=screen.getByRole('button',{name:'取消上传 预览图片.png'});cancel.focus();fireEvent.click(cancel);
 fireEvent.click(screen.getByRole('button',{name:'重新上传 预览图片.png'}));
 act(()=>old());expect(screen.getByRole('progressbar',{name:'预览图片.png'}).getAttribute('aria-valuenow')).toBe('0');
 act(()=>vi.advanceTimersByTime(400));
 expect(screen.getByRole('progressbar',{name:'交付说明.txt'}).getAttribute('aria-valuenow')).toBe('25');
 fireEvent.click(screen.getByRole('button',{name:'移除 交付说明.txt'}));expect(document.activeElement).toBe(screen.getByRole('button',{name:'预览 预览图片.png'}));
 const action=screen.getByRole('button',{name:'取消上传 预览图片.png'});action.focus();act(()=>vi.advanceTimersByTime(1200));
 expect(document.activeElement).toBe(action);expect(action.getAttribute('aria-disabled')).toBe('true');
 fireEvent.click(action);expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
 fireEvent.click(screen.getByRole('button',{name:'移除 预览图片.png'}));expect(document.activeElement).toBe(screen.getByRole('button',{name:'选择文件'}));act(()=>vi.advanceTimersByTime(2000));expect(screen.queryByRole('article')).toBeNull();
});
it('keeps duplicate filenames independent and long filenames out of visible action labels',()=>{
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('button',{name:'添加长文件名样例'}));fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 const names=screen.getAllByRole('article');expect(names).toHaveLength(4);
 const long=screen.getByRole('button',{name:/预览 跨区域交付说明/});expect(long.textContent?.trim()).toBe('');expect(long.querySelector('.ls-motion-icon')).toBeTruthy();expect(long.getAttribute('title')).toBe('预览');
 fireEvent.click(screen.getAllByRole('button',{name:'取消上传 预览图片.png'})[0]);act(()=>vi.advanceTimersByTime(1600));
 const bars=screen.getAllByRole('progressbar',{name:'预览图片.png'});expect(bars[0].getAttribute('aria-valuetext')).toContain('已取消');expect(bars[1].getAttribute('aria-valuetext')).toContain('已完成');
});
it('returns focus to the preview trigger after closing while uploads finish',async()=>{
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 const preview=screen.getByRole('button',{name:'预览 交付说明.txt'});preview.focus();fireEvent.click(preview);await act(async()=>{vi.advanceTimersByTime(2000)});
 const close=screen.getByRole('button',{name:'关闭预览'});expect(document.querySelector('.ant-modal-footer')).toBeNull();expect(close.getAttribute('title')).toBe('关闭预览');
 fireEvent.click(close);act(()=>vi.advanceTimersByTime(1000));
 expect(document.activeElement).toBe(preview);
});
it('targets mixed states and retains batch focus without restarting completed files',()=>{
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));act(()=>vi.advanceTimersByTime(1600));
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟上传失败'}));fireEvent.click(screen.getByRole('button',{name:'添加长文件名样例'}));act(()=>vi.advanceTimersByTime(800));
 fireEvent.click(screen.getByRole('checkbox',{name:'模拟上传失败'}));fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 const cancel=screen.getByRole('button',{name:'批量取消'});cancel.focus();fireEvent.click(cancel);expect(document.activeElement).toBe(cancel);expect(cancel.getAttribute('aria-disabled')).toBe('true');
 const retry=screen.getByRole('button',{name:'批量重试'});retry.focus();fireEvent.click(retry);fireEvent.click(retry);expect(document.activeElement).toBe(retry);
 expect(screen.getAllByRole('progressbar').map(el=>el.getAttribute('aria-valuenow'))).toEqual(['100','100','0','0','0']);
 const remove=screen.getByRole('button',{name:'移除非上传中项'});remove.focus();fireEvent.click(remove);
 expect(document.activeElement).toBe(remove);expect(screen.getAllByRole('article')).toHaveLength(3);
 act(()=>vi.advanceTimersByTime(1600));expect(screen.getAllByRole('progressbar').every(el=>el.getAttribute('aria-valuenow')==='100')).toBe(true);
 fireEvent.click(remove);expect(document.activeElement).toBe(remove);expect(screen.queryByRole('article')).toBeNull();fireEvent.click(remove);expect(screen.queryByRole('article')).toBeNull();
});
it('routes dropped files through the same validation and queue limit',async()=>{
 render(<UploadPreview/>);
 expect(document.querySelector('.ls-upload-drop.ant-upload-wrapper')).toBeTruthy();
 const drop=document.querySelector('.ant-upload-drag-container')!;
 const files=[new File(['x'],'a.png'),new File(['x'],'b.mp4'),new File(['x'],'c.txt'),new File(['x'],'d.pdf'),new File(['x'],'e.docx'),new File(['x'],'extra.txt'),new File(['x'],'bad.exe')];
 await act(async()=>{fireEvent.drop(drop,{dataTransfer:{files,items:files.map(file=>({kind:'file',type:file.type,getAsFile:()=>file})),types:['Files']}})});
 expect(screen.getAllByRole('article')).toHaveLength(5);expect(screen.queryByRole('article',{name:'bad.exe'})).toBeNull();expect(screen.queryByRole('article',{name:'extra.txt'})).toBeNull();
});
it('keeps caller classes alongside the shared dropzone surface',()=>{
 render(<UploadControl.Dragger className="caller-drop" showUploadList={false}>选择文件</UploadControl.Dragger>);
 expect(document.querySelector('.ls-upload-drop.caller-drop.ant-upload-wrapper')).toBeTruthy();
});

it('reports every mixed rejection, preserves validation after completion and releases slots only on removal',async()=>{
 render(<UploadPreview/>);fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));
 const big=new File(['x'],'large.pdf');Object.defineProperty(big,'size',{value:51*1024*1024});
 const files=[new File(['x'],'bad.exe'),new File([],'empty.txt'),big,...Array.from({length:4},(_,i)=>new File(['x'],`valid${i}.txt`))];
 const choose=screen.getByRole('button',{name:'选择文件'});choose.focus();
 await act(async()=>{fireEvent.drop(document.querySelector('.ant-upload-drag-container')!,{dataTransfer:{files,items:files.map(file=>({kind:'file',type:file.type,getAsFile:()=>file})),types:['Files']}})});
 expect(screen.getAllByRole('article')).toHaveLength(5);expect(document.activeElement).toBe(choose);
 const receipt=screen.getByRole('region',{name:'最近一次文件校验'});
 for(const reason of ['不支持此文件类型','不能选择空文件','50 MB','valid3.txt：最多'])expect(receipt.textContent).toContain(reason);
 act(()=>vi.advanceTimersByTime(1600));expect(receipt.textContent).toContain('bad.exe');
 fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));expect(screen.getAllByRole('article')).toHaveLength(5);
 fireEvent.click(screen.getByRole('button',{name:'移除非上传中项'}));fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));expect(screen.getAllByRole('article')).toHaveLength(2);
 expect(receipt.textContent).toContain('未加入 0 个');expect(receipt.textContent).not.toContain('bad.exe');
});
it('retains focus through consecutive batch cycles and ignores removed attempt callbacks',()=>{
 const schedule=vi.spyOn(globalThis,'setInterval');render(<UploadPreview/>);
 fireEvent.click(screen.getByRole('button',{name:'添加模拟图片与文档'}));const old=schedule.mock.calls[0][0] as ()=>void;
 for(let i=0;i<3;i++){
  const cancel=screen.getByRole('button',{name:'批量取消'});cancel.focus();fireEvent.click(cancel);fireEvent.click(cancel);expect(document.activeElement).toBe(cancel);
  const retry=screen.getByRole('button',{name:'批量重试'});retry.focus();fireEvent.click(retry);act(()=>vi.advanceTimersByTime(400));fireEvent.click(retry);
  expect(document.activeElement).toBe(retry);expect(screen.getAllByRole('progressbar').map(el=>el.getAttribute('aria-valuenow'))).toEqual(['25','25']);
 }
 fireEvent.click(screen.getByRole('button',{name:'批量取消'}));const remove=screen.getByRole('button',{name:'移除非上传中项'});remove.focus();fireEvent.click(remove);fireEvent.click(remove);
 act(()=>{old();vi.advanceTimersByTime(2000)});expect(screen.queryByRole('article')).toBeNull();expect(document.activeElement).toBe(remove);
});
