<script lang="ts" setup>
import { useSiteConfig } from 'valaxy'

const siteConfig = useSiteConfig()
</script>

<template>
  <section class="lgc-home-intro" aria-labelledby="lgc-home-intro-title">
    <p class="lgc-home-intro-label">Posts</p>
    <h1 id="lgc-home-intro-title">{{ siteConfig.title }}</h1>
    <p v-if="siteConfig.subtitle" class="lgc-home-intro-subtitle">
      {{ siteConfig.subtitle }}
    </p>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-home-intro {
  display: grid;
  justify-items: start;
  gap: var(--lgc-space-md);
  padding: 2rem var(--lgc-space-xl);
  margin-bottom: var(--lgc-space-lg);
  border-radius: var(--lgc-radius-large);
  background:
    radial-gradient(
      circle at 14% 20%,
      color-mix(in srgb, var(--md-sys-color-primary-container) 84%, transparent),
      transparent 36%
    ),
    var(--md-sys-color-surface-container-low);

  h1 {
    margin: 0;
    color: var(--md-sys-color-on-surface);
    font-size: var(--lgc-headline-large);
    font-weight: 900;
    line-height: 1.12;
    letter-spacing: 0;
  }
}

.lgc-home-intro-label {
  padding: 0.35rem 0.85rem;
  margin: 0;
  border-radius: var(--lgc-radius-full);
  color: var(--md-sys-color-on-secondary-container);
  background: var(--md-sys-color-secondary-container);
  font-size: var(--lgc-label-medium);
  font-weight: 900;
}

.lgc-home-intro-subtitle {
  max-width: var(--lgc-measure-narrow);
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: var(--lgc-body-large);
  line-height: 1.75;
}

@include compact-up {
  .lgc-home-intro {
    padding: 2.5rem;
  }
}
</style>
