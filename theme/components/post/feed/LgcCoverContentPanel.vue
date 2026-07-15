<script setup lang="ts">
import type { CoverContentMask, CoverContentPosition } from '../../../types'

withDefaults(
  defineProps<{
    mask?: CoverContentMask
    position?: CoverContentPosition
  }>(),
  {
    mask: 'gradient',
    position: 'left',
  },
)
</script>

<template>
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
</template>

<style lang="scss">
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
  @apply 'absolute right-$lgc-space-xl sm:right-$lgc-space-2xl top-1/2 -translate-y-1/2 max-sm:hidden sm:inline-grid';
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
    @apply 'top-$lgc-space-2xl translate-y-0';
  }
}
</style>
