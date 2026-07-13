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
      <span block min-w="0">
        <span
          block
          font="900"
          text="$md-sys-color-on-surface"
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ title }}
        </span>
        <span
          v-if="author"
          block
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant"
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ author }}
        </span>
        <span
          block
          mt="0.5"
          font="400"
          text="$md-sys-color-on-surface-variant"
          whitespace="pre-wrap"
          wrap="anywhere"
        >
          {{ description }}
        </span>
        <button
          v-if="canSwitchImage"
          class="appearance-none bg-transparent no-underline inline-flex items-center"
          gap="$lgc-gap-compact"
          mt="$lgc-space-sm"
          border="0"
          p="0"
          text="$md-sys-color-primary size-$lgc-label-medium"
          font="900"
          cursor="pointer"
          transition="[color,opacity]"
          duration="$lgc-motion-short"
          ease="$lgc-easing-standard"
          hover="text-$md-sys-color-tertiary"
          un-disabled="opacity-70 cursor-wait"
          type="button"
          :disabled="isSwitching"
          :aria-label="switchLabel"
          @click="refreshBackground"
        >
          <span
            :class="{ 'is-loading': isSwitching }"
            i-material-symbols-refresh-rounded
            h="1em"
            w="1em"
            text="size-$lgc-icon-size-sm"
            aria-hidden="true"
          />
          <span>{{ switchLabel }}</span>
        </button>
      </span>
    </template>
  </LgcFloatingActionButton>
</template>

<style scoped lang="scss">
.is-loading {
  animation: lgc-fixed-bg-action-spin 900ms linear infinite;
}

@keyframes lgc-fixed-bg-action-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
