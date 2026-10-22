# Third-party notices

Beautiful UI adaptations retain the MIT license in src/beautiful-ui/LICENSE and dist/beautiful-ui/LICENSE. Original snapshots and provenance are in src/beautiful-ui/upstream and README.md. Iconoir is MIT licensed and consumed as a dependency. Ant Design and React are peer dependencies. This repository does not relicense third-party work.

SourceCodeBlock uses Prism 1.30.0 (MIT) for tokenization, distributed as a runtime dependency. Its license is included in the prismjs package.

## Default interface fonts

Inter and Noto Sans SC variable fonts are self-hosted via Fontsource. Both retain SIL Open Font License 1.1 notices. The unchanged font files and full licenses are included in dist/fonts/{inter,noto-sans-sc}; documentation also includes them in licenses.txt. Relative URLs and unicode-range subsets allow consumers to serve the default fonts from their own application origin.

## Markdown rendering

Markdown consumes react-markdown, remark-gfm and remark-breaks (MIT) as runtime dependencies. Its math module bundles remark-math, rehype-katex and KaTeX 0.19.0 with their dependencies, keeping the verified engine independent of consumer dependency resolution. Full bundled notices, version inventory, unchanged KaTeX CSS, local fonts and license are included in dist/math. The documentation license bundle includes these projects.

## Optional statistical charts

The optional @lanshang-labs/ui/charts entry consumes @ant-design/plots (MIT), based on AntV G2 and its upstream dependencies. Chart consumers supply this optional peer; the base UI entry does not import it. Upstream licenses remain in their packages. Tremor (https://www.tremor.so/, Apache-2.0 for its open-source repository) was evaluated as a design reference for compact dashboards; no Tremor source, templates or Recharts code is copied or bundled by this implementation.
