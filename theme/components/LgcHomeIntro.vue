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
.lgc-home-intro {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  padding: 2rem 1.25rem;
  margin-bottom: 1rem;
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
  border-radius: 999px;
  color: var(--md-sys-color-on-secondary-container);
  background: var(--md-sys-color-secondary-container);
  font-size: 0.8125rem;
  font-weight: 900;
}

.lgc-home-intro-subtitle {
  max-width: 620px;
  margin: 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  line-height: 1.75;
}

@media (min-width: 640px) {
  .lgc-home-intro {
    padding: 2.5rem;
  }
}
</style>
