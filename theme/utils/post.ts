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

export function formatPostDateParts(date?: string | number | Date): PostDateParts {
  const formatted = formatDate(date || '')
  const parts = formatted.split('-')
  return {
    day: parts[2] || formatted,
    rest: parts.length >= 2 ? `${parts[0]}.${parts[1]}` : '',
    datetime: formatted,
  }
}
