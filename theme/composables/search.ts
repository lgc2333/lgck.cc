import { onClickOutside, useDebounce } from '@vueuse/core'
import {
  getAddonModule,
  isEmptyAddon,
  useFuseSearch,
  useLocalSearch,
  useSiteConfig,
} from 'valaxy'
import type { FuseListItem, LocalSearchResult } from 'valaxy'
import * as addonAlgolia from 'valaxy-addon-algolia'
import type { ComputedRef, Ref } from 'vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { SearchItem } from '../types'
import { normalizeLocaleText } from '../utils/post'
import type { FuseSearchMatch } from '../utils/search'
import {
  buildSnippetSegments,
  buildTextSegments,
  cleanSearchText,
  findFuseMatch,
  highlightTerms,
  segmentsToText,
  truncateText,
} from '../utils/search'
import type { SearchLayer } from './searchLayers'
import { useSearchLayers } from './searchLayers'

const PREVIEW_LIMIT = 5

export function useUnifiedSearch() {
  const siteConfig = useSiteConfig()
  const router = useRouter()
  const { locale } = useI18n()

  const provider = computed(() => siteConfig.value.search.provider)
  const isSupported = computed(() => {
    return siteConfig.value.search.enable && provider.value !== 'engine'
  })
  const isAlgolia = computed(() => provider.value === 'algolia')
  const isFuse = computed(() => provider.value === 'fuse')
  const isLocal = computed(() => provider.value === 'local')
  const rootRef = ref<HTMLElement>()
  const query = ref('')
  const debouncedQuery = useDebounce(query, 180)
  const {
    activeLayer,
    closeAllLayers,
    closeDrawer: closeSearchDrawer,
    closeInline: closeInlineLayer,
    isBelowLg,
    isMaxSm,
    mobileSearchMode,
    openDrawer,
    openInline,
    openInlineSearch: openInlineLayer,
    openMobilePanel: openMobileLayer,
    openResultsDrawer: openResultsDrawerLayer,
  } = useSearchLayers()
  const previewSelectedIndex = ref(0)
  const drawerSelectedIndex = ref(0)
  const mobileSelectedIndex = ref(0)
  const fuseLoaded = ref(false)
  const fuseLoading = ref(false)
  const localLoaded = ref(false)
  const algoliaLoaded = ref(false)
  const algoliaAddon = getAddonModule<typeof addonAlgolia>(addonAlgolia)
  const algolia =
    !isEmptyAddon(algoliaAddon) && algoliaAddon.useAddonAlgolia
      ? algoliaAddon.useAddonAlgolia()
      : undefined

  const { results: fuseResults, fetchFuseListData } = useFuseSearch(debouncedQuery)
  const {
    results: localResults,
    loading: localLoading,
    load: loadLocalSearch,
  } = useLocalSearch(debouncedQuery)
  const { normalizeFuseResult, normalizeLocalResult } = useSearchResultAdapters({
    locale,
    query: debouncedQuery,
  })

  const hasQuery = computed(() => query.value.trim().length > 0)
  const loading = computed(() => {
    return (
      fuseLoading.value ||
      localLoading.value ||
      (hasQuery.value && query.value.trim() !== debouncedQuery.value.trim())
    )
  })
  const results = computed<SearchItem[]>(() => {
    if (!debouncedQuery.value.trim()) return []

    if (isLocal.value) return localResults.value.map(normalizeLocalResult)

    if (isFuse.value) return fuseResults.value.map(normalizeFuseResult)

    return []
  })
  const previewResults = computed(() => results.value.slice(0, PREVIEW_LIMIT))
  const previewOptionsCount = computed(() => {
    return previewResults.value.length > 0 ? previewResults.value.length + 1 : 0
  })
  const drawerOptionsCount = computed(() => results.value.length)
  const mobileOptionsCount = computed(() => results.value.length)
  const activeOptionsCount = computed(() => {
    if (activeLayer.value === 'drawer') return drawerOptionsCount.value
    if (activeLayer.value === 'mobile') return mobileOptionsCount.value
    if (activeLayer.value === 'preview') return previewOptionsCount.value
    return 0
  })
  const previewSelectedIsAll = computed(() => {
    return previewSelectedIndex.value === previewResults.value.length
  })
  const { handleSearchKeydown, onGlobalKeydown } = useSearchKeyboard({
    activateSelected,
    activeLayer,
    activeOptionsCount,
    closeActiveLayer,
    getActiveSelectedIndex,
    isSupported,
    openSearch,
    setActiveSelectedIndex,
  })

  watch(results, () => {
    resetSelectedIndexes()
  })

  watch(previewOptionsCount, (count) => clampSelectedIndex(previewSelectedIndex, count))
  watch(drawerOptionsCount, (count) => clampSelectedIndex(drawerSelectedIndex, count))
  watch(mobileOptionsCount, (count) => clampSelectedIndex(mobileSelectedIndex, count))

  onClickOutside(rootRef, () => {
    if (openInline.value && !openDrawer.value && !mobileSearchMode.value) closeInline()
  })

  onMounted(() => {
    window.addEventListener('keydown', onGlobalKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onGlobalKeydown)
  })

  async function openSearch() {
    if (isAlgolia.value) {
      await openAlgolia()
      return
    }

    await ensureSearchLoaded()

    if (isMaxSm.value) openMobilePanel()
    else if (isBelowLg.value) openResultsDrawer()
    else openInlineSearch()
  }

  function openInlineSearch() {
    openInlineLayer()
    previewSelectedIndex.value = 0
  }

  function openMobilePanel() {
    openMobileLayer()
    mobileSelectedIndex.value = 0
  }

  function closeInline() {
    closeInlineLayer()
    previewSelectedIndex.value = 0
  }

  function closeDrawer() {
    closeSearchDrawer()
    drawerSelectedIndex.value = 0
  }

  function closeAll() {
    closeAllLayers()
    resetSelectedIndexes()
  }

  function resetAndClose() {
    query.value = ''
    closeAll()
  }

  async function ensureSearchLoaded() {
    if (isFuse.value && !fuseLoaded.value) {
      fuseLoading.value = true
      try {
        await fetchFuseListData()
        fuseLoaded.value = true
      } finally {
        fuseLoading.value = false
      }
    }

    if (isLocal.value && !localLoaded.value) {
      await loadLocalSearch(locale.value)
      localLoaded.value = true
    }
  }

  async function openAlgolia() {
    if (!algolia) return

    if (!algoliaLoaded.value) algoliaLoaded.value = true

    await nextTick()

    algolia.load()
    algolia.dispatchEvent()
  }

  function activateSelected() {
    const selectedIndex = getActiveSelectedIndex()

    if (activeLayer.value === 'preview') {
      if (previewSelectedIsAll.value) {
        openResultsDrawer()
        return
      }

      const item = previewResults.value[selectedIndex]
      if (item) navigateToResult(item)
      return
    }

    const item = results.value[selectedIndex]
    if (item) navigateToResult(item)
  }

  function openResultsDrawer() {
    openResultsDrawerLayer()
    drawerSelectedIndex.value = 0
  }

  function closeActiveLayer() {
    if (openDrawer.value) {
      closeDrawer()
      return
    }

    if (mobileSearchMode.value) {
      resetAndClose()
      return
    }

    closeInline()
  }

  function navigateToResult(item: SearchItem) {
    router.push(item.to)
    resetAndClose()
  }

  function getActiveSelectedIndex() {
    if (activeLayer.value === 'drawer') return drawerSelectedIndex.value
    if (activeLayer.value === 'mobile') return mobileSelectedIndex.value
    if (activeLayer.value === 'preview') return previewSelectedIndex.value
    return 0
  }

  function setActiveSelectedIndex(index: number) {
    if (activeLayer.value === 'drawer') drawerSelectedIndex.value = index
    else if (activeLayer.value === 'mobile') mobileSelectedIndex.value = index
    else if (activeLayer.value === 'preview') previewSelectedIndex.value = index
  }

  function resetSelectedIndexes() {
    previewSelectedIndex.value = 0
    drawerSelectedIndex.value = 0
    mobileSelectedIndex.value = 0
  }

  return {
    algoliaLoaded,
    closeDrawer,
    drawerSelectedIndex,
    handleSearchKeydown,
    hasQuery,
    isAlgolia,
    isSupported,
    loading,
    mobileSearchMode,
    mobileSelectedIndex,
    navigateToResult,
    openDrawer,
    openInline,
    openResultsDrawer,
    openSearch,
    previewResults,
    previewSelectedIndex,
    previewSelectedIsAll,
    query,
    resetAndClose,
    results,
    rootRef,
  }
}

function clampSelectedIndex(selectedIndex: { value: number }, count: number) {
  if (count <= 0) {
    selectedIndex.value = 0
    return
  }

  selectedIndex.value = Math.min(selectedIndex.value, count - 1)
}

type FuseSearchItem = FuseListItem & {
  content?: string
  excerpt?: string
  link?: string
  path?: string
}

interface FuseSearchResultLike {
  item: FuseSearchItem
  matches?: readonly FuseSearchMatch[]
  score?: number
}

function useSearchResultAdapters(options: { locale: Ref<string>; query: Ref<string> }) {
  function normalizeFuseResult(result: FuseSearchResultLike): SearchItem {
    const item = result.item
    const to = normalizePath(item.link || item.path || '/')
    const title = normalizeTitle(item.title) || to
    const titleMatch = findFuseMatch(result.matches, 'title')
    const excerptSegments = getFuseExcerptSegments(result)
    const titleSegments = titleMatch
      ? buildTextSegments(titleMatch.value || title, titleMatch.indices)
      : highlightTerms(title, getQueryTerms())

    return {
      id: `fuse:${to}:${title}`,
      title,
      titleSegments,
      excerpt: segmentsToText(excerptSegments),
      excerptSegments,
      path: stripHtmlSuffix(to),
      score: normalizeScore(result.score),
      to,
      provider: 'fuse',
    }
  }

  function normalizeLocalResult(result: LocalSearchResult): SearchItem {
    const to = stripHtmlSuffix(result.id)
    const section = [...(result.titles || []), result.title].filter(Boolean).join(' > ')
    const path = stripHtmlSuffix(result.id.replace(/#.*$/, '')) || '/'
    const terms = result.terms.length > 0 ? result.terms : getQueryTerms()
    const titleSegments = highlightTerms(result.title || getPageTitle(path), terms)
    const sectionSegments = section ? highlightTerms(section, terms) : undefined

    return {
      id: `local:${result.id}`,
      title: result.title || getPageTitle(path),
      titleSegments,
      section,
      sectionSegments,
      path,
      score: normalizeScore(result.score),
      to,
      provider: 'local',
    }
  }

  function normalizeTitle(title: FuseListItem['title']): string {
    return normalizeLocaleText(title, options.locale.value)
  }

  function getQueryTerms() {
    return options.query.value.trim().split(/\s+/).filter(Boolean)
  }

  function getFuseExcerptSegments(result: FuseSearchResultLike) {
    const matches = result.matches || []
    const match =
      findFuseMatch(matches, 'content') ||
      findFuseMatch(matches, 'excerpt') ||
      findFuseMatch(matches, 'title') ||
      findFuseMatch(matches, 'tags') ||
      findFuseMatch(matches, 'categories') ||
      findFuseMatch(matches, 'author')

    if (match) return buildSnippetSegments(match.value || '', match.indices)

    const fallback = cleanSearchText(result.item.excerpt || result.item.content || '')
    return fallback
      ? highlightTerms(truncateText(fallback), getQueryTerms())
      : undefined
  }

  function normalizeScore(score: unknown) {
    return typeof score === 'number' && Number.isFinite(score) ? score : undefined
  }

  return {
    normalizeFuseResult,
    normalizeLocalResult,
  }
}

function useSearchKeyboard(options: {
  activateSelected: () => void
  activeLayer: ComputedRef<SearchLayer>
  activeOptionsCount: ComputedRef<number>
  closeActiveLayer: () => void
  getActiveSelectedIndex: () => number
  isSupported: ComputedRef<boolean>
  openSearch: () => void | Promise<void>
  setActiveSelectedIndex: (index: number) => void
}) {
  function onGlobalKeydown(event: KeyboardEvent) {
    if (!options.isSupported.value) return

    if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      options.openSearch()
      return
    }

    if (options.activeLayer.value === 'none' || isEditingContent(event)) return

    handleSearchKeydown(event)
  }

  function handleSearchKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectByOffset(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectByOffset(-1)
        break
      case 'Enter':
        event.preventDefault()
        options.activateSelected()
        break
      case 'Escape':
        event.preventDefault()
        options.closeActiveLayer()
        break
    }
  }

  function selectByOffset(offset: number) {
    const count = options.activeOptionsCount.value
    if (count <= 0) return

    options.setActiveSelectedIndex(
      (options.getActiveSelectedIndex() + offset + count) % count,
    )
  }

  return {
    handleSearchKeydown,
    onGlobalKeydown,
  }
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement | null
  const tagName = element?.tagName

  return Boolean(
    element?.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA',
  )
}

function normalizePath(path: string) {
  return stripHtmlSuffix(path.startsWith('/') ? path : `/${path}`)
}

function stripHtmlSuffix(path: string) {
  return path.replace(/\.html(?=($|#))/, '')
}

function getPageTitle(path: string): string {
  return path.replace(/^\//, '') || '/'
}
