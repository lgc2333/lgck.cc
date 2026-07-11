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
      aria-label="Landing"
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
          :name="authorName"
          :status="authorStatus"
          :title="title"
        />

        <h1
          class="font-$lgc-font-display font-900"
          m="0"
          max-w="$landing-title-max-w"
          text="$md-sys-color-on-surface size-$lgc-display-large"
          leading="[0.96]"
          tracking-normal
        >
          {{ title }}
        </h1>

        <p
          v-if="subtitle"
          m="0"
          mt="$lgc-space-xl"
          max-w="$lgc-measure-narrow"
          text="$md-sys-color-on-surface-variant size-$lgc-body-large sm:size-$lgc-title-medium"
          leading="[2]"
        >
          {{ subtitle }}
        </p>

        <LgcLandingDock v-if="landingLinks?.length" :links="landingLinks" />
        <LgcLandingSocials v-if="siteSocials?.length" :socials="siteSocials" />
      </div>

      <a
        v-if="showPosts"
        class="lgc-scroll-hint text-$md-sys-color-primary rounded-$lgc-radius-control bg-$md-sys-color-surface-container-high transition-[border-radius,transform] duration-$lgc-motion-short ease-$lgc-easing-standard hover:rounded-$lgc-radius-control-active -translate-x-1/2 hover:translate-y-$lgc-space-sm hover:-translate-x-1/2"
        bottom="$lgc-space-2xl"
        left="1/2"
        w="$lgc-control-size"
        h="$lgc-control-size"
        place-items="center"
        no-underline
        grid
        absolute
        href="#posts"
        aria-label="Scroll to posts"
      >
        <!-- text-* via class only on <a>: HTMLAnchorElement.text wipes children -->
        <span
          class="text-size-$lgc-icon-font-lg"
          i-material-symbols-keyboard-arrow-down-rounded
          aria-hidden="true"
        />
      </a>

      <LgcFooter v-if="isFullOnlyLanding" class="relative z-1" />
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
  </main>
</template>

<style scoped lang="scss">
// Local calc owners for landing viewport math (not template [calc(...)]).
.lgc-landing-center {
  --landing-center-min-h: calc(100vh - var(--lgc-header-height) - 80px);
  --landing-title-max-w: calc(var(--lgc-container-wide) - 80px);
}

@screen sm {
  .lgc-landing-center {
    --landing-center-min-h: calc(100vh - var(--lgc-header-height) - 96px);
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
</style>
