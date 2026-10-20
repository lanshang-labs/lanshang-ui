import {cloneElement,isValidElement,forwardRef,useState,useRef,type RefAttributes,type ReactElement} from 'react';
import {ConfigProvider,Select as AntSelect,Pagination as AntPagination,type PaginationProps,type SelectProps,type RefSelectProps,type TableProps} from 'antd';
import {FastArrowLeft,FastArrowRight} from 'iconoir-react';
import type {BaseOptionType,DefaultOptionType} from 'antd/es/select';
import {ChevronLeftOutlined,ChevronRightOutlined,ChevronDownOutlined,CheckOutlined} from './icons.js';
import {MotionIcon} from './MotionIcon.js';
import {withClearControlIcon} from './ClearControlIcon.js';
import {controlSizes} from './tokens.js';
const decorative=(icon:React.ReactNode)=><span aria-hidden="true" className="ls-control-icon">{icon}</span>;
/** Keep AntD's loading indicator and explicit consumer overrides. */
export const Select=Object.assign(forwardRef<RefSelectProps,SelectProps>(function Select(props,ref){
 const [keyboard,setKeyboard]=useState(false);
 const pointerFocus=useRef(false);
 const {componentSize}=ConfigProvider.useConfig();
 const size=props.size??componentSize??'middle';
 return <AntSelect suffixIcon={props.loading?undefined:<span aria-hidden="true" className="ls-control-icon ls-select-chevron"><ChevronDownOutlined/></span>} menuItemSelectedIcon={decorative(<CheckOutlined/>)} removeIcon={decorative(<MotionIcon name="close" size={controlSizes[size].icon}/>)} {...props} listItemHeight={props.listItemHeight??controlSizes[size].optionHeight} className={`ls-select ${props.className??''}`} popupClassName={`${props.popupClassName??''} ls-select-popup-${size} ${keyboard?'ls-select-popup-keyboard':''}`} data-ls-keyboard={keyboard||undefined} onMouseDown={event=>{pointerFocus.current=true;setKeyboard(false);props.onMouseDown?.(event);}} onFocus={event=>{setKeyboard(!pointerFocus.current);props.onFocus?.(event);}} onKeyDown={event=>{setKeyboard(true);props.onKeyDown?.(event);}} onBlur={event=>{pointerFocus.current=false;setKeyboard(false);props.onBlur?.(event);}} allowClear={withClearControlIcon(props.allowClear,size,'清空选择')} ref={ref}/>;
}),{Option:AntSelect.Option,OptGroup:AntSelect.OptGroup}) as (<ValueType=any,OptionType extends BaseOptionType|DefaultOptionType=DefaultOptionType>(props:SelectProps<ValueType,OptionType>&RefAttributes<RefSelectProps>)=>ReactElement)&Pick<typeof AntSelect,'Option'|'OptGroup'>;
export const paginationItemRender:NonNullable<PaginationProps['itemRender']> = (_page,type,element)=>{
 if((type==='prev'||type==='next')&&isValidElement<{children?:React.ReactNode;'aria-label'?:string}>(element))return cloneElement(element,{'aria-label':element.props['aria-label']??(type==='prev'?'上一页':'下一页')},decorative(type==='prev'?<ChevronLeftOutlined/>:<ChevronRightOutlined/>));
 if((type==='jump-prev'||type==='jump-next')&&isValidElement<{children?:React.ReactNode;'aria-label'?:string}>(element))return cloneElement(element,{'aria-label':element.props['aria-label']??(type==='jump-prev'?'向前跳页':'向后跳页')},decorative(type==='jump-prev'?<FastArrowLeft width={14} height={14} strokeWidth={1.8}/>:<FastArrowRight width={14} height={14} strokeWidth={1.8}/>));
 return element;
};
export function paginationSizeChanger(show:PaginationProps['showSizeChanger']):PaginationProps['showSizeChanger']{
 if(show===true)return {suffixIcon:decorative(<ChevronDownOutlined/>)};
 if(show&&typeof show==='object')return {suffixIcon:decorative(<ChevronDownOutlined/>),...show};
 return show;
}
export function Pagination(props:PaginationProps){return <AntPagination itemRender={paginationItemRender} {...props} showSizeChanger={paginationSizeChanger(props.showSizeChanger)}/>;}
export function tableExpandIcon<T extends object = object>(labels:{expand?:string;collapse?:string}={}):NonNullable<NonNullable<TableProps<T>['expandable']>['expandIcon']>{
 return ({expanded,expandable,onExpand,record})=>expandable?<button type="button" className="ls-table-expand" aria-label={expanded?(labels.collapse??'收起行'):(labels.expand??'展开行')} aria-expanded={expanded} onClick={event=>{onExpand(record,event);event.stopPropagation()}}>{decorative(<ChevronRightOutlined/>)}</button>:<span className="ls-table-expand-spacer" aria-hidden="true"/>;
}
