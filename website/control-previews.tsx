import {MotionButton} from '../dist/index.js';
import { useEffect, useId, useRef, useState } from 'react';
import {SkeletonAvatar,SkeletonBlock} from '../dist/index.js';
import {Form} from '../dist/index.js';
import { Select, ButtonGroup, Inline, ContentState, LoadingLabel, RowActionButton, Skeleton, StatusTag, TextInput, TextArea, ToggleSwitch } from '../dist/index.js';
// Only the documentation demo owns timers. Production requests belong to the application.
function useDemoTimer() {
    const timer = useRef<ReturnType<typeof setTimeout>>();
    useEffect(() => () => clearTimeout(timer.current), []);
    return (done: () => void) => { clearTimeout(timer.current); timer.current = setTimeout(done, 700); };
}
export function SkeletonPreview() {
    const [state, setState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
    const [refreshing, setRefreshing] = useState(false), [custom, setCustom] = useState(false);
    const later = useDemoTimer();
    function choose(next: typeof state) { setRefreshing(false); later(() => { }); setState(next); }
    return <div className="control-demo">
    <ButtonGroup aria-label="骨架屏演示状态" style={{justifySelf:'start'}}>{(['loading', 'ready', 'empty', 'error'] as const).map((value, i) => <RowActionButton key={value} aria-pressed={state === value} onClick={() => choose(value)}>{['首次加载', '有内容', '空数据', '读取失败'][i]}</RowActionButton>)}</ButtonGroup>
    <label className="control-demo-switch"><ToggleSwitch checked={custom} onChange={setCustom}/> 自定义占位布局</label>
    <div className="control-demo-panel" aria-label="项目摘要">
      {state === 'error' ? <ContentState role="alert" title="读取失败" description="保留筛选条件，重试只重新加载当前项目。" action={<MotionButton motionIcon="retry" onClick={() => { setState('loading'); later(() => setState('ready')); }}>重试读取</MotionButton>}/> : state === 'empty' ? <ContentState title="暂无项目" description="加载已经完成，没有可展示的记录。"/> :
            <Skeleton loading={state === 'loading'} avatar paragraph={{ rows: 2 }} template={custom ? <div className="control-demo-placeholder"><SkeletonAvatar active shape="square" size={40}/><SkeletonBlock active title={{ width: '45%' }} paragraph={{ rows: 2, width: ['100%', '65%'] }}/></div> : undefined}>
        <div aria-busy={refreshing}><h3>设计系统工作台</h3><p>组件、使用约定与交互示例保持同步。</p><Inline><StatusTag tone="success">运行正常</StatusTag><MotionButton motionIcon="refresh" disabled={refreshing} onClick={() => { setRefreshing(true); later(() => setRefreshing(false)); }} aria-label="刷新摘要" title="刷新摘要"/>{refreshing && <LoadingLabel label="正在刷新"/>}</Inline></div>
      </Skeleton>}
    </div>
    <p className="docs-muted">首次加载延迟 150ms 显示骨架并预留空间；刷新保留现有内容。重试和刷新模拟耗时 700ms，不发送网络请求。</p>
  </div>;
}
export function ButtonPreview() {
    const [pending, setPending] = useState(false), [fail, setFail] = useState(false), [result, setResult] = useState('尚未保存');
    const lock = useRef(false);
    const later = useDemoTimer();
    function save() { if (lock.current)
        return; lock.current = true; setPending(true); setResult('正在保存'); later(() => { lock.current = false; setPending(false); setResult(fail ? '保存失败，内容已保留，可再次保存' : '保存成功'); }); }
    return <div className="control-demo"><Inline><MotionButton motionIcon="save" type="primary" aria-label="保存修改" loading={pending} aria-busy={pending} onClick={save}>保存修改</MotionButton><MotionButton disabled={pending} onClick={() => setResult('已取消本次修改')}>取消</MotionButton><RowActionButton motionIcon="edit" onClick={() => setResult('已打开本地编辑示例')} disabled={pending} aria-label="编辑" title="编辑"/><MotionButton motionIcon="delete" danger disabled>删除（无权限）</MotionButton></Inline>
    <div role="group" aria-label="按钮样式与状态" style={{display:'grid',gap:12,marginTop:16}}>
      <Inline><MotionButton type="primary">主操作</MotionButton><MotionButton>次操作</MotionButton><MotionButton type="text">轻量操作</MotionButton><MotionButton danger>危险操作</MotionButton></Inline>
      <Inline><MotionButton size="small">紧凑按钮</MotionButton><MotionButton size="middle">标准按钮</MotionButton><MotionButton size="large">大号按钮</MotionButton><MotionButton motionIcon="add" shape="circle" aria-label="添加项目" title="添加项目"/></Inline>
      <Inline><MotionButton type="primary" loading aria-label="正在提交">正在提交</MotionButton><MotionButton loading aria-label="正在读取">正在读取</MotionButton><MotionButton type="primary" disabled>主操作不可用</MotionButton><MotionButton disabled>次操作不可用</MotionButton></Inline>
    </div>
    <label className="control-demo-switch"><ToggleSwitch checked={fail} disabled={pending} onChange={setFail}/> 模拟保存失败</label>
    <p role={result.startsWith('保存失败') ? 'alert' : 'status'}>{result}</p><p className="docs-muted">主操作用实心按钮，行内操作保持轻量。中性按钮的悬停、按下与组合按钮采用相同底色；只有切换操作保留选中态。加载期间阻止重复提交；链接跳转使用 NavigationLink。</p></div>;
}
export function InputPreview() {
    const [form] = Form.useForm();
    const [saved, setSaved] = useState('');
    const readOnlyId = useId(), restrictedId = useId();
    return <div className="control-demo"><Form form={form} layout="vertical" onFinish={values => setSaved(values.name.trim())} onFinishFailed={({ errorFields }) => form.getFieldInstance(errorFields[0]?.name)?.focus()}>
    <Form.Item name="name" label="项目名称" rules={[{ required: true, whitespace: true, message: '请输入项目名称' }]}><TextInput allowClear maxLength={60} placeholder="例如：设计系统工作台"/></Form.Item>
    <Form.Item name="description" label="项目说明"><TextArea autoSize={{ minRows: 2, maxRows: 4 }} maxLength={240} showCount placeholder="说明项目用途"/></Form.Item>
    <div className="control-demo-grid"><Form.Item label="只读标识" htmlFor={readOnlyId}><TextInput id={readOnlyId} readOnly value="lanshang-ui"/></Form.Item><Form.Item label="无权限字段" htmlFor={restrictedId}><TextInput id={restrictedId} disabled value="由管理员维护"/></Form.Item></div>
    <Inline><MotionButton htmlType="submit" type="primary">验证输入</MotionButton><MotionButton onClick={() => { form.resetFields(); setSaved(''); }}>重置输入</MotionButton></Inline>
  </Form><p role="status">{saved ? `已提交：${saved}` : '输入保留在本地，必填错误会聚焦项目名称。'}</p></div>;
}
const options = [{ value: 'design', label: '设计团队' }, { value: 'engineering', label: '研发团队 · 公共基础设施与跨项目协作' }, { value: 'archived', label: '归档团队（不可选）', disabled: true }];
export function SelectPreview() {
    const [value, setValue] = useState<string>(), [state, setState] = useState<'ready' | 'loading' | 'empty' | 'error'>('ready');
    const later = useDemoTimer();
    return <div className="control-demo"><ButtonGroup aria-label="选择器演示状态" style={{justifySelf:'start'}}>{(['ready', 'loading', 'empty', 'error'] as const).map((s, i) => <RowActionButton key={s} aria-pressed={s === state} onClick={() => { later(() => { }); setState(s); }}>{['可选择', '加载选项', '无选项', '选项失败'][i]}</RowActionButton>)}</ButtonGroup>
    <Form layout="vertical"><Form.Item label="负责人团队" htmlFor="team-select" help={state === 'error' ? '选项读取失败，已保留当前选择。' : undefined} validateStatus={state === 'error' ? 'error' : undefined}>
      <Select id="team-select" value={value} onChange={setValue} allowClear showSearch optionFilterProp="label" placeholder="搜索或选择团队" loading={state === 'loading'} disabled={state !== 'ready'} options={state === 'empty' ? [] : options} style={{ width: '100%' }} notFoundContent="没有匹配的团队"/>
    </Form.Item></Form>
    <div className="control-demo-grid">
      <Form layout="vertical"><Form.Item label="错误状态选择器" htmlFor="team-select-error" validateStatus="error" help="该团队已不可用，请重新选择。"><Select id="team-select-error" status="error" aria-invalid="true" defaultValue="design" options={options} style={{width:'100%'}}/></Form.Item></Form>
      <Form layout="vertical"><Form.Item label="警告状态选择器" htmlFor="team-select-warning" validateStatus="warning" help="该团队即将调整，请核对成员。"><Select id="team-select-warning" status="warning" defaultValue="design" options={options} style={{width:'100%'}}/></Form.Item></Form>
    </div>
    {state === 'loading' && <LoadingLabel label="正在读取选项"/>}
    {state === 'empty' && <p role="status">暂无可选团队，请先添加团队。</p>}
    {state === 'error' && <MotionButton motionIcon="retry" onClick={() => { setState('loading'); later(() => setState('ready')); }}>重试选项</MotionButton>}
    <p role="status">当前选择：{options.find(o => o.value === value)?.label ?? '未选择'}</p>
    <p className="docs-muted">方向键移动，Enter 选择，Esc 关闭，Tab 离开。长标签保持完整数据；搜索按标签匹配。</p>
  </div>;
}
