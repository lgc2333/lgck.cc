<script setup lang="ts">
withDefaults(
  defineProps<{
    src: string
    alt?: string
    variant?: 'feed' | 'article'
  }>(),
  {
    alt: '',
    variant: 'feed',
  },
)
</script>

<template>
  <div
    class="lgc-post-cover-frame"
    relative
    grid
    overflow-hidden
    isolate
    bg="$md-sys-color-surface-container"
    :class="`is-${variant}`"
  >
    <img
      absolute
      inset-0
      z="-2"
      w="full"
      h="full"
      object-cover
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
    />
    <div absolute inset-0 z="-1" pointer-events-none aria-hidden="true" />
    <div col-start-1 row-start-1 grid min-w="0">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-cover-frame {
  color: var(--lgc-post-cover-on-mask);
  --lgc-post-cover-mask-solid: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-lowest) 88%,
    transparent
  );
  --lgc-post-cover-mask-strong: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-low) 72%,
    transparent
  );
  --lgc-post-cover-mask-soft: color-mix(
    in srgb,
    var(--md-sys-color-surface-container) 38%,
    transparent
  );
  --lgc-post-cover-mask-faint: color-mix(
    in srgb,
    var(--md-sys-color-surface) 12%,
    transparent
  );
  --lgc-post-cover-on-mask: var(--md-sys-color-on-surface);
  --lgc-post-cover-on-mask-variant: color-mix(
    in srgb,
    var(--md-sys-color-on-surface-variant) 58%,
    var(--md-sys-color-on-surface)
  );
  --lgc-post-cover-text-shadow: 0 1px 8px
    color-mix(in srgb, var(--md-sys-color-surface) 36%, transparent);
}

html.dark .lgc-post-cover-frame {
  --lgc-post-cover-on-mask-variant: color-mix(
    in srgb,
    var(--md-sys-color-on-surface-variant) 62%,
    var(--md-sys-color-on-surface)
  );
}

.lgc-post-cover-frame.is-feed {
  --lgc-post-cover-ratio-size: 28.5714%;
  @apply 'max-md:[--lgc-post-cover-ratio-size:38.0952%]';
}

.lgc-post-cover-frame.is-article {
  --lgc-post-cover-ratio-size: 38.0952%;
  --lgc-post-cover-min-height: 320px;
  @apply 'max-sm:[--lgc-post-cover-ratio-size:75%]';
  @apply 'max-sm:[--lgc-post-cover-min-height:288px]';
}

// Residual: aspect-ratio spacer via padding-block-end percentage.
.lgc-post-cover-frame::before {
  @apply 'col-start-1 row-start-1';
  min-height: var(--lgc-post-cover-min-height, 0);
  padding-block-end: var(--lgc-post-cover-ratio-size);
  content: '';
}
</style>
