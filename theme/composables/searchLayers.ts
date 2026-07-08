import { computed, onMounted, onUnmounted, ref } from 'vue'

export type SearchLayer = 'drawer' | 'mobile' | 'preview' | 'none'

const MOBILE_QUERY = '(max-width: 720px)'

export function useSearchLayers() {
  const openInline = ref(false)
  const openDrawer = ref(false)
  const mobileSearchMode = ref(false)
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | undefined
  let updateMobile: (() => void) | undefined
  const activeLayer = computed<SearchLayer>(() => {
    if (openDrawer.value) return 'drawer'
    if (mobileSearchMode.value) return 'mobile'
    if (openInline.value) return 'preview'
    return 'none'
  })

  onMounted(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    mediaQuery = query
    updateMobile = () => {
      isMobile.value = query.matches
      if (isMobile.value && openInline.value) openMobilePanel()
      else if (!isMobile.value && mobileSearchMode.value) closeMobilePanel()
    }

    updateMobile()
    query.addEventListener('change', updateMobile)
  })

  onUnmounted(() => {
    if (mediaQuery && updateMobile) {
      mediaQuery.removeEventListener('change', updateMobile)
    }
  })

  function openInlineSearch() {
    mobileSearchMode.value = false
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
    openDrawer.value = true
  }

  return {
    activeLayer,
    closeAllLayers,
    closeDrawer,
    closeInline,
    closeMobilePanel,
    isMobile,
    mobileSearchMode,
    openDrawer,
    openInline,
    openInlineSearch,
    openMobilePanel,
    openResultsDrawer,
  }
}
