import {useEffect, useState} from 'react';
import {LayoutSpace as Space} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import {ContentState, DataTable, RowActionButton, SearchField, StatusTag} from '../dist/index.js';
const source=Array.from({length:42},(_,i)=>({id:i+1,name:`项目 ${String(i+1).padStart(2,'0')}`,owner:i%2?'设计团队':'研发团队'}));
const size=5;
/** Local asynchronous example only; request ownership stays outside DataTable. */
export function RemoteTablePreview(){
 const [input,setInput]=useState(''),[failNext,setFailNext]=useState(false);
 const [request,setRequest]=useState({page:1,query:'',attempt:0,fail:false});
 const [result,setResult]=useState({page:1,query:'',rows:source.slice(0,size),total:source.length});
 const [loading,setLoading]=useState(true),[error,setError]=useState(false);
 useEffect(()=>{
  setLoading(true);setError(false);
  const timer=setTimeout(()=>{
   if(request.fail){setError(true);setLoading(false);return;}
   const matches=source.filter(row=>`${row.name} ${row.owner}`.includes(request.query));
   const page=Math.min(request.page,Math.max(1,Math.ceil(matches.length/size)));
   setResult({page,query:request.query,rows:matches.slice((page-1)*size,page*size),total:matches.length});
   setLoading(false);
  },650);
  // A replaced request or unmounted demo must not update the visible result.
  return ()=>clearTimeout(timer);
 },[request]);
 function load(page:number,query:string,fail=failNext){
  setLoading(true);setError(false);setFailNext(false);
  setRequest(previous=>({page,query,fail,attempt:previous.attempt+1}));
 }
 return <section className="docs-demo-gap" aria-label="异步分页示例">
  <h3>异步分页与错误恢复</h3>
  <Space wrap>
   <SearchField aria-label="异步搜索项目" placeholder="输入项目或团队后按 Enter" value={input} onChange={setInput} onSearch={value=>load(1,value.trim())}/>
   <RowActionButton motionIcon="refresh" disabled={loading} onClick={()=>load(result.page,result.query)}>刷新当前页</RowActionButton>
   <Checkbox checked={failNext} onChange={e=>setFailNext(e.target.checked)}>下次请求失败</Checkbox>
  </Space>
  <p className="docs-muted">模拟 650ms 延迟，无网络请求。加载时保留已有数据；失败后保留原页码与记录，重试成功才切换。</p>
  {error&&<ContentState role="alert" title="读取失败" description={`未能读取第 ${request.page} 页；下方仍为上次成功结果。`} action={<RowActionButton motionIcon="retry" onClick={()=>load(request.page,request.query,false)}>重试请求</RowActionButton>}/>}
  <DataTable rowKey="id" dataSource={result.rows} loading={loading}
   columns={[{title:'项目',dataIndex:'name'},{title:'负责人',dataIndex:'owner'},{title:'状态',render:()=> <StatusTag tone="success">正常</StatusTag>}]}
   scroll={{x:420}}
   locale={{emptyText:<ContentState title="没有匹配结果" description="试试其他项目名称或清除筛选。" action={<RowActionButton onClick={()=>{setInput('');load(1,'',false)}}>清除异步筛选</RowActionButton>}/>}}
   pagination={{current:result.page,pageSize:size,total:result.total,showSizeChanger:false,disabled:loading,
    showTotal:total=>`共 ${total} 条`,onChange:page=>load(page,result.query),locale:{prev_page:'上一页',next_page:'下一页'}}}/>
  <p className="docs-muted" role="status">{loading?'正在请求…':error?'请求失败，可重试':`已显示第 ${result.page} 页，共 ${result.total} 条`}{result.query?` · 当前结果筛选：${result.query}`:''}</p>
 </section>;
}
