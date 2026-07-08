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
