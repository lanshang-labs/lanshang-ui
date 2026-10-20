// Extracted from Beautiful UI LoadingState.tsx (MIT). Only mounted during real pending work; no demo timer.
export type LoadingLabelProps = {label:string; announce?:boolean};
export default function LoadingLabel({label,announce=true}:LoadingLabelProps) {
const resolvedLabel=label;
  const labelEl = (
    <span
      className="bg-clip-text text-[13px] font-medium text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-text var(--ls-motion-loading,1600ms) linear infinite",
      }}
    >
      {resolvedLabel}
    </span>
  );
return <span role={announce?"status":undefined} className="bui bui-loading-label"><span aria-hidden="true" className="ls-pixel-loader"/>{labelEl}</span>;
}
