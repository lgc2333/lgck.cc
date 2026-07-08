import type { ComputedRef } from 'vue'

import type { SearchLayer } from './searchLayers'

export function useSearchKeyboard(options: {
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
