<script lang="ts" setup>
import { useBackToTop } from 'valaxy'
import { computed } from 'vue'

const { show, percentage, backToTop } = useBackToTop({ offset: 100 })

const progressViewBoxSize = 56
const progressStrokeWidth = 2
const progressInset = progressStrokeWidth / 2
const progressOuterRadius = 16
const progressRadius = progressOuterRadius - progressInset
const progressMin = progressInset
const progressMax = progressViewBoxSize - progressInset
const progressStart = progressViewBoxSize / 2
const progressCornerStart = progressMin + progressRadius
const progressCornerEnd = progressMax - progressRadius

const progressPath = [
  `M ${progressStart} ${progressMin}`,
  `H ${progressCornerEnd}`,
  `A ${progressRadius} ${progressRadius} 0 0 1 ${progressMax} ${progressCornerStart}`,
  `V ${progressCornerEnd}`,
  `A ${progressRadius} ${progressRadius} 0 0 1 ${progressCornerEnd} ${progressMax}`,
  `H ${progressCornerStart}`,
  `A ${progressRadius} ${progressRadius} 0 0 1 ${progressMin} ${progressCornerEnd}`,
  `V ${progressCornerStart}`,
  `A ${progressRadius} ${progressRadius} 0 0 1 ${progressCornerStart} ${progressMin}`,
  `H ${progressStart}`,
].join(' ')

const strokeOffset = computed(() => {
  const progress = Math.min(Math.max(percentage.value, 0), 1)
  return 1 - progress
})
</script>

<template>
  <div class="lgc-back-to-top">
    <Transition name="lgc-back-to-top-fade">
      <button
        v-if="show"
        class="lgc-back-to-top-button lgc-icon-button-base lgc-icon-button-hover"
        type="button"
        aria-label="Back to top"
        @click="backToTop"
      >
        <span i-material-symbols-keyboard-arrow-up-rounded aria-hidden="true" />
        <svg class="lgc-back-to-top-progress" viewBox="0 0 56 56" aria-hidden="true">
          <path
            class="lgc-back-to-top-progress-indicator"
            :d="progressPath"
            fill="none"
            pathLength="1"
            :stroke-width="progressStrokeWidth"
            stroke-dasharray="1"
            :stroke-dashoffset="strokeOffset"
          />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.lgc-back-to-top {
  position: fixed;
  z-index: var(--lgc-layer-floating);
  right: 2rem;
  bottom: 2rem;
  display: none;
}

.lgc-back-to-top-button {
  --lgc-back-to-top-size: 3.5rem;
  --lgc-back-to-top-radius: 1rem;

  position: relative;
  width: var(--lgc-back-to-top-size);
  height: var(--lgc-back-to-top-size);
  overflow: visible;
  border-radius: var(--lgc-back-to-top-radius);
  color: var(--md-sys-color-primary);
  font-size: 1.5rem;
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--lgc-elevation-shadow-level-2);
  transition:
    background-color var(--lgc-motion-short) var(--lgc-easing-standard),
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    box-shadow var(--lgc-motion-short) var(--lgc-easing-standard),
    color var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover,
  &:focus-visible {
    border-radius: var(--lgc-back-to-top-radius);
    color: var(--md-sys-color-primary);
    background: var(--md-sys-color-surface-container-highest);
    box-shadow: var(--lgc-elevation-shadow-level-3);
  }

  &:active {
    border-radius: var(--lgc-back-to-top-radius);
    background: var(--md-sys-color-surface-container-highest);
  }
}

.lgc-back-to-top-progress {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.lgc-back-to-top-progress-indicator {
  stroke: currentColor;
  stroke-linecap: round;
  transition: stroke-dashoffset var(--lgc-motion-short) var(--lgc-easing-standard);
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
