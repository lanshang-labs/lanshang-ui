import {expect,it} from 'vitest';
import {pages} from '../website/catalog';
import {navigationGroups,navigationGroupFor,orderedDocPages} from '../website/navigation';

it('places every page once in the same order used by navigation and paging',()=>{
 const ordered=orderedDocPages(pages);
 const configured=navigationGroups.flatMap(group=>group.order);
 expect(new Set(configured).size).toBe(configured.length);
 expect(configured).toHaveLength(pages.length);
 expect(ordered.map(page=>page.id)).toEqual(configured);
 expect(ordered.every(page=>navigationGroupFor(page))).toBe(true);
 expect(ordered[0].id).toBe('guide/introduction');
 expect(ordered.findIndex(page=>page.id==='components/control-group')).toBeGreaterThan(ordered.findIndex(page=>page.id==='components/input'));
});
