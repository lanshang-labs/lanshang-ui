import {Table, ConfigProvider, type TableProps} from "antd";
import {paginationItemRender,paginationSizeChanger,tableExpandIcon} from "./control-icons.js";
import LoadingLabel from "./beautiful-ui/LoadingLabel.js";
import {ContentState} from "./ContentState.js";
import {foundations} from "./tokens.js";
import {HintTooltip} from "./ComplexControls.js";
import {withTableColumnIcons} from "./table-icons.js";
import {cloneElement,isValidElement} from 'react';
/** Presentation-only adapter: sorting, paging, selection and requests remain owned by callers. */
export function DataTable<T extends object>({density="compact",className="",locale,loading,pagination,expandable,size,columns,rowSelection,...props}:TableProps<T>&{density?:"compact"|"comfortable"}) {
 const {componentSize}=ConfigProvider.useConfig();
 const resolvedSize=size??componentSize??"middle";
 const cellPaddingBlock=density==="compact"?foundations.table.compactPadding:foundations.table.comfortablePadding;
 const hasExpansion = !!expandable?.expandedRowRender || props.dataSource?.some(row => !!(row as Record<string, unknown>)[expandable?.childrenColumnName ?? 'children']);
 const renderExpanded = expandable?.expandedRowRender;
 const resolvedExpandable = hasExpansion ? {
  expandIcon:tableExpandIcon<T>(locale),...expandable,
  ...(renderExpanded ? {expandedRowRender: (...args: Parameters<NonNullable<typeof renderExpanded>>) => <div className="ds-table-expanded-content">{renderExpanded(...args)}</div>} : {}),
 } : expandable;
 const resolvedLoading = loading ? {indicator:<span className="ds-table-loading"><LoadingLabel label="正在加载"/></span>,...(typeof loading==="object"?loading:{spinning:true})} : loading;
 const selectionLabel=typeof locale?.selectAll==='string'?locale.selectAll:'选择全部';
 const resolvedRowSelection=rowSelection&&rowSelection.columnTitle===undefined?{
  ...rowSelection,
  columnTitle:(checkboxNode:React.ReactNode)=>isValidElement(checkboxNode)?cloneElement(checkboxNode as React.ReactElement<{ 'aria-label'?:string}>,{'aria-label':selectionLabel}):checkboxNode,
 }:rowSelection;
 // AntD renders middle table pagination as small; keep pager controls at the standard size.
 const resolvedPagination=pagination===false?false:{itemRender:paginationItemRender,...pagination,size:pagination?.size??'default',showSizeChanger:paginationSizeChanger(pagination?.showSizeChanger)};
 return <ConfigProvider theme={{components:{Table:{cellPaddingBlockSM:cellPaddingBlock,cellPaddingBlockMD:cellPaddingBlock,cellPaddingBlock:cellPaddingBlock}}}}>
  <Table<T> size={resolvedSize} {...props} rowSelection={resolvedRowSelection} columns={withTableColumnIcons(columns,props.sortDirections)} expandable={resolvedExpandable} pagination={resolvedPagination} loading={resolvedLoading} locale={{emptyText:<ContentState title="暂无数据" description="数据准备好后，会显示在这里。"/>,...locale}} className={`ds-data-table ${className}`}/>
 </ConfigProvider>;
}
export function ColumnLabel({name,type}:{name:string;type?:string}) {
 return <HintTooltip trigger={["hover","focus"]} title={type?`${name} · ${type}`:name}><span className="ds-column-label" tabIndex={0}>{name}</span></HintTooltip>;
}
