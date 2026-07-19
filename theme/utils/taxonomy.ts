import type { LocationQuery, RouteLocationRaw } from 'vue-router'

import { normalizePostListValue } from './post'

export const CATEGORY_ROUTE_PATH = '/categories'
export const TAG_ROUTE_PATH = '/tags'

/** Category query string for /categories?category=... (Yun-compatible). */
export function normalizeCategoryQuery(value: unknown) {
  return normalizePostListValue(value).join('/')
}

/** Tag query string for /tags?tag=... (Yun-compatible). */
export function normalizeTagQuery(value: unknown) {
  return normalizePostListValue(value)[0] || ''
}

export function readCategoryRouteQuery(value: LocationQuery['category']) {
  if (Array.isArray(value)) return String(value[0] || '')
  return value ? String(value) : ''
}

export function readTagRouteQuery(value: LocationQuery['tag']) {
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

export function tagRouteLocation(tag: unknown): RouteLocationRaw {
  return {
    path: TAG_ROUTE_PATH,
    query: {
      tag: normalizeTagQuery(tag),
    },
  }
}
