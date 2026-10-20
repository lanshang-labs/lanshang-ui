import {Alert} from '../dist/index.js';
import {OverlayPreview} from './overlay-preview';
import {NestedOverlayPreview} from './nested-overlay-preview';
import {OverlayControlsPreview} from './overlay-controls-preview';
import {OverlayAsyncSelectPreview} from './overlay-async-select-preview';
import {RemoteSelectPreview} from './remote-select-preview';
import './overlay-recovery-spec.css';

export function OverlayRecoverySpec(){return <div className="ls-overlay-spec">
 <div className="ls-overlay-spec-intro"><strong>先确认，再执行；失败后保留上下文</strong><p>点击入口观察三个结果：浮层从哪里打开、失败时输入是否保留、关闭后焦点回到哪里。所有请求只在本地模拟。</p></div>
 <section className="ls-overlay-spec-section" aria-labelledby="overlay-main-title"><header><span>01 / 基本路径</span><h3 id="overlay-main-title">确认、失败与重试</h3><p>分别打开 Modal、Drawer 和 Popconfirm；触发失败后继续在原位置恢复。</p></header><div className="ls-overlay-spec-body"><OverlayPreview/><Alert showIcon type="warning" message="连接尚未启用" description="完成连接配置后即可使用；这不影响上方本地交互样例。"/></div></section>
 <section className="ls-overlay-spec-section" aria-labelledby="overlay-nested-title"><header><span>02 / 层级</span><h3 id="overlay-nested-title">嵌套浮层与长内容</h3><p>逐层打开后，用 Escape 逐层关闭；长内容只在自己的区域滚动。</p></header><div className="ls-overlay-spec-body"><NestedOverlayPreview/></div></section>
 <section className="ls-overlay-spec-section" aria-labelledby="overlay-controls-title"><header><span>03 / 焦点与选择</span><h3 id="overlay-controls-title">浮层内的控件</h3><p>检查选择器、菜单、提示和多选列表在浮层边界内是否仍可操作。</p></header><div className="ls-overlay-spec-body"><OverlayControlsPreview/><div className="ls-overlay-spec-divider"/><OverlayAsyncSelectPreview/></div></section>
 <section className="ls-overlay-spec-section" aria-labelledby="overlay-remote-title"><header><span>04 / 异步</span><h3 id="overlay-remote-title">远程搜索与分页</h3><p>模拟加载、失败和重试，检查关闭后是否保留正确的操作位置。</p></header><div className="ls-overlay-spec-body"><RemoteSelectPreview/></div></section>
 </div>}
