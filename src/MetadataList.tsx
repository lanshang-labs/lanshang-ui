import {forwardRef, type HTMLAttributes, type ReactNode} from "react";
export type MetadataItem = {key: string; label: ReactNode; value: ReactNode};
export type MetadataListProps = Omit<HTMLAttributes<HTMLDListElement>, "children"> & {items: MetadataItem[]};
/** Values remain caller-owned; zero, empty strings and rich content are preserved. */
export const MetadataList = forwardRef<HTMLDListElement, MetadataListProps>(function MetadataList({items, className="", ...props}, ref) {
  return <dl {...props} ref={ref} className={`bui-metadata-list ${className}`}>{items.map(item => <div className="bui-metadata-row" key={item.key}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
});
