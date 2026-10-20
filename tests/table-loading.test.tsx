import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {DataTable} from '../src/DataTable';
afterEach(cleanup);
it('uses the shared pending indicator and preserves Spin overrides',()=>{
 const {rerender}=render(<DataTable loading dataSource={[]} columns={[]} pagination={false}/>);
 expect(screen.getByText('正在加载')).toBeTruthy();
 rerender(<DataTable loading={{indicator:<span>读取订单</span>}} dataSource={[]} columns={[]} pagination={false}/>);
 expect(screen.queryByText('正在加载')).toBeNull();expect(screen.getByText('读取订单')).toBeTruthy();
 rerender(<DataTable loading={false} dataSource={[]} columns={[]} pagination={false}/>);
 expect(document.querySelector('.ant-spin-spinning')).toBeNull();
});
