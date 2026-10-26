import {Card,CardContent,CardDescription,CardHeader,CardTitle} from './ui/card';
import {Button} from './ui/button';
import {useLab} from '../lab-context';
export function SidebarNotification(){const {navigate}=useLab();return <Card className="gap-3 py-4 shadow-none group-data-[collapsible=icon]:hidden"><CardHeader className="px-4"><CardTitle className="text-sm">Template experiment / 02</CardTitle><CardDescription className="text-xs">原模板视觉 + Ant Design 业务交互</CardDescription></CardHeader><CardContent className="px-4"><Button size="sm" variant="outline" className="w-full" onClick={()=>navigate('/source')}>MIT · Source details</Button></CardContent></Card>;}
