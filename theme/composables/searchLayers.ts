import { computed, onMounted, onUnmounted, ref } from 'vue'

import { maxLgcBreakpointQuery } from '../utils/breakpoints'

export type SearchLayer = 'drawer' | 'mobile' | 'preview' | 'none'

const MAX_SM_QUERY = maxLgcBreakpointQuery('sm')
const BELOW_LG_QUERY = maxLgcBreakpointQuery('lg')

export function useSearchLayers() {
  const openInline = ref(false)
  const openDrawer = ref(false)
  const mobileSearchMode = ref(false)
  const isMaxSm = ref(false)
  const isBelowLg = ref(false)
  let maxSmQuery: MediaQueryList | undefined
  let belowLgQuery: MediaQueryList | undefined
  let updateSearchLayout: (() => void) | undefined
  const activeLayer = computed<SearchLayer>(() => {
    if (openDrawer.value) return 'drawer'
    if (mobileSearchMode.value) return 'mobile'
    if (openInline.value) return 'preview'
    return 'none'
  })

  onMounted(() => {
    const smQuery = window.matchMedia(MAX_SM_QUERY)
    const lgQuery = window.matchMedia(BELOW_LG_QUERY)
    maxSmQuery = smQuery
    belowLgQuery = lgQuery
    updateSearchLayout = () => {
      isMaxSm.value = smQuery.matches
      isBelowLg.value = lgQuery.matches

      if (isMaxSm.value) {
        if (openInline.value || openDrawer.value) openMobilePanel()
        return
      }

      if (isBelowLg.value) {
        if (openInline.value || mobileSearchMode.value) openResultsDrawer()
        return
      }

      if (mobileSearchMode.value || openDrawer.value) openInlineSearch()
    }

    updateSearchLayout()
    smQuery.addEventListener('change', updateSearchLayout)
    lgQuery.addEventListener('change', updateSearchLayout)
  })

  onUnmounted(() => {
    if (updateSearchLayout) {
      maxSmQuery?.removeEventListener('change', updateSearchLayout)
      belowLgQuery?.removeEventListener('change', updateSearchLayout)
    }
  })

  function openInlineSearch() {
    mobileSearchMode.value = false
    openDrawer.value = false
    openInline.value = true
  }

  function openMobilePanel() {
    openInline.value = false
    openDrawer.value = false
    mobileSearchMode.value = true
  }

  function closeInline() {
    openInline.value = false
    openDrawer.value = false
  }

  function closeDrawer() {
    openDrawer.value = false
  }

  function closeMobilePanel() {
    mobileSearchMode.value = false
  }

  function closeAllLayers() {
    openInline.value = false
    openDrawer.value = false
    mobileSearchMode.value = false
  }

  function openResultsDrawer() {
    openInline.value = false
    mobileSearchMode.value = false
    openDrawer.value = true
  }

  return {
    activeLayer,
    closeAllLayers,
    closeDrawer,
    closeInline,
    closeMobilePanel,
    isBelowLg,
    isMaxSm,
    mobileSearchMode,
    openDrawer,
    openInline,
    openInlineSearch,
    openMobilePanel,
    openResultsDrawer,
  }
}
