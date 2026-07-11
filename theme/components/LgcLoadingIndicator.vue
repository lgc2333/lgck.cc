<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface M3LoadingIndicatorCanvasOptions {
  color?: string
  contained?: boolean
  containerColor?: string
  paused?: boolean
  speed?: number
}

interface M3LoadingIndicatorCanvasController {
  destroy: () => void
  start: () => void
  update: (nextOptions: M3LoadingIndicatorCanvasOptions) => void
}

const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    containerColor?: string
    contained?: boolean
    bootstrap?: boolean
    speed?: number
    paused?: boolean
    label?: string
  }>(),
  {
    size: 48,
    color: 'currentColor',
    bootstrap: false,
    containerColor: 'rgba(0, 0, 0, 0.08)',
    contained: false,
    speed: 1,
    paused: false,
  },
)

const { t } = useI18n()
const resolvedLabel = computed(() => props.label || t('accessibility.loading'))
const normalizedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
const canvas = ref<HTMLCanvasElement>()

let controller: M3LoadingIndicatorCanvasController | undefined

function loadingIndicatorGlobal() {
  return window as Window & {
    __lgcLoadingIndicator?: {
      canvas: HTMLCanvasElement
      controller: M3LoadingIndicatorCanvasController
    }
    __lgcLoadingIndicatorRuntime?: {
      create: (
        canvas: HTMLCanvasElement,
        options?: M3LoadingIndicatorCanvasOptions,
      ) => M3LoadingIndicatorCanvasController
    }
  }
}

function currentOptions() {
  return {
    color: props.color,
    contained: props.contained,
    containerColor: props.containerColor,
    paused: props.paused,
    speed: props.speed,
  }
}

onMounted(async () => {
  await nextTick()

  if (!canvas.value) return

  const loadingIndicator = loadingIndicatorGlobal()

  if (
    props.bootstrap &&
    loadingIndicator.__lgcLoadingIndicator?.canvas === canvas.value
  ) {
    controller = loadingIndicator.__lgcLoadingIndicator.controller
    controller.update(currentOptions())
    return
  }

  const createM3LoadingIndicatorCanvas =
    loadingIndicator.__lgcLoadingIndicatorRuntime?.create
  if (!createM3LoadingIndicatorCanvas) return

  controller = createM3LoadingIndicatorCanvas(canvas.value, currentOptions())
  controller.start()
})

onBeforeUnmount(() => {
  const loadingIndicator = loadingIndicatorGlobal()

  controller?.destroy()
  if (loadingIndicator.__lgcLoadingIndicator?.canvas === canvas.value) {
    loadingIndicator.__lgcLoadingIndicator = undefined
  }
})

watch(
  () => [
    props.size,
    props.color,
    props.containerColor,
    props.contained,
    props.paused,
    props.speed,
  ],
  async () => {
    await nextTick()
    controller?.update(currentOptions())
  },
)
</script>

<template>
  <canvas
    ref="canvas"
    block
    w="$lgc-m3-loading-indicator-size"
    h="$lgc-m3-loading-indicator-size"
    :aria-label="resolvedLabel"
    role="img"
    :data-lgc-loading-indicator="bootstrap ? 'boot' : undefined"
    :style="{
      '--lgc-m3-loading-indicator-size': normalizedSize,
      color,
    }"
  />
</template>
