import {NotificationNestedPreview} from './notification-nested-preview';
import './notification-spec.css';

export function NotificationSpec(){return <div className="ls-notification-spec"><div className="ls-notification-spec-heading"><h3>通知与浮层各有自己的生命周期</h3><p>先打开工作区，再打开内层详情；在任一层模拟后台结果，最后逐层关闭，观察通知何时恢复计时。</p></div><ol><li><strong>01</strong><span>打开 Modal，再打开 Drawer</span></li><li><strong>02</strong><span>模拟后台结果并快速重开</span></li><li><strong>03</strong><span>逐层关闭，通知继续计时</span></li></ol><div className="ls-notification-spec-demo"><NotificationNestedPreview/></div></div>}
