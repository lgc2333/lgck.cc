<script setup lang="ts">
import { useSiteConfig, useValaxyI18n } from 'valaxy'
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../../composables'
import { flattenLandingLinks } from '../../utils/landing'

const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()
const { t } = useI18n()
const { $t } = useValaxyI18n()

const landing = computed(() => themeConfig.value.landing || {})
const landingLinks = computed(() => landing.value.links || [])
const hasLandingLinks = computed(
  () => flattenLandingLinks(landingLinks.value).length > 0,
)
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
const authorIntro = computed(() => $t(author.value.intro || ''))
const authorLink = computed(() => author.value.link)
const avatar = computed(() => $t(author.value.avatar))
const avatarShape = computed(() => landing.value.avatarShape || 'rounded')
const authorStatus = computed(() => {
  const status = author.value.status
  if (!status) return undefined
  return {
    emoji: status.emoji,
    message: status.message ? $t(status.message) : status.message,
  }
})
const siteSubtitle = computed(() => $t(siteConfig.value.subtitle))
const siteDescription = computed(() => $t(siteConfig.value.description))
</script>

<template>
  <main
    class="lgc-home"
    min-h="screen"
    font="$lgc-font-body"
    :class="`is-${landingMode}`"
    :style="landingStyle"
  >
    <LgcFixedBg />
    <LgcHeader />

    <section
      class="lgc-landing lgc-page-surface"
      min-h="screen"
      grid
      relative
      overflow-clip
      isolate
      pt="$lgc-header-height"
      pb="80px sm:96px"
      :aria-label="t('accessibility.landing.label')"
    >
      <div
        class="lgc-landing-center"
        flex="~ col items-center justify-center"
        w="full"
        min-h="$landing-center-min-h"
        max-w="$lgc-container-wide"
        px="$lgc-space-lg sm:$lgc-space-2xl"
        pt="$lgc-space-lg sm:0"
        mx-auto
        text-center
        relative
        z-1
      >
        <LgcLandingMark
          v-if="avatar"
          :avatar="avatar"
          :avatar-shape="avatarShape"
          :intro="authorIntro"
          :link="authorLink"
          :name="authorName"
          :status="authorStatus"
          :title="title"
        />

        <div
          class="lgc-landing-heading"
          grid
          justify-items-center
          gap="$lgc-space-xs sm:$lgc-space-sm"
          w="full"
        >
          <h1
            class="lgc-landing-title font-$lgc-font-display font-900"
            m="0"
            max-w="$landing-title-max-w"
            text="$md-sys-color-on-surface size-$lgc-display-large"
            leading="[1.05]"
            tracking-normal
          >
            {{ title }}
          </h1>

          <p
            v-if="siteSubtitle"
            class="lgc-landing-subtitle"
            m="0"
            max-w="full"
            text="$md-sys-color-on-surface size-$lgc-title-small sm:size-$lgc-title-large"
            leading="[1.65]"
          >
            {{ siteSubtitle }}
          </p>

          <p
            v-if="siteDescription"
            class="lgc-landing-description"
            m="0"
            max-w="full"
            text="$md-sys-color-on-surface size-$lgc-body-small sm:size-$lgc-body-large"
            leading="[1.65]"
          >
            {{ siteDescription }}
          </p>
        </div>

        <LgcLandingDock v-if="hasLandingLinks" :links="landingLinks" />
        <LgcLandingSocials v-if="siteSocials?.length" :socials="siteSocials" />
      </div>

      <a
        v-if="showPosts"
        class="lgc-scroll-hint"
        bottom="$lgc-space-2xl"
        left="1/2"
        w="$lgc-control-size"
        h="$lgc-control-size"
        place-items="center"
        no-underline
        grid
        absolute
        z-1
        href="#posts"
        :aria-label="t('accessibility.landing.scroll_to_posts')"
      >
        <!-- text-* via class only on <a>: HTMLAnchorElement.text wipes children -->
        <span
          class="text-size-$lgc-icon-font-lg"
          i-material-symbols-keyboard-arrow-down-rounded
          aria-hidden="true"
        />
      </a>

      <LgcFooter v-if="isFullOnlyLanding" class="lgc-landing-footer relative z-1" />
    </section>

    <div
      v-if="showPosts"
      class="lgc-page-surface"
      flex="~ col"
      min-h="screen"
      bg="$lgc-surface-mask-bg"
    >
      <LgcPostFeed
        class="lgc-content-under-header"
        flex="[1_0_auto]"
        pb="$lgc-space-lg sm:$lgc-space-3xl"
        paginate
      />

      <LgcFooter class="mt-auto" />
    </div>

    <LgcFloatingActions />
  </main>
</template>

<style scoped lang="scss">
// Residual: paired edge gradients need opposite directions and pseudo-elements.
.lgc-landing {
  --landing-edge-fade-height: calc(var(--lgc-header-height) * 2);
}

.lgc-landing::before,
.lgc-landing::after {
  content: '';
  @apply 'pointer-events-none absolute inset-x-0 z-0';
  height: var(--landing-edge-fade-height);
}

.lgc-landing::before {
  @apply 'top-0';
  background: linear-gradient(
    to top,
    transparent 0%,
    color-mix(in srgb, var(--lgc-surface-mask-bg) 18%, transparent) 34%,
    color-mix(in srgb, var(--lgc-surface-mask-bg) 62%, transparent) 72%,
    var(--lgc-surface-mask-bg) 100%
  );
}

.lgc-landing::after {
  @apply 'bottom-0';
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--lgc-surface-mask-bg) 18%, transparent) 34%,
    color-mix(in srgb, var(--lgc-surface-mask-bg) 62%, transparent) 72%,
    var(--lgc-surface-mask-bg) 100%
  );
}

// Residual: text-shadow has no project utility and shares a landing token.
.lgc-landing-title,
.lgc-landing-subtitle,
.lgc-landing-description {
  text-shadow: var(--lgc-landing-text-shadow);
}

// Residual: parent-state override clears the child footer gradient background.
.lgc-home.is-full-only .lgc-landing-footer {
  @apply 'text-$md-sys-color-on-surface';
  background: none;
  text-shadow: var(--lgc-landing-text-shadow);
}

// Local calc owners for landing viewport math (not template [calc(...)]).
.lgc-landing-center {
  --landing-center-min-h: calc(100vh - var(--lgc-header-height) - 80px);
  --landing-center-min-h: calc(100dvh - var(--lgc-header-height) - 80px);
  --landing-title-max-w: calc(var(--lgc-container-wide) - 80px);
}

@screen sm {
  .lgc-landing-center {
    --landing-center-min-h: calc(100vh - var(--lgc-header-height) - 96px);
    --landing-center-min-h: calc(100dvh - var(--lgc-header-height) - 96px);
  }
}

// Mode variants: parent-state cascades stay as residual selectors.
.lgc-home.is-full-only {
  @apply 'min-h-dvh overflow-clip';
}

.lgc-home.is-full-only .lgc-landing {
  @apply 'min-h-screen min-h-dvh grid-rows-[minmax(0,1fr)_auto] pb-0';
}

.lgc-home.is-full-only .lgc-landing-center {
  --landing-center-min-h: 0;
  @apply 'pb-$lgc-space-lg';
}

.lgc-home.is-compact .lgc-landing {
  @apply 'min-h-$lgc-landing-compact-height';
}

.lgc-home.is-compact .lgc-landing-center {
  --landing-center-min-h: calc(
    var(--lgc-landing-compact-height) - var(--lgc-header-height) - 80px
  );
}

@screen sm {
  .lgc-home.is-compact .lgc-landing-center {
    --landing-center-min-h: calc(
      var(--lgc-landing-compact-height) - var(--lgc-header-height) - 96px
    );
  }
}

.lgc-scroll-hint {
  --lgc-scroll-hint-y: 0;
  --lgc-scroll-hint-scale: 1;

  @apply 'text-$md-sys-color-primary rounded-$lgc-radius-control';
  @apply 'bg-$md-sys-color-surface-container-high no-underline';
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  transition-property: border-radius, transform;
  transform: translateX(-50%) translateY(var(--lgc-scroll-hint-y))
    scale(var(--lgc-scroll-hint-scale));
}

.lgc-scroll-hint:hover,
.lgc-scroll-hint:focus-visible {
  --lgc-scroll-hint-y: var(--lgc-space-sm);

  @apply 'rounded-$lgc-radius-control-active';
}

.lgc-scroll-hint:active {
  --lgc-scroll-hint-scale: var(--lgc-control-press-scale);
}
</style>
