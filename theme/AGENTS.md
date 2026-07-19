# Theme Guidelines

AI guide for `valaxy-theme-lgcuwukii`. Follow root `../AGENTS.md` first; this file owns structure, design direction, and full styling policy. Keep this doc concise.

## References

If an M3 Expressive decision is unclear, check official refs before implementing (not memory / old theme choices).

- [M3](https://m3.material.io/) · [Expressive](https://m3.material.io/blog/building-with-m3-expressive) · [research](https://design.google/library/expressive-material-design-google-research)
- [styles](https://m3.material.io/styles) · [color](https://m3.material.io/styles/color/overview) · [elevation](https://m3.material.io/styles/elevation/overview) · [motion](https://m3.material.io/styles/motion/overview)
- Search: `Material 3 Expressive official guidelines`, `color shape motion`, `surface container tonal elevation`, `state layer hover pressed focus`
- Loading indicator: read `utils/m3-loading-indicator/NOTE.md` first

## Structure

- `valaxy.config.ts`: `defineTheme()` — defaults, focused Vite plugins, Uno safelist/icons
- `App.vue`: theme shell (`LgcLoading`)
- `client/`: user-facing exports; `node/`: defaults/material colors/safelist; `node/vite/`: Vite plugins (fonts, material colors CSS, loading bootstrap, Giscus theme/font CSS)
- `types/index.ts`: public theme config + Valaxy augmentation (`PostFrontMatter`, `DefaultTheme`, `*.ttf`)
- `components/`: auto-registered; Valaxy contract overrides `ValaxyApp` / `ValaxyMain` stay at root; shell primitives `LgcSiteShell`, `LgcPageSurface`, `LgcSideDrawer`, `LgcPrevNextNav` stay root-level; other `Lgc*` grouped by surface (`header/`, `landing/`, `floating/`, `loading/`, `search/`, `index/`, `category/`, `tag/`, `post/`, `collection/`)
- `layouts/`: default, home, post, collection(s), categories, tags, archives, 404
- `composables/`: config, header, language motion, search
- `utils/`: locale, post, routes, repo URLs, search text, M3 loading
- `styles/`: global SCSS + tokens (`index.ts` → fonts + `index.scss`); `styles/shared/*` owns cross-component recipes only (`control.scss`, `reading.scss` panel base/padding); one-off card/action chrome stays component-local; `styles/giscus/` owns Giscus iframe theme CSS
- `assets/fonts/`, `locales/`, `pages/` (theme routes)

## Direction

Valaxy blog: landing home, floating header, unified search, post feed/layouts, footer, M3 loading. Visual: **M3 Expressive × soft blue character site**.

- Blue primary; soft blue/white, brown + pink accents, rounded shapes, light dots, gentle motion
- Filled tonal surfaces over outlines/shadows; reading surfaces calmer than landing
- Works without bundled character images

## Surface Map

- `ValaxyApp.vue`: route transition timing; `LgcPageSurface` / `.lgc-page-surface` animates
- `LgcSiteShell`: site chrome only (fixed bg, header, content container, footer, floating actions); route layouts own page type and `LgcPageSurface`
- `LgcLandingHome.vue`: first viewport + optional posts
- Header: `LgcHeader` / `LgcHeaderActions` / `LgcHeaderDrawer` shell with `LgcHeaderDrawerNav` + `LgcHeaderDrawerSettings` / `LgcHeaderLink`
- Search: `LgcUnifiedSearch` + `composables/search*.ts` (local/fuse/Algolia); field/preview/panel use `LgcUnifiedSearchResultList`
- Index pages: `LgcIndexSection` owns shared section/header/container chrome for posts, categories, tags, and archives; category tree behavior/rendering lives in `LgcCategoryTree`; post timelines live in `post/timeline/`
- `ValaxyMain.vue`: post shell — `main-header` full `layout-inner` width; body/nav/comment in `.lgc-main-reading` (`--lgc-container-main`); collection pages stack collection nav + TOC in the right aside at lg and split collection left / TOC right at xl. Pieces: `LgcPostArticleHeader`, `LgcPostContentAfter/Sponsor/Aside/Outline/OutlineAction`, `LgcPostCoverFrame`, `LgcPostMetaRow`, `LgcTaxonomyChips`, `LgcPostFeed*`, `LgcPrevNextNav`, pagination
- Collections: `layouts/collections.vue` reuses `LgcPostFeed source="collections"`; `layouts/collection.vue` reuses `layouts/post.vue` with the `collection` prop; `components/collection/LgcCollection*` own collection article navigation. Feed collapsed cards use the same post-card frame. Collection nav opens from a mobile floating action drawer below lg, stacks with TOC at lg, and moves left at xl; sticky asides must stay height-limited.
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
- Post meta uses direct presenters: `LgcPostMetaRow` for article metadata and `LgcTaxonomyChips` for collection/category/tag chips; shared chip chrome lives in `styles/shared/post-meta.scss`

## Avatar

- No CSS-fake avatar. Use `siteConfig.author.avatar` or hide entirely
- Title from `siteConfig.title`; author fields in `site.config.ts`
- No decorative badges unless real configurable feature

## Style Constraints

PLEASE: Double-check the code you wrote meets the following constraints before your work is done.

### ALWAYS! ALWAYS!! USE UNOCSS ATTRIBUTIFY FIRST

- Always use UnoCSS attributify first. Extract variables when needed (keep-set → `--lgc-*`; calc/API → local `--foo`), then use `$token` / `var(--…)`. Only fall back to residual SCSS when truly unavoidable.
- Writing plain SCSS for layout/color/type/spacing/radius that Wind4 can express → YOU GET WHIPPED. Existing residual nearby is not an excuse to pile ordinary properties next to it.
- Order (DO NOT SKIP):
  1. Utility exists → put it on the element with attributify → stop.
  2. Attributify cannot express it (attr conflict, dynamic class, selector/variant shape) → use `class` on that element.
  3. Need shared/calc → extract token/local var first, then Uno `$token`.
  4. Multi-use / hover·active cascade → class + `@apply '…'` (quote in SCSS when the string contains `$` or `:`).
  5. Allowlist residual only → write raw + a one-line why comment.
  6. Still want SCSS? Re-read this section.
- YOU GET WHIPPED FOR:
  - SCSS for `display/margin/padding/gap/flex/grid` / solid color tokens / `font-size` / `border-radius` / sizing; magic values instead of extracted vars;
  - One-off classes that only wrap a single `@apply`; template `class` stuffed with static utility tokens that could be attributify;
  - Raw `var(--lgc-*)` / `var(--md-sys-*)` for normal utility-owned CSS when `$lgc-*` / `$md-sys-*` works;
  - Uno `shortcuts` / theme color spacing scales;
  - JS-built color utilities (use semantic `is-*` only); `@apply` walls on one-off nodes.
- Class:
  - One-off → write attributify on the element first; use `class` only when attributify cannot represent it, and delete the class + rule.
  - Static utilities in templates belong in attributify, not `class`; reserve `class` for semantic hooks, dynamic states, icons, or unsupported arbitrary selector shapes.
  - Multi-state → class + `@apply`, residual only for the hard parts.
  - `@apply` respects Prettier `printWidth` 88.
  - Global → `styles/shared/*`; component residual → component `<style>`. `<Transition name>` enter/leave must be CSS only.
- Residual allowlist (still EXTRACT VARS FIRST):
  - Multi-layer gradients/shadows; keyframes; `color-mix`/scrim % with no utility;
  - Bleed / asymmetric radii / viewport clamp;
  - Local calc owner;
  - Classic `transform` for press scale / hover lift when transition targets `transform`, or when overriding Wind4 `translate`/`scale`;
  - Multi-property transitions Uno breaks (e.g. with `max-inline-size`);
  - Pseudo / parent-state / `html.dark` / `:has` / Transition name that must hang on a selector.
- Prefer owner / fallthrough / props / `[&_.child]` / `has-[]` over `:deep`.

### Tooling

- Prefer attributify for all element-local utilities (`flex`/`text`/`bg`/`p`/`rounded`/`max-inline`…); move leftovers to `class` only when attributify cannot express them; use `un-` if attr conflicts with DOM/Vue prop
- Tokens in `styles/base.scss`; call with `$token` (`bg-$md-sys-color-surface`, `p-$lgc-space-lg`)
- Icons/safelist only in `valaxy.config.ts` (no standalone Uno config). Theme icon packs: `material-symbols` + `ic` only (Material family). Material Symbols Rounded primary; site-owned packs (e.g. `ri`) load in site configs, not theme. Config icons must be safelisted/collections-loaded
- Fonts: `styles/fonts.ts`, `assets/fonts/`, `node/vite/font.ts`

### Tokens

- Prefix `--lgc-*`; sole defs in `styles/base.scss`
- **Unify:** radius, type/font size, elevation/shadow, icon size — no parallel scales
- Layout chrome may stay bare px (landing pads, dense gaps, cover insets, date badges)
- Space `--lgc-space-*` for rhythm; one-offs need not join. Radius: role tokens (`--lgc-radius-control`, …)
- Prefer `$lgc-*` / `$md-sys-*`; residual may use `var(--…)` only for custom-prop definitions, calc owners, `color-mix`, component APIs, or raw properties Uno cannot express.
- No one-off CSS var for a single use unless clear API or calc owner
- JS: semantic `is-*` classes only — **no** color utilities built in script strings

### Calc

- **No `calc(...)` in Uno `[]` or long template class strings**
- Own a local custom prop on the component/shared class, then `$` / `var(--…)`: e.g. `--content-pad-top: calc(...)` → `p-t="$content-pad-top"`
- Prefer component-local calc vars over dumping formulas into `base.scss`

### Responsive (Wind4)

Breakpoints only from theme config (sm/md/lg/xl above). Use Uno/Wind4 variants or `@screen`; CSS `@media` width breakpoints are forbidden.

- Works: `sm:`/`md:`/`lg:`/`xl:` (min), `max-sm:`/`max-md:` (max), wind4 `lt-sm`/`at-sm`
- Broken: `min-sm:` / `min-md:` (empty) — use plain `sm:` / `md:`
- Token overrides: prefer mobile defaults + `@screen sm` upward overrides
- Forbidden: `@media` containing `width`, `min-width`, or `max-width` for breakpoints
- Allowed: non-width media queries such as `prefers-reduced-motion`

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
- `postFooter.sponsor.link`: site-owned sponsor page link; when set, it wins over `siteConfig.sponsor.methods`
- `giscus.useTheme`: when true, theme overwrites `valaxy-addon-giscus.options.theme` with its generated `/assets/giscus/*.css`
- `landing.links`: flat list = auto layout; nested list = explicit dock rows
- Site content (title, author, avatar, nav, landing links, socials) → `site.config.ts` / `themeConfig` / demos, not hard-coded defaults

## Before Finalizing

- Style self-check:
  - Are element-local utilities written as attributify first?
  - Is `class` used only when attributify cannot express the utility?
  - Do new/changed `<style>` blocks contain only allowlisted residual CSS?
  - Are needed vars extracted?
  - Are one-off `@apply` rules inlined?
  - Is ordinary layout SCSS gone?
- Update this file + root `../AGENTS.md` when structure/config/design direction changes
- Demo build; confirm Iconify classes in CSS; check desktop + mobile
- If drifting from M3 Expressive, re-check refs above
