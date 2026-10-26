import {ConfigProvider,Drawer as AntDrawer,Dropdown as AntDropdown,Form as AntForm,Modal as AntModal,Popconfirm as AntPopconfirm,Space as AntSpace,Tabs as AntTabs,Tooltip as AntTooltip,type DrawerProps,type DropDownProps,type FormProps,type ModalProps,type PopconfirmProps,type SpaceProps,type TabsProps,type TooltipProps} from 'antd';
import {MoreHoriz,WarningCircle} from 'iconoir-react';
import {useId,useLayoutEffect} from 'react';
import {controlSizes} from './tokens.js';

/** Shared entry for complex upstream interactions; LanshangProvider owns their visual tokens. */
/** AntD hardcodes "Close" on portal buttons, so name only this instance after it mounts. */
function useCloseLabel(open:boolean|undefined,label:string,selector:string){
 const scope=`ls-close-${useId().replace(/[^a-zA-Z0-9_-]/g,'')}`;
 useLayoutEffect(()=>{
  if(!open)return;
  const update=()=>{
   const button=document.querySelector(`.${scope} ${selector}`);
   if(!button)return false;
   button.setAttribute('aria-label',label);
   button.setAttribute('title',label);
   return true;
  };
  if(update())return;
  const observer=new MutationObserver(()=>{if(update())observer.disconnect()});
  observer.observe(document.body,{childList:true,subtree:true});
  return ()=>observer.disconnect();
 },[open,label,scope,selector]);
 return scope;
}
export interface DialogProps extends ModalProps {closeAriaLabel?:string}
export function Dialog({className='',closeAriaLabel='关闭模态框',...props}:DialogProps){const scope=useCloseLabel((props.open??props.visible)&&props.closable!==false,closeAriaLabel,'.ant-modal-close');return <AntModal {...props} className={`ls-dialog ${scope} ${className}`.trim()}/>}
export interface DrawerPanelProps extends DrawerProps {closeAriaLabel?:string}
export function DrawerPanel({className='',closeAriaLabel='关闭抽屉',...props}:DrawerPanelProps){const scope=useCloseLabel((props.open??props.visible)&&props.closable!==false,closeAriaLabel,'.ant-drawer-close');return <AntDrawer {...props} className={`ls-drawer-panel ${scope} ${className}`.trim()}/>}
export interface ConfirmPopoverProps extends PopconfirmProps {
 /** The description provides its own actions; hide Ant Design's built-in button row. */
 hideDefaultActions?:boolean;
}
export function ConfirmPopover({hideDefaultActions=false,overlayClassName='',icon,...props}:ConfirmPopoverProps){return <AntPopconfirm {...props} icon={icon===undefined?<span className="ls-confirm-icon" aria-hidden="true"><WarningCircle width={18} height={18} strokeWidth={1.8}/></span>:icon} overlayClassName={`ls-confirm-popover${hideDefaultActions?' ls-confirm-popover--custom-actions':''} ${overlayClassName}`.trim()}/>}
export function MenuDropdown({overlayClassName='',...props}:DropDownProps){return <AntDropdown {...props} overlayClassName={`ls-menu-dropdown ${overlayClassName}`.trim()}/>}
export function HintTooltip({overlayClassName='',...props}:TooltipProps){return <AntTooltip {...props} overlayClassName={`ls-hint-tooltip ${overlayClassName}`.trim()}/>}
export function TabStrip({className='',size,moreIcon,...props}:TabsProps){const {componentSize}=ConfigProvider.useConfig();const resolvedSize=size??componentSize??'middle';return <AntTabs {...props} moreIcon={moreIcon===undefined?<span aria-hidden="true" className="ls-control-icon"><MoreHoriz width={controlSizes[resolvedSize].icon} height={controlSizes[resolvedSize].icon} strokeWidth={1.8}/></span>:moreIcon} size={resolvedSize} className={`ls-tab-strip ${className}`.trim()}/>}
export function LayoutSpace({className='',size=8,...props}:SpaceProps){return <AntSpace {...props} size={size} className={`ls-layout-space ${className}`.trim()}/>}

function FormControl<Values=any>({className='',...props}:FormProps<Values>){const BoundForm=AntForm as <T>(props:FormProps<T>)=>React.ReactElement;return <BoundForm<Values> {...props} className={`ls-form ${className}`.trim()}/>}
/** Keep Form.Item and useForm binding without asking demos to import an upstream control. */
export const Form=Object.assign(FormControl,{Item:AntForm.Item,List:AntForm.List,ErrorList:AntForm.ErrorList,Provider:AntForm.Provider,useForm:AntForm.useForm,useWatch:AntForm.useWatch,useFormInstance:AntForm.useFormInstance});
