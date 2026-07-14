# Repository Guidelines

Note for Claude: Check if `CLAUDE.md` is a symlink first; the tool refuses to write through symlinks.

For docs mainly for AI (like `AGENTS.md`), keep them concise and token efficient.

## Project Structure

- pnpm workspace packages are `blog`, `demo`, `theme`, and `addons/*`; shared versions live in the `pnpm-workspace.yaml` catalog.
- `addons/giscus/`: local Valaxy addon package `valaxy-addon-giscus`.
- `blog/`: production Valaxy site. Edit source in `pages/`, `components/`, `styles/`, `setup/`, `public/`, `site.config.ts`, and `valaxy.config.ts`.
- `theme/`: package `valaxy-theme-lgcuwukii`; structure, component grouping, design direction, and **full styling policy** live in `theme/AGENTS.md`.
- `demo/`: local theme demo that consumes `theme` through `workspace:*`.
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

Before implementing theme features, first inspect how the default theme `valaxy-theme-yun` (in `temp/valaxy/packages`) handles the same behavior. Use it as a reference, not a template to copy blindly.

## Rules

### Styling — ALWAYS UNO ATTRIBUTIFY FIRST

- Always use UnoCSS attributify first. Extract tokens / local CSS variables when needed, then use `$token` / `var(--…)`. Only fall back to residual SCSS when truly unavoidable.
- Writing plain SCSS for layout/color/type/spacing/radius that Wind4 can express → YOU GET WHIPPED.
- Authored UI = UnoCSS Wind4, with attributify on the element first.
- If an element cannot express a utility with attributify, then use `class`; one-off use still must not leave a class + rule.
- Multi-state: class + `@apply`; residual only for gradients/keyframes/`color-mix`/bleed/calc owner/Transition name.
- Full rules in **`theme/AGENTS.md`**.

### Engineering

- Prefer thoughtful refactors when tiny patches would create spaghetti code.
- Keep dependency versions centralized in the workspace catalog unless a package truly needs an exception.
- Full-project Prettier formatting churn is acceptable; keep formatter output instead of reverting it as noise.
- If formatter output conflicts with an ESLint style rule, keep the formatter result and disable the conflicting ESLint rule in `eslint.config.mjs`.
- For M3 loading indicator work, read `theme/utils/m3-loading-indicator/NOTE.md` before editing; official AndroidX/Flutter source is the fact standard, not old staged diffs.
- When project structure, theme structure, or design rules change, update `AGENTS.md` and related docs such as `theme/AGENTS.md` in the same change.

### Configuration

- Theme defaults should stay minimal behavior defaults. Put site-owned content (title, author, avatar, social links, long example lists) in `site.config.ts` or demos, not theme defaults.
- Theme config types live under `theme/types/`; defaults and Valaxy theme integration live under `theme/node/`.

### Tools And Files

- Do not call Chrome DevTools MCP tools in parallel.
- Store temporary files in `temp/<sub-category>/` at the project root. If a skill specifies another location, follow the skill.

## Gotchas

ATTENTION: If you encounter a reusable pitfall, you MUST RECORD IT BELOW AS EARLY AS POSSIBLE.

### Tools

- When searching for text that starts with `--` using `rg`, pass `--` before the pattern, e.g. `rg -- "--lgc-space"`.
- Multi-agent worktree changes are user-owned unless proven otherwise; do not revert unexpected diffs just because they are outside the current task.

### Styling / Vue

- Sass `@extend` cannot cross Vue scoped style / `@use` module boundaries reliably; prefer `@apply` shared classes or duplicate small declarations.
- Under `lang="scss"`, always quote `@apply '…$token…'` so Sass does not treat `$token` as a Sass variable.
- Uno `@apply` may leave multi-property `transition-[…,max-inline-size,…]` untransformed (raw `@apply` in dist CSS / lightningcss warning). Use residual `transition-property: …` for lists that include `max-inline-size` (or other props that fail transform); keep `duration-`/`ease-` as `@apply`.
- **Never put Uno attributify `text="…"` on `<a>`, `AppLink`, or `RouterLink`.** `HTMLAnchorElement` has a legacy `.text` DOM property (alias of `textContent`). Vue sets it as a prop and **replaces all children** with the attribute string. Put color/size on a child span via `class`/`text=`, or use residual CSS / `class="text-…"`.
- **Never use bare HTML `hidden` as an Uno hide utility.** Vue emits the boolean `hidden` attribute; UA CSS is `[hidden] { display: none !important }`, so responsive show utilities cannot override it. Use `class="hidden max-md:grid"` (or residual `@apply 'hidden max-md:grid'`).
- **When `lgc-icon-button-base` (`inline-grid`) fights display utilities, use trailing `!`** (e.g. `hidden! max-md:grid!`), not residual SCSS. Bare `hidden`/`max-md:grid` lose same-specificity cascade and the control stays always visible.
- Parent scoped CSS does **not** match non-root nodes inside child components. Header mobile hide for action buttons must live in `LgcHeaderActions` (or use `:deep`), not only in `LgcHeader`.
- **Do not set a CSS custom property to itself** (e.g. inline `--lgc-header-link-max-width: var(--lgc-header-link-max-width)`). Self-reference is invalid at computed-value time; dependents become empty. Omit the inline override so `:root` applies, or set a concrete value.
- **Wind4 `translate`/`scale` ≠ `transform`:** Uno `hover:-translate-y-*` / `active:scale-*` set the individual `translate` / `scale` properties. `transform: none` does **not** cancel them. Prefer residual classic `transform: translateY/scale(...)` for shared motion that other rules must override, or also reset `translate`/`scale`.
- `text-$token` is **color**; font-size is `text-size-$token` / `font-size-$token`. `border-$token` is border-color; width is `border-width-$token`.
- Use Uno overflow-wrap utilities: `wrap="anywhere"` / `wrap="break-word"` / `wrap="normal"`, not raw `overflow-wrap` or arbitrary `[overflow-wrap:anywhere]`.
- If an attributify name conflicts with a real Vue/DOM prop such as `disabled`, keep the real prop (e.g. `:disabled`) and use `un-disabled="…"`, or `class="disabled:…"` as fallback.
- Current `eslint --fix` can temporarily mangle clusters of standalone boolean attributify attrs; run Prettier afterward to normalize them instead of converting to utility `class`.

### Valaxy

- In this pnpm workspace, Valaxy/UnoCSS may not auto-resolve `@iconify-json/*` installed only through a local theme package. Theme icons should provide `unocssPresets.icons.collections` loaders in the theme `valaxy.config.ts`, alongside `unocss.safelist`. Theme packs are Material-only (`material-symbols` + `ic`); site-owned packs (e.g. `ri`) load in site `valaxy.config.ts`.
- Valaxy CLI `valaxy` does not accept Vite-style `--host` / `--port` args directly; use config/default port or the supported Valaxy CLI options.
- In Valaxy SSG, `Teleport to="body"` rendered during SSR can break hydration and remove `#app`, causing a blank page; wrap body-level teleports in `ClientOnly` or use a stable in-app target.
- Valaxy post excerpts with `excerpt_type: html` may contain Vue component placeholders such as `<VT ... />`; render them through `ValaxyDynamicComponent` instead of raw `v-html` to avoid browser HTML normalization causing hydration mismatches.
- Keep theme shell components such as `components/layout.vue` free of `RouterView`; global page transition timing belongs in the `ValaxyApp.vue` override, but visual opacity/transform should target `.lgc-page-surface` content areas instead of the whole route root.
- Valaxy/unplugin-vue-components auto-imports components from **static tags** in templates. Do not resolve theme components via `:is="'LgcPostCoverFrame'"` (string name only); the import never runs. Use a static tag, or pass the real component object after an explicit import.
- To debug production hydration mismatches, temporarily set `vite.define.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__` to `'true'`; remove it after diagnosis.
- In this pnpm workspace, `vue-tsc` may type-check Valaxy client files under `node_modules` via generated `.valaxy/components.d.ts` and Valaxy's own `index.d.ts`, causing dependency-side virtual module / `@ts-expect-error` noise. Treat this as a known upstream issue; do not solve it with project-local `valaxy` type facades or `paths` hacks.
- `.valaxy` generated route/type files include headers recommending commit; keep their updates when generated by Valaxy commands instead of reverting them as noise.
- `temp/valaxy` is useful as an upstream reference clone, but it must stay excluded from TypeScript checks; otherwise `pnpm check` will scan upstream demos/tests and fail on missing upstream-only dependencies.
- CSS-i18n wraps localized markdown in top-level `div[lang]`; trim first/last real child margins at the markdown layer instead of relying on layout margin collapse. Code block margin selectors are more specific than generic `> :last-child`, so include `div[class*='language-']` in trim selectors.

## Commit

Use English conventional commit messages:

```text
type(optional scope): description

optional body

optional footer(s)
```
