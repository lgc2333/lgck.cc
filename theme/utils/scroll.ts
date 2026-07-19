const ACTIVE_SCROLL_ITEM_HEIGHT = 32
const ACTIVE_SCROLL_MARGIN = ACTIVE_SCROLL_ITEM_HEIGHT * 3

function getScrollBehavior(behavior: ScrollBehavior = 'smooth') {
  if (typeof window === 'undefined') return 'auto'

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduceMotion ? 'auto' : behavior
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function scrollActiveChildIntoView(
  container: HTMLElement | null | undefined,
  activeChild: HTMLElement | null | undefined,
  behavior: ScrollBehavior = 'smooth',
) {
  if (!container || !activeChild) return
  if (container.scrollHeight <= container.clientHeight) return

  const visibleTop = container.scrollTop + ACTIVE_SCROLL_MARGIN
  const visibleBottom =
    container.scrollTop + container.clientHeight - ACTIVE_SCROLL_MARGIN
  const containerRect = container.getBoundingClientRect()
  const childRect = activeChild.getBoundingClientRect()
  const childTop = childRect.top - containerRect.top + container.scrollTop
  const childBottom = childTop + childRect.height

  if (childTop >= visibleTop && childBottom <= visibleBottom) return

  const maxScrollTop = container.scrollHeight - container.clientHeight
  const targetTop =
    childTop < visibleTop
      ? childTop - ACTIVE_SCROLL_MARGIN
      : childBottom - container.clientHeight + ACTIVE_SCROLL_MARGIN
  const nextScrollTop = clamp(Math.round(targetTop), 0, maxScrollTop)

  if (Math.abs(nextScrollTop - container.scrollTop) < 1) return

  container.scrollTo({
    top: nextScrollTop,
    behavior: getScrollBehavior(behavior),
  })
}
