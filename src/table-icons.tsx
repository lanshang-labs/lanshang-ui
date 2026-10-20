import type {TableProps} from 'antd';
import {Filter,NavArrowDown,NavArrowUp} from 'iconoir-react';

type Columns<T extends object>=NonNullable<TableProps<T>['columns']>;

/** Supply Lanshang defaults only where the consumer has not supplied an icon. */
export function withTableColumnIcons<T extends object>(columns:TableProps<T>['columns'],tableDirections:TableProps<T>['sortDirections']):TableProps<T>['columns']{
 if(!columns)return columns;
 return columns.map(column=>{
  if('children' in column)return {...column,children:withTableColumnIcons(column.children,tableDirections) as Columns<T>};
  const directions=column.sortDirections??tableDirections??['ascend','descend'];
  return {...column,
   ...(column.sorter&&column.sortIcon===undefined?{sortIcon:({sortOrder}:{sortOrder:'ascend'|'descend'|null})=><span aria-hidden="true" className="ls-table-sort-icon" data-order={sortOrder??undefined}>{directions.includes('ascend')&&<NavArrowUp/>}{directions.includes('descend')&&<NavArrowDown/>}</span>}:{}),
   ...((column.filters||column.filterDropdown)&&column.filterIcon===undefined?{filterIcon:<span className="ls-table-filter-icon"><Filter aria-hidden="true"/><span className="ls-table-filter-label">筛选{typeof column.title==='string'||typeof column.title==='number'?column.title:''}</span></span>}:{}),
  };
 });
}
