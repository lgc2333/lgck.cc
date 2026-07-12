import { computed, ref } from 'vue'

import type { FixedBgImageMeta } from '../types'
import { useThemeConfig } from './config'

const SWITCH_DEBOUNCE = 120

// Module-scope state survives Valaxy route component remounts, so a single
// configured background image does not fade out to the fallback on navigation.
const visibleImage = ref<FixedBgImageMeta>()
const activeLayer = ref(0)
const imageLayers = ref<(FixedBgImageMeta | undefined)[]>([undefined, undefined])
const hasVisibleImage = computed(() => !!visibleImage.value)
const isSwitching = ref(false)

let debounceTimer: number | undefined
let requestId = 0
let pendingSwitch = false
let sequentialIndex = -1
let randomQueue: number[] = []
let lastListKey = ''

function escapeCssUrl(url: string) {
  return url.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

function isFixedBgImageMeta(value: unknown): value is FixedBgImageMeta {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as FixedBgImageMeta).url === 'string'
  )
}

function getListKey(list: FixedBgImageMeta[]) {
  return list.map((item) => item.url).join('\u0000')
}

function resetListStateIfNeeded(list: FixedBgImageMeta[]) {
  const listKey = getListKey(list)
  if (listKey === lastListKey) return

  lastListKey = listKey
  sequentialIndex = -1
  randomQueue = []
}

function createRandomQueue(length: number) {
  const queue = Array.from({ length }, (_, index) => index)

  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[queue[i], queue[j]] = [queue[j], queue[i]]
  }

  return queue
}

function preloadImage(meta: FixedBgImageMeta) {
  return new Promise<FixedBgImageMeta>((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(meta)
    image.onerror = () =>
      reject(new Error(`Failed to load fixed background image: ${meta.url}`))
    image.decoding = 'async'
    image.src = meta.url
  })
}

function showImage(meta: FixedBgImageMeta) {
  const nextLayer = activeLayer.value === 0 ? 1 : 0

  imageLayers.value[nextLayer] = meta
  activeLayer.value = nextLayer
  visibleImage.value = meta
}

function getImageBackgroundStyle(image?: FixedBgImageMeta) {
  return image ? { backgroundImage: `url("${escapeCssUrl(image.url)}")` } : undefined
}

function cancelScheduledSwitch() {
  if (!debounceTimer) return

  window.clearTimeout(debounceTimer)
  debounceTimer = undefined
}

export function useFixedBg() {
  const themeConfig = useThemeConfig()
  const canSwitchImage = computed(() => {
    const source = themeConfig.value.fixedBg?.image

    if (typeof source === 'function') return true
    if (Array.isArray(source)) return source.length > 1

    return false
  })

  function pickFromList(list: FixedBgImageMeta[]) {
    resetListStateIfNeeded(list)

    if (themeConfig.value.fixedBg?.switchMode === 'random') {
      if (!randomQueue.length) randomQueue = createRandomQueue(list.length)
      const index = randomQueue.shift()
      return typeof index === 'number' ? list[index] : undefined
    }

    sequentialIndex = (sequentialIndex + 1) % list.length
    return list[sequentialIndex]
  }

  async function resolveNextImage() {
    const source = themeConfig.value.fixedBg?.image

    if (typeof source === 'function') return source()
    if (Array.isArray(source)) return source.length ? pickFromList(source) : undefined
    if (isFixedBgImageMeta(source)) return source
  }

  async function runSwitch() {
    if (isSwitching.value) {
      pendingSwitch = true
      return
    }

    isSwitching.value = true
    const currentRequestId = ++requestId

    try {
      const nextImage = await resolveNextImage()
      if (currentRequestId !== requestId || !isFixedBgImageMeta(nextImage)) return
      if (nextImage.url === visibleImage.value?.url) return

      const loadedImage = await preloadImage(nextImage)
      if (currentRequestId !== requestId) return

      showImage(loadedImage)
    } catch {
      // Keep the current image or fallback atmosphere when provider/preload fails.
    } finally {
      isSwitching.value = false

      if (pendingSwitch) {
        pendingSwitch = false
        void runSwitch()
      }
    }
  }

  function scheduleSwitch() {
    if (isSwitching.value) requestId++

    cancelScheduledSwitch()

    debounceTimer = window.setTimeout(() => {
      debounceTimer = undefined
      void runSwitch()
    }, SWITCH_DEBOUNCE)
  }

  function switchNow() {
    cancelScheduledSwitch()
    return runSwitch()
  }

  return {
    activeLayer,
    canSwitchImage,
    cancelScheduledSwitch,
    getImageBackgroundStyle,
    hasVisibleImage,
    imageLayers,
    isSwitching,
    scheduleSwitch,
    switchNow,
    visibleImage,
  }
}
