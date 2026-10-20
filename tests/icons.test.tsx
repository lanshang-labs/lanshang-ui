import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {Modal,Drawer} from 'antd';
import {LanshangProvider} from '../src/Provider';
import {Dialog,DrawerPanel} from '../src/ComplexControls';
import {CloudOutlined,FileTextOutlined,ConnectorOutlined,DesignOutlined,CloseOutlined} from '../src/icons';
afterEach(cleanup);
it('uses distinct vectors with consistent sizing and stroke',()=>{
 const {container}=render(<>{[CloudOutlined,FileTextOutlined,ConnectorOutlined,DesignOutlined,CloseOutlined].map((Icon,i)=><Icon key={i}/>)}</>);
 const icons=Array.from(container.querySelectorAll('svg'));
 expect(new Set(icons.map(e=>e.innerHTML)).size).toBe(5);
 icons.forEach(e=>{expect(e.getAttribute('width')).toBe('1em');expect(e.getAttribute('height')).toBe('1em');expect(e.getAttribute('stroke-width')).toBe('1.8');});
});
for(const kind of ['modal','drawer'] as const)it(`${kind} preserves close action and explicit icon overrides`,()=>{
 const close=vi.fn();
 const view=render(<LanshangProvider>{kind==='modal'?<Modal open title="Dialog" onCancel={close} footer={null}>Content</Modal>:<Drawer open title="Dialog" onClose={close}>Content</Drawer>}</LanshangProvider>);
 const button=screen.getByRole('button',{name:'Close'});
 expect(button.querySelector('.ls-motion-icon[data-effect="close"]')).toBeTruthy();
 fireEvent.click(button);expect(close).toHaveBeenCalledTimes(1);
 view.rerender(<LanshangProvider>{kind==='modal'?<Modal open closeIcon={<span>Custom close</span>} footer={null}/>:<Drawer open closeIcon={<span>Custom close</span>}/>}</LanshangProvider>);
 expect(screen.getByText('Custom close')).toBeTruthy();
});
for(const kind of ['modal','drawer'] as const)it(`${kind} gives the shared close action a customizable accessible name`,async()=>{
 const close=vi.fn(),label='关闭项目详情';
 render(<LanshangProvider>{kind==='modal'?<Dialog open title="项目详情" footer={null} closeAriaLabel={label} onCancel={close}/>:<DrawerPanel open title="项目详情" closeAriaLabel={label} onClose={close}/>}</LanshangProvider>);
 const button=await screen.findByRole('button',{name:label});
 expect(button.querySelector('.ls-motion-icon[data-effect="close"]')).toBeTruthy();
 fireEvent.click(button);
 expect(close).toHaveBeenCalledOnce();
});
