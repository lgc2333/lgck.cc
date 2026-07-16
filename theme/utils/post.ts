import { formatDate } from 'valaxy'

export interface PostDateParts {
  day: string
  rest: string
  datetime: string
}

export function normalizePostListValue(value: unknown) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return [String(value)].filter(Boolean)
}

const LOCALE_PREFIX = '$locale:'

/**
 * Resolve a string, `$locale:key`, or `{ lang: text }` map for the active locale.
 * Pass `translate` (vue-i18n `t`) when the value may be a `$locale:` key.
 */
export function normalizeLocaleText(
  value: string | Record<string, string> | undefined,
  locale = 'en',
  translate?: (key: string) => string,
) {
  if (!value) return ''
  if (typeof value === 'object')
    return value[locale] || value.en || Object.values(value)[0] || ''
  if (translate && value.startsWith(LOCALE_PREFIX))
    return translate(value.slice(LOCALE_PREFIX.length))
  return value
}

export function formatPostDate(date?: string | number | Date) {
  return formatDate(date || '')
}

/** Full timestamp for tooltips — matches Yun `formatTimestamp`. */
export function formatPostTimestamp(date?: string | number | Date) {
  return formatDate(date || '', { template: 'YYYY-MM-DD HH:mm:ss' })
}

export function formatPostDateParts(date?: string | number | Date): PostDateParts {
  const formatted = formatPostDate(date)
  const parts = formatted.split('-')
  return {
    day: parts[2] || formatted,
    rest: parts.length >= 2 ? `${parts[0]}.${parts[1]}` : '',
    datetime: formatted,
  }
}

/**
 * Whether to show the updated time.
 * Aligns with Yun `YunPostDateMeta`: raw frontmatter inequality
 * (`updated && updated !== date`), not day-formatted equality.
 */
export function shouldShowPostUpdated(
  created?: string | number | Date,
  updated?: string | number | Date,
) {
  if (updated == null || updated === '') return false
  return updated !== created
}

/** Layouts that inject article post meta (Yun: post + collection). */
export function isPostMetaLayout(layout: unknown) {
  return layout === 'post' || layout === 'collection'
}
