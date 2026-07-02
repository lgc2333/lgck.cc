<script setup lang="ts">
import { useSiteConfig, useSiteStore, useValaxyI18n } from 'valaxy'
import { computed } from 'vue'

import { useThemeConfig } from '../composables'

const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()
const siteStore = useSiteStore()
const { $t } = useValaxyI18n()

const landing = computed(() => themeConfig.value.landing || {})
const topBar = computed(() => themeConfig.value.topBar || {})
const landingLinks = computed(() => landing.value.links || [])
const siteSocials = computed(() => siteConfig.value.social || [])
const showPosts = computed(() => landing.value.showPosts !== false)
const addHome = computed(() => topBar.value.addHome !== false)
const homeFixed = computed(() => topBar.value.homeFixed !== false)
const topBarLinks = computed(() => topBar.value.links || {})
const author = computed(() => siteConfig.value.author)
const title = computed(() => $t(siteConfig.value.title))
const authorName = computed(() => $t(author.value.name))
const avatar = computed(() => $t(author.value.avatar))
const authorStatus = computed(() => author.value.status)
const subtitle = computed(() => $t(author.value.intro || siteConfig.value.subtitle))
const posts = computed(() => siteStore.postList.slice(0, 6))
</script>

<template>
  <main class="lgc-home">
    <LgcLandingTopBar
      :add-home="addHome"
      :home-fixed="homeFixed"
      :home-label="topBar.homeLabel"
      :link-options="topBarLinks"
      :links="siteSocials"
    />

    <section
      class="lgc-landing"
      :class="{ 'is-compact': landing.compact }"
      aria-label="Landing"
    >
      <div class="lgc-landing-center" :class="{ 'is-compact': landing.compact }">
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

        <LgcLandingDock :links="landingLinks" />
        <LgcLandingSocials :socials="siteSocials" />
      </div>

      <a
        v-if="showPosts"
        class="lgc-scroll-hint"
        href="#posts"
        aria-label="Scroll to posts"
      >
        <span i-material-symbols-keyboard-arrow-down-rounded aria-hidden="true" />
      </a>
    </section>

    <section v-if="showPosts" id="posts" class="lgc-posts" aria-label="Latest posts">
      <div class="lgc-posts-inner">
        <div class="lgc-posts-header">
          <div>
            <p class="lgc-posts-label">Latest</p>
            <h2 class="lgc-section-title">最近文章</h2>
          </div>
        </div>

        <template v-if="posts.length">
          <LgcLandingPostCard v-for="post in posts" :key="post.path" :post="post" />
        </template>
        <p v-else class="lgc-posts-empty">还没有公开文章。</p>
      </div>
    </section>

    <StarterFooter />
  </main>
</template>

<style scoped lang="scss">
.lgc-home {
  --lgc-topbar-height: 4.5rem;

  min-height: 100vh;
  font-family: var(--lgc-font-body);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--md-sys-color-primary-container) 42%, transparent) 0%,
    color-mix(in srgb, var(--md-sys-color-surface) 96%, transparent) 44%,
    var(--md-sys-color-surface) 100%
  );
}

.lgc-landing {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: calc(100vh - var(--lgc-topbar-height));
  padding: 0 1rem 5rem;
  overflow: clip;

  &.is-compact {
    min-height: calc(76vh - var(--lgc-topbar-height));
  }
}

.lgc-landing::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
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
  opacity: 0.55;
}

.lgc-landing::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 16% 8% 8%;
  pointer-events: none;
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

.lgc-landing-center {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1180px;
  min-height: calc(100vh - var(--lgc-topbar-height) - 5rem);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  margin-inline: auto;
  text-align: center;
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
  width: 3rem;
  height: 3rem;
  place-items: center;
  border-radius: 1.5rem;
  color: var(--md-sys-color-primary);
  font-size: 1.875rem;
  text-decoration: none;
  background: var(--md-sys-color-surface-container-high);
  transform: translateX(-50%);
  transition:
    border-radius var(--lgc-motion-short) var(--lgc-easing-standard),
    transform var(--lgc-motion-short) var(--lgc-easing-standard);

  &:hover {
    border-radius: 1rem;
    transform: translate(-50%, 0.5rem);
  }
}

.lgc-posts {
  scroll-margin-top: 1rem;
  background: var(--md-sys-color-surface);
}

.lgc-posts-inner {
  display: grid;
  width: 100%;
  max-width: 900px;
  gap: 1rem;
  padding: 2.5rem 1rem;
  margin-inline: auto;
}

.lgc-posts-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.lgc-posts-label {
  margin: 0;
  color: var(--md-sys-color-primary);
  font-size: 0.875rem;
  font-weight: 800;
}

.lgc-posts-empty {
  padding: 1.5rem;
  margin: 0;
  border-radius: 1.75rem;
  color: var(--md-sys-color-on-surface-variant);
  background: var(--md-sys-color-surface-container);
}

@media (min-width: 640px) {
  .lgc-home {
    --lgc-topbar-height: 5.5rem;
  }

  .lgc-landing {
    padding: 0 1.5rem 6rem;
  }

  .lgc-landing-center {
    min-height: calc(100vh - var(--lgc-topbar-height) - 6rem);
    padding-top: 0;

    &.is-compact {
      min-height: calc(76vh - var(--lgc-topbar-height) - 6rem);
    }
  }

  .lgc-landing-subtitle {
    font-size: 1.125rem;
  }

  .lgc-posts-inner {
    padding-inline: 1.5rem;
  }
}
</style>
