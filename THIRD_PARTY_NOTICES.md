# Third-party notices

Beautiful UI adaptations retain the MIT license in src/beautiful-ui/LICENSE and dist/beautiful-ui/LICENSE. Original snapshots and provenance are in src/beautiful-ui/upstream and README.md. Iconoir is MIT licensed and consumed as a dependency. Ant Design and React are peer dependencies. This repository does not relicense third-party work.

SourceCodeBlock uses Prism 1.30.0 (MIT) for tokenization, distributed as a runtime dependency. Its license is included in the prismjs package.

## Default interface fonts

Inter and Noto Sans SC variable fonts are self-hosted via Fontsource. Both retain SIL Open Font License 1.1 notices. The unchanged font files and full licenses are included in dist/fonts/{inter,noto-sans-sc}; documentation also includes them in licenses.txt. Relative URLs and unicode-range subsets allow consumers to serve the default fonts from their own application origin.

## Markdown rendering

Markdown consumes react-markdown, remark-gfm and remark-breaks (MIT) as runtime dependencies. Its math module bundles remark-math, rehype-katex and KaTeX 0.19.0 with their dependencies, keeping the verified engine independent of consumer dependency resolution. Full bundled notices, version inventory, unchanged KaTeX CSS, local fonts and license are included in dist/math. The documentation license bundle includes these projects.

## Optional statistical charts

The optional @lanshang-labs/ui/charts entry consumes @ant-design/plots (MIT), based on AntV G2 and its upstream dependencies. Chart consumers supply this optional peer; the base UI entry does not import it. Upstream licenses remain in their packages. Tremor (https://www.tremor.so/, Apache-2.0 for its open-source repository) was evaluated as a design reference for compact dashboards; no Tremor source, templates or Recharts code is copied or bundled by this implementation.

## Local lab: ShadcnStore dashboard template

The local-only `experiments/shadcn-dashboard` lab derives from ShadcnStore's MIT-licensed `shadcn-dashboard-landing-template`, commit `65fc11224e96d56a62e224a58f7ed590aea5ac24`, listed on 21st.dev as Shadcn Dashboard and Landing. Copyright (c) 2025 ShadcnStore. The full, unchanged license is retained in `experiments/shadcn-dashboard/LICENSE.md`; byte-for-byte source snapshots and hashes are retained in `upstream/` and `provenance.json`. The adapted React 18 example retains the template's Tailwind CSS, Radix UI, Lucide and Recharts dependencies with their package licenses. No third-party avatar images are copied. This lab is isolated from the published UI package and is not a new public export.


## Motion Primitives Dock

The `Dock` component and retained `experiments/dock` lab derive from ibelick's Motion Primitives Dock (MIT), discovered on https://21st.dev/@ibelick/components/dock. Copyright (c) 2024 ibelick. Upstream commit `120f64f6ca60348e251f929e9c81f11ccbe45eda`, unchanged source snapshots, hashes and the full license are retained in `experiments/dock/upstream`. The adaptation retains the distance transform / spring animation and adds native button semantics, scoped theme styles and a compact/reduced-motion fallback. Dock is exported through the optional `/dock` entry with Motion 14.6.0 as an optional peer, without importing Motion from the base entry. The complete original license is shipped in `dist/licenses/motion-primitives/LICENSE`. The retained lab uses Lucide as a development dependency; public examples use Lanshang icons. Documentation includes upstream and runtime dependency licenses. The new source entry is not yet published.
