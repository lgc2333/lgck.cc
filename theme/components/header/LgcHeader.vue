<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useThemeConfig } from '../../composables'
import type { HeaderLinksConfig, HeaderNavLink } from '../../types'
import { normalizeLocaleText } from '../../utils/post'

const { t, locale } = useI18n()
const themeConfig = useThemeConfig()
const drawerOpen = ref(false)
const { y: scrollY } = useWindowScroll()

const header = computed(() => themeConfig.value.header || {})
const linkOptions = computed<Partial<HeaderLinksConfig>>(() => header.value.links || {})
const addHome = computed(() => linkOptions.value.addHome !== false)
const activePathRewrites = computed(() => linkOptions.value.activePathRewrites || [])
const homeLabel = computed(
  () =>
    normalizeLocaleText(linkOptions.value.homeLabel, locale.value, t) || t('menu.home'),
)
const activeExpanded = computed(() => linkOptions.value.activeExpanded !== false)
const isScrolled = computed(() => scrollY.value > 8)
const homeFixed = computed(() => linkOptions.value.homeFixed === true)
const linkMode = computed<HeaderLinksConfig['mode']>(
  () => linkOptions.value.mode || 'hover',
)
const homeLinkMode = computed(() => (homeFixed.value ? 'expanded' : linkMode.value))
// Only set overrides when config provides them. Never
// `--lgc-header-link-max-width: var(--lgc-header-link-max-width)` (self-ref =
// invalid at computed-value time; open-size becomes empty and expand motion breaks).
// Default open max comes from :root `--lgc-header-link-max-width` (176px / was 11rem).
const linkStyle = computed(() => {
  const style: Record<string, string> = {
    '--lgc-header-link-min-width':
      linkOptions.value.minWidth || 'var(--lgc-control-size)',
  }
  if (linkOptions.value.width) {
    style['--lgc-header-link-width'] = linkOptions.value.width
  }
  if (linkOptions.value.maxWidth) {
    style['--lgc-header-link-max-width'] = linkOptions.value.maxWidth
  }
  return style
})

const homeLink = computed<HeaderNavLink>(() => ({
  text: homeLabel.value,
  link: '/',
  icon: 'i-material-symbols-home-outline-rounded',
  activeIcon: 'i-material-symbols-home-rounded',
}))

const headerLinks = computed<HeaderNavLink[]>(() => {
  return header.value.nav || []
})

function closeDrawer() {
  drawerOpen.value = false
}
</script>

<template>
  <header
    class="lgc-header-shell"
    left-0
    right-0
    top-0
    fixed
    z="$lgc-layer-header"
    sm="px-$lgc-space-lg"
    :class="{ 'is-scrolled': isScrolled }"
  >
    <nav
      class="lgc-header"
      flex="~ items-center justify-between"
      w="full"
      max-w="$lgc-container-wide"
      gap="$lgc-space-lg"
      p="$lgc-space-sm sm:[14px]"
      sm="px-$lgc-space-md"
      mx-auto
      bg-transparent
      rounded="b-$lgc-radius-control"
      shadow="$lgc-elevation-shadow-level-0"
      transition="[backdrop-filter,background-color,box-shadow]"
      duration="$lgc-motion-medium"
      ease="$lgc-easing-standard"
      :aria-label="t('accessibility.navigation.primary')"
    >
      <div
        class="lgc-header-primary"
        flex="~ items-center"
        min-w="0"
        gap="$lgc-space-sm"
      >
        <button
          class="lgc-header-button lgc-header-menu lgc-control-reset lgc-control-on-surface lgc-control-state-layer hidden max-md:grid"
          type="button"
          place-items="center"
          :aria-expanded="drawerOpen"
          aria-controls="lgc-mobile-drawer"
          :aria-label="t('accessibility.navigation.open')"
          @click="drawerOpen = true"
        >
          <span i-material-symbols-menu-rounded aria-hidden="true" />
        </button>

        <LgcHeaderLink
          v-if="addHome"
          :active-expanded="activeExpanded"
          :active-path-rewrites="activePathRewrites"
          active-match="exact"
          :fixed="Boolean(linkOptions.width)"
          :item="homeLink"
          :link-style="linkStyle"
          :mode="homeLinkMode"
        />

        <LgcHeaderLink
          v-for="(item, index) in headerLinks"
          :key="item.link"
          :fixed="Boolean(linkOptions.width)"
          :item="item"
          :link-style="linkStyle"
          :mode="linkMode"
          :active-expanded="activeExpanded"
          :active-path-rewrites="activePathRewrites"
          :optional="index >= 3"
        />
      </div>

      <LgcHeaderActions action-class="is-header-action" optional-class="is-optional" />
    </nav>
  </header>

  <ClientOnly>
    <LgcHeaderDrawer
      :add-home="addHome"
      :active-path-rewrites="activePathRewrites"
      :home-link="homeLink"
      :links="headerLinks"
      :open="drawerOpen"
      @close="closeDrawer"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
// Residual: scrolled scrim blur + color-mix (no clean utility for mix percent).
// Menu: `hidden max-md:grid` on the button; control reset intentionally owns no
// display so responsive utilities stay ordinary.
// Never bare HTML `hidden` (UA `[hidden] { display:none !important }` blocks max-md:grid).
// Nav links hide below md: cascade into child LgcHeaderLink (parent scoped cannot
// put utilities on another component's root without a class target).
.lgc-header-shell.is-scrolled .lgc-header {
  backdrop-filter: blur(var(--lgc-header-blur));
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 40%,
    transparent
  );
  @apply 'shadow-$lgc-elevation-shadow-level-2';
}

.lgc-header-primary .lgc-header-link {
  @apply 'max-md:hidden';
}
</style>
