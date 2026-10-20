import {useId,type CSSProperties} from 'react';
import {motion} from './motion.js';
import {Search,Refresh,NavArrowDown,Plus,Xmark,Copy,Upload,Download,Trash,EditPencil,Bell,SunLight,ArrowLeft,ArrowRight,ArrowUpRight,Expand,Collapse,SidebarExpand,SidebarCollapse,Folder,Eye,EyeClosed,Lock,Filter,SortUp,SortDown,Play,Pause,Square,Database,Cloud,Page,Settings,WrapText} from 'iconoir-react';
export const motionIcons=[
 {id:'search',name:'搜索',Icon:Search,effect:'scan',duration:motion.duration.search,use:'提交搜索时短距离探查'},
 {id:'refresh',name:'刷新',Icon:Refresh,effect:'spin',duration:motion.duration.refresh,use:'点击时旋转一周，不代表请求完成'},
 {id:'expand',name:'展开／收起',Icon:NavArrowDown,effect:'turn',duration:motion.duration.chevron,use:'箭头跟随展开状态，重复点击恢复'},
 {id:'add',name:'添加',Icon:Plus,effect:'pop',duration:motion.duration.selection,use:'轻微放大后恢复'},
 {id:'close',name:'关闭',Icon:Xmark,effect:'close',duration:motion.duration.search,use:'叉号旋转收拢后恢复，保持关闭语义'},
 {id:'copy',name:'复制',Icon:Copy,effect:'shift',duration:motion.duration.selection,use:'短距离位移，成功反馈由真实结果决定'},
 {id:'wrap',name:'换行',Icon:WrapText,effect:'wrap',duration:motion.duration.search,use:'折返箭头按当前换行状态轻移一次'},
 {id:'save',name:'保存',Icon:SaveMotion,effect:'save',duration:motion.duration.selection,use:'自绘对号在提交时过渡到单段圆弧；结果仍由调用方决定'},
 {id:'upload',name:'上传',Icon:Upload,effect:'up',duration:motion.duration.search,use:'向上移动后回到原位'},
 {id:'download',name:'下载',Icon:Download,effect:'down',duration:motion.duration.search,use:'向下移动后回到原位'},
 {id:'delete',name:'删除',Icon:Trash,effect:'lid',duration:motion.duration.refresh,use:'桶身保持稳定，盖子抬起后合上'},
 {id:'edit',name:'编辑',Icon:EditPencil,effect:'shift',duration:motion.duration.selection,use:'短距离书写提示'},
 {id:'notice',name:'通知',Icon:Bell,effect:'ring',duration:motion.duration.search,use:'小幅摆动一次，不循环打扰'},
 {id:'theme',name:'太阳／月亮',Icon:SunLight,effect:'theme',duration:motion.duration.search,use:'点击在太阳与月亮之间双向切换'},
 {id:'back',name:'返回',Icon:ArrowLeft,effect:'left',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'forward',name:'前进',Icon:ArrowRight,effect:'right',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'external',name:'外链',Icon:ArrowUpRight,effect:'shift',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'fullscreen',name:'全屏／退出',Icon:Expand,AltIcon:Collapse,effect:'pair',duration:motion.duration.search,use:'点击双向切换'},
 {id:'sidebar',name:'侧栏展开／收起',Icon:SidebarExpand,AltIcon:SidebarCollapse,effect:'pair',duration:motion.duration.search,use:'点击双向切换'},
 {id:'folder',name:'文件夹开／关',Icon:Folder,effect:'folder',duration:motion.duration.search,use:'点击双向切换'},
 {id:'visibility',name:'查看／隐藏',Icon:Eye,AltIcon:EyeClosed,effect:'pair',duration:motion.duration.search,use:'点击双向切换'},
 {id:'lock',name:'锁定／解锁',Icon:Lock,effect:'lock',duration:motion.duration.search,use:'点击双向切换'},
 {id:'filter',name:'筛选',Icon:Filter,effect:'filter',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'sort',name:'升序／降序',Icon:SortUp,AltIcon:SortDown,effect:'pair',duration:motion.duration.search,use:'点击双向切换'},
 {id:'play',name:'播放／暂停',Icon:Play,AltIcon:Pause,effect:'pair',duration:motion.duration.search,use:'点击双向切换'},
 {id:'retry',name:'重试',Icon:Refresh,effect:'spin',duration:motion.duration.refresh,use:'点击播放一次反馈'},
 {id:'stop',name:'停止',Icon:Square,effect:'stop',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'database',name:'数据库',Icon:Database,effect:'breathe',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'cloud',name:'云存储',Icon:Cloud,effect:'float',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'document',name:'文档',Icon:Page,effect:'breathe',duration:motion.duration.search,use:'点击播放一次反馈'},
 {id:'settings',name:'设置',Icon:Settings,effect:'gear',duration:motion.duration.search,use:'点击播放一次反馈'},
] as const;

export type MotionIconName=typeof motionIcons[number]['id'];
export interface MotionIconProps {name:MotionIconName; active?:boolean; replay?:number; size?:number; pending?:boolean}
/** Decorative only: accessible names, state and request lifecycles belong to the control. */
export function MotionIcon({name,active=false,replay=0,size=16,pending=false}:MotionIconProps){
 const item=motionIcons.find(item=>item.id===name)!;
 const {Icon}=item;const AltIcon='AltIcon' in item?item.AltIcon:null;
 const toggle=['theme','turn','pair','folder','lock'].includes(item.effect);
 return <span key={toggle?name:replay} aria-hidden="true" className={`ls-motion-icon ${replay?'is-playing':''}`} data-effect={item.effect} data-turned={active} data-pending={pending} style={{'--icon-duration':`${item.duration}ms`,width:size,height:size} as CSSProperties}>{name==='delete'?<TrashMotion/>:name==='theme'?<ThemeMotion/>:name==='folder'?<FolderMotion/>:name==='lock'?<LockMotion/>:name==='save'?<SaveMotion/>:name==='wrap'?<WrapMotion/>:AltIcon?<><Icon className="ls-icon-pair-first" width={24} height={24}/><AltIcon className="ls-icon-pair-second" width={24} height={24}/></>:<Icon width={24} height={24} strokeWidth={name==='settings'?2.4:undefined}/>}</span>;
}
function WrapMotion(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 17h5"/><g className="ls-icon-wrap-return"><path d="M4 12h13.5a2.5 2.5 0 010 5h-5"/><path d="m15 15.5-2.5 1.5 2.5 1.5"/></g></svg>}
function SaveMotion(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path className="ls-icon-save-check" d="M4.8 12.4l4.8 4.5L19.2 7.3" strokeWidth="2.5"/><path className="ls-icon-save-arc" d="M19.25 8.25A8 8 0 1 1 12 4" strokeWidth="2.25"/></svg>}
function TrashMotion(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l1.1 12a1 1 0 001 .9h7.8a1 1 0 001-.9L18 8M10 11v6M14 11v6"/><g className="ls-icon-trash-lid"><path d="M4 7h16M9 7V4.5A1.5 1.5 0 0110.5 3h3A1.5 1.5 0 0115 4.5V7"/></g></svg>}
function ThemeMotion(){const id=useId().replace(/:/g,'');return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><defs><mask id={`${id}-cut`}><rect width="24" height="24" fill="white" stroke="none"/><circle className="ls-icon-theme-cut" cx="24" cy="0" r="6" fill="black" stroke="black" strokeWidth="0"/></mask><clipPath id={`${id}-disc`}><circle cx="12" cy="12" r="6"/></clipPath></defs><g className="ls-icon-theme-rays"><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g><circle cx="12" cy="12" r="6" mask={`url(#${id}-cut)`}/><g clipPath={`url(#${id}-disc)`}><circle className="ls-icon-theme-cut" cx="24" cy="0" r="6"/></g></svg>}

function FolderMotion(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 19V5a1 1 0 011-1h5l2 3h9a1 1 0 011 1v11"/><path className="ls-icon-folder-front" d="M3 10h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1z"/></svg>}
function LockMotion(){return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M12 14v3"/><path className="ls-icon-lock-shackle" d="M8 10V7a4 4 0 018 0v3"/></svg>}
