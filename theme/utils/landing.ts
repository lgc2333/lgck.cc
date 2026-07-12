import type { LandingLink, LandingLinks } from '../types'

export function normalizeLandingLinkRows(links?: LandingLinks | null): LandingLink[][] {
  if (!links?.length) return []

  if (Array.isArray(links[0])) {
    return (links as LandingLink[][])
      .map((row) => row.filter(Boolean))
      .filter((row) => row.length)
  }

  return [(links as LandingLink[]).filter(Boolean)]
}

export function flattenLandingLinks(links?: LandingLinks | null): LandingLink[] {
  return normalizeLandingLinkRows(links).flat()
}
