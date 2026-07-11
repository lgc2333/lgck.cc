# Theme Guidelines

AI guide for `valaxy-theme-lgcuwukii`. Follow root `../AGENTS.md` first; this file owns structure, design direction, and full styling policy. Keep this doc concise.

## References

If an M3 Expressive decision is unclear, check official refs before implementing (not memory / old theme choices).

- [M3](https://m3.material.io/) · [Expressive](https://m3.material.io/blog/building-with-m3-expressive) · [research](https://design.google/library/expressive-material-design-google-research)
- [styles](https://m3.material.io/styles) · [color](https://m3.material.io/styles/color/overview) · [elevation](https://m3.material.io/styles/elevation/overview) · [motion](https://m3.material.io/styles/motion/overview)
- Search: `Material 3 Expressive official guidelines`, `color shape motion`, `surface container tonal elevation`, `state layer hover pressed focus`
- Loading indicator: read `utils/m3-loading-indicator/NOTE.md` first

## Structure

- `valaxy.config.ts`: `defineTheme()` — defaults, Vite plugins, fonts, Uno safelist/icons
- `App.vue`: theme shell (`LgcLoading`)
- `client/`: user-facing exports; `node/`: defaults, font plugin, loading bootstrap, icon safelist
- `types/index.ts`: public theme config + Valaxy augmentation (`PostFrontMatter`, `DefaultTheme`, `*.ttf`)
- `components/`: auto-registered; `Lgc*` = theme UI; `ValaxyApp` / `ValaxyMain` / `layout` override slots
- `layouts/`: default, home, post, 404
- `composables/`: config, header, language motion, search
- `utils/`: locale, post, routes, repo URLs, search text, M3 loading
- `styles/`: global SCSS + tokens (`index.ts` → fonts + `index.scss`)
- `assets/fonts/`, `locales/`, `pages/` (theme routes)

## Direction

Valaxy blog: landing home, floating header, unified search, post feed/layouts, footer, M3 loading. Visual: **M3 Expressive × soft blue character site**.

- Blue primary; soft blue/white, cookie-brown + ribbon-pink accents, rounded shapes, light dots, gentle motion
- Filled tonal surfaces over outlines/shadows; reading surfaces calmer than landing
- Works without bundled character images

## Surface Map

- `ValaxyApp.vue`: route transition timing; `.lgc-page-surface` animates
- `LgcLandingHome.vue`: first viewport + optional posts
- Header: `LgcHeader` / `LgcHeaderActions` / `LgcHeaderDrawer` / `LgcHeaderLink`
- Search: `LgcUnifiedSearch` + `composables/search*.ts` (local/fuse/Algolia); field/preview/panel/results own display
- `ValaxyMain.vue`: post shell — `main-header` full `layout-inner` width; body/nav/comment in `.lgc-main-reading` (`--lgc-container-reading`). Pieces: `LgcPostArticleHeader/Nav`, `LgcPostCoverFrame`, `LgcPostMetaChips`, `LgcPostFeed*`, pagination
- Loading: `LgcLoading*` + `utils/m3-loading-indicator/`
- `utils/pagination.ts`, `utils/post.ts` (dates/locale)
- `styles/base.scss`: sole MD + `--lgc-*` token source (+ html/body base)
- Breakpoints (`valaxy.config.ts`): sm 600 / md 840 / lg 1200 / xl 1600

## Landing

- Full-viewport surface; floating topbar, rounded icon buttons, state layers
- Optical center only — no vertical center line
- Soft diffuse bg; no solid blur orbs / heavy gradients
- Dock = primary interaction; socials icon-only and quiet
- `landing.mode`: `full` | `full-only` | `compact` | `disabled`

## Header And Search

- Stable icon anchors/size/padding across rest/hover/active/drawer/mobile
- Links: icon-only / hover-expand / always-expand; keep active expand + path rewrite (`types/index.ts`)
- Search: keyboard nav, selected-index per surface, mobile panel intact
- Results: title, path/section, optional provider, quiet highlights
- Icon buttons for compact actions; labels only when width is intentional

## Post Surfaces

- Feed: `card` | `gradient` masks; L/R placement on wide; more expressive than articles
- Articles: calm, readable, stable type
- Chips / dates / nav / pagination = one control family
- Covers stay legible on mobile and image-heavy posts

## Avatar

- No CSS-fake avatar. Use `siteConfig.author.avatar` or hide entirely
- Title from `siteConfig.title`; author fields in `site.config.ts`
- No decorative badges unless real configurable feature

## Style Constraints

### ALWAYS! ALWAYS!! USE UNOCSS FIRST

**ALWAYS! ALWAYS!! USE UNOCSS FIRST.** 该抽变量就抽变量（keep-set → `--lgc-*`；calc/API → 局部 `--foo`），再用 `$token` / `var(--…)`。实在实在实在实在不行才 residual SCSS。Wind4 能写的布局/颜色/字号/间距/圆角硬写 SCSS → **挨鞭子。** 旁边已有 residual 也不许借机堆普通属性。

**顺序（不许跳）：** ① 有 utility → 写元素（attributify 同前缀，其余 `class`）→ 停。② 要共享/calc → 先抽 token/局部 var，再 Uno。③ 多处/hover·active 级联 → class + `@apply '…'`（SCSS 里带 `$`/`:` 必须引号）。④ 仅 allowlist 残差 → 写 raw + 一行 why 注释。⑤ 还想写 SCSS？重读本节。

**挨鞭子：** 为 `display/margin/padding/gap/flex/grid`/实色 token/`font-size`/`border-radius`/尺寸开 SCSS；不抽变量乱塞 magic；单次用只包一层 `@apply` 的 class；Uno `shortcuts`/主题色间距 scale；JS 拼颜色 utility（只用语义 `is-*`）；one-off 节点堆 `@apply` 墙。

**Class：** 单次 → 元素上写完，删 class+规则。多状态 → class + `@apply`，残差只留硬部分。`@apply` 遵守 printWidth 88。全局 → `styles/shared/*`；组件残差 → 组件 `<style>`。`<Transition name>` 进出场只能 CSS。

**残差 allowlist（仍先抽 var）：** 多层渐变/阴影；keyframes；无 utility 的 `color-mix`/scrim%；bleed/非对称圆角/视口 clamp；局部 calc owner；覆盖 Wind4 `translate`/`scale` 的经典 `transform`；Uno 弄坏的多属性 transition（如含 `max-inline-size`）；必须挂选择器的伪类/父态/`html.dark`/`:has`/Transition name。少用 `:deep`，优先 owner / fallthrough / props / `[&_.child]` / `has-[]`。

### Tooling

- Attributify same-prefix groups (`flex`/`text`/`bg`/`p`/`rounded`…); leftovers in `class`; `un-` if attr conflicts with DOM/Vue prop
- Tokens in `styles/base.scss`; call with `$token` (`bg-$md-sys-color-surface`, `p-$lgc-space-lg`)
- Icons/safelist only in `valaxy.config.ts` (no standalone Uno config). Material Symbols Rounded primary; Iconify config icons must be safelisted/collections-loaded
- Fonts: `styles/fonts.ts`, `assets/fonts/`, `node/font.ts`

### Tokens

- Prefix `--lgc-*`; sole defs in `styles/base.scss`
- **Unify:** radius, type/font size, elevation/shadow, icon size — no parallel scales
- Layout chrome may stay bare px (landing pads, dense gaps, cover insets, date badges)
- Space `--lgc-space-*` for rhythm; one-offs need not join. Radius: role tokens (`--lgc-radius-control`, …)
- Prefer `$lgc-*` / `$md-sys-*`; residual may `var(--lgc-*)`; component APIs may `var(--…)`
- No one-off CSS var for a single use unless clear API or calc owner
- JS: semantic `is-*` classes only — **no** color utilities built in script strings

### Calc

- **No `calc(...)` in Uno `[]` or long template class strings**
- Own a local custom prop on the component/shared class, then `$` / `var(--…)`: e.g. `--content-pad-top: calc(...)` → `p-t="$content-pad-top"`
- Prefer component-local calc vars over dumping formulas into `base.scss`

### Responsive (Wind4)

Breakpoints only from theme config (sm/md/lg/xl above). Prefer Uno variants over free-form layout `@media`.

- Works: `sm:`/`md:`/`lg:`/`xl:` (min), `max-sm:`/`max-md:` (max), wind4 `lt-sm`/`at-sm`
- Broken: `min-sm:` / `min-md:` (empty) — use plain `sm:` / `md:`
- Token overrides: `@screen sm`. Matching max-sm: `@media (width <= 599.9px)` ok

### Utility name pitfalls

- `text-$token` = color; size = `text-size-$token` / `font-size-$token`
- `border-$token` = border-color; width = `border-width-$token`
- Quote SCSS `@apply` with `$` or `:`: `@apply 'hover:bg-$md-sys-color-surface-container'`
- Vue/Uno gotchas (anchor `text=`, bare `hidden`, CSS var self-ref, Wind4 `translate`≠`transform`) → root `../AGENTS.md` Gotchas only

### Material Feel

- No default outlines; state layers + tonal containers. No default shadows on landing/search/post cards unless strong reason
- Shape: pills for selected icons/scroll hint; large rounded post cards; smaller radius on hover/active
- States distinct (base / hover·focus / active); active after hover when overlapping
- Expand/collapse: stable icon anchors/padding; animate size/opacity, not gap/padding mid-transition
- Icon size/padding consistent in a group; prefer `1em` from button font
- Motion subtle; respect `prefers-reduced-motion`
- Text fits mobile; no viewport-scaled type except landing title

## Theme Config

- Defaults `node/config.ts` = minimal behavior only
- Types in `types/` before wiring options
- Site content (title, author, avatar, nav, landing links, socials) → `site.config.ts` / `themeConfig` / demos, not hard-coded defaults

## Before Finalizing

- **Style self-check:** 新/改的 `<style>` 是否只剩 allowlist 残差？该抽的 var 抽了？单次 `@apply` 已内联？没有为普通布局硬写 SCSS（否则挨鞭子）？
- Update this file + root `../AGENTS.md` when structure/config/design direction changes
- Demo build; confirm Iconify classes in CSS; check desktop + mobile
- If drifting from M3 Expressive, re-check refs above
