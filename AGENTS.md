# Repository Guidelines

Note for Claude: Check if `CLAUDE.md` is a symlink first, the tool refuse to write through symlinks.

For docs mainly for AI (like `AGENTS.md`), keep them concise and token efficient.

## Project Structure

- pnpm workspace packages are `blog`, `demo`, and `theme`; shared versions live in the `pnpm-workspace.yaml` catalog.
- `blog/`: production Valaxy site. Edit source in `pages/`, `components/`, `styles/`, `setup/`, `public/`, `site.config.ts`, and `valaxy.config.ts`.
- `theme/`: package `valaxy-theme-lgcuwukii`; read `theme/AGENTS.md` for its structure map. Theme responsive layout uses Uno breakpoints (`sm`/`md`/`lg`/`xl` from theme `valaxy.config.ts`), not free-form `@media` px queries.
- `demo/`: local theme demo that consumes `theme` through `workspace:*`; includes sample `pages/`, `components/`, `styles/`, `locales/`, and Valaxy config.
- Generated outputs include `.valaxy/`, `dist/`, feed files, `valaxy-fuse-list.json`, and `*.tsbuildinfo`; do not edit them as source.
- `temp/`: ignored scratch space; store temporary files in `temp/<sub-category>/`.

## Commands

```bash
pnpm install
pnpm lint                 # lint TypeScript, Vue, JS, and config files
pnpm lint:fix             # auto-fix lint issues
pnpm check                # type-check root, blog, demo, and theme project refs
pnpm format               # format files with Prettier
pnpm --dir blog dev       # start the main blog locally
pnpm --dir blog build     # production SSG build
pnpm --dir blog build:spa # SPA build
pnpm --dir blog serve     # preview built output
pnpm --dir blog rss       # regenerate RSS output
pnpm --dir blog sponsor   # regenerate sponsor assets
pnpm --dir demo dev       # start the theme demo locally
pnpm --dir demo build     # demo SSG build
pnpm --dir demo build:spa # demo SPA build
pnpm --dir demo serve     # preview demo output
```

Run `format`, `lint`, and `check` after code changes. `theme/` has no package scripts; validate theme work through root checks plus `blog`/`demo` builds as relevant.

## Valaxy Reference

Invoke the local `valaxy` skill before Valaxy theme/site work. If upstream reference is needed, use `temp/valaxy` as a depth-1 clone of `YunYouJun/valaxy`, check out the tag matching the installed `valaxy` package version (for example `v0.28.11`), and read its `AGENTS.md` before exploring it.
Before implementing theme features, first inspect how the default theme `valaxy-theme-yun` (it's in `temp/valaxy/packages`) handles the same behavior. Use it as a reference, not a template to copy blindly.

## Rules

### Engineering

- Prefer thoughtful refactors when tiny patches would create spaghetti code.
- Keep dependency versions centralized in the workspace catalog unless a package truly needs an exception.
- If formatter output conflicts with an ESLint style rule, keep the formatter result and disable the conflicting ESLint rule in `eslint.config.mjs`.
- For M3 loading indicator work, read `theme/utils/m3-loading-indicator/NOTE.md` before editing; official AndroidX/Flutter source is the fact standard, not old staged diffs.
- When project structure, theme structure, or design rules change, update `AGENTS.md` and related docs such as `theme/AGENTS.md` in the same change.

### Styling And UI

- For theme structure and design direction, read `theme/AGENTS.md` before reshaping landing, post feed, navigation, search, or Material 3 Expressive styling.
- Styling: **UnoCSS Wind4 + attributify** for authored UI. Write Tailwind-compatible utilities; group same-prefix utilities with attributify; put leftovers in `class`.
- Do **not** define Uno `shortcuts` or theme color/spacing scales. Reference CSS variables with `$token` (`p-$lgc-space-lg`, `bg-$md-sys-color-surface`). Token definitions stay in `theme/styles/tokens.scss`.
- Shared multi-use classes use CSS + `@apply '…'` (quote when using `$` or `:` variants). Single-use rules inline onto the element and delete the CSS rule.
- Responsive: use `sm:`/`md:`/`lg:`/`xl:` and **`max-sm:`/`max-md:`** from theme Uno breakpoints (Wind4). **`min-sm:` is unsupported** — use `sm:` for min-width. Prefer Uno variants over free-form layout `@media`. Root token tweaks may use `@screen sm`.
- **Numeric tokens to unify:** radius, type/font size, elevation/shadow, icon size. Layout chrome may stay bare px. Multi-token layout **`calc` belongs in residual CSS as a local custom property**, not in template attributify. JS must not build color utilities. See `theme/AGENTS.md`.
- Pitfalls: `text-$token` is **color**; font-size is `text-size-$token` / `font-size-$token`. `border-$token` is border-color; width is `border-width-$token`. SCSS + `@apply` with `$` must be quoted.
- Avoid casual scoped `:deep`. Prefer owner styles, class fallthrough, props, or Uno `[&_.child]:…` / `has-[.child:hover]:…`. Reserve `:deep` for cases that truly cannot own the node.
- Complex non-utility CSS (multi-layer gradients, keyframes, `:deep` trees) may stay as raw CSS on the class.
- Keep Uno icons/safelist wiring in theme `valaxy.config.ts`; no standalone Uno config files.
- UI states should have clear layering: base, hover/focus, and active/selected styles must be distinct, with active rules ordered after hover when they overlap.
- Prefer shape feedback: controls may be rounder at rest and should use smaller rounded-rectangle radii on hover/active.
- For expanding/collapsing controls, keep icon anchors, padding, and layout stable; animate container/text size or opacity instead of changing gap/padding mid-transition.
- Keep icon size and padding consistent within a control group; prefer inheriting button font size with `1em` over local px/rem guesses.

### Configuration

- Theme defaults should stay minimal behavior defaults. Put site-owned content such as title, author, avatar, social links, and long example lists in `site.config.ts` or demos, not theme defaults.
- Theme config types live under `theme/types/`; defaults and Valaxy theme integration live under `theme/node/`.

### Tools And Files

- Do not call Chrome DevTools MCP tools in parallel.
- Store temporary files into the `temp/<sub-category>` folder in current project root. But if a skill guide you to use another location, follow it.

## Gotchas

ATTENTION: If you encounter a pitfall that might be reusable, you MUST RECORD IT BELOW AS EARLY AS POSSIBLE.

### PowerShell

- PowerShell `Copy-Item -LiteralPath` does not expand wildcards like `*.ttf`; use `-Path` or enumerate with `Get-ChildItem`.
- PowerShell `Start-Process` cannot redirect stdout and stderr to the same file; use separate log files.

### Styling

- Sass `@extend` cannot cross Vue scoped style / `@use` module boundaries reliably; prefer `@apply` shared classes or duplicate small declarations.
- Under `lang="scss"`, always quote `@apply '…$token…'` so Sass does not treat `$token` as a Sass variable.
- Uno `@apply` may leave multi-property `transition-[…,max-inline-size,…]` untransformed (raw `@apply` in dist CSS / lightningcss warning). Use residual `transition-property: …` for lists that include `max-inline-size` (or other props that fail transform); keep `duration-`/`ease-` as `@apply`.
- **Never put Uno attributify `text="…"` on `<a>`, `AppLink`, or `RouterLink`.** `HTMLAnchorElement` has a legacy `.text` DOM property (alias of `textContent`). Vue sets it as a prop and **replaces all children** with the attribute string (e.g. social icons become literal `size-$lgc-icon-font-sm`, titles become `inherit hover:…`). Put color/size on a child span via `class`/`text=`, or use residual CSS / `class="text-…"`.
- **Never use bare HTML `hidden` as an Uno hide utility.** Vue emits the boolean `hidden` attribute; UA CSS is `[hidden] { display: none !important }`, so `max-md="grid"` / `md="block"` cannot override it. Use `class="hidden max-md:grid"` (or residual `@apply 'hidden max-md:grid'`), not a lone `hidden` attribute.
- Parent scoped CSS does **not** match non-root nodes inside child components. Header mobile hide for action buttons must live in `LgcHeaderActions` (or use `:deep`), not only in `LgcHeader`.
- **Do not set a CSS custom property to itself** (e.g. inline `--lgc-header-link-max-width: var(--lgc-header-link-max-width)` as a “default”). Self-reference is invalid at computed-value time; dependents like `--lgc-header-link-open-size` become empty and header-link expand width stops animating. Omit the inline override so `:root` token applies, or set a concrete value (`11rem` / `176px`).
- **Wind4 `translate`/`scale` ≠ `transform`:** Uno `hover:-translate-y-*` / `active:scale-*` set the individual `translate` / `scale` properties. Suppressing with `transform: none` does **not** cancel them (post-card whole-surface lift bug). Prefer residual classic `transform: translateY/scale(...)` for shared motion that other rules must override, or also reset `translate`/`scale`.

### Valaxy

- In this pnpm workspace, Valaxy/UnoCSS may not auto-resolve `@iconify-json/*` installed only through a local theme package. Theme icons should provide `unocssPresets.icons.collections` loaders in the theme `valaxy.config.ts`, alongside `unocss.safelist`.
- Valaxy CLI `valaxy` does not accept Vite-style `--host` / `--port` args directly; use config/default port or the supported Valaxy CLI options.
- In Valaxy SSG, `Teleport to="body"` rendered during SSR can break hydration and remove `#app`, causing a blank page; wrap body-level teleports in `ClientOnly` or use a stable in-app target.
- Valaxy post excerpts with `excerpt_type: html` may contain Vue component placeholders such as `<VT ... />`; render them through `ValaxyDynamicComponent` instead of raw `v-html` to avoid browser HTML normalization causing hydration mismatches.
- Keep theme shell components such as `components/layout.vue` free of `RouterView`; global page transition timing belongs in the `ValaxyApp.vue` override, but visual opacity/transform should target `.lgc-page-surface` content areas instead of the whole route root.
- Valaxy/unplugin-vue-components auto-imports components from **static tags** in templates. Do not resolve theme components via `:is="'LgcPostCoverFrame'"` (string name only); the import never runs and the cover/header frame will not mount. Use a static tag, or pass the real component object after an explicit import.
- To debug production hydration mismatches, temporarily set `vite.define.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` to `'true'` so Vue logs the exact mismatched node; remove it after diagnosis.
- In this pnpm workspace, `vue-tsc` may type-check Valaxy client files under `node_modules` via generated `.valaxy/components.d.ts` and Valaxy's own `index.d.ts`, causing dependency-side virtual module / `@ts-expect-error` noise. Treat this as a known upstream/package-resolution issue; do not solve it with project-local `valaxy` type facades or `paths` hacks.
- `.valaxy` generated route/type files include headers recommending commit; keep their updates when generated by Valaxy commands instead of reverting them as noise.
- `temp/valaxy` is useful as an upstream reference clone, but it must stay excluded from TypeScript checks; otherwise `pnpm check` will scan upstream demos/tests and fail on missing upstream-only dependencies.

## Commit

Use English conventional commit messages:

```text
type(optional scope): description

optional body

optional footer(s)
```
