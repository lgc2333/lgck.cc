<script setup lang="ts">
import type { CoverContentMask, CoverContentPosition } from '../../../types'

const props = withDefaults(
  defineProps<{
    cover?: string
    mask?: CoverContentMask
    position?: CoverContentPosition
    title: string
    variant: 'plain' | 'cover'
  }>(),
  {
    mask: 'gradient',
    position: 'left',
  },
)
</script>

<template>
  <article
    class="lgc-post-card lgc-card-link"
    grid
    items-start
    relative
    gap="$lgc-space-lg sm:$lgc-space-2xl"
    p="$lgc-space-xl sm:$lgc-space-2xl"
    :class="{ 'has-cover': props.variant === 'cover' && cover }"
  >
    <slot name="status" />

    <LgcPostCoverFrame
      v-if="props.variant === 'cover' && cover"
      rounded-inherit
      :src="cover"
      :alt="title"
      variant="feed"
    >
      <LgcCoverContentPanel :mask="mask" :position="position">
        <template #corner>
          <slot name="corner" />
        </template>

        <template #content>
          <slot name="content" />
        </template>

        <template #action>
          <slot name="action" />
        </template>
      </LgcCoverContentPanel>
    </LgcPostCoverFrame>

    <template v-else>
      <slot name="corner" />
      <div class="lgc-post-frame-content-plain">
        <div class="lgc-post-frame-title-plain">
          <slot name="title" />
        </div>
        <div class="lgc-post-frame-body-plain">
          <slot name="content" />
        </div>
      </div>
      <slot name="below" />
      <slot name="action" />
    </template>
  </article>
</template>

<style lang="scss">
// Residual: grid tracks, rest bg token, title/arrow-owned lift.
.lgc-post-card {
  --lgc-post-card-rest-bg: var(--md-sys-color-surface-container-low);
  --post-card-cols: 84px minmax(0, 1fr);
  grid-template-columns: var(--post-card-cols);
  background: var(--lgc-post-card-rest-bg);
}

@screen sm {
  .lgc-post-card:not(.has-cover) {
    --post-card-cols: 120px minmax(0, 1fr) auto;
  }
}

.lgc-post-card:focus-within {
  @apply 'rounded-$lgc-radius-large-active bg-$md-sys-color-surface-container';
}

.lgc-post-card > :not(.lgc-post-status-icons) {
  @apply 'relative z-$lgc-layer-local-base';
}

// Whole-card hover: keep rest shape/lift (no radius morph, no translate).
// Lift + radius morph only when title or arrow is the target.
.lgc-post-card.lgc-card-link:hover {
  @apply 'rounded-$lgc-radius-large';
  transform: none;
}

.lgc-post-card.lgc-card-link:active {
  @apply 'rounded-$lgc-radius-large';
  background: var(--lgc-post-card-rest-bg);
  transform: none;
}

.lgc-post-card.lgc-card-link:has(
    .lgc-post-title-link:hover,
    .lgc-post-title-link:focus-visible,
    .lgc-post-arrow:hover,
    .lgc-post-arrow:focus-visible
  ) {
  @apply 'rounded-$lgc-radius-large-active';
  transform: translateY(-2px);
}

.lgc-post-card.lgc-card-link:has(.lgc-post-title-link:active, .lgc-post-arrow:active) {
  @apply 'rounded-$lgc-radius-large-active';
  background: var(--md-sys-color-surface-container-high);
  transform: scale(var(--lgc-card-press-scale));
}

// Keep rest bg as plain-card low while cover loads / fails.
.lgc-post-card.has-cover {
  @apply 'block p-0';
  color: var(--lgc-post-cover-on-mask);
}

.lgc-post-frame-content-plain {
  @apply 'min-w-0 self-center max-sm:contents';
}

.lgc-post-frame-title-plain {
  @apply 'min-w-0 max-sm:self-center';
}

.lgc-post-frame-body-plain {
  @apply 'min-w-0 mt-$lgc-space-md max-sm:col-span-full max-sm:mt-0';
}
</style>
