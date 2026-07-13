import type { HeaderActivePathRewrite } from '../types'

export type RouteActiveMatch = 'exact' | 'prefix'

export function getRouteContentKey(fullPath: string) {
  return fullPath.split('#', 1)[0]
}

export function isRouteLinkActive(
  currentPath: string,
  targetLink: string,
  match: RouteActiveMatch = 'prefix',
  rewrites: readonly HeaderActivePathRewrite[] = [],
) {
  if (!targetLink.startsWith('/')) return false

  const current = rewriteRoutePath(currentPath, rewrites)
  const target = normalizeRoutePath(targetLink)

  if (match === 'exact') return current === target
  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}

export function rewriteRoutePath(
  path: string,
  rewrites: readonly HeaderActivePathRewrite[] = [],
) {
  const current = normalizeRoutePath(path)

  for (const rewrite of rewrites) {
    const from = normalizeRoutePath(rewrite.from)
    const to = normalizeRoutePath(rewrite.to)

    if (!from.startsWith('/') || !to.startsWith('/')) continue
    if (from === '/') {
      if (current === '/') return to
      continue
    }

    if (current !== from && !current.startsWith(`${from}/`)) continue

    const suffix = current.slice(from.length)
    if (to === '/') return suffix || '/'
    return `${to}${suffix}`
  }

  return current
}

function normalizeRoutePath(path: string) {
  if (path === '/') return path
  return path.replace(/\/+$/, '')
}
