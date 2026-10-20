import {forwardRef, type ComponentRef} from "react";
import {Tag, type TagProps} from "antd";
import {tagCloseIcon} from './TagCloseIcon.js';
export type StatusTone = "neutral" | "success" | "warning" | "error" | "info";
export type StatusTagProps = Omit<TagProps, "color"> & {tone?: StatusTone};
/** Callers own labels and state mapping; tone owns the semantic color. */
export const StatusTag = forwardRef<ComponentRef<typeof Tag>, StatusTagProps>(function StatusTag({tone="neutral",closable,closeIcon,...props}, ref) {
  return <Tag {...props} closable={closable} closeIcon={tagCloseIcon(closable,closeIcon)} ref={ref} color={tone === "neutral" ? undefined : tone === "info" ? "processing" : tone} />;
});
