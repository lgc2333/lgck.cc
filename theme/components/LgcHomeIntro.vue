<script lang="ts" setup>
import { useSiteConfig } from 'valaxy'

const siteConfig = useSiteConfig()
</script>

<template>
  <section
    class="lgc-home-intro"
    grid="~ justify-items-start"
    mb="$lgc-space-lg"
    py="$lgc-space-3xl"
    px="$lgc-space-xl"
    gap="$lgc-space-md"
    rounded="$lgc-radius-large"
    sm="p-$lgc-space-4xl"
    aria-labelledby="lgc-home-intro-title"
  >
    <p
      m="0"
      py="$lgc-space-xs"
      px="$lgc-space-md"
      rounded="$lgc-radius-full"
      text="$md-sys-color-on-secondary-container size-$lgc-label-medium"
      font="900"
      bg="$md-sys-color-secondary-container"
    >
      Posts
    </p>
    <h1
      id="lgc-home-intro-title"
      m="0"
      text="$md-sys-color-on-surface size-$lgc-headline-large"
      font="900"
      leading="[1.12]"
      tracking-normal
    >
      {{ siteConfig.title }}
    </h1>
    <p
      v-if="siteConfig.subtitle"
      m="0"
      max-w="$lgc-measure-narrow"
      text="$md-sys-color-on-surface-variant size-$lgc-body-large"
      leading="[1.75]"
    >
      {{ siteConfig.subtitle }}
    </p>
  </section>
</template>

<style scoped lang="scss">
// Residual: multi-layer radial atmosphere (not a clean utility).
.lgc-home-intro {
  background:
    radial-gradient(
      circle at 14% 20%,
      color-mix(in srgb, var(--md-sys-color-primary-container) 84%, transparent),
      transparent 36%
    ),
    var(--md-sys-color-surface-container-low);
}
</style>
