<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { createM3LoadingIndicatorCanvas } from '../utils/m3-loading-indicator'
import type { M3LoadingIndicatorCanvasController } from '../utils/m3-loading-indicator'

const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    containerColor?: string
    contained?: boolean
    speed?: number
    paused?: boolean
    label?: string
  }>(),
  {
    size: 48,
    color: 'currentColor',
    containerColor: 'rgba(0, 0, 0, 0.08)',
    contained: false,
    speed: 1,
    paused: false,
    label: 'Loading',
  },
)

const normalizedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
const canvas = ref<HTMLCanvasElement>()

let controller: M3LoadingIndicatorCanvasController | undefined

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

  controller = createM3LoadingIndicatorCanvas(canvas.value, currentOptions())
  controller.start()
})

onBeforeUnmount(() => {
  controller?.destroy()
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
    class="lgc-m3-loading-indicator"
    :aria-label="label"
    role="img"
    :style="{
      '--lgc-m3-loading-indicator-size': normalizedSize,
      color,
    }"
  />
</template>

<style scoped lang="scss">
.lgc-m3-loading-indicator {
  display: block;
  width: var(--lgc-m3-loading-indicator-size);
  height: var(--lgc-m3-loading-indicator-size);
}
</style>
