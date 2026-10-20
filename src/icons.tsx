// Shared Iconoir entrypoint. Iconoir MIT; legacy export names avoid changing callers.
import type { ComponentType, SVGProps } from "react";
import {User,Lock,ArrowLeft,ArrowRight,NavArrowLeft,NavArrowRight,NavArrowDown,Cloud,Page,PlugTypeA,DesignPencil,Xmark,Check,CheckCircle,Clock,ClockRotateRight,CloudUpload,Code,Collapse,Copy,Database,Download,EditPencil,Expand,Eye,EyeClosed,Folder,Frame,Globe,Group,HalfMoon,Link,LogOut,MessageText,Minus,MoreVert,Network,Play,Plus,Position,Refresh,Search,Settings,ShieldCheck,SidebarCollapse,SidebarExpand,SunLight,Trash,Upload,ViewGrid,WarningCircle,ZoomIn,ZoomOut} from "iconoir-react";
// Decorative composition icons share the package entrypoint with semantic icons.
export {ArrowUpRight,Book,HomeSimple} from "iconoir-react";
export {Check,Folder,Settings};
type Props = SVGProps<SVGSVGElement> & {spin?:boolean;rotate?:number};
function icon(Component:ComponentType<SVGProps<SVGSVGElement>>, label:string, spinning=false) {
 return function PlatformIcon({spin=spinning,rotate,className="",style,...props}:Props) {
  return <span role="img" aria-label={label} className={`anticon platform-icon ${spin?"platform-icon-spin":""} ${className}`} style={style}><Component {...props} aria-hidden="true" width="1em" height="1em" strokeWidth={1.8} style={rotate?{transform:`rotate(${rotate}deg)`}:undefined}/></span>;
 };
}
export const AimOutlined=icon(Position,"aim",false);
export const ApiOutlined=icon(Network,"api",false);
export const AppstoreOutlined=icon(ViewGrid,"appstore",false);
export const ArrowLeftOutlined=icon(ArrowLeft,"arrow-left",false);
export const ArrowRightOutlined=icon(ArrowRight,"arrow-right",false);
export const BorderOuterOutlined=icon(Frame,"border-outer",false);
export const CheckCircleOutlined=icon(CheckCircle,"check-circle",false);
export const CheckOutlined=icon(Check,"check",false);
export const ClockCircleOutlined=icon(Clock,"clock-circle",false);
export const CloudUploadOutlined=icon(CloudUpload,"cloud-upload",false);
export const CodeOutlined=icon(Code,"code",false);
export const CommentOutlined=icon(MessageText,"comment",false);
export const CompressOutlined=icon(Collapse,"compress",false);
export const CopyOutlined=icon(Copy,"copy",false);
export const DatabaseOutlined=icon(Database,"database",false);
export const DeleteOutlined=icon(Trash,"delete",false);
export const DownloadOutlined=icon(Download,"download",false);
export const EditOutlined=icon(EditPencil,"edit",false);
export const ExclamationCircleOutlined=icon(WarningCircle,"exclamation-circle",false);
export const ExpandOutlined=icon(Expand,"expand",false);
export const EyeInvisibleOutlined=icon(EyeClosed,"eye-invisible",false);
export const EyeOutlined=icon(Eye,"eye",false);
export const FolderOutlined=icon(Folder,"folder",false);
export const GlobalOutlined=icon(Globe,"global",false);
export const HistoryOutlined=icon(ClockRotateRight,"history",false);
export const LinkOutlined=icon(Link,"link",false);
export const LoadingOutlined=icon(Refresh,"loading",true);
export const LogoutOutlined=icon(LogOut,"logout",false);
export const MenuFoldOutlined=icon(SidebarCollapse,"menu-fold",false);
export const MenuUnfoldOutlined=icon(SidebarExpand,"menu-unfold",false);
export const MinusOutlined=icon(Minus,"minus",false);
export const MoonOutlined=icon(HalfMoon,"moon",false);
export const MoreOutlined=icon(MoreVert,"more",false);
export const PlayCircleOutlined=icon(Play,"play-circle",false);
export const PlusOutlined=icon(Plus,"plus",false);
export const ProjectOutlined=icon(Folder,"project",false);
export const ReloadOutlined=icon(Refresh,"reload",false);
export const SafetyCertificateOutlined=icon(ShieldCheck,"safety-certificate",false);
export const SearchOutlined=icon(Search,"search",false);
export const SettingOutlined=icon(Settings,"setting",false);
export const SunOutlined=icon(SunLight,"sun",false);
export const TeamOutlined=icon(Group,"team",false);
export const UploadOutlined=icon(Upload,"upload",false);
export const ZoomInOutlined=icon(ZoomIn,"zoom-in",false);
export const ZoomOutOutlined=icon(ZoomOut,"zoom-out",false);

// Semantic exports for application navigation; route ownership stays with consumers.
export const CloudOutlined=icon(Cloud,"cloud");
export const FileTextOutlined=icon(Page,"file-text");
export const ConnectorOutlined=icon(PlugTypeA,"connector");
export const DesignOutlined=icon(DesignPencil,"design");
export const CloseOutlined=icon(Xmark,"close");

export const ChevronLeftOutlined=icon(NavArrowLeft,"chevron-left");
export const ChevronRightOutlined=icon(NavArrowRight,"chevron-right");
export const ChevronDownOutlined=icon(NavArrowDown,"chevron-down");

export const UserOutlined=icon(User,"user");
export const LockOutlined=icon(Lock,"lock");
