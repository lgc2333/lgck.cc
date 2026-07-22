import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const EDGE_ATTR = 'data-md-edge'
const EDGE_CONTAINER_SELECTOR = '.markdown-body'

type MarkdownEdge = 'first' | 'last'

function toPx(value: string) {
  const number = Number.parseFloat(value)

  return Number.isFinite(number) ? number : 0
}

function isRenderedElement(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false

  const style = window.getComputedStyle(element)

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    (style.display === 'contents' || element.getClientRects().length > 0)
  )
}

function hasVisiblePaint(style: CSSStyleDeclaration) {
  return (
    style.backgroundImage !== 'none' ||
    !['rgba(0, 0, 0, 0)', 'transparent'].includes(style.backgroundColor) ||
    style.boxShadow !== 'none' ||
    style.outlineStyle !== 'none'
  )
}

function hasVerticalBoxEdge(style: CSSStyleDeclaration) {
  return [
    style.marginTop,
    style.marginBottom,
    style.paddingTop,
    style.paddingBottom,
    style.borderTopWidth,
    style.borderBottomWidth,
  ].some((value) => toPx(value) !== 0)
}

function isTransparentWrapper(element: HTMLElement) {
  const style = window.getComputedStyle(element)

  return (
    style.display === 'contents' ||
    (!hasVerticalBoxEdge(style) &&
      !hasVisiblePaint(style) &&
      element.children.length > 0)
  )
}

function findVisualEdgeTarget(element: HTMLElement, edge: MarkdownEdge): HTMLElement {
  if (!isTransparentWrapper(element)) return element

  const children = Array.from(element.children).filter(isRenderedElement)
  const next = edge === 'first' ? children.at(0) : children.at(-1)

  return next ? findVisualEdgeTarget(next, edge) : element
}

function setEdge(element: HTMLElement, edge: MarkdownEdge) {
  const values = new Set(
    (element.getAttribute(EDGE_ATTR) || '').split(/\s+/).filter(Boolean),
  )

  values.add(edge)
  element.setAttribute(EDGE_ATTR, Array.from(values).join(' '))
}

function markContainerEdges(container: HTMLElement) {
  const children = Array.from(container.children).filter(isRenderedElement)
  const first = children.at(0)
  const last = children.at(-1)

  if (first) setEdge(findVisualEdgeTarget(first, 'first'), 'first')
  if (last) setEdge(findVisualEdgeTarget(last, 'last'), 'last')
}

function syncMarkdownEdgeMarkers(root: HTMLElement) {
  root.querySelectorAll(`[${EDGE_ATTR}]`).forEach((element) => {
    element.removeAttribute(EDGE_ATTR)
  })

  markContainerEdges(root)
  root
    .querySelectorAll<HTMLElement>(EDGE_CONTAINER_SELECTOR)
    .forEach(markContainerEdges)
}

export function useMarkdownEdgeMarkers(markdownRoot: Ref<HTMLElement | null>) {
  const route = useRoute()
  const { locale } = useI18n()

  let frame: number | undefined
  let observer: MutationObserver | undefined

  function scheduleSync() {
    if (typeof window === 'undefined') return
    if (frame !== undefined) window.cancelAnimationFrame(frame)

    frame = window.requestAnimationFrame(() => {
      frame = undefined

      const root = markdownRoot.value
      if (root) syncMarkdownEdgeMarkers(root)
    })
  }

  async function syncAfterRender() {
    await nextTick()
    scheduleSync()
  }

  function observeRoot() {
    observer?.disconnect()

    const root = markdownRoot.value
    if (!root) return

    observer = new MutationObserver(scheduleSync)
    observer.observe(root, { childList: true, subtree: true })
    scheduleSync()
  }

  onMounted(observeRoot)

  watch(markdownRoot, observeRoot, { flush: 'post' })
  watch(() => [route.fullPath, locale.value], syncAfterRender, { flush: 'post' })

  onBeforeUnmount(() => {
    observer?.disconnect()

    if (frame !== undefined) window.cancelAnimationFrame(frame)
  })
}
