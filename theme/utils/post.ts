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

export function normalizePostCategoryPath(value: unknown) {
  return normalizePostListValue(value).join(' / ')
}

export function normalizeLocaleText(
  value: string | Record<string, string> | undefined,
  locale = 'en',
) {
  if (!value) return ''
  if (typeof value === 'string') return value

  return value[locale] || value.en || Object.values(value)[0] || ''
}

export function formatPostDate(date?: string | number | Date) {
  return formatDate(date || '')
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

export function shouldShowPostUpdated(
  created?: string | number | Date,
  updated?: string | number | Date,
) {
  if (updated == null || updated === '') return false
  if (created == null || created === '') return true
  return formatPostDate(updated) !== formatPostDate(created)
}
