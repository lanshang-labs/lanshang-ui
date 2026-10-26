# Dock lab

Retained local experiment. The formal Dock component is published separately in 0.2.12 through @lanshang-labs/ui/dock. Reference: https://21st.dev/@ibelick/components/dock and https://github.com/ibelick/motion-primitives.

Pinned source commit: `120f64f6ca60348e251f929e9c81f11ccbe45eda`. Original files and SHA-256 hashes are in `upstream/`; the unchanged MIT license credits copyright (c) 2024 ibelick.

`Dock.tsx` adapts the upstream motion value distance transform and spring. Differences: native buttons, scoped token CSS, labels and selection, keyboard focus navigation, compact/container-aware sizing, pointer type guard, and reduced motion. No Tailwind runtime or second React/AntD provider is required. The formal Dock entry uses Motion as an optional peer; this lab reuses that entry. Preview: `http://127.0.0.1:5177/#/labs/dock`.


Validation (2026-10-25): 12 targeted tests across dock-lab, docs-navigation and site-self-hosting; example typecheck and docs Vite build passed. License-bundle import and unchanged source hashes verified. Browser evidence in `../../doc/review/evidence/dock-lab-2026-10-25`: desktop mouse magnification / keyboard selection, dark and 390px, dynamic reduced-motion fallback (08), final normal light viewport (09). 04/06 are retained draft issue observations, superseded by 05/08. No publish or public exports changed.


2026-10-25 promotion: the audited implementation is now maintained in src/DockNavigation.tsx and src/dock.css, exported through the optional /dock entry. The lab consumes dist/dock.js. Original experiment files, upstream snapshots and audit evidence remain for comparison. Motion is now an optional peer; this is formal source integration, not a version release. See ../../doc/dock.md.
