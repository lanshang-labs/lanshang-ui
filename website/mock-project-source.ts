import type {ProjectRecord, ProjectActivity} from './blocks';
export type FailureMode='none'|'all'|'partial';
export const demoOwners=['林远','陈夏','顾宁'];
export const demoCategories=['基础平台','协作工具'];
export const projectSamples:ProjectRecord[]=['设计系统','文档中心','客户门户','数据工作台','团队空间','发布中心','资源库','服务监控'].map((name,i)=>({id:`PRJ-${String(i+1).padStart(3,'0')}`,name,owner:demoOwners[i%3],status:i===2?'draft':i===6?'archived':'active',category:demoCategories[i%2],description:'让团队在统一的工作空间中，清晰地组织信息与推进日常工作。',notifications:true,progress:[72,46,0,85,38,100,100,62][i]}));
/** Only the documentation uses this in-memory service. Never distributed with Blocks. */
export function createProjectSource(delay=700){
 let rows=projectSamples.map(row=>({...row}));
 const events=new Map<string,ProjectActivity[]>();
 let nextId=9, eventId=0;
 const wait=()=>new Promise(resolve=>setTimeout(resolve,delay));
 const event=(id:string,label:string)=>events.set(id,[{id:String(++eventId),actor:'当前成员',label,time:new Date().toLocaleTimeString('zh-CN')},...(events.get(id)||[])]);
 return {
  async list({query,status,page,pageSize}:{query:string;status:string;page:number;pageSize:number},fail=false){await wait();if(fail)throw new Error('模拟请求失败，请关闭失败开关后重试。');const matches=rows.filter(r=>(status==='all'||r.status===status)&&`${r.name} ${r.id} ${r.owner}`.toLowerCase().includes(query.trim().toLowerCase()));return {rows:matches.slice((page-1)*pageSize,page*pageSize).map(r=>({...r})),total:matches.length}},
  async detail(id:string,fail=false){await wait();if(fail)throw new Error('模拟读取失败');const record=rows.find(r=>r.id===id);return {record:record?{...record}:undefined,activities:[...(events.get(id)||[])]}},
  async save(record:ProjectRecord,fail=false){await wait();if(fail)throw new Error('保存失败，输入已保留。请关闭失败开关后重试。');const saved={...record,id:record.id||`PRJ-${String(nextId++).padStart(3,'0')}`};rows=rows.some(r=>r.id===saved.id)?rows.map(r=>r.id===saved.id?saved:r):[saved,...rows];event(saved.id,record.id?'更新了项目信息':'创建了项目');return {...saved}},
  async archive(ids:string[],mode:FailureMode){await wait();if(mode==='all')throw new Error('归档请求失败，所选项目均未修改。');const failed=mode==='partial'?ids.filter((_,i)=>i%2===0):[];const succeeded=ids.filter(id=>!failed.includes(id)&&rows.some(r=>r.id===id));rows=rows.map(r=>succeeded.includes(r.id)?{...r,status:'archived'}:r);succeeded.forEach(id=>event(id,'归档了项目'));return {succeeded,failed}},
 };
}
