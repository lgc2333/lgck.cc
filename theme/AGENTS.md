# Theme Guidelines

Concise AI guide for `valaxy-theme-lgcuwukii`. Follow root `../AGENTS.md` first; this file owns theme structure and design direction.

## References

If a Material 3 Expressive decision is unclear, search and review official references before implementing. Do this before relying on memory or copying older theme decisions.

Recommended starting points:

- [Material Design 3](https://m3.material.io/)
- [Material 3 Expressive announcement](https://m3.material.io/blog/building-with-m3-expressive)
- [Expressive Material Design research](https://design.google/library/expressive-material-design-google-research)
- [Material 3 styles](https://m3.material.io/styles)
- [Material 3 color](https://m3.material.io/styles/color/overview)
- [Material 3 elevation](https://m3.material.io/styles/elevation/overview)
- [Material 3 motion](https://m3.material.io/styles/motion/overview)

Useful search terms:

- `Material 3 Expressive official guidelines`
- `Material 3 Expressive color shape motion`
- `Material 3 surface container tonal elevation`
- `Material 3 state layer hover pressed focus`

Read `utils/m3-loading-indicator/NOTE.md` before editing the loading indicator.

## Structure

- `valaxy.config.ts`: `defineTheme()` entry; wires defaults, Vite plugins, font plugin, UnoCSS safelist, and icon collections.
- `App.vue`: theme-level app shell; currently mounts `LgcLoading`.
- `client/`: client exports consumed by Valaxy users; currently re-exports theme composables.
- `node/`: theme defaults and build-time integration: config defaults, HarmonyOS font plugin, loading bootstrap plugin, and dynamic icon safelist generation.
- `types/`: public theme config and Valaxy module augmentation. Keep configurable behavior typed here before using it in `node/` or components.
- `components/`: auto-registered Vue components. `Lgc*` files own theme UI; Valaxy-compatible names such as `ValaxyApp.vue`, `ValaxyMain.vue`, or `layout.vue` override framework/theme slots.
- `layouts/`: Valaxy layouts for default, home, post, and 404 routes.
- `composables/`: runtime state and adapters, including theme config, header state, language icon motion, and unified search helpers.
- `utils/`: pure helpers for locale, post, routes, repository URLs, search text, and the Material 3 loading indicator.
- `styles/`: global SCSS entry, shared layers, helper mixins, and global search styles. `styles/index.ts` imports fonts and `index.scss`.
- `assets/`: bundled static assets, especially HarmonyOS font files.
- `locales/`: theme i18n messages.
- `pages/`: theme-provided Valaxy pages/routes such as paginated home.

## Direction

The theme is a Valaxy blog theme with a configurable landing home, floating header, unified search, post feed, post layouts, footer, and Material 3 loading indicator. Visual direction: **Material 3 Expressive x soft blue character site**.

- Blue is the primary color.
- Character impression comes from soft blue and white surfaces, cookie-brown and ribbon-pink accents, rounded shapes, light dot texture, and gentle expressive motion.
- Prefer filled tonal surfaces over outlines and shadows.
- Keep article, post, and search reading surfaces calmer and denser than the landing screen.
- The theme must work without bundled character images.

## Surface Map

- `ValaxyApp.vue` owns global route transition timing and keeps framework theme/user app mounting behavior; `.lgc-page-surface` marks the content areas that visually animate.
- `LgcLandingHome.vue` owns the first viewport and optional posts section.
- `LgcHeader.vue`, `LgcHeaderActions.vue`, `LgcHeaderDrawer.vue`, and `LgcHeaderLink.vue` own navigation, i18n/dark/search actions, and responsive drawer behavior.
- `LgcUnifiedSearch.vue` coordinates local/fuse/Algolia search; `composables/search*.ts` own provider adapters, layer state, and keyboard behavior; field, preview, `LgcUnifiedSearchPanel` (`variant: drawer | mobile`), result button, and result list components own display states.
- `ValaxyMain.vue` owns the post shell: `main-header` (article cover/title) is full width of `layout-inner` so covers can span `--lgc-container-wide` on ultra-wide screens; body/nav/comment live in `.lgc-main-reading` at `--lgc-container-reading`. `LgcPostArticleHeader.vue`, `LgcPostArticleNav.vue`, `LgcPostCoverFrame.vue`, `LgcPostMetaChips.vue`, `LgcPostFeed.vue`, `LgcPostFeedCard.vue`, `LgcPostFeedPlainCard.vue`, `LgcPostFeedCoverMask.vue` (`mask: card | gradient`), and pagination components own post browsing and reading pieces.
- `LgcLoading.vue` and `LgcLoadingIndicator.vue` use `utils/m3-loading-indicator/`; read its `NOTE.md` before changing that implementation.
- `utils/pagination.ts` owns post-feed page windowing and page path helpers; `utils/post.ts` owns post date formatting (`formatPostDate`, `formatPostDateParts`, `shouldShowPostUpdated`) and locale/list normalizers.
- `theme/styles/index.scss` composes token, base, utility, search, and markdown styles.
- `theme/styles/tokens.scss` stores shared Material color roles and reusable lgc typography, space, measure, icon, blur, and motion tokens.
- `theme/styles/helpers.scss` stores SCSS-only breakpoints and shared layout mixins (`compact-up/down`, `nav-up/down`, `between-*`); always use these for `@media` because CSS custom properties cannot drive media queries. `--lgc-breakpoint-*` in tokens is documentation/non-media only.

## Landing Rules

- Use one full viewport landing surface.
- Topbar floats over the landing and uses rounded icon buttons with Material state layers.
- Center content is optically centered. Do not reintroduce a vertical center line.
- Background atmosphere should be diffuse and soft. Avoid solid-center blur circles, visible decorative orbs, and heavy gradients.
- Dock links are the main interaction area and should be stronger than social icons.
- Social icons stay icon-only and visually quiet.
- `landing.mode` controls the home shape: `full` is one viewport with posts below, `full-only` is one viewport with footer at the bottom and no posts, `compact` shows posts below a shorter landing, and `disabled` uses the plain home layout.

## Header And Search

- Header controls should keep stable icon anchors, dimensions, and padding across rest, hover, active, drawer, and mobile states.
- Header links can be icon-only, hover-expanded, or always expanded. Preserve active-link expansion and path rewrite behavior from `types/header.d.ts`.
- Search supports local, fuse, and Algolia providers. Keep keyboard navigation, selected-index ownership per surface, and mobile panel behavior intact.
- Search result surfaces should be scan-friendly: clear title, path/section, provider context when useful, and highlighted terms without loud decoration.
- Use icon buttons for compact actions; text labels belong where the control's width is intentionally designed for them.

## Post Surfaces

- Post feed cards may use `card` or `gradient` cover content masks and left/right placement on wider screens.
- Feed cards can be more expressive than article pages; article pages should stay calm, readable, and typographically stable.
- Metadata chips, date/status icons, post nav, and pagination should feel like one control family: consistent icon sizing, state layers, and shape feedback.
- Cover frames and masks must keep text legible on mobile and on image-heavy posts.

## Avatar

- Do not simulate an avatar with CSS.
- Use `siteConfig.author.avatar` when present.
- If `author.avatar` is empty, hide the avatar area completely.
- The landing title uses `siteConfig.title`; author-owned fields should stay in `site.config.ts` and render alongside the site title only when needed.
- Do not add decorative badges below or on top of the avatar unless they are a real configurable feature.

## Style Constraints

- Use traditional SCSS for authored theme styles.
- Component-specific SCSS belongs in the component's scoped `<style>`.
- Add global SCSS only for behavior shared across the theme.
- Do not use UnoCSS utilities, shortcuts, or `@apply` for stable UI styling.
- Keep UnoCSS limited to icon generation and required Valaxy integration in `valaxy.config.ts`; do not add standalone Uno config files.
- Do not create CSS variables for values used only once.
- Custom theme tokens use the `--lgc-*` prefix.
- Use Material Symbols Rounded as the primary icon language. Additional rounded icon sets are fine when needed.
- Iconify icons used by config must be safelisted or loaded through the theme's Uno icon collections.
- HarmonyOS font loading is theme-owned; keep font integration in `styles/fonts.ts`, `assets/fonts/`, and `node/font.ts`.

## Material Feel

- No default outlines on cards/buttons. Use state layers and tonal containers.
- No default shadows for landing controls, search surfaces, or post cards unless a component has a strong reason.
- Shape is expressive but disciplined: pills for selected icons and scroll hint, large rounded cards for posts, smaller rounded states on hover.
- Motion should be subtle shape/position feedback and must respect `prefers-reduced-motion`.
- Text must fit on mobile. Do not use viewport-scaled font sizes except for the landing title.

## Theme Config Shape

- Theme defaults live in `node/config.ts` and should stay minimal behavior defaults.
- Public config types live in `types/`; add or update types before wiring new options into components or `node/`.
- Put site-owned content such as `title`, `subtitle`, `author`, `avatar`, nav labels, landing links, and social links in `site.config.ts`, `themeConfig`, or demos, not hard-coded theme defaults.

## Before Finalizing

- Update this file and root `../AGENTS.md` when changing theme structure, config surface, or design direction.
- Build the demo site and confirm Iconify classes are emitted in the CSS.
- Verify desktop and mobile layouts.
- If the design starts drifting from M3 Expressive, pause and re-check the official references above.
