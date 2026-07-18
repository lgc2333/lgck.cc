<script setup lang="ts">
import { useFixedBgPresenter } from '../../composables'

const {
  actionHref,
  author,
  canSwitchImage,
  description,
  isSwitching,
  refresh,
  switchLabel,
  title,
  visibleImage,
} = useFixedBgPresenter()
</script>

<template>
  <LgcFloatingActionButton
    v-if="visibleImage && actionHref"
    class="max-md:hidden!"
    :href="actionHref"
    interactive-detail
    :label="title"
  >
    <span i-material-symbols-imagesmode-outline-rounded aria-hidden="true" />

    <template #detail>
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
        v-if="description"
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
        gap="$lgc-space-xs"
        mt="$lgc-space-xs"
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
        @click="refresh"
      >
        <span
          :class="{ 'is-loading': isSwitching }"
          i-material-symbols-refresh-rounded
          h="0.825em"
          w="0.825em"
          text="size-$lgc-icon-size-sm"
          aria-hidden="true"
        />
        <span>{{ switchLabel }}</span>
      </button>
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
