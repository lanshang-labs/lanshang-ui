import {it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {KeyboardKey} from '../src/KeyboardKey';
it('uses semantic non-focusable keyboard hints with caller accessible names',()=>{
 const view=render(<KeyboardKey aria-label="Command 加 K">⌘ K</KeyboardKey>);
 expect(screen.getByLabelText('Command 加 K').tagName).toBe('KBD');
 expect(view.container.querySelector('kbd')?.hasAttribute('tabindex')).toBe(false);
});
