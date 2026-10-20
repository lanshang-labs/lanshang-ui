import {MotionIcon} from '../dist/index.js';
import {useId, useRef, useState} from 'react';
import {SegmentedControl as Segmented} from '../dist/index.js';
import {TabStrip as Tabs, MenuDropdown as Dropdown} from '../dist/index.js';
import {MotionButton as Button} from '../dist/index.js';
import {BeautifulTabs,RadioGroup} from '../dist/index.js';

export function NavigationStatesPreview() {
  const [selected, setSelected] = useState('overview');
  const [open, setOpen] = useState(false);
  const [density, setDensity] = useState('compact');
  const [scope, setScope] = useState('mine');
  const scopeName = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const items = [
    {key: 'overview', label: '项目概览'},
    {key: 'activity', label: '活动记录'},
    {key: 'disabled', label: '无权限', disabled: true},
  ];
  return <div className="control-demo">
    <section><h3>下拉导航</h3>
      <Dropdown autoFocus open={open} onOpenChange={next => {setOpen(next); if (!next) trigger.current?.focus();}}
        trigger={['click']} menu={{items, selectable:true, selectedKeys:[selected], onClick:({key})=>{setSelected(key); setOpen(false); trigger.current?.focus();}}}>
        <Button ref={trigger} aria-haspopup="menu" aria-expanded={open} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setOpen(true)}}}>切换视图<MotionIcon name="expand" active={open} size={14}/></Button>
      </Dropdown>
      <p role="status">当前视图：{items.find(item=>item.key===selected)?.label}</p>
    </section>
    <section><h3>轻量导航</h3><BeautifulTabs items={items} activeKey={selected} onChange={setSelected}/></section>
    <section><h3>内容页签</h3><Tabs items={items.map(item=>({...item,children:<p>{item.label}内容。悬停和移动焦点不会改变当前内容。</p>}))}/></section>
    <section><h3>卡片页签</h3><Tabs type="card" items={items.map(item=>({...item,children:<p>{item.label}内容。</p>}))}/></section>
    <section><h3>纵向页签</h3><Tabs tabPosition="left" items={items.map(item=>({...item,children:<p>{item.label}内容。</p>}))}/></section>
    <section><h3>分段选择</h3>
      <Segmented aria-label="显示密度" value={density} onChange={setDensity} options={[{value:'compact',label:'紧凑'},{value:'comfortable',label:'舒适'},{value:'disabled',label:'不可用',disabled:true}]}/>
      <p>显示密度：{density==='compact'?'紧凑':'舒适'}</p>
    </section>
    <section><h3>单选按钮组</h3>
      <RadioGroup name={scopeName} aria-label="项目范围" optionType="button" buttonStyle="solid" value={scope} onChange={event=>setScope(event.target.value)} options={[{value:'mine',label:'我的项目'},{value:'team',label:'团队项目'},{value:'disabled',label:'全部项目',disabled:true}]}/>
      <p>项目范围：{scope==='mine'?'我的项目':'团队项目'}</p>
    </section>
    <p className="docs-muted">当前版本分段选择使用 Tab 定位、Space 选中；带 name 的单选按钮组支持方向键同时移动焦点并改变选择。Tabs 使用 Tab 定位后按 Enter 或 Space 确认。</p>
    <p className="docs-muted">下拉和轻量导航共享当前视图。轻量导航和内容页签保留当前项底色与加重文字，其他项悬停仅提亮文字；纵向页签使用相同的中号导航行与圆角。键盘焦点独立显示，禁用项不接管高亮。内容页签保留当前 AntD 版本的 Tab、Enter 与 Space 操作，轻量导航使用 Tab 和 Enter。</p>
  </div>;
}
