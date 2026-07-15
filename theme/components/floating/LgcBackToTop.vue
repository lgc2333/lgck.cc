<script lang="ts" setup>
import { useBackToTop } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  <Transition name="lgc-back-to-top-fade">
    <LgcFloatingActionButton
      v-if="show"
      :label="t('sidebar.return_top')"
      @click="backToTop"
    >
      <span i-material-symbols-keyboard-arrow-up-rounded aria-hidden="true" />
      <svg
        w="full"
        h="full"
        pointer-events-none
        inset-0
        absolute
        overflow-visible
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <path
          class="transition-[stroke-dashoffset] duration-$lgc-motion-short ease-$lgc-easing-standard"
          stroke-current
          :d="progressPath"
          fill="none"
          pathLength="1"
          :stroke-width="progressStrokeWidth"
          stroke-dasharray="1"
          :stroke-dashoffset="strokeOffset"
          stroke-linecap="round"
        />
      </svg>
    </LgcFloatingActionButton>
  </Transition>
</template>

<style scoped lang="scss">
.lgc-back-to-top-fade-enter-active,
.lgc-back-to-top-fade-leave-active {
  @apply 'transition-[opacity,transform] duration-$lgc-motion-short';
  @apply 'ease-$lgc-easing-standard';
}

.lgc-back-to-top-fade-enter-from,
.lgc-back-to-top-fade-leave-to {
  @apply 'opacity-0';
  transform: translateY(var(--lgc-space-sm));
}
</style>
