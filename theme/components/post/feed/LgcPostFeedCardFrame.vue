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
    class="lgc-post-card"
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
      <div
        class="lgc-cover-content-panel"
        w="full"
        min-h="full"
        grid-rows="[auto_minmax(min-content,1fr)]"
        grid-cols="1"
        grid
        content-between
        items-stretch
        relative
        gap="$lgc-space-lg sm:$lgc-space-2xl"
        p="$lgc-space-xl sm:$lgc-space-2xl"
        :class="[`is-${mask}`, `is-${position}`]"
      >
        <div class="lgc-cover-content-panel-corner">
          <slot name="corner" />
        </div>

        <div class="lgc-cover-content-panel-content">
          <slot name="content" />
        </div>

        <slot name="action" />
      </div>
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

  @apply 'overflow-hidden rounded-$lgc-radius-large text-$md-sys-color-on-surface';
  grid-template-columns: var(--post-card-cols);
  background: var(--lgc-post-card-rest-bg);
  transition-property: background-color, border-radius, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
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

// Lift + radius morph only when title or arrow is the target.
.lgc-post-card:has(
  .lgc-post-title-link:hover,
  .lgc-post-title-link:focus-visible,
  .lgc-post-arrow:hover,
  .lgc-post-arrow:focus-visible
) {
  @apply 'rounded-$lgc-radius-large-active';
  transform: translateY(-2px);
}

.lgc-post-card:has(.lgc-post-title-link:active, .lgc-post-arrow:active) {
  @apply 'rounded-$lgc-radius-large-active';
  background: var(--md-sys-color-surface-container-high);
  transform: scale(var(--lgc-card-press-scale));
}

.lgc-post-arrow {
  @apply 'w-$lgc-control-size h-$lgc-control-size self-center';
  @apply 'rounded-$lgc-radius-control text-$md-sys-color-primary';
  @apply 'text-size-$lgc-icon-size bg-$md-sys-color-surface-container-highest';
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

// Residual: color-mix, gradient mask, asymmetric card radii, bleed layout.
.lgc-cover-content-panel-corner {
  @apply 'relative z-$lgc-layer-local-raised row-start-1 col-start-1 self-start justify-self-start';
}

.lgc-cover-content-panel-corner .lgc-post-date-badge {
  @apply 'text-$md-sys-color-on-primary-container';
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 65%,
    transparent
  );
  backdrop-filter: blur(var(--lgc-elevate-blur));
}

.lgc-cover-content-panel .lgc-post-arrow {
  @apply 'absolute right-$lgc-space-xl sm:right-$lgc-space-2xl top-1/2 max-sm:hidden sm:inline-grid';
  transform: translateY(-50%);
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 30%,
    transparent
  );
  backdrop-filter: blur(var(--lgc-elevate-blur));
}

.lgc-cover-content-panel-content {
  @apply 'col-start-1 row-start-2 self-end relative min-w-0';
}

.lgc-cover-content-panel.is-gradient .lgc-cover-content-panel-content {
  --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-xl);
  --lgc-post-cover-gradient-color: var(--md-sys-color-surface-container-lowest);
  --lgc-post-cover-bleed: var(--lgc-space-xl);
  --cover-bleed-width: calc(100% + 2 * var(--lgc-post-cover-bleed));
  --cover-bleed-out: calc(var(--lgc-post-cover-bleed) * -1);
  --cover-pad-inline-end: var(--lgc-space-xl);
  --cover-grad-start: calc(var(--lgc-post-cover-gradient-padding-block-end) * -2);

  @apply 'z-$lgc-layer-local-base justify-self-stretch max-w-none';
  @apply 'rounded-none bg-transparent';
  @apply 'w-$cover-bleed-width mb-$cover-bleed-out mx-$cover-bleed-out';
  @apply 'py-$lgc-post-cover-gradient-padding-block-end ps-$lgc-post-cover-bleed pe-$cover-pad-inline-end';
  @apply 'text-$lgc-post-cover-on-mask';
}

.lgc-cover-content-panel.is-gradient .lgc-cover-content-panel-content::before {
  @apply 'absolute -z-1 inset-x-0 bottom-0';
  inset-block-start: var(--cover-grad-start);
  content: '';
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 76%, transparent) 0%,
    color-mix(in srgb, var(--lgc-post-cover-gradient-color) 46%, transparent) 52%,
    transparent 100%
  );
}

.lgc-cover-content-panel.is-card .lgc-cover-content-panel-content {
  --lgc-post-cover-bleed: var(--lgc-space-xl);
  --cover-bleed-out: calc(var(--lgc-post-cover-bleed) * -1);
  --cover-card-max-w: none;
  --cover-radius-wide: calc(var(--lgc-radius-large) * 2.5);
  --cover-radius-soft: calc(var(--lgc-radius-large) * 0.5);

  @apply 'z-$lgc-layer-local-raised col-span-full justify-self-stretch w-auto';
  @apply 'max-w-none text-$md-sys-color-on-surface';
  @apply 'mb-$cover-bleed-out mx-$cover-bleed-out p-$lgc-post-cover-bleed';
  @apply 'rounded-t-$lgc-radius-large rounded-b-0';
  background: color-mix(in srgb, var(--md-sys-color-surface) 65%, transparent);
}

@screen sm {
  .lgc-cover-content-panel.is-gradient .lgc-cover-content-panel-content {
    --lgc-post-cover-gradient-padding-block-end: var(--lgc-space-2xl);
    --lgc-post-cover-bleed: var(--lgc-space-2xl);
    --cover-pad-inline-end: calc(var(--lgc-control-size) + var(--lgc-space-lg));
  }

  .lgc-cover-content-panel.is-gradient.is-right .lgc-cover-content-panel-content {
    @apply 'justify-self-stretch justify-items-end rounded-none';
    @apply 'mx-$cover-bleed-out px-$lgc-post-cover-bleed';
  }

  .lgc-cover-content-panel.is-card .lgc-cover-content-panel-content {
    --lgc-post-cover-bleed: var(--lgc-space-2xl);
    --cover-card-max-w: min(
      672px,
      calc(100% - var(--lgc-control-size) - var(--lgc-space-lg))
    );

    @apply 'col-auto justify-self-start w-fit';
    @apply 'mx-0 ms-$cover-bleed-out max-w-$cover-card-max-w';
    @apply 'rounded-tl-$lgc-radius-large rounded-tr-$cover-radius-wide';
    @apply 'rounded-bl-0 rounded-br-$cover-radius-soft';
  }

  .lgc-cover-content-panel.is-card.is-right .lgc-cover-content-panel-content {
    @apply 'grid justify-self-end justify-items-end';
    @apply 'ms-0 me-$cover-bleed-out';
    @apply 'rounded-tl-$cover-radius-wide rounded-tr-$lgc-radius-large';
    @apply 'rounded-bl-$cover-radius-soft rounded-br-0';
  }

  .lgc-cover-content-panel.is-right .lgc-post-arrow {
    @apply 'top-$lgc-space-2xl';
    transform: none;
  }
}
</style>
