import {expect,it} from 'vitest';
import {matchesSearch,pages} from '../website/catalog';

it('finds exported component names within their existing design pages',()=>{
 const results=(query:string)=>pages.filter(page=>matchesSearch(page,query)).map(page=>page.id);
 expect(results('Dialog')).toContain('patterns/overlay-recovery');
 expect(results('tabstrip')).toContain('patterns/navigation-states');
 expect(results('InputGroup')).toContain('components/control-group');
 expect(results('布局与间距')).toContain('patterns/layout');
});
