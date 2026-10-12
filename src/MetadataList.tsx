import type {ReactNode} from "react";
export type MetadataItem={key:string;label:ReactNode;value:ReactNode};
export function MetadataList({items}:{items:MetadataItem[]}){return <dl className="bui-metadata-list">{items.map(item=><div className="bui-metadata-row" key={item.key}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
