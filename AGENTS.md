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

## Reference Repository

Use `temp/valaxy` as a depth-1 clone of `YunYouJun/valaxy` when you need upstream reference. Keep it checked out to the currently installed version, and read its `AGENTS.md` before exploring the repo.

## Rules

- Prefer thoughtful refactors when tiny patches would create spaghetti code.
- Do not call Chrome DevTools MCP tools in parallel.
- Store temporary files into the `temp/<sub-category>` folder in current project root. But if a skill guide you to use another location, follow it.

## Gotchas

ATTENTION: If you encounter a pitfall that might be reusable, you MUST record it below as early as possible.

- PowerShell `Copy-Item -LiteralPath` does not expand wildcards like `*.ttf`; use `-Path` or enumerate with `Get-ChildItem`.

## Commit

Use English conventional commit messages:

```text
type(optional scope): description

optional body

optional footer(s)
```
