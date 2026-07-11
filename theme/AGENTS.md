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
- `styles/tokens.scss`: sole MD + `--lgc-*` token source
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

### Priority: Uno first, SCSS second

**Authored UI = UnoCSS Wind4 + attributify. SCSS/CSS is auxiliary — do not grow SCSS when utilities cover it.**

- Prefer: utilities on the element; `$token` vs CSS vars; short multi-use `@apply` classes
- Avoid: Uno `shortcuts` / theme color·spacing scales; parallel one-off scales; huge `@apply` walls; single-use rules left as named classes

**Class policy**

1. Single-use: utilities on element (attributify + `class`); **drop classname + CSS rule**
2. Multi-use / state / transition: keep class; `@apply '…'` (quote `$` / `:` under SCSS); residual only for non-utility bits
3. Reusable `@apply` must stay under Prettier `printWidth` 88 — split rules/children/residual props
4. Global shared → `styles/*`; component residual → component `<style>` (plain CSS fine if only `@apply`)

**Residual SCSS/CSS only when hard:** multi-layer gradient/shadow, keyframes, blur stacks, bleed, viewport clamps, local calc owners, unavoidable trees. Prefer owner styles / fallthrough / props / `[&_.child]:…` / `has-[…]` over casual `:deep`. Hard values can still be CSS vars + `$` in Uno instead of a full SCSS block.

### Tooling

- Attributify same-prefix groups (`flex`/`text`/`bg`/`p`/`rounded`…); leftovers in `class`; `un-` if attr conflicts with DOM/Vue prop
- Tokens in `styles/tokens.scss`; call with `$token` (`bg-$md-sys-color-surface`, `p-$lgc-space-lg`)
- Icons/safelist only in `valaxy.config.ts` (no standalone Uno config). Material Symbols Rounded primary; Iconify config icons must be safelisted/collections-loaded
- Fonts: `styles/fonts.ts`, `assets/fonts/`, `node/font.ts`

### Tokens

- Prefix `--lgc-*`; sole defs in `styles/tokens.scss`
- **Unify:** radius, type/font size, elevation/shadow, icon size — no parallel scales
- Layout chrome may stay bare px (landing pads, dense gaps, cover insets, date badges)
- Space `--lgc-space-*` for rhythm; one-offs need not join. Radius: role tokens (`--lgc-radius-control`, …)
- Prefer `$lgc-*` / `$md-sys-*`; residual may `var(--lgc-*)`; component APIs may `var(--…)`
- No one-off CSS var for a single use unless clear API or calc owner
- JS: semantic `is-*` classes only — **no** color utilities built in script strings

### Calc

- **No `calc(...)` in Uno `[]` or long template class strings**
- Own a local custom prop on the component/shared class, then `$` / `var(--…)`: e.g. `--content-pad-top: calc(...)` → `p-t="$content-pad-top"`
- Prefer component-local calc vars over dumping formulas into `tokens.scss`

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

- Update this file + root `../AGENTS.md` when structure/config/design direction changes
- Demo build; confirm Iconify classes in CSS; check desktop + mobile
- If drifting from M3 Expressive, re-check refs above
