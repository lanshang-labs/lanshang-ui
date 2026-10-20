/** Stay inside the active dialog while escaping its scrolling body. */
export function overlayPopupContainer(trigger:HTMLElement,fallback:HTMLElement):HTMLElement{
 return trigger.closest<HTMLElement>('.ant-modal-content,.ant-drawer-content')??fallback;
}
