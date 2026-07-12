<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useFixedBg } from '../composables'

const { canSwitchImage, isSwitching, switchNow, visibleImage } = useFixedBg()
const { t } = useI18n()

const actionHref = computed(() => {
  const image = visibleImage.value
  return image?.sourceUrl || image?.url || ''
})
const title = computed(() => visibleImage.value?.title || t('fixed_bg.title'))
const author = computed(() => visibleImage.value?.author)
const description = computed(
  () => visibleImage.value?.description || t('fixed_bg.empty_description'),
)
const switchLabel = computed(() =>
  isSwitching.value ? t('fixed_bg.loading') : t('fixed_bg.refresh'),
)

function refreshBackground() {
  if (isSwitching.value) return

  void switchNow()
}
</script>

<template>
  <LgcFloatingActionButton
    v-if="visibleImage && actionHref"
    :href="actionHref"
    interactive-detail
    :label="title"
  >
    <span i-material-symbols-imagesmode-outline-rounded aria-hidden="true" />

    <template #detail>
      <span class="lgc-fixed-bg-action-detail">
        <span
          class="lgc-fixed-bg-action-title"
          block
          font="900"
          text="$md-sys-color-on-surface"
        >
          {{ title }}
        </span>
        <span
          v-if="author"
          class="lgc-fixed-bg-action-author"
          block
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant"
        >
          {{ author }}
        </span>
        <span
          class="lgc-fixed-bg-action-description"
          block
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant"
        >
          {{ description }}
        </span>
        <button
          v-if="canSwitchImage"
          class="lgc-fixed-bg-action-refresh"
          type="button"
          :disabled="isSwitching"
          :aria-label="switchLabel"
          @click="refreshBackground"
        >
          <span
            class="lgc-fixed-bg-action-refresh-icon"
            :class="{ 'is-loading': isSwitching }"
            i-material-symbols-refresh-rounded
            aria-hidden="true"
          />
          <span>{{ switchLabel }}</span>
        </button>
      </span>
    </template>
  </LgcFloatingActionButton>
</template>

<style scoped lang="scss">
.lgc-fixed-bg-action-detail {
  @apply 'block min-w-0';
}

.lgc-fixed-bg-action-title,
.lgc-fixed-bg-action-author,
.lgc-fixed-bg-action-description {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.lgc-fixed-bg-action-refresh {
  @apply 'mt-$lgc-space-sm inline-flex items-center gap-$lgc-gap-compact';
  @apply 'border-0 p-0 text-$md-sys-color-primary text-size-$lgc-label-medium';
  @apply 'font-900 no-underline bg-transparent appearance-none cursor-pointer';
  @apply 'transition-[color,opacity] duration-$lgc-motion-short ease-$lgc-easing-standard';
  @apply 'hover:text-$md-sys-color-tertiary disabled:cursor-wait disabled:opacity-70';
}

.lgc-fixed-bg-action-refresh-icon {
  @apply 'h-1em w-1em text-size-$lgc-icon-size-sm';
}

.lgc-fixed-bg-action-refresh-icon.is-loading {
  animation: lgc-fixed-bg-action-spin 900ms linear infinite;
}

@keyframes lgc-fixed-bg-action-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
