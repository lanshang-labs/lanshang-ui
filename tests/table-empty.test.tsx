import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {DataTable} from '../src/DataTable';
afterEach(cleanup);
it('uses the shared empty state and preserves consumer overrides',()=>{
 const {rerender}=render(<DataTable dataSource={[]} columns={[]} pagination={false}/>);
 expect(screen.getByRole('status').textContent).toContain('暂无数据');
 rerender(<DataTable dataSource={[]} columns={[]} pagination={false} locale={{emptyText:'没有匹配的订单'}}/>);
 expect(screen.queryByText('暂无数据')).toBeNull();expect(screen.getByText('没有匹配的订单')).toBeTruthy();
});
