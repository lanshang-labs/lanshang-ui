// Canonical semantic tokens. AntD and source-adapted Beautiful UI consume these values.
export type ThemeMode = "light" | "dark";
export const foundations = {
  font: '"Inter Variable",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif',
  mono: 'ui-monospace,SFMono-Regular,monospace',
  fontSize: 13, controlHeight: 28, radius: 8, controlRadius: 6,
  spacing: {xs:4, sm:8, md:12, lg:16, xl:24},
  table: {compactPadding:6, comfortablePadding:10, horizontalPadding:10},
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
    "canvas": "#f7f8fa",
    "error-text": "#bc5050", "error-bg":"#fbefef",
    "surface": "#ffffff",
    "raised": "#f0f2f5",
    "selected": "#e6e9ee",
    "line": "#e0e3e8",
    "line-strong": "#cbd0d8",
    "text": "#25282e",
    "secondary": "#535b67",
    "muted": "#707784",
    "accent": "#3978c9",
    "info-bg": "#eaf1fa",
    "warning-bg": "#fcf7ec",
    "warning-line": "#e9dcc2",
    "warning-text": "#906a2d",
    "success-bg": "#eff7f2",
    "success-line": "#d5e6dd",
    "success-text": "#398665"
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
