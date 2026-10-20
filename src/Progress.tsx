import {useId, type ReactNode} from 'react';

export type ProgressStatus = 'running' | 'queued' | 'paused' | 'blocked' | 'failed' | 'success' | 'cancelled' | 'unknown';
export const progressLabels: Record<ProgressStatus, string> = {
  running:'处理中', queued:'排队中', paused:'已暂停', blocked:'受阻', failed:'失败',
  success:'已完成', cancelled:'已取消', unknown:'待核实',
};
export type ProgressProps = {
  /** Omit when the amount of work is unknown. 100 does not imply success. */
  value?: number;
  status?: ProgressStatus;
  label: string;
  description?: ReactNode;
  valueText?: string;
  variant?: 'line' | 'circle';
  showInfo?: boolean;
  className?: string;
};
/** Controlled presentation only: never advances time or infers completion. */
export function Progress({value, status='running', label, description, valueText, variant='line', showInfo=true, className=''}: ProgressProps) {
  const id=useId();
  const amount=typeof value==='number' && Number.isFinite(value) ? Math.max(0,Math.min(100,value)) : undefined;
  const copy=valueText ?? (amount===undefined ? '进度未知' : `${Math.round(amount)}%`);
  const active=amount===undefined && status==='running';
  return <div className={`ls-progress ls-progress--${variant} ${className}`} data-status={status}>
    <div className={`ls-progress-meter${active?' is-indeterminate':''}`} role="progressbar" aria-label={label}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={amount}
      aria-valuetext={`${copy} · ${progressLabels[status]}`} aria-describedby={description ? id : undefined}>
      {variant==='circle' ? <svg viewBox="0 0 36 36" aria-hidden="true"><circle className="ls-progress-track" cx="18" cy="18" r="15"/><circle className="ls-progress-fill" cx="18" cy="18" r="15" pathLength="100" strokeDasharray={`${amount ?? (active?24:0)} 100`}/></svg>
        : <span className="ls-progress-fill" style={{width:`${amount ?? (active?28:0)}%`}}/>}
    </div>
    {showInfo && <div className="ls-progress-info"><span>{label}</span><span className="ls-progress-value">{copy} · {progressLabels[status]}</span></div>}
    {description && <div id={id} className="ls-progress-description">{description}</div>}
  </div>;
}
