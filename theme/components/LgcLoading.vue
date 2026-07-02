<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { computed } from 'vue'

withDefaults(
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
</script>

<template>
  <Transition name="lgc-material-loader">
    <div
      v-if="app.showLoading"
      class="lgc-material-loader"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <LgcLoadingIndicator
        :size="size"
        :color="color || loaderColor"
        :container-color="containerColor || loaderContainerColor"
        contained
      />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.lgc-material-loader {
  position: fixed;
  z-index: 1030;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: var(--md-sys-color-surface);
}

.lgc-material-loader-enter-active,
.lgc-material-loader-leave-active {
  transition:
    opacity var(--lgc-motion-medium) var(--lgc-easing-standard),
    filter var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-material-loader-enter-from,
.lgc-material-loader-leave-to {
  filter: blur(8px);
  opacity: 0;
}
</style>
