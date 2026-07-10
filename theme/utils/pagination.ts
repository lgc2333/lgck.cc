export function parsePageParam(raw: unknown): number {
  const pageValue = Array.isArray(raw) ? raw[0] : raw
  const page = Number.parseInt(String(pageValue || '1'), 10)
  return Number.isFinite(page) && page > 0 ? page : 1
}

export function getPaginationSurroundLength(currentPage: number, totalPages: number) {
  return currentPage === 1 || currentPage === totalPages ? 3 : 2
}

export function shouldShowPaginationPage(
  page: number,
  currentPage: number,
  totalPages: number,
  surroundLength = getPaginationSurroundLength(currentPage, totalPages),
) {
  if (page === 1 || page === totalPages) return true
  return page > currentPage - surroundLength && page < currentPage + surroundLength
}

/**
 * Builds page numbers for pagination UI.
 * Positive values are page links; negative values mark ellipsis slots.
 */
export function buildPaginationPages(
  currentPage: number,
  totalPages: number,
): number[] {
  const pages: number[] = []
  let ellipsisOpen = false
  const surroundLength = getPaginationSurroundLength(currentPage, totalPages)

  for (let page = 1; page <= totalPages; page += 1) {
    if (shouldShowPaginationPage(page, currentPage, totalPages, surroundLength)) {
      pages.push(page)
      ellipsisOpen = false
    } else if (!ellipsisOpen) {
      pages.push(-page)
      ellipsisOpen = true
    }
  }

  return pages
}

export function getPostFeedPagePath(page: number) {
  return `/page/${page}`
}

export function slicePageItems<T>(items: T[], page: number, pageSize: number) {
  const size = Math.max(1, pageSize)
  const current = Math.max(1, page)
  return items.slice((current - 1) * size, current * size)
}
