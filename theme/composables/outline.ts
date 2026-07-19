import type { MenuItem } from 'valaxy'
import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  readonly,
  ref,
  toValue,
  watch,
} from 'vue'

import { scrollActiveChildIntoView } from '../utils/scroll'

const PAGE_OFFSET = 130
interface ActiveOutlineOptions {
  containerRef?: Ref<HTMLElement | undefined>
  enabled?: MaybeRefOrGetter<boolean | undefined>
  markerRef?: Ref<HTMLElement | undefined>
  markerTopOffset?: MaybeRefOrGetter<number | undefined>
}

interface OutlineEntry {
  element: HTMLElement
  link: string
  title: string
  depth: number
}

function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0
  let current: HTMLElement | null = element

  while (current && current !== document.body) {
    offsetTop += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return current ? offsetTop : Number.NaN
}

function flattenHeaders(headers: MenuItem[], entries: OutlineEntry[] = [], depth = 0) {
  for (const header of headers) {
    entries.push({
      element: header.element,
      depth,
      link: header.link,
      title: header.title,
    })

    if (header.children?.length) flattenHeaders(header.children, entries, depth + 1)
  }

  return entries
}

function resolveActiveEntry(headers: MenuItem[]) {
  if (typeof window === 'undefined') return null

  const scrollY = window.scrollY
  const innerHeight = window.innerHeight
  const offsetHeight = document.body.offsetHeight
  const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

  const entries = flattenHeaders(headers)
    .map((entry) => ({
      ...entry,
      top: getAbsoluteTop(entry.element),
    }))
    .filter(({ top }) => !Number.isNaN(top))
    .sort((a, b) => a.top - b.top)

  if (!entries.length || scrollY < 1) return null
  if (isBottom) return entries.at(-1) || null

  let activeEntry: OutlineEntry | null = null
  for (const entry of entries) {
    if (entry.top > scrollY + 4 + PAGE_OFFSET) break

    activeEntry = entry
  }

  return activeEntry
}

function findOutlineLink(container: HTMLElement, link: string) {
  return [...container.querySelectorAll<HTMLAnchorElement>('a[href]')].find(
    (anchor) => anchor.getAttribute('href') === link,
  )
}

export function useActiveOutline(
  headers: MaybeRefOrGetter<MenuItem[]>,
  options: ActiveOutlineOptions = {},
) {
  const activeLink = ref('')
  const activeTitle = ref('')
  let frame = 0
  let previousActiveLink: HTMLAnchorElement | undefined

  const enabled = computed(() => toValue(options.enabled) !== false)

  function setMarker(activeAnchor?: HTMLAnchorElement, activeDepth = 0) {
    const marker = options.markerRef?.value
    if (!marker) return

    const markerTopOffset = toValue(options.markerTopOffset) ?? 0
    marker.style.setProperty(
      '--post-outline-marker-left',
      activeAnchor ? `calc(${activeDepth} * var(--lgc-space-md))` : '0px',
    )

    if (activeAnchor) {
      const centeredOffset = Math.round(
        (activeAnchor.offsetHeight - marker.offsetHeight) / 2,
      )
      marker.style.top = `${activeAnchor.offsetTop + markerTopOffset + centeredOffset}px`
      marker.style.opacity = '1'
    } else {
      marker.style.top = `${markerTopOffset}px`
      marker.style.opacity = '0'
    }
  }

  function updateContainerActiveLink(link: string, activeDepth = 0) {
    if (previousActiveLink) previousActiveLink.classList.remove('active')

    const container = options.containerRef?.value
    previousActiveLink =
      container && link ? findOutlineLink(container, link) : undefined

    if (previousActiveLink) previousActiveLink.classList.add('active')

    setMarker(previousActiveLink, activeDepth)
    scrollActiveChildIntoView(container, previousActiveLink)
  }

  function updateActiveOutline() {
    if (!enabled.value) {
      activeLink.value = ''
      activeTitle.value = ''
      updateContainerActiveLink('', 0)
      return
    }

    const activeEntry = resolveActiveEntry(toValue(headers))
    activeLink.value = activeEntry?.link || ''
    activeTitle.value = activeEntry?.title || ''
    updateContainerActiveLink(activeLink.value, activeEntry?.depth ?? 0)
  }

  function queueUpdate() {
    if (typeof window === 'undefined') return
    if (frame) return

    frame = window.requestAnimationFrame(() => {
      frame = 0
      updateActiveOutline()
    })
  }

  onMounted(() => {
    queueUpdate()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('hashchange', queueUpdate)
  })

  onUnmounted(() => {
    if (frame) window.cancelAnimationFrame(frame)
    window.removeEventListener('scroll', queueUpdate)
    window.removeEventListener('hashchange', queueUpdate)
    if (previousActiveLink) previousActiveLink.classList.remove('active')
  })

  watch(
    () => [toValue(headers), enabled.value],
    () => {
      void nextTick(queueUpdate)
    },
    { flush: 'post' },
  )

  return {
    activeLink: readonly(activeLink),
    activeTitle: readonly(activeTitle),
    updateActiveOutline,
  }
}
