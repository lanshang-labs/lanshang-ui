import {cleanup,render} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {theme} from 'antd';
import {LanshangProvider} from '../src/Provider';
import {foundations} from '../src/tokens';
import {designTheme} from '../src/theme';
afterEach(cleanup);
function Probe(){const {token}=theme.useToken();return <span data-testid="font" style={{fontFamily:token.fontFamily}}>字体 Font</span>}
it('uses bundled defaults and updates custom font consistently across theme changes',()=>{
 const {rerender,getByTestId}=render(<LanshangProvider storageKey="font-test"><Probe/></LanshangProvider>);
 expect(getByTestId('font').style.fontFamily).toContain('Noto Sans SC Variable');
 expect(document.documentElement.style.getPropertyValue('--ds-font')).toBe(foundations.font);
 rerender(<LanshangProvider storageKey="font-test" fontFamily="BusinessFont, serif"><Probe/></LanshangProvider>);
 expect(getByTestId('font').style.fontFamily).toBe('BusinessFont, serif');
 expect(document.documentElement.style.getPropertyValue('--ds-font')).toBe('BusinessFont, serif');
 expect(designTheme('dark','BusinessFont, serif').token?.fontFamily).toBe('BusinessFont, serif');
 rerender(<LanshangProvider storageKey="font-test"><Probe/></LanshangProvider>);
 expect(document.documentElement.style.getPropertyValue('--ds-font')).toBe(foundations.font);
});
