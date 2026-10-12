import {Tag} from "antd";
import type {ReactNode} from "react";
/** Presentation only: callers own status interpretation and labels. */
export function StatusTag({tone="neutral",children}:{tone?:"neutral"|"success"|"warning"|"error"|"info";children:ReactNode}) {
 return <Tag color={tone==="neutral"?undefined:tone==="info"?"processing":tone}>{children}</Tag>;
}
