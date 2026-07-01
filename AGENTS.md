# Repository Guidelines

Note for Claude: Check if `CLAUDE.md` is a symlink first, the tool refuse to write through symlinks.

For docs mainly for AI (like `AGENTS.md`), keep them concise and token efficient.

## Project Structure

- `blog/`: production Valaxy site; content and app code are in `pages/`, `components/`, `styles/`, `setup/`, and `public/`.
- `theme/`: package `valaxy-theme-lgcuwukii`, with shared code in `components/`, `layouts/`, `composables/`, `styles/`, `client/`, `node/`, and `types/`.
- `demo/`: demo site that consumes the local theme.
- `temp/`: ignored scratch space; store temporary files in `temp/<sub-category>/`.

## Commands

```bash
pnpm install
pnpm --dir blog dev       # start the main blog locally
pnpm --dir demo dev       # start the theme demo locally
pnpm --dir blog build     # production SSG build
pnpm --dir demo build     # demo SSG build
pnpm lint                 # lint TypeScript, Vue, JS, and config files (dir param optional)
pnpm check                # type-check root workspace projects (dir param optional)
pnpm format               # format files with Prettier (dir param optional)
pnpm --dir blog rss       # regenerate RSS output
pnpm --dir blog sponsor   # regenerate sponsor assets
```

Run `format`, `lint`, and `check` scripts after code changes.

## Valaxy Reference

Invoke the local `valaxy` skill before Valaxy theme/site work. If upstream reference is needed, use `temp/valaxy` as a depth-1 clone of `YunYouJun/valaxy`, check out the tag matching the installed `valaxy` package version (for example `v0.28.11`), and read its `AGENTS.md` before exploring it.

## Rules

- Prefer thoughtful refactors when tiny patches would create spaghetti code.
- Styling: prefer UnoCSS theme tokens/classes first; keep SCSS minimal and only for CSS-native concerns such as globals, prose, pseudo-elements, complex selectors, or gradients.
- Keep styling responsibilities split: `uno.config.ts` defines theme/token mappings, while `styles/*.scss` contains real CSS and `@apply` utility classes.
- Do not call Chrome DevTools MCP tools in parallel.
- Store temporary files into the `temp/<sub-category>` folder in current project root. But if a skill guide you to use another location, follow it.

## Gotchas

ATTENTION: If you encounter a pitfall that might be reusable, you MUST record it below as early as possible.

- PowerShell `Copy-Item -LiteralPath` does not expand wildcards like `*.ttf`; use `-Path` or enumerate with `Get-ChildItem`.
- In this pnpm workspace, Valaxy/UnoCSS may not auto-resolve `@iconify-json/*` installed only through a local theme package. Theme icons should provide `unocssPresets.icons.collections` loaders in the theme `valaxy.config.ts`, alongside `unocss.safelist`.

## Commit

Use English conventional commit messages:

```text
type(optional scope): description

optional body

optional footer(s)
```
