import {createRef} from 'react';
import type {ResourceTreeRef} from '../src/ResourceTree';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import {ResourceTree,ResourceIcon,ResourceName} from '../src/ResourceTree';
afterEach(cleanup);
it('preserves expansion and selection with decorative centered icons',()=>{
 const onSelect=vi.fn();
 const {container}=render(<ResourceTree onSelect={onSelect} treeData={[{key:'db',title:'workspace',icon:<ResourceIcon kind="database"/>,children:[{key:'table',title:'projects',icon:<ResourceIcon kind="table"/>}]}]}/>);
 expect(screen.queryByText('projects')).toBeNull();
 fireEvent.click(container.querySelector('.ant-tree-switcher')!);
 fireEvent.click(screen.getByText('projects'));
 expect(onSelect.mock.calls[0][0]).toEqual(['table']);
 expect(container.querySelector('.bui-resource-icon')?.getAttribute('aria-hidden')).toBe('true');
 fireEvent.click(container.querySelector('.ant-tree-switcher')!);
 expect(container.querySelector('.ant-tree-switcher_close')).not.toBeNull();
});

it('retains a deeply nested long-name selection after collapse and expansion',async()=>{
 const title='project_documentation_version_history_项目文档历史记录与归档';
 let node:any={key:'leaf',title,icon:<ResourceIcon kind="table"/>};
 for(let depth=5;depth>=1;depth--) node={key:`level-${depth}`,title:`Level ${depth}`,children:[node]};
 const {container}=render(<ResourceTree treeData={[node]} defaultExpandedKeys={['level-1','level-2','level-3','level-4','level-5']} defaultSelectedKeys={['leaf']}/>);
 expect(container.querySelector('.ant-tree-node-selected')?.textContent).toBe(title);
 fireEvent.click(container.querySelector('.ant-tree-switcher')!);
 await waitFor(()=>expect(container.querySelector('.ant-tree-node-selected')).toBeNull());
 fireEvent.click(container.querySelector('.ant-tree-switcher')!);
 await waitFor(()=>expect(container.querySelector('.ant-tree-node-selected')?.textContent).toBe(title));
});

it('supports keyboard expansion, selection and full-name tooltips',async()=>{
 const selected=vi.fn();
 const {container}=render(<ResourceTree onSelect={selected} treeData={[{key:'root',title:'Long project directory',children:[{key:'leaf',title:'Long project document name'}]}]}/>);
 const input=screen.getByRole('textbox',{name:'for screen reader'});
 fireEvent.focus(input);
 fireEvent.keyDown(input,{key:'ArrowDown',keyCode:40});
 fireEvent.keyDown(input,{key:'ArrowRight',keyCode:39});
 await waitFor(()=>expect(screen.getByText('Long project document name')).toBeTruthy());
 fireEvent.keyDown(input,{key:'ArrowRight',keyCode:39});
 fireEvent.keyDown(input,{key:'Enter',keyCode:13});
 expect(selected.mock.calls.at(-1)?.[0]).toEqual(['leaf']);
 expect((await screen.findByRole('tooltip')).textContent).toBe('Long project document name');
 fireEvent.keyDown(input,{key:'Escape',keyCode:27});
 fireEvent.keyDown(input,{key:'ArrowLeft',keyCode:37});
 fireEvent.keyDown(input,{key:'ArrowLeft',keyCode:37});
 await waitFor(()=>expect(container.querySelector('.ant-tree-switcher_close')).toBeTruthy());
});

it('shows the same full name on hover and button keyboard focus',async()=>{
 render(<button><ResourceName text="Full project name"/></button>);
 fireEvent.mouseEnter(screen.getByLabelText('Full project name'));
 expect((await screen.findByRole('tooltip')).textContent).toBe('Full project name');
 fireEvent.mouseLeave(screen.getByLabelText('Full project name'));
 fireEvent.focus(screen.getByRole('button'));
 expect((await screen.findByRole('tooltip')).textContent).toBe('Full project name');
 fireEvent.blur(screen.getByRole('button'));
});


it('reveals the retained selection when filtered nodes return',async()=>{
 const ref=createRef<ResourceTreeRef>();
 const selected={key:'last',title:'Last selected layer'};
 const view=render(<ResourceTree ref={ref} height={150} selectedKeys={['last']} treeData={[selected]}/>);
 const scroll=vi.spyOn(ref.current!,'scrollTo');
 view.rerender(<ResourceTree ref={ref} height={150} selectedKeys={['last']} treeData={[...Array.from({length:30},(_,i)=>({key:i,title:`Layer ${i}`})),selected]}/>);
 await waitFor(()=>expect(scroll).toHaveBeenCalledWith({key:'last'}));

});
