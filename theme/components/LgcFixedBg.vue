<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useFixedBg } from '../composables'

const route = useRoute()
const {
  activeLayer,
  cancelScheduledSwitch,
  getImageBackgroundStyle,
  hasVisibleImage,
  imageLayers,
  scheduleSwitch,
} = useFixedBg()

onMounted(() => {
  scheduleSwitch()
})

onBeforeUnmount(() => {
  cancelScheduledSwitch()
})

watch(
  () => route.fullPath,
  () => {
    scheduleSwitch()
  },
)
</script>

<template>
  <div
    class="lgc-fixed-bg"
    z="$lgc-layer-background"
    pointer-events-none
    inset-0
    fixed
    aria-hidden="true"
  >
    <div class="lgc-fixed-bg-atmosphere" inset-0 absolute />
    <div
      v-for="(image, index) in imageLayers"
      :key="index"
      class="lgc-fixed-bg-image"
      :class="{ 'is-visible': image && index === activeLayer }"
      :style="getImageBackgroundStyle(image)"
      inset-0
      absolute
    />
    <div
      class="lgc-fixed-bg-mask"
      :class="{ 'is-visible': hasVisibleImage }"
      inset-0
      absolute
    />
  </div>
</template>

<style scoped lang="scss">
.lgc-fixed-bg {
  @apply isolate overflow-hidden;
  --lgc-fixed-bg-fade-duration: 720ms;
}

// Multi-layer atmosphere stays raw CSS (not expressible cleanly as utilities).
.lgc-fixed-bg-atmosphere {
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--md-sys-color-primary) 24%, transparent) 0 2px,
      transparent 2.6px
    ),
    radial-gradient(
      circle,
      color-mix(in srgb, var(--md-sys-color-tertiary) 20%, transparent) 0 1.4px,
      transparent 2px
    ),
    radial-gradient(
      closest-side at 48% 28%,
      color-mix(in srgb, var(--md-sys-color-primary) 12%, transparent),
      transparent 74%
    ),
    radial-gradient(
      closest-side at 34% 58%,
      color-mix(in srgb, var(--md-sys-color-primary-container) 34%, transparent),
      transparent 80%
    ),
    radial-gradient(
      closest-side at 68% 54%,
      color-mix(in srgb, var(--md-sys-color-tertiary-container) 28%, transparent),
      transparent 82%
    ),
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--md-sys-color-primary-container) 42%, transparent) 0%,
      color-mix(in srgb, var(--md-sys-color-surface) 96%, transparent) 44%,
      var(--md-sys-color-surface) 100%
    );
  background-position:
    0 0,
    28px 22px,
    center,
    center,
    center,
    center;
  background-size:
    84px 84px,
    132px 132px,
    auto,
    auto,
    auto,
    auto;
}

.lgc-fixed-bg-atmosphere::before {
  content: '';
  @apply 'absolute inset-0 opacity-82';
  backdrop-filter: blur(42px);
  mask-image: radial-gradient(ellipse at 50% 42%, black 0 44%, transparent 76%);
}

.lgc-fixed-bg-image,
.lgc-fixed-bg-mask {
  @apply 'opacity-0 transition-opacity duration-$lgc-fixed-bg-fade-duration ease-$lgc-easing-standard';
}

.lgc-fixed-bg-image {
  @apply 'bg-center bg-cover bg-no-repeat';
}

.lgc-fixed-bg-image.is-visible,
.lgc-fixed-bg-mask.is-visible {
  @apply 'opacity-100';
}

.lgc-fixed-bg-mask {
  background: color-mix(
    in srgb,
    var(--md-sys-color-surface-container) 50%,
    transparent
  );
}
</style>
