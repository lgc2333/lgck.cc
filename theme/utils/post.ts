export function normalizePostListValue(value: unknown) {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return [String(value)].filter(Boolean)
}

export function normalizePostCategoryPath(value: unknown) {
  return normalizePostListValue(value).join(' / ')
}
