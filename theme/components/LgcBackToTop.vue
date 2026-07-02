<script lang="ts" setup>
import { isClient, useWindowScroll } from '@vueuse/core'
import { computed } from 'vue'

const { y } = useWindowScroll()
const showBackToTop = computed(() => y.value > 50)

function backToTop() {
  if (!isClient) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="lgc-back-to-top">
    <Transition name="lgc-back-to-top-fade">
      <button
        v-if="showBackToTop"
        class="lgc-back-to-top-button lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        aria-label="Back to top"
        @click="backToTop"
      >
        <span i-material-symbols-keyboard-arrow-up-rounded aria-hidden="true" />
      </button>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.lgc-back-to-top {
  position: fixed;
  z-index: 40;
  right: 2rem;
  bottom: 2rem;
  display: none;
}

.lgc-back-to-top-button {
  width: var(--lgc-control-size);
  height: var(--lgc-control-size);
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-primary);
  font-size: 1.5rem;
  background: var(--md-sys-color-surface-container-high);

  &:hover,
  &:focus-visible {
    border-radius: var(--lgc-radius-control-active);
  }
}

.lgc-back-to-top-fade-enter-active,
.lgc-back-to-top-fade-leave-active {
  transition:
    opacity var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-back-to-top-fade-enter-from,
.lgc-back-to-top-fade-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

@media (min-width: 768px) {
  .lgc-back-to-top {
    display: block;
  }
}
</style>
