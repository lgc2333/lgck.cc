<script setup lang="ts">
import { computed, ref } from 'vue'

import { useThemeConfig } from '../composables'
import type { HeaderLinksConfig, HeaderNavLink } from '../types'

const themeConfig = useThemeConfig()
const drawerOpen = ref(false)

const header = computed(() => themeConfig.value.header || {})
const addHome = computed(() => header.value.addHome !== false)
const homeLabel = computed(() => header.value.homeLabel || 'Home')
const linkOptions = computed<Partial<HeaderLinksConfig>>(() => header.value.links || {})
const activeExpanded = computed(() => linkOptions.value.activeExpanded !== false)
const homeFixed = computed(() => header.value.homeFixed === true)
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
  <header class="lgc-header-shell">
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

        <HeaderLink
          v-if="addHome"
          :active-expanded="activeExpanded"
          active-match="exact"
          :fixed="Boolean(linkOptions.width)"
          :item="homeLink"
          :link-style="linkStyle"
          :mode="homeLinkMode"
        />

        <HeaderLink
          v-for="(item, index) in headerLinks"
          :key="`${item.text}-${item.link}`"
          :fixed="Boolean(linkOptions.width)"
          :item="item"
          :link-style="linkStyle"
          :mode="linkMode"
          :active-expanded="activeExpanded"
          :optional="index >= 3"
        />
      </div>

      <HeaderActions optional-class="is-optional" />
    </nav>
  </header>

  <HeaderDrawer
    :add-home="addHome"
    :home-label="homeLabel"
    :links="headerLinks"
    :open="drawerOpen"
    @close="closeDrawer"
  />
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
  backdrop-filter: blur(18px);
  background: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) 34%,
    transparent
  );
  border-radius: 0 0 var(--lgc-radius-control) var(--lgc-radius-control);
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
