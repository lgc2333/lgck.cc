import type { FuseListItem, LocalSearchResult } from 'valaxy'
import type { Ref } from 'vue'

import type { SearchItem } from '../types'
import type { FuseSearchMatch } from '../utils/search'
import {
  buildSnippetSegments,
  buildTextSegments,
  cleanSearchText,
  findFuseMatch,
  highlightTerms,
  segmentsToText,
  truncateText,
} from '../utils/search'

type FuseSearchItem = FuseListItem & {
  content?: string
  excerpt?: string
  link?: string
  path?: string
}

export interface FuseSearchResultLike {
  item: FuseSearchItem
  matches?: readonly FuseSearchMatch[]
}

export function useSearchResultAdapters(options: {
  locale: Ref<string>
  query: Ref<string>
}) {
  function normalizeFuseResult(result: FuseSearchResultLike): SearchItem {
    const item = result.item
    const to = normalizePath(item.link || item.path || '/')
    const title = normalizeTitle(item.title) || to
    const titleMatch = findFuseMatch(result.matches, 'title')
    const excerptSegments = getFuseExcerptSegments(result)
    const titleSegments = titleMatch
      ? buildTextSegments(titleMatch.value || title, titleMatch.indices)
      : highlightTerms(title, getQueryTerms())

    return {
      id: `fuse:${to}:${title}`,
      title,
      titleSegments,
      excerpt: segmentsToText(excerptSegments),
      excerptSegments,
      path: stripHtmlSuffix(to),
      to,
      provider: 'fuse',
    }
  }

  function normalizeLocalResult(result: LocalSearchResult): SearchItem {
    const to = stripHtmlSuffix(result.id)
    const section = [...(result.titles || []), result.title].filter(Boolean).join(' > ')
    const path = stripHtmlSuffix(result.id.replace(/#.*$/, '')) || '/'
    const terms = result.terms.length > 0 ? result.terms : getQueryTerms()
    const titleSegments = highlightTerms(result.title || getPageTitle(path), terms)
    const sectionSegments = section ? highlightTerms(section, terms) : undefined

    return {
      id: `local:${result.id}`,
      title: result.title || getPageTitle(path),
      titleSegments,
      section,
      sectionSegments,
      path,
      to,
      provider: 'local',
    }
  }

  function normalizeTitle(title: FuseListItem['title']): string {
    if (typeof title === 'string') return title

    return (
      title?.[options.locale.value] || title?.en || Object.values(title || {})[0] || ''
    )
  }

  function getQueryTerms() {
    return options.query.value.trim().split(/\s+/).filter(Boolean)
  }

  function getFuseExcerptSegments(result: FuseSearchResultLike) {
    const matches = result.matches || []
    const match =
      findFuseMatch(matches, 'content') ||
      findFuseMatch(matches, 'excerpt') ||
      findFuseMatch(matches, 'title') ||
      findFuseMatch(matches, 'tags') ||
      findFuseMatch(matches, 'categories') ||
      findFuseMatch(matches, 'author')

    if (match) return buildSnippetSegments(match.value || '', match.indices)

    const fallback = cleanSearchText(result.item.excerpt || result.item.content || '')
    return fallback
      ? highlightTerms(truncateText(fallback), getQueryTerms())
      : undefined
  }

  return {
    normalizeFuseResult,
    normalizeLocalResult,
  }
}

function normalizePath(path: string) {
  return stripHtmlSuffix(path.startsWith('/') ? path : `/${path}`)
}

function stripHtmlSuffix(path: string) {
  return path.replace(/\.html(?=($|#))/, '')
}

function getPageTitle(path: string): string {
  return path.replace(/^\//, '') || '/'
}
