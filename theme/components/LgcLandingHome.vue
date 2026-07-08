<script setup lang="ts">
import { useSiteConfig, useValaxyI18n } from 'valaxy'
import type { StyleValue } from 'vue'
import { computed } from 'vue'

import { useThemeConfig } from '../composables'

const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()
const { $t } = useValaxyI18n()

const landing = computed(() => themeConfig.value.landing || {})
const landingLinks = computed(() => landing.value.links)
const siteSocials = computed(() => siteConfig.value.social)
const landingMode = computed(() => landing.value.mode || 'full')
const isFullOnlyLanding = computed(() => landingMode.value === 'full-only')
const showPosts = computed(
  () => landingMode.value === 'full' || landingMode.value === 'compact',
)
const landingStyle = computed<StyleValue>(() => ({
  '--lgc-landing-compact-height': `${landing.value.compactHeight ?? 65}vh`,
}))
const author = computed(() => siteConfig.value.author)
const title = computed(() => $t(siteConfig.value.title))
const authorName = computed(() => $t(author.value.name))
const avatar = computed(() => $t(author.value.avatar))
const authorStatus = computed(() => author.value.status)
const subtitle = computed(() => $t(author.value.intro || siteConfig.value.subtitle))
</script>

<template>
  <main class="lgc-home" :class="`is-${landingMode}`" :style="landingStyle">
    <LgcFixedBg />
    <LgcHeader />

    <section class="lgc-landing lgc-page-surface" aria-label="Landing">
      <div class="lgc-landing-center">
        <LgcLandingMark
          v-if="avatar"
          :avatar="avatar"
          :name="authorName"
          :status="authorStatus"
          :title="title"
        />

        <h1 class="lgc-landing-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="lgc-landing-subtitle">
          {{ subtitle }}
        </p>

        <LgcLandingDock v-if="landingLinks?.length" :links="landingLinks" />
        <LgcLandingSocials v-if="siteSocials?.length" :socials="siteSocials" />
      </div>

      <a
        v-if="showPosts"
        class="lgc-scroll-hint"
        href="#posts"
        aria-label="Scroll to posts"
      >
        <span i-material-symbols-keyboard-arrow-down-rounded aria-hidden="true" />
      </a>

      <LgcFooter v-if="isFullOnlyLanding" />
    </section>

    <div v-if="showPosts" class="lgc-home-surface lgc-page-surface">
      <LgcPostFeed paginate />

      <LgcFooter />
    </div>
  </main>
</template>

<style scoped lang="scss">
@use '../styles/helpers' as *;

.lgc-home {
  min-height: 100vh;
  font-family: var(--lgc-font-body);
}

.lgc-home.is-full-only {
  min-height: 100dvh;
  overflow: clip;
}

.lgc-home-surface {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: var(--lgc-surface-mask-bg);
}

.lgc-home-surface :deep(.lgc-post-feed) {
  flex: 1 0 auto;
  padding-top: calc(var(--lgc-header-height) + 1rem);
  padding-bottom: 1rem;
}

.lgc-home-surface :deep(.lgc-footer) {
  margin-top: auto;
}

.lgc-landing {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100vh;
  padding: var(--lgc-header-height) 1rem 5rem;
  overflow: clip;
}

.lgc-landing-center {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: var(--lgc-container-wide);
  min-height: calc(100vh - var(--lgc-header-height) - 5rem);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  margin-inline: auto;
  text-align: center;
}

.lgc-home.is-full-only .lgc-landing {
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-rows: minmax(0, 1fr) auto;
  padding-bottom: 0;
}

.lgc-home.is-full-only .lgc-landing-center {
  min-height: 0;
  padding-bottom: 1rem;
}

.lgc-home.is-full-only :deep(.lgc-footer) {
  position: relative;
  z-index: 1;
}

.lgc-home.is-compact .lgc-landing {
  min-height: var(--lgc-landing-compact-height);
}

.lgc-home.is-compact .lgc-landing-center {
  min-height: calc(var(--lgc-landing-compact-height) - var(--lgc-header-height) - 5rem);
}

.lgc-landing-subtitle {
  max-width: 620px;
  margin: 1.25rem 0 0;
  color: var(--md-sys-color-on-surface-variant);
  font-size: 1rem;
  line-height: 2;
}

.lgc-scroll-hint {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  display: grid;
  width: var(--lgc-control-size);
  height: var(--lgc-control-size);
  place-items: center;
  border-radius: var(--lgc-radius-control);
  color: var(--md-sys-color-primary);
  font-size: 1.875rem;
  text-decoration: none;
  background: var(--md-sys-color-surface-container-high);
  transform: translateX(-50%);
  transition:
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover {
    border-radius: var(--lgc-radius-control-active);
    transform: translate(-50%, 0.5rem);
  }
}

@include compact-up {
  .lgc-home-surface :deep(.lgc-post-feed) {
    padding-top: calc(var(--lgc-header-height) + 2rem);
    padding-bottom: 2rem;
  }

  .lgc-landing {
    padding: var(--lgc-header-height) 1.5rem 6rem;
  }

  .lgc-landing-center {
    min-height: calc(100vh - var(--lgc-header-height) - 6rem);
    padding-top: 0;
  }

  .lgc-home.is-full-only .lgc-landing-center {
    min-height: 0;
  }

  .lgc-home.is-compact .lgc-landing-center {
    min-height: calc(
      var(--lgc-landing-compact-height) - var(--lgc-header-height) - 6rem
    );
  }

  .lgc-landing-subtitle {
    font-size: 1.125rem;
  }
}
</style>
