/** One information architecture for the sidebar, breadcrumbs and page order. */
export const navigationGroups = [
 {key:'guide',label:'开始使用',pageGroups:['开始使用'],order:['guide/introduction','guide/installation','guide/theme','guide/registry','guide/architecture']},
 {key:'patterns',label:'设计规范',pageGroups:['模式与规范'],order:['patterns/motion','patterns/layout','guide/usage','patterns/navigation-states','patterns/states','patterns/style-study','patterns/typography','patterns/icon-motion','patterns/boundaries','patterns/save-feedback','patterns/overlay-recovery','patterns/custom-toolbar','patterns/notification-overlays','guide/compatibility','guide/releases']},
 {key:'inputs',label:'输入与操作',pageGroups:['输入与操作'],order:['components/button','components/input','components/control-group','components/select','components/search-field','components/checkbox','components/radio','components/switch','components/input-number','components/slider','components/date-picker','components/range-picker','components/upload','components/form','components/actions','components/navigation-link']},
 {key:'display',label:'布局与展示',pageGroups:['布局与展示'],order:['components/workspace-layout','components/navigation','components/resource-tree','components/splitter','components/infinite-canvas','components/image-card','components/image-deck','components/markdown','components/data-table','components/analytics','components/page-header','components/metadata','components/status-tag','components/task-rows','components/code-block']},
 {key:'feedback',label:'反馈与状态',pageGroups:['反馈','加载与反馈'],order:['components/alert','components/content-state','components/loading-container','components/skeleton','components/progress','components/loading-label','components/notification','components/feedback-panel']},
 {key:'blocks',label:'组合区块',pageGroups:['组合区块'],order:['blocks/list','blocks/edit','blocks/detail','blocks/sidebar','blocks/task-progress','blocks/task-queue','blocks/remote-task-queue','blocks/task-recovery']},
] as const;

type NavigablePage={id:string;group:string};
export function navigationGroupFor(page:NavigablePage){return navigationGroups.find(group=>(group.pageGroups as readonly string[]).includes(page.group));}
export function orderedDocPages<T extends NavigablePage>(pages:readonly T[]):T[]{
 const ranks=new Map<string,number>(navigationGroups.flatMap((group,groupIndex)=>group.order.map((id,index)=>[id,groupIndex*100+index] as const)));
 return [...pages].sort((a,b)=>(ranks.get(a.id)??Infinity)-(ranks.get(b.id)??Infinity));
}
