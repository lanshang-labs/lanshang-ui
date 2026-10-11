// Extracted from Beautiful UI ContextCards.tsx. MIT — see LICENSE.
import type {ReactNode} from "react";
export default function BeautifulSurface({title,extra,children,className=""}:{title:ReactNode;extra?:ReactNode;children:ReactNode;className?:string}) {
 return (
        <div
          className={`bui bui-surface overflow-hidden rounded-card bg-surface shadow-card ${className}`}
        >
          <div className="primitive-card-bar flex items-center gap-2.5 border-b border-line">
            <span className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-ink">
              <span className="truncate">{title}</span>
            </span>
            <span className="ml-auto shrink-0 text-[12px] text-ink-3 tabular-nums">{extra}</span>
          </div>
<div className="bui-surface-body">{children}</div></div>);
}
