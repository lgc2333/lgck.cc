<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

const props = withDefaults(
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

const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const failed = ref(false)

function syncFromImage(el: HTMLImageElement | null) {
  if (!el) return
  if (el.complete && el.naturalWidth > 0) {
    loaded.value = true
    failed.value = false
    return
  }
  if (el.complete && el.naturalWidth === 0 && el.currentSrc) {
    loaded.value = false
    failed.value = true
  }
}

function onLoad() {
  loaded.value = true
  failed.value = false
}

function onError() {
  loaded.value = false
  failed.value = true
}

watch(
  () => props.src,
  () => {
    loaded.value = false
    failed.value = false
    void nextTick(() => syncFromImage(imgRef.value))
  },
)

onMounted(() => {
  syncFromImage(imgRef.value)
})
</script>

<template>
  <div
    class="lgc-post-cover-frame"
    grid
    relative
    overflow-hidden
    isolate
    bg="$md-sys-color-surface-container-low"
    :class="[`is-${variant}`, { 'is-loaded': loaded, 'is-failed': failed }]"
  >
    <img
      ref="imgRef"
      class="lgc-post-cover-img"
      :class="{ 'is-ready': loaded }"
      z="-2"
      w="full"
      h="full"
      inset-0
      absolute
      object-cover
      opacity="0"
      transition="opacity"
      duration="$lgc-motion-medium"
      ease="$lgc-easing-standard"
      :src="src"
      :alt="alt"
      loading="lazy"
      decoding="async"
      @load="onLoad"
      @error="onError"
    />
    <div
      class="lgc-post-cover-skeleton"
      :class="{ 'is-done': loaded || failed }"
      z="-1"
      pointer-events-none
      inset-0
      absolute
      overflow-hidden
      opacity="100"
      transition="opacity"
      duration="$lgc-motion-medium"
      ease="$lgc-easing-standard"
      aria-hidden="true"
    />
    <div grid col-start-1 row-start-1 min-w="0">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
// Residual: cover mask/on-mask tokens (consumed by feed/article children).
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

.lgc-post-cover-img.is-ready {
  @apply 'opacity-100';
}

// Residual: solid base + translating sheen (::after). Infinite loop must be
// linear — standard easing restarts with a hitch. Light peak uses on-surface
// tint (container steps are too close); dark uses container-highest.
.lgc-post-cover-skeleton {
  --lgc-cover-skeleton-base: var(--md-sys-color-surface-container-low);
  --lgc-cover-skeleton-sheen: color-mix(
    in srgb,
    var(--md-sys-color-on-surface) 10%,
    transparent
  );
  background: var(--lgc-cover-skeleton-base);
}

html.dark .lgc-post-cover-skeleton {
  --lgc-cover-skeleton-sheen: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) 88%,
    transparent
  );
}

.lgc-post-cover-skeleton::after {
  @apply 'absolute inset-0';
  content: '';
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    var(--lgc-cover-skeleton-sheen) 50%,
    transparent 64%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: lgc-post-cover-shimmer 1.4s linear infinite;
}

.lgc-post-cover-skeleton.is-done {
  @apply 'opacity-0';
  animation: none;
}

.lgc-post-cover-skeleton.is-done::after {
  animation: none;
}

@keyframes lgc-post-cover-shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
