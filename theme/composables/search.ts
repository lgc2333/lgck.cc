import { onClickOutside, useDebounce } from '@vueuse/core'
import type { FuseListItem, LocalSearchResult } from 'valaxy'
import {
  getAddonModule,
  isEmptyAddon,
  useFuseSearch,
  useLocalSearch,
  useSiteConfig,
} from 'valaxy'
import * as addonAlgolia from 'valaxy-addon-algolia'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import type { SearchItem } from '../types/search'
import {
  buildSnippetSegments,
  buildTextSegments,
  cleanSearchText,
  findFuseMatch,
  highlightTerms,
  segmentsToText,
  truncateText,
} from '../utils/search'

const PREVIEW_LIMIT = 5
const MOBILE_QUERY = '(max-width: 720px)'

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
  const openInline = ref(false)
  const openDrawer = ref(false)
  const mobileSearchMode = ref(false)
  const selectedIndex = ref(0)
  const fuseLoaded = ref(false)
  const fuseLoading = ref(false)
  const localLoaded = ref(false)
  const isMobile = ref(false)
  const algoliaLoaded = ref(false)
  const algoliaAddon = getAddonModule<typeof addonAlgolia>(addonAlgolia)
  const algolia =
    !isEmptyAddon(algoliaAddon) && algoliaAddon.useAddonAlgolia
      ? algoliaAddon.useAddonAlgolia()
      : undefined

  const { results: fuseResults, fetchFuseListData } = useFuseSearch(debouncedQuery)
  type FuseSearchResult = (typeof fuseResults.value)[number]
  const {
    results: localResults,
    loading: localLoading,
    load: loadLocalSearch,
  } = useLocalSearch(debouncedQuery)

  const loading = computed(() => fuseLoading.value || localLoading.value)
  const results = computed<SearchItem[]>(() => {
    if (!debouncedQuery.value.trim()) return []

    if (isLocal.value) return localResults.value.map(normalizeLocalResult)

    if (isFuse.value) return fuseResults.value.map(normalizeFuseResult)

    return []
  })
  const previewResults = computed(() => results.value.slice(0, PREVIEW_LIMIT))
  const hasQuery = computed(() => query.value.trim().length > 0)
  const previewOptionsCount = computed(() => {
    return previewResults.value.length > 0 ? previewResults.value.length + 1 : 0
  })
  const drawerOptionsCount = computed(() => results.value.length)
  const mobileOptionsCount = computed(() => results.value.length)
  const activeLayer = computed<'drawer' | 'mobile' | 'preview' | 'none'>(() => {
    if (openDrawer.value) return 'drawer'
    if (mobileSearchMode.value) return 'mobile'
    if (openInline.value) return 'preview'
    return 'none'
  })
  const activeOptionsCount = computed(() => {
    if (activeLayer.value === 'drawer') return drawerOptionsCount.value
    if (activeLayer.value === 'mobile') return mobileOptionsCount.value
    if (activeLayer.value === 'preview') return previewOptionsCount.value
    return 0
  })
  const previewSelectedIsAll = computed(() => {
    return selectedIndex.value === previewResults.value.length
  })

  watch(results, () => {
    selectedIndex.value = 0
  })

  watch(activeOptionsCount, (count) => {
    if (count <= 0) {
      selectedIndex.value = 0
      return
    }

    selectedIndex.value = Math.min(selectedIndex.value, count - 1)
  })

  onClickOutside(rootRef, () => {
    if (openInline.value && !openDrawer.value && !mobileSearchMode.value) closeInline()
  })

  onMounted(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY)
    const updateMobile = () => {
      isMobile.value = mediaQuery.matches
      if (isMobile.value && openInline.value) openMobilePanel()
      else if (!isMobile.value && mobileSearchMode.value) closeMobilePanel()
    }

    updateMobile()
    mediaQuery.addEventListener('change', updateMobile)
    window.addEventListener('keydown', onGlobalKeydown)

    onUnmounted(() => {
      mediaQuery.removeEventListener('change', updateMobile)
      window.removeEventListener('keydown', onGlobalKeydown)
    })
  })

  async function openSearch() {
    if (isAlgolia.value) {
      await openAlgolia()
      return
    }

    await ensureSearchLoaded()

    if (isMobile.value) openMobilePanel()
    else openInlineSearch()
  }

  function openInlineSearch() {
    mobileSearchMode.value = false
    openInline.value = true
    selectedIndex.value = 0
  }

  function openMobilePanel() {
    openInline.value = false
    openDrawer.value = false
    mobileSearchMode.value = true
    selectedIndex.value = 0
  }

  function closeInline() {
    openInline.value = false
    openDrawer.value = false
    selectedIndex.value = 0
  }

  function closeDrawer() {
    openDrawer.value = false
    selectedIndex.value = 0
  }

  function closeMobilePanel() {
    mobileSearchMode.value = false
    selectedIndex.value = 0
  }

  function closeAll() {
    openInline.value = false
    openDrawer.value = false
    mobileSearchMode.value = false
    selectedIndex.value = 0
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

  function onGlobalKeydown(event: KeyboardEvent) {
    if (!isSupported.value) return

    if (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      openSearch()
      return
    }

    if (activeLayer.value === 'none' || isEditingContent(event)) return

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
        activateSelected()
        break
      case 'Escape':
        event.preventDefault()
        closeActiveLayer()
        break
    }
  }

  function selectByOffset(offset: number) {
    const count = activeOptionsCount.value
    if (count <= 0) return

    selectedIndex.value = (selectedIndex.value + offset + count) % count
  }

  function activateSelected() {
    if (activeLayer.value === 'preview') {
      if (previewSelectedIsAll.value) {
        openResultsDrawer()
        return
      }

      const item = previewResults.value[selectedIndex.value]
      if (item) navigateToResult(item)
      return
    }

    const item = results.value[selectedIndex.value]
    if (item) navigateToResult(item)
  }

  function openResultsDrawer() {
    openDrawer.value = true
    selectedIndex.value = 0
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

  function normalizeFuseResult(result: FuseSearchResult): SearchItem {
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
      to,
      provider: 'local',
    }
  }

  function normalizeTitle(title: FuseListItem['title']): string {
    if (typeof title === 'string') return title

    return title?.[locale.value] || title?.en || Object.values(title || {})[0] || ''
  }

  function getQueryTerms() {
    return debouncedQuery.value.trim().split(/\s+/).filter(Boolean)
  }

  function getFuseExcerptSegments(result: FuseSearchResult) {
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

  return {
    algoliaLoaded,
    closeDrawer,
    handleSearchKeydown,
    hasQuery,
    isAlgolia,
    isSupported,
    loading,
    mobileSearchMode,
    navigateToResult,
    openDrawer,
    openInline,
    openResultsDrawer,
    openSearch,
    previewResults,
    previewSelectedIsAll,
    query,
    resetAndClose,
    results,
    rootRef,
    selectedIndex,
  }
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
