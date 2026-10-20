import {Select} from '../dist/index.js';
import {SourceCodeBlock} from '../dist/index.js';
import {LazyTreeTablePreview} from './lazy-tree-table-preview';
import lazySource from './lazy-tree-table-preview.tsx?raw';
import {CrossSpanTablePreview} from './cross-span-table-preview';
import spanSource from './cross-span-table-preview.tsx?raw';
import {TableCompatibilityPreview} from './table-compatibility-preview';
import compatibilitySource from './table-compatibility-preview.tsx?raw';
import {SummaryTablePreview} from './summary-table-preview';
import summarySource from './summary-table-preview.tsx?raw';
import {MergedTablePreview} from './merged-table-preview';
import mergedSource from './merged-table-preview.tsx?raw';
import {GroupedTablePreview} from './grouped-table-preview';
import groupedSource from './grouped-table-preview.tsx?raw';
import {TreeTablePreview} from './tree-table-preview';
import treeSource from './tree-table-preview.tsx?raw';
import {useState} from 'react';
import {TabStrip as Tabs} from '../dist/index.js';
import {SelectionTablePreview} from './selection-table-preview';
import {FixedTablePreview} from './fixed-table-preview';
import {VirtualTablePreview} from './virtual-table-preview';
import {RemoteTablePreview} from './remote-table-preview';
import {EditableTablePreview} from './editable-table-preview';
import selectionSource from './selection-table-preview.tsx?raw';
import fixedSource from './fixed-table-preview.tsx?raw';
import virtualSource from './virtual-table-preview.tsx?raw';
import remoteSource from './remote-table-preview.tsx?raw';
import editableSource from './editable-table-preview.tsx?raw';
const examples=[
 {key:'selection',label:'分页与选择',Component:SelectionTablePreview,source:selectionSource},
 {key:'fixed',label:'固定与滚动',Component:FixedTablePreview,source:fixedSource},
 {key:'virtual',label:'虚拟滚动',Component:VirtualTablePreview,source:virtualSource},
 {key:'remote',label:'异步分页',Component:RemoteTablePreview,source:remoteSource},
 {key:'editable',label:'行编辑',Component:EditableTablePreview,source:editableSource},
 {key:'tree',label:'树形数据',Component:TreeTablePreview,source:treeSource},
 {key:'grouped',label:'分组表头',Component:GroupedTablePreview,source:groupedSource},
 {key:'merged',label:'合并单元格',Component:MergedTablePreview,source:mergedSource},
 {key:'summary',label:'汇总行',Component:SummaryTablePreview,source:summarySource},
 {key:'compatibility',label:'组合兼容',Component:TableCompatibilityPreview,source:compatibilitySource},
 {key:'lazy',label:'树形懒加载',Component:LazyTreeTablePreview,source:lazySource},
 {key:'span',label:'跨屏合并',Component:CrossSpanTablePreview,source:spanSource},
];
export function TablePreview(){const [active,setActive]=useState("selection");return <div className="docs-table-examples"><label className="docs-table-picker"><span>选择表格示例</span><Select aria-label="选择表格示例" value={active} onChange={setActive} options={examples.map(({key,label})=>({value:key,label}))}/></label><Tabs activeKey={active} onChange={setActive} items={examples.map(({key,label,Component,source})=>({key,label,children:<><Component/><div className="docs-demo-gap"><SourceCodeBlock filename={`${key}-example.tsx`} code={source.split('../dist/index.js').join('@lanshang-labs/ui')} /></div></>}))}/></div>}
