<script setup lang="ts">
import { useSiteConfig, useSiteStore } from 'valaxy'
import { computed } from 'vue'

import { useThemeConfig } from '../composables'

const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()
const siteStore = useSiteStore()

const landing = computed(() => themeConfig.value.landing)
const landingLinks = computed(() => landing.value.links || [])
const landingSocials = computed(() => landing.value.socials || [])
const showPosts = computed(() => landing.value.showPosts !== false)
const title = computed(() => landing.value.title || siteConfig.value.title)
const subtitle = computed(() => landing.value.subtitle || siteConfig.value.subtitle)
const posts = computed(() => siteStore.postList.slice(0, 6))
</script>

<template>
  <main class="lgc-home min-h-screen font-body">
    <section
      class="lgc-landing relative isolate grid min-h-screen overflow-clip px-4 py-20 sm:px-6 sm:py-24"
      :class="{ 'min-h-[76vh]': landing.compact }"
      aria-label="Landing"
    >
      <LgcLandingTopbar :nav="themeConfig.nav || []" :fallback-links="landingLinks" />

      <div
        class="lgc-landing-center relative z-1 mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-[960px] flex-col items-center justify-center pt-6 text-center sm:min-h-[calc(100vh-12rem)] sm:pt-0"
        :class="{ 'sm:min-h-[calc(76vh-12rem)]': landing.compact }"
      >
        <LgcLandingMark v-if="landing.avatar" :avatar="landing.avatar" :title="title" />

        <div
          v-if="landing.eyebrow"
          class="lgc-eyebrow lgc-chip-tonal mb-5 gap-2 px-4 py-2 text-sm font-800"
        >
          {{ landing.eyebrow }}
        </div>

        <h1
          class="m-0 max-w-[820px] text-lgc-display text-md-on-surface font-900 font-display leading-[0.96]"
        >
          {{ title }}
        </h1>

        <p
          v-if="subtitle"
          class="m-0 mt-5 max-w-[620px] text-base text-md-on-surface-variant leading-8 sm:text-lg"
        >
          {{ subtitle }}
        </p>

        <LgcLandingDock :links="landingLinks" />
        <LgcLandingSocials :socials="landingSocials" />
      </div>

      <a
        v-if="showPosts"
        class="absolute bottom-6 left-1/2 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-6 bg-md-surface-container-high text-3xl text-md-primary no-underline transition-[border-radius,transform] duration-[var(--lgc-motion-short)] ease-[var(--lgc-easing-standard)] hover:translate-x-[-50%] hover:translate-y-2 hover:rounded-4"
        href="#posts"
        aria-label="Scroll to posts"
      >
        <span i-material-symbols-keyboard-arrow-down-rounded aria-hidden="true" />
      </a>
    </section>

    <section
      v-if="showPosts"
      id="posts"
      class="scroll-mt-4 bg-md-surface"
      aria-label="Latest posts"
    >
      <div class="mx-auto grid w-full max-w-[900px] gap-4 px-4 py-10 sm:px-6">
        <div class="mb-2 flex items-end justify-between gap-4">
          <div>
            <p class="m-0 text-sm text-md-primary font-800">Latest</p>
            <h2 class="m-0 text-lgc-headline leading-tight">最近文章</h2>
          </div>
        </div>

        <template v-if="posts.length">
          <LgcLandingPostCard v-for="post in posts" :key="post.path" :post="post" />
        </template>
        <p
          v-else
          class="m-0 rounded-7 bg-md-surface-container p-6 text-md-on-surface-variant"
        >
          还没有公开文章。
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
.lgc-landing {
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--md-sys-color-primary-container) 42%, transparent) 0%,
    color-mix(in srgb, var(--md-sys-color-surface) 96%, transparent) 44%,
    var(--md-sys-color-surface) 100%
  );
}

.lgc-landing::before {
  @apply pointer-events-none absolute inset-0 -z-1 opacity-55;

  content: '';
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
    );
  background-position:
    0 0,
    28px 22px;
  background-size:
    84px 84px,
    132px 132px;
  mask-image: radial-gradient(ellipse at 50% 46%, black 0 38%, transparent 72%);
}

.lgc-landing::after {
  @apply pointer-events-none absolute -z-1;

  content: '';
  inset: 16% 8% 8%;
  background:
    radial-gradient(
      closest-side at 48% 38%,
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
    );
  filter: blur(42px);
  opacity: 0.82;
  transform: translateZ(0);
}

.lgc-eyebrow::before {
  @apply h-2 w-2 rounded-full bg-md-primary;

  content: '';
}

h1 {
  letter-spacing: 0;
}
</style>
