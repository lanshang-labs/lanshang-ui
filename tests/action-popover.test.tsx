import {createPortal} from 'react-dom';
import {it,expect,afterEach,vi} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {useState} from 'react';
import {ActionPopover} from '../src/ActionPopover';
it('closes on Escape, restores trigger focus and preserves controlled input',async()=>{
 function Demo(){const [open,setOpen]=useState(false),[value,setValue]=useState('');return <ActionPopover label="筛选" open={open} onOpenChange={setOpen}><input aria-label="条件" value={value} onChange={e=>setValue(e.target.value)}/></ActionPopover>}
 render(<Demo/>);const trigger=screen.getByRole('button',{name:/筛\s*选/});fireEvent.click(trigger);
 const input=await screen.findByLabelText('条件');fireEvent.change(input,{target:{value:'retained'}});input.focus();fireEvent.keyDown(input,{key:'Escape'});
 await waitFor(()=>expect(trigger.getAttribute('aria-expanded')).toBe('false'));expect(document.activeElement).toBe(trigger);
 fireEvent.click(trigger);expect((screen.getByLabelText('条件') as HTMLInputElement).value).toBe('retained');
});

afterEach(cleanup);
it('does not consume Escape from a nested portal',()=>{
 function Nested(){const [open,setOpen]=useState(true);return <ActionPopover label="工具" open={open} onOpenChange={setOpen}>{createPortal(<button>嵌套弹窗操作</button>,document.body)}</ActionPopover>}
 render(<Nested/>);fireEvent.keyDown(screen.getByRole('button',{name:'嵌套弹窗操作'}),{key:'Escape'});
 expect(screen.getByRole('button',{name:/^工\s*具$/}).getAttribute('aria-expanded')).toBe('true');
});

it('returns focus to the collapsed action after a nested modal disappears',async()=>{
 const rect=vi.spyOn(HTMLElement.prototype,'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
 function Nested(){const [open,setOpen]=useState(true),[modal,setModal]=useState(false);return <ActionPopover label="设置" open={open} onOpenChange={setOpen}><button onClick={()=>setModal(true)}>编辑</button>{modal&&createPortal(<div className="ant-modal-wrap"><button onClick={()=>{setModal(false);(document.querySelector('.ls-action-popover') as HTMLElement).focus()}}>返回</button></div>,document.body)}</ActionPopover>}
 render(<Nested/>);const edit=screen.getByRole('button',{name:'编辑'});fireEvent.click(edit);
 await waitFor(()=>expect(screen.getByRole('button',{name:'返回'})).toBeTruthy());
 fireEvent.click(screen.getByRole('button',{name:'返回'}));await waitFor(()=>expect(document.activeElement).toBe(edit));rect.mockRestore();
});
