<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'

import { useThemeConfig } from '../composables'
import type { HeaderLinksConfig, HeaderNavLink } from '../types'

const themeConfig = useThemeConfig()
const drawerOpen = ref(false)
const { y: scrollY } = useWindowScroll()

const header = computed(() => themeConfig.value.header || {})
const linkOptions = computed<Partial<HeaderLinksConfig>>(() => header.value.links || {})
const addHome = computed(() => linkOptions.value.addHome !== false)
const activePathRewrites = computed(() => linkOptions.value.activePathRewrites || [])
const homeLabel = computed(() => linkOptions.value.homeLabel || 'Home')
const activeExpanded = computed(() => linkOptions.value.activeExpanded !== false)
const isScrolled = computed(() => scrollY.value > 8)
const homeFixed = computed(() => linkOptions.value.homeFixed === true)
const linkMode = computed<HeaderLinksConfig['mode']>(
  () => linkOptions.value.mode || 'hover',
)
const homeLinkMode = computed(() => (homeFixed.value ? 'expanded' : linkMode.value))
const linkStyle = computed(() => ({
  '--lgc-header-link-width': linkOptions.value.width || undefined,
  '--lgc-header-link-min-width':
    linkOptions.value.minWidth || 'var(--lgc-control-size)',
  '--lgc-header-link-max-width': linkOptions.value.maxWidth || '11rem',
}))

const homeLink = computed<HeaderNavLink>(() => ({
  text: homeLabel.value,
  link: '/',
  icon: 'i-material-symbols-home-rounded',
}))

const headerLinks = computed<HeaderNavLink[]>(() => {
  return header.value.nav || []
})

function closeDrawer() {
  drawerOpen.value = false
}
</script>

<template>
  <header class="lgc-header-shell" :class="{ 'is-scrolled': isScrolled }">
    <nav class="lgc-header" aria-label="Primary navigation">
      <div class="lgc-header-group lgc-header-primary">
        <button
          class="lgc-header-button lgc-header-menu lgc-icon-button-base lgc-icon-button-hover"
          type="button"
          :aria-expanded="drawerOpen"
          aria-controls="lgc-mobile-drawer"
          aria-label="Open navigation"
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
          :key="`${item.text}-${item.link}`"
          :fixed="Boolean(linkOptions.width)"
          :item="item"
          :link-style="linkStyle"
          :mode="linkMode"
          :active-expanded="activeExpanded"
          :active-path-rewrites="activePathRewrites"
          :optional="index >= 3"
        />
      </div>

      <LgcHeaderActions optional-class="is-optional" />
    </nav>
  </header>

  <ClientOnly>
    <LgcHeaderDrawer
      :add-home="addHome"
      :active-path-rewrites="activePathRewrites"
      :home-label="homeLabel"
      :links="headerLinks"
      :open="drawerOpen"
      @close="closeDrawer"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.lgc-header-shell {
  position: fixed;
  z-index: 30;
  top: 0;
  right: 0;
  left: 0;
}

.lgc-header {
  display: flex;
  width: 100%;
  max-width: var(--lgc-container-wide);
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem;
  margin-inline: auto;
  background: transparent;
  border-radius: 0 0 var(--lgc-radius-control) var(--lgc-radius-control);
  transition:
    backdrop-filter var(--lgc-motion-medium) var(--lgc-easing-standard),
    background-color var(--lgc-motion-medium) var(--lgc-easing-standard);
}

.lgc-header-shell.is-scrolled .lgc-header {
  backdrop-filter: blur(18px);
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 40%,
    transparent
  );
}

.lgc-header-group {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 0.5rem;
}

.lgc-header-menu {
  display: none;
}

@media (max-width: 720px) {
  .lgc-header-menu {
    display: grid;
  }

  .lgc-header-primary .lgc-header-link {
    display: none;
  }

  .lgc-header-button.is-optional {
    display: none;
  }
}

@media (min-width: 640px) {
  .lgc-header-shell {
    padding-inline: 1rem;
  }

  .lgc-header {
    padding: 0.875rem;
    padding-inline: 0.75rem;
  }
}
</style>
