import {expect,it} from 'vitest';
import {overlayPopupContainer} from '../website/overlay-popup-container';
it('escapes the scrolling body but never leaves the nearest dialog',()=>{
 for(const name of ['ant-modal-content','ant-drawer-content']){
 const root=document.createElement('div');root.className=name;
 const body=document.createElement('div'),trigger=document.createElement('button');body.append(trigger);root.append(body);
 expect(overlayPopupContainer(trigger,body)).toBe(root);
 }
 const fallback=document.createElement('div');expect(overlayPopupContainer(document.createElement('button'),fallback)).toBe(fallback);
});
