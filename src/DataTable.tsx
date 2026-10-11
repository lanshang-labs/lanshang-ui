import {Table, ConfigProvider, Tooltip, type TableProps} from "antd";
import {foundations} from "./tokens.js";
/** Presentation-only adapter: sorting, paging, selection and requests remain owned by callers. */
export function DataTable<T extends object>({density="compact",className="",...props}:TableProps<T>&{density?:"compact"|"comfortable"}) {
 return <ConfigProvider theme={{components:{Table:{cellPaddingBlockSM:density==="compact"?foundations.table.compactPadding:foundations.table.comfortablePadding}}}}>
  <Table<T> size="small" {...props} className={`ds-data-table ${className}`}/>
 </ConfigProvider>;
}
export function ColumnLabel({name,type}:{name:string;type?:string}) {
 return <Tooltip trigger={["hover","focus"]} title={type?`${name} · ${type}`:name}><span className="ds-column-label" tabIndex={0}>{name}</span></Tooltip>;
}
