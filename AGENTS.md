# Repository Guidelines

Note for Claude: Check if `CLAUDE.md` is a symlink first, the tool refuse to write through symlinks.

For docs mainly for AI (like `AGENTS.md`), keep them concise and token efficient.

## Project Structure

- pnpm workspace packages are `blog`, `demo`, and `theme`; shared versions live in the `pnpm-workspace.yaml` catalog.
- `blog/`: production Valaxy site. Edit source in `pages/`, `components/`, `styles/`, `setup/`, `public/`, `site.config.ts`, and `valaxy.config.ts`.
- `theme/`: package `valaxy-theme-lgcuwukii`; read `theme/AGENTS.md` for its structure map.
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
- Styling: use traditional SCSS for authored theme/site styles. Do not use UnoCSS utilities, shortcuts, or `@apply` for stable UI styling.
- Keep UnoCSS limited to icon generation and required Valaxy integration in `valaxy.config.ts`; do not add standalone Uno config files. Put real styling in component scoped SCSS or `styles/*.scss`.
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

- Sass `@extend` cannot cross Vue scoped style / `@use` module boundaries reliably; duplicate small transition declarations or use mixins instead of extending selectors from another stylesheet.

### Valaxy

- In this pnpm workspace, Valaxy/UnoCSS may not auto-resolve `@iconify-json/*` installed only through a local theme package. Theme icons should provide `unocssPresets.icons.collections` loaders in the theme `valaxy.config.ts`, alongside `unocss.safelist`.
- Valaxy CLI `valaxy` does not accept Vite-style `--host` / `--port` args directly; use config/default port or the supported Valaxy CLI options.
- In Valaxy SSG, `Teleport to="body"` rendered during SSR can break hydration and remove `#app`, causing a blank page; wrap body-level teleports in `ClientOnly` or use a stable in-app target.
- Valaxy post excerpts with `excerpt_type: html` may contain Vue component placeholders such as `<VT ... />`; render them through `ValaxyDynamicComponent` instead of raw `v-html` to avoid browser HTML normalization causing hydration mismatches.
- Keep theme shell components such as `components/layout.vue` free of `RouterView`; global page transition timing belongs in the `ValaxyApp.vue` override, but visual opacity/transform should target `.lgc-page-surface` content areas instead of the whole route root.
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
