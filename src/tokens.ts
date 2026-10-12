// Canonical semantic tokens. AntD and source-adapted Beautiful UI consume these values.
export type ThemeMode = "light" | "dark";
export const foundations = {
  font: '"Inter Variable",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif',
  mono: 'ui-monospace,SFMono-Regular,monospace',
  fontSize: 13, controlHeight: 28, radius: 8, controlRadius: 6,
  spacing: {xs:4, sm:8, md:12, lg:16, xl:24},
  table: {compactPadding:4, comfortablePadding:10, horizontalPadding:10},
};
export const palettes = {
  "dark": {
    "canvas": "#171819",
    "error-text": "#e48b8b", "error-bg":"#352628",
    "surface": "#1e1f21",
    "raised": "#242527",
    "selected": "#2b2d30",
    "line": "#323438",
    "line-strong": "#43474f",
    "text": "#e5e5e7",
    "secondary": "#b3b8c2",
    "muted": "#90959f",
    "accent": "#8db9f8",
    "info-bg": "#252b32",
    "warning-bg": "#2a2823",
    "warning-line": "#454035",
    "warning-text": "#d2b277",
    "success-bg": "#242a27",
    "success-line": "#343d39",
    "success-text": "#8cbba1"
  },
  "light": {
    "canvas": "#fafafa",
    "error-text": "#d43e49", "error-bg":"#fbefef",
    "surface": "#ffffff",
    "raised": "#f2f2f3",
    "selected": "#eaeaec",
    "line": "#ededf0",
    "line-strong": "#d9d9df",
    "text": "#202124",
    "secondary": "#62646b",
    "muted": "#777981",
    "accent": "#0085ff",
    "info-bg": "#edf6ff",
    "warning-bg": "#fcf7ec",
    "warning-line": "#e9dcc2",
    "warning-text": "#906a2d",
    "success-bg": "#eaf7ef",
    "success-line": "#c7e9d4",
    "success-text": "#168449"
  }
} as const;
export function themeVariables(mode: ThemeMode): Record<string,string> {
  return {
    ...Object.fromEntries(Object.entries(palettes[mode]).map(([key,value])=>[`--ui-${key}`,value])),
    "--ds-font":foundations.font,"--ds-mono":foundations.mono,
    "--ds-radius":`${foundations.radius}px`,
    ...Object.fromEntries(Object.entries(foundations.spacing).map(([key,value])=>[`--ds-space-${key}`,`${value}px`])),
  };
}
