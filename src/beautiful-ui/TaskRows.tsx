import { Check, Xmark, NavArrowDown } from "iconoir-react";
// Adapted from Beautiful UI TaskRows.tsx. MIT — see LICENSE. No simulated status transitions.
"use client";

import {Progress, progressLabels, type ProgressProps} from "../Progress.js";
import {ContentState} from "../ContentState.js";
import { useId, useState, type ReactNode } from "react";

/* Platform states are explicit. Upstream demonstration timers were removed. */

function SpinnerRing({ active, children }: { active?: boolean; children?: React.ReactNode }) {
  const size = 24, stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size} height={size} className="absolute inset-0"
        style={active ? { animation: "spin var(--ls-motion-loading,1600ms) linear infinite" } : undefined}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {active && (
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="var(--ink-3)" strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c * 0.72}`}
          />
        )}
      </svg>
      <span className="relative text-[10.5px] font-semibold tabular-nums text-ink">{children}</span>
    </span>
  );
}

function Badge({ tone, children }: { tone: "red" | "green"; children: React.ReactNode }) {
  return (
    <span
      className={`flex size-5.5 shrink-0 items-center justify-center rounded-full text-white
        ${tone === "red" ? "bg-red" : "bg-green"}`}
      style={{ animation: "fade-up var(--ls-motion-enter,180ms) var(--ls-ease-standard,ease) both" }}
    >
      {children}
    </span>
  );
}

const XIcon = <Xmark width="12" height="12" strokeWidth={2}/>;
const CheckIcon = <Check width="13" height="13" strokeWidth={2}/>;

/* One detail line shown when a task row is expanded. */
export type TaskDetail = { label: string; meta: string };

/* A single task row.
 *  - "done"     → green check badge + completed pill (static)
 *  - "running"  → active spinner showing `step`, no pill (static)
 *  - failed / unknown / queued are controlled by the platform.
 */
export type TaskRow = {
  key: string;
  label: string;
  amount: string;
  status: "done" | "running" | "failed" | "unknown" | "queued" | "paused" | "blocked" | "cancelled";
  progress?: Omit<ProgressProps, "label" | "status">;
  actions?: ReactNode;
  step?: number;
  details: TaskDetail[];
};

export type TaskRowsLabels = {
  completed: string;
  failed: string;
  running?: string; queued?: string; paused?: string; blocked?: string; cancelled?: string; unknown?: string;
};

const DEFAULT_LABELS: TaskRowsLabels = {
  completed: "完成",
  failed: "失败",
};

export default function TaskRows({
  variant = "Capsules",
  rows = [],
  labels,
  className,
  onToggleRow,
  emptyText = "暂无任务",
  animated = true,
}: {
  emptyText?: string;
  animated?: boolean;
  variant?: string;
  rows?: TaskRow[];
  labels?: Partial<TaskRowsLabels>;
  className?: string;
  onToggleRow?: (key: string, open: boolean) => void;
}) {
  const detailsId = useId();
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});
  const copy = { ...DEFAULT_LABELS, ...labels };

  const badgeFor = (row: TaskRow) => {
    if (row.status === "done") return <Badge tone="green">{CheckIcon}</Badge>;
    if (row.status === "running") return <SpinnerRing active={animated}>{row.step}</SpinnerRing>;
    return row.status === "failed" ? <Badge tone="red">{XIcon}</Badge> : <SpinnerRing>{row.status === "unknown" ? "?" : "·"}</SpinnerRing>;
  };
  const pillFor = (row: TaskRow) => row.status === "done" ? <span className="rounded-full bg-green-tint px-2 text-[11.5px] text-green">{copy.completed}</span> : row.status === "failed" ? <span className="rounded-full bg-red-tint px-2 text-[11.5px] text-red">{copy.failed}</span> : <span className="ls-task-row-status">{copy[row.status] ?? progressLabels[row.status]}</span>;

  const list = variant === "List";
  return (
    <div
      data-ls-motion={animated ? undefined : "reduce"}
      className={`bui bui-task-rows flex w-full max-w-110 flex-col ${
        list ? "gap-0 self-start overflow-hidden rounded-card bg-surface shadow-card" : "min-h-[196px] gap-2"
      }${className ? ` ${className}` : ""}`}
    >
      {!rows.length && <ContentState title={emptyText}/>}
      {rows.map((row, i) => {
        const open = manualOpen[row.key] ?? false;
        const Trigger = row.details.length ? "button" : "div";
        return (
          <div
            key={row.key}
            className={`ls-task-row self-stretch overflow-hidden transition-[border-radius,background-color] duration-300 hover:bg-inset ${
              list ? "border-b border-line last:border-0" : "bg-surface shadow-card"
            }`}
            style={{
              borderRadius: list ? 0 : 12,
              animation: animated ? "fade-up var(--ls-motion-enter,180ms) var(--ls-ease-standard,ease) both" : undefined,
            }}
          >
            <Trigger
              type={row.details.length ? "button" : undefined}
              aria-expanded={row.details.length ? open : undefined}
              aria-controls={row.details.length ? `${detailsId}-${i}` : undefined}
              onClick={() => {
                if (!row.details.length) return;
                setManualOpen((current) => ({ ...current, [row.key]: !open }));
                onToggleRow?.(row.key, !open);
              }}
              className="ls-task-row-trigger flex h-11 w-full items-center gap-2.5 px-2.5 text-left"
            >
              <span className="flex size-6 shrink-0 items-center justify-center">
                {badgeFor(row)}
              </span>
              <span className="ls-task-row-name min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                {row.label}
              </span>
              <span className="ls-task-row-amount text-[12.5px] text-ink-2 tabular-nums">{row.amount}</span>
              {pillFor(row)}
              <span
                aria-hidden="true"
                className="-ml-2 flex size-7 shrink-0 items-center justify-center rounded-full text-ink-3"
              >
                {row.details.length > 0 && <NavArrowDown width={15} height={15} strokeWidth={1.5} className="ls-disclosure-arrow" style={{transform:open?"rotate(180deg)":"rotate(0)"}}/>}
              </span>
            </Trigger>

            <div className="ls-task-row-extra">
              {row.progress && <Progress showInfo={false} {...row.progress} label={row.label} status={row.status==='done'?'success':row.status}/>}
              {row.actions && <div className="ls-task-row-actions">{row.actions}</div>}
            </div>
            {/* dropdown detail — same expandable grammar as Chain of Thought */}
            <div
              id={`${detailsId}-${i}`}
              aria-hidden={!open}
              className="ls-task-row-details grid"
                style={{
                  gridTemplateRows: open ? "1fr" : "0fr",
                  opacity: open ? 1 : 0,
                }}
              >
                <div className="overflow-hidden">
                  <div className="ls-task-row-detail-content">

                    <div className="flex flex-col gap-1.5">
                      {row.details.map((d) => (
                        <div
                          key={d.label}
                          className="ls-task-detail flex items-center justify-between"
                        >
                          <span className="text-[12px] text-ink-2">{d.label}</span>
                          <span className="font-mono text-[11.5px] text-ink-3 tabular-nums">
                            {d.meta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
          </div>
        );
      })}
    </div>
  );
}
