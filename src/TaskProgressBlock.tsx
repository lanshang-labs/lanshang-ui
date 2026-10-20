import {Stack,Inline} from './Stack.js';
import {FeedbackPanel} from './FeedbackPanel.js';
import {useId, type ReactNode} from 'react';
import LoadingLabel from './beautiful-ui/LoadingLabel.js';
import {Progress, progressLabels, type ProgressProps} from './Progress.js';
import TaskRows, {type TaskRow, type TaskRowsLabels} from './beautiful-ui/TaskRows.js';
import {ContentState} from './ContentState.js';
import {Skeleton} from './Skeleton.js';
export type TaskProgressBlockProps = {
  title: string;
  description?: ReactNode;
  progress: ProgressProps;
  rows: TaskRow[];
  actions?: ReactNode;
  labels?: Partial<TaskRowsLabels>;
  loading?: boolean;
  /** Historical snapshots retain status text without suggesting live processing. */
  snapshot?: boolean;
  refreshing?: boolean;
  error?: string;
  recovery?: ReactNode;
  emptyText?: string;
  presentation?: "activity" | "meter";
  rowVariant?: "Capsules" | "List";
};
/** Consumers own requests, permissions and retry semantics. Existing rows survive refresh errors. */
export function TaskProgressBlock({title,description,progress,rows,actions,labels,loading=false,snapshot=false,refreshing=false,error,recovery,emptyText='暂无任务',presentation='activity',rowVariant='Capsules'}:TaskProgressBlockProps) {
  const id=useId();
  return <section className={`ls-task-progress-block ls-task-progress--${presentation}`} aria-labelledby={id}>
    <header><Stack gap="xs"><h3 id={id}>{title}</h3>{description && <p>{description}</p>}</Stack>{actions && <Inline className="ls-task-progress-actions">{actions}</Inline>}</header>
    {loading ? <Skeleton loading label="正在加载任务" paragraph={{rows:3}}/> : <>
      {presentation==='meter' ? <Progress {...progress}/> : <div className="ls-task-activity" role="status">
        {(!snapshot && (!progress.status || progress.status==='running')) ? <LoadingLabel label={progress.label} announce={false}/> : <span>{progress.label} · {progressLabels[progress.status ?? 'running']}</span>}
        <span className="ls-task-activity-meta">{progress.valueText}</span>
        {progress.description && <div>{progress.description}</div>}
      </div>}
      {refreshing && <p role="status" className="ls-task-progress-note"><LoadingLabel label="正在刷新，保留上次任务记录…" announce={false}/></p>}
      {error && <FeedbackPanel type="error" message={<span role="alert">{error}</span>} action={recovery}/>}
      {rows.length ? <TaskRows animated={!snapshot} variant={rowVariant} rows={rows} labels={labels}/> : <ContentState title={emptyText}/>}
    </>}
  </section>;
}
