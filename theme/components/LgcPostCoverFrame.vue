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
  <div class="lgc-post-cover-frame" :class="`is-${variant}`">
    <img
      class="lgc-post-cover-image"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
    />
    <div class="lgc-post-cover-mask" aria-hidden="true" />
    <div class="lgc-post-cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.lgc-post-cover-frame {
  position: relative;
  display: grid;
  overflow: hidden;
  isolation: isolate;
  color: var(--lgc-post-cover-on-mask);
  background: var(--md-sys-color-surface-container);
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
  --lgc-post-cover-text-shadow: 0 0.0625rem 0.5rem
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
}

.lgc-post-cover-frame.is-article {
  --lgc-post-cover-ratio-size: 38.0952%;
  --lgc-post-cover-min-height: 20rem;
}

.lgc-post-cover-frame::before {
  grid-area: 1 / 1;
  min-height: var(--lgc-post-cover-min-height, 0);
  padding-block-end: var(--lgc-post-cover-ratio-size);
  content: '';
}

.lgc-post-cover-image,
.lgc-post-cover-mask {
  position: absolute;
  inset: 0;
}

.lgc-post-cover-image {
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lgc-post-cover-mask {
  z-index: -1;
  pointer-events: none;
}

.lgc-post-cover-content {
  grid-area: 1 / 1;
  display: grid;
  min-width: 0;
}

@media (max-width: 639px) {
  .lgc-post-cover-frame.is-feed {
    --lgc-post-cover-ratio-size: 38.0952%;
  }

  .lgc-post-cover-frame.is-article {
    --lgc-post-cover-ratio-size: 75%;
    --lgc-post-cover-min-height: 18rem;
  }
}

@media (max-width: 719px) {
  .lgc-post-cover-frame.is-feed {
    --lgc-post-cover-ratio-size: 38.0952%;
  }
}
</style>
