// Keep the upstream action row, use Ant Design for menu behavior.
import {Plus,Settings,FileText,TableProperties} from 'lucide-react';
import {Dropdown} from 'antd';
import {Button} from '../../../components/ui/button';
import {useLab} from '../../../lab-context';
export function QuickActions(){const {createSale,report,transactions,navigate}=useLab();return <div className="flex items-center space-x-2">
 <Button className="cursor-pointer" onClick={createSale}><Plus className="h-4 w-4 mr-2"/>New Sale</Button>
 <Dropdown trigger={['click']} menu={{items:[{key:'report',label:'Report preview',icon:<FileText size={15}/>},{key:'transactions',label:'All transactions',icon:<TableProperties size={15}/>},{type:'divider'},{key:'settings',label:'Dashboard settings',icon:<Settings size={15}/>}],onClick:({key})=>key==='report'?report('Recent Transactions',transactions):navigate(key==='settings'?'/settings':'/transactions')}}>
  <Button variant="outline" className="cursor-pointer"><Settings className="h-4 w-4 mr-2"/>Actions</Button>
 </Dropdown>
 </div>;}
