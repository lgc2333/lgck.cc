<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { computed, onBeforeUnmount, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    size?: number | string
    color?: string
    containerColor?: string
    minVisible?: number
  }>(),
  {
    size: 96,
    minVisible: 650,
  },
)

const app = useAppStore()
const loaderColor = computed(() => 'var(--md-sys-color-on-primary-container)')
const loaderContainerColor = computed(() => 'var(--md-sys-color-primary-container)')
const normalizedSize = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)

let hideTimer: number | undefined

onMounted(() => {
  hideTimer = window.setTimeout(() => {
    app.showLoading = false
  }, props.minVisible)
})

onBeforeUnmount(() => {
  if (hideTimer) window.clearTimeout(hideTimer)
})
</script>

<template>
  <Transition name="lgc-material-loader">
    <div
      v-if="app.showLoading"
      fixed
      inset-0
      z="$lgc-layer-loading"
      grid
      place-items="center"
      pointer-events-none
      bg="$md-sys-color-surface"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        relative
        grid
        place-items="center"
        w="$lgc-material-loader-size"
        h="$lgc-material-loader-size"
        :style="{ '--lgc-material-loader-size': normalizedSize }"
      >
        <LgcLoadingIndicator
          :size="size"
          :color="color || loaderColor"
          :container-color="containerColor || loaderContainerColor"
          bootstrap
          contained
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.lgc-material-loader-enter-active,
.lgc-material-loader-leave-active {
  @apply 'transition-[opacity,filter] duration-$lgc-motion-medium';
  @apply 'ease-$lgc-easing-standard';
}

.lgc-material-loader-enter-from,
.lgc-material-loader-leave-to {
  @apply 'opacity-0';
  filter: blur(var(--lgc-surface-blur));
}
</style>
