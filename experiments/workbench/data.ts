export type ProjectStatus='进行中'|'需关注'|'已完成'|'计划中';
export type Project={id:string;name:string;description:string;category:string;status:ProjectStatus;owner:string;color:string;done:number;total:number;due:string;updated:string};
export const people=[{name:'夏豆儿',initials:'YD',role:'产品与设计',color:'#e8ede4'},{name:'陈一',initials:'CY',role:'前端工程师',color:'#ede5dc'},{name:'林可',initials:'LK',role:'后端工程师',color:'#e2e9ed'},{name:'周宁',initials:'ZN',role:'内容与运营',color:'#eae3ed'}];
export const initialProjects:Project[]=[
 {id:'PRJ-024',name:'品牌官网重构',description:'重新梳理品牌表达，让产品价值更清晰。',category:'网站体验',status:'进行中',owner:'夏豆儿',color:'#e4ebde',done:32,total:40,due:'10月30日',updated:'刚刚'},
 {id:'PRJ-023',name:'客户服务工作台',description:'把分散的客户问题与服务进度放到同一处。',category:'产品开发',status:'需关注',owner:'陈一',color:'#e5e9f0',done:18,total:32,due:'10月28日',updated:'12 分钟前'},
 {id:'PRJ-022',name:'内容资源中心',description:'统一素材归档、搜索和团队协作。',category:'内容系统',status:'进行中',owner:'周宁',color:'#eee4dc',done:24,total:36,due:'11月02日',updated:'38 分钟前'},
 {id:'PRJ-021',name:'开放平台 API',description:'提供稳定、清晰的开发者接入体验。',category:'基础服务',status:'进行中',owner:'林可',color:'#e3e9e6',done:45,total:50,due:'11月05日',updated:'1 小时前'},
 {id:'PRJ-020',name:'移动端体验优化',description:'优化关键任务在小屏设备上的操作路径。',category:'体验优化',status:'已完成',owner:'陈一',color:'#eee6e8',done:28,total:28,due:'10月24日',updated:'昨天'},
 {id:'PRJ-019',name:'团队知识库',description:'整理项目中的决定、经验和可复用资料。',category:'团队协作',status:'计划中',owner:'夏豆儿',color:'#e8e5f0',done:0,total:20,due:'11月12日',updated:'昨天'},
];
export type Activity={id:string;person:string;action:string;target:string;time:string;tone?:'warning'};
export const initialActivity:Activity[]=[{id:'a1',person:'夏豆儿',action:'更新了设计稿',target:'品牌官网重构',time:'10 分钟前'},{id:'a2',person:'陈一',action:'标记了一个阻塞',target:'客户服务工作台',time:'28 分钟前',tone:'warning'},{id:'a3',person:'林可',action:'完成了接口联调',target:'开放平台 API',time:'46 分钟前'},{id:'a4',person:'周宁',action:'整理了 12 份素材',target:'内容资源中心',time:'1 小时前'}];
export const runs=[{id:'RUN-1048',name:'生产环境构建',project:'品牌官网重构',status:'成功',duration:'1 分 24 秒',time:'14:32'},{id:'RUN-1047',name:'接口契约检查',project:'开放平台 API',status:'成功',duration:'38 秒',time:'14:18'},{id:'RUN-1046',name:'资源完整性检查',project:'内容资源中心',status:'失败',duration:'12 秒',time:'13:56'},{id:'RUN-1045',name:'前端类型检查',project:'客户服务工作台',status:'成功',duration:'24 秒',time:'13:40'}];
// Historical sample through 2026-10-25; totals stay within the current project snapshot.
export const weeklyCompleted=[0,1,2,1,3,2,5,3,4,2,5,4,6,5,4,6,4,7,5,8,6,5,6,5,8,7,9,8,9,7];
export function deliveryData(days:number){const start=weeklyCompleted.length-days;return weeklyCompleted.slice(start).flatMap((value,i)=>{const date=new Date(Date.UTC(2026,9,25-(weeklyCompleted.length-1)+start+i));const label=`${date.getUTCMonth()+1}/${date.getUTCDate()}`;return [{date:label,value,series:'已完成'},{date:label,value:value+2+(i%3),series:'新增任务'}];});}
