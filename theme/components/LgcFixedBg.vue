<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useFixedBg } from '../composables'
import { getRouteContentKey } from '../utils/route'

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
  () => getRouteContentKey(route.fullPath),
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
  --lgc-fixed-bg-pink-color: var(--md-custom-color-pink-container);
  --lgc-fixed-bg-brown-color: var(--md-custom-color-brown-container);
  --lgc-fixed-bg-pink-presence: 50%;
  --lgc-fixed-bg-brown-presence: 38%;
  --lgc-fixed-bg-blue-presence: 58%;
  --lgc-fixed-bg-top-presence: 52%;
  --lgc-fixed-bg-soft-opacity: 0.72;
  --lgc-fixed-bg-soft-brown-color: var(--md-custom-color-brown-container);
  --lgc-fixed-bg-soft-pink-color: var(--md-custom-color-pink-container);
  --lgc-fixed-bg-soft-brown-presence: 32%;
  --lgc-fixed-bg-soft-pink-presence: 30%;
  --lgc-fixed-bg-soft-blue-presence: 16%;

  background:
    radial-gradient(
      ellipse at 22% 14%,
      color-mix(
        in srgb,
        var(--lgc-fixed-bg-pink-color) var(--lgc-fixed-bg-pink-presence),
        transparent
      ),
      transparent 42%
    ),
    radial-gradient(
      ellipse at 76% 22%,
      color-mix(
        in srgb,
        var(--lgc-fixed-bg-brown-color) var(--lgc-fixed-bg-brown-presence),
        transparent
      ),
      transparent 44%
    ),
    radial-gradient(
      ellipse at 50% 108%,
      color-mix(
        in srgb,
        var(--md-custom-color-blue-container) var(--lgc-fixed-bg-blue-presence),
        transparent
      ),
      transparent 66%
    ),
    linear-gradient(
      180deg,
      color-mix(
          in srgb,
          var(--md-custom-color-blue-container) var(--lgc-fixed-bg-top-presence),
          transparent
        )
        0%,
      color-mix(in srgb, var(--md-sys-color-surface) 94%, transparent) 52%,
      var(--md-sys-color-surface) 100%
    );
}

html.dark .lgc-fixed-bg-atmosphere {
  --lgc-fixed-bg-pink-color: var(--md-custom-color-pink);
  --lgc-fixed-bg-brown-color: var(--md-custom-color-brown);
  --lgc-fixed-bg-pink-presence: 12%;
  --lgc-fixed-bg-brown-presence: 11%;
  --lgc-fixed-bg-blue-presence: 44%;
  --lgc-fixed-bg-top-presence: 38%;
  --lgc-fixed-bg-soft-opacity: 0.62;
  --lgc-fixed-bg-soft-brown-color: var(--md-custom-color-brown);
  --lgc-fixed-bg-soft-pink-color: var(--md-custom-color-pink);
  --lgc-fixed-bg-soft-brown-presence: 12%;
  --lgc-fixed-bg-soft-pink-presence: 8%;
  --lgc-fixed-bg-soft-blue-presence: 10%;
}

.lgc-fixed-bg-atmosphere::before {
  content: '';
  @apply 'absolute inset-0';
  opacity: var(--lgc-fixed-bg-soft-opacity);
  background:
    radial-gradient(
      ellipse at 64% 34%,
      color-mix(
        in srgb,
        var(--lgc-fixed-bg-soft-brown-color) var(--lgc-fixed-bg-soft-brown-presence),
        transparent
      ),
      transparent 58%
    ),
    radial-gradient(
      ellipse at 24% 30%,
      color-mix(
        in srgb,
        var(--lgc-fixed-bg-soft-pink-color) var(--lgc-fixed-bg-soft-pink-presence),
        transparent
      ),
      transparent 60%
    ),
    radial-gradient(
      ellipse at 38% 52%,
      color-mix(
        in srgb,
        var(--md-custom-color-blue) var(--lgc-fixed-bg-soft-blue-presence),
        transparent
      ),
      transparent 62%
    );
  backdrop-filter: blur(38px);
  mask-image: radial-gradient(ellipse at 50% 46%, black 0 48%, transparent 78%);
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
    var(--md-sys-color-surface-container) var(--lgc-fixed-bg-image-mask-opacity),
    transparent
  );
}
</style>
