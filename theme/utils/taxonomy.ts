import type { LocationQuery, RouteLocationRaw } from 'vue-router'

import { normalizePostListValue } from './post'

export const CATEGORY_ROUTE_PATH = '/categories'

/** Category query string for /categories?category=... (Yun-compatible). */
export function normalizeCategoryQuery(value: unknown) {
  return normalizePostListValue(value).join('/')
}

export function readCategoryRouteQuery(value: LocationQuery['category']) {
  if (Array.isArray(value)) return String(value[0] || '')
  return value ? String(value) : ''
}

export function categoryRouteLocation(category: unknown): RouteLocationRaw {
  return {
    path: CATEGORY_ROUTE_PATH,
    query: {
      category: normalizeCategoryQuery(category),
    },
  }
}
