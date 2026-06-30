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
const showPosts = computed(() => landing.value.showPosts === true)
const title = computed(() => landing.value.title || siteConfig.value.title)
const subtitle = computed(() => landing.value.subtitle || siteConfig.value.subtitle)
const posts = computed(() => siteStore.postList.slice(0, 6))
</script>

<template>
  <main class="lgc-home">
    <section class="lgc-landing" :class="{ 'is-compact': landing.compact }" aria-label="Landing">
      <LgcLandingTopbar :nav="themeConfig.nav || []" :fallback-links="landingLinks" />

      <div class="lgc-landing-center">
        <LgcLandingMark :avatar="landing.avatar" :title="title" />

        <div v-if="landing.eyebrow" class="lgc-eyebrow">
          {{ landing.eyebrow }}
        </div>

        <h1 class="lgc-landing-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="lgc-landing-subtitle">
          {{ subtitle }}
        </p>

        <LgcLandingDock :links="landingLinks" />
        <LgcLandingSocials :socials="landingSocials" />
      </div>

      <a v-if="showPosts" class="lgc-scroll-hint" href="#posts" aria-label="Scroll to posts">
        <span i-material-symbols-keyboard-arrow-down-rounded aria-hidden="true" />
      </a>
    </section>

    <section v-if="showPosts" id="posts" class="lgc-posts" aria-label="Latest posts">
      <div class="mx-auto grid w-full max-w-[900px] gap-4 px-4 py-10 sm:px-6">
        <div class="mb-2 flex items-end justify-between gap-4">
          <div>
            <p class="m-0 text-sm font-800 text-[var(--md-sys-color-primary)]">
              Latest
            </p>
            <h2 class="m-0 text-[var(--lgc-headline-large)] leading-tight">
              最近文章
            </h2>
          </div>
        </div>

        <template v-if="posts.length">
          <LgcLandingPostCard v-for="post in posts" :key="post.path" :post="post" />
        </template>
        <p v-else class="m-0 rounded-[28px] bg-[var(--md-sys-color-surface-container)] p-6 text-[var(--md-sys-color-on-surface-variant)]">
          还没有公开文章。
        </p>
      </div>
    </section>
  </main>
</template>
