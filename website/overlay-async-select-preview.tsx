import {Select} from '../dist/index.js';
import {overlayPopupContainer} from './overlay-popup-container';
import {Stack,Inline} from '../dist/index.js';
import {useEffect, useRef, useState} from 'react';
import {Dialog as Modal, DrawerPanel as Drawer} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {Checkbox} from '../dist/index.js';
import type {SelectRef as RefSelectProps} from '../dist/index.js';
import {LoadingLabel} from '../dist/index.js';
import {FeedbackPanel} from '../dist/index.js';
import './overlay-preview.css';

const teams = [
  {value:'design', label:'设计团队'},
  {value:'engineering', label:'研发团队 · 公共基础设施与跨项目协作 / InfrastructurePlatformTeam'},
  {value:'content', label:'内容团队'},
  {value:'archived', label:'归档团队（不可选）', disabled:true, 'aria-disabled':true},
];
type Choice = {value:string; label:string};
function AsyncTeams({onPopupChange}:{onPopupChange:(open:boolean)=>void}) {
  const [values,setValues] = useState<Choice[]>([teams[0]]);
  const [options,setOptions] = useState<typeof teams>([]);
  const [status,setStatus] = useState<'loading'|'error'|'ready'>('loading');
  const [fail,setFail] = useState(true);
  const [open,setOpen] = useState(false);
  const [search,setSearch] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const host = useRef<HTMLDivElement>(null);
  const select = useRef<RefSelectProps>(null);
  const request = useRef(0);
  function popup(next:boolean){setOpen(next);onPopupChange(next)}
  function load(shouldFail:boolean){
    clearTimeout(timer.current);
    const id=++request.current;
    setStatus('loading');setOptions([]);
    timer.current=setTimeout(()=>{
      if(id!==request.current)return;
      setStatus(shouldFail?'error':'ready');
      if(!shouldFail)setOptions(teams);
    },650);
  }
  useEffect(()=>{load(true);return()=>{++request.current;clearTimeout(timer.current)}},[]);
  return <div ref={host} className="ls-overlay-control-host ls-async-teams" onKeyDownCapture={e=>{
    if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();popup(false);select.current?.focus()}
    if(e.key==='Tab'&&open)popup(false);
  }}>
    <Stack>
    <p>多选协作团队。首次读取模拟失败；重试成功不清除已选项或搜索词。</p>
    <Select ref={select} aria-label="协作团队" mode="multiple" labelInValue allowClear virtual={false}
      value={values} onChange={setValues} options={options} showSearch searchValue={search} onSearch={setSearch}
      autoClearSearchValue={false} optionFilterProp="label" open={open} onDropdownVisibleChange={popup}
      getPopupContainer={trigger=>overlayPopupContainer(trigger,host.current!)} popupClassName="ls-overlay-control-select" style={{width:'100%'}}
      notFoundContent={<div className="ls-overlay-no-results">{status==='loading'?'正在读取团队…':status==='error'?'选项暂不可用，请在下方重试。':'没有匹配的团队，请修改关键词。'}</div>}
    />
    <div aria-busy={status==='loading'}><FeedbackPanel variant="inline" type={status==='error'?'error':'info'} message={status==='loading'?<LoadingLabel label="正在读取团队"/>:status==='error'?<span role="alert">团队加载失败，已选项已保留。可重试读取。</span>:<span role="status">团队选项已更新。</span>} action={<Inline>
        <Button aria-disabled={status==='loading'} onClick={()=>{if(status!=='loading')load(false)}}>重试读取</Button>
        <Button disabled={status==='loading'} onClick={()=>load(fail)}>重新加载</Button>
        <Button disabled={!values.length} onClick={()=>{setValues([]);setSearch('');popup(false);select.current?.focus()}}>清空已选团队</Button>
      </Inline>}/></div>
    <Checkbox checked={fail} onChange={e=>setFail(e.target.checked)}>重新加载时模拟失败</Checkbox>
    <p role="status">已选 {values.length} 个团队：{values.map(v=>v.label).join('、')||'暂无选择'}</p>
    <p>方向键定位，Enter 切换选项；空搜索时 Backspace 移除最后一项。Tab 收起列表并前进，Escape 先收起列表。</p>
    </Stack>
  </div>;
}
export function OverlayAsyncSelectPreview(){
  const [kind,setKind]=useState<'modal'|'drawer'|null>(null);
  const [popup,setPopup]=useState(false);
  const opener=useRef<HTMLElement|null>(null);
  function close(){setPopup(false);setKind(null)}
  const content=kind?<AsyncTeams key={kind} onPopupChange={setPopup}/>:null;
  const restore=()=>opener.current?.focus();
  return <><Inline>{(['modal','drawer'] as const).map(value=><Button key={value} onClick={e=>{opener.current=e.currentTarget;setKind(value)}}>{value==='modal'?'Modal':'Drawer'} 异步多选</Button>)}</Inline>
    <Modal title="协作团队 · 异步多选" rootClassName="ls-overlay-demo-popup" open={kind==='modal'} keyboard={!popup} maskClosable={!popup} onCancel={close} destroyOnClose focusTriggerAfterClose={false} afterClose={restore} footer={<Button onClick={close}>完成选择</Button>}>{kind==='modal'?content:null}</Modal>
    <Drawer title="协作团队 · 异步多选" rootClassName="ls-overlay-demo-popup" open={kind==='drawer'} width="min(460px,100vw)" keyboard={!popup} maskClosable={!popup} onClose={close} destroyOnClose afterOpenChange={next=>{if(!next)restore()}} footer={<Button onClick={close}>完成选择</Button>}>{kind==='drawer'?content:null}</Drawer>
  </>;
}
