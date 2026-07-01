<script setup lang="ts">
import { useAppStore } from 'valaxy'
import { computed } from 'vue'

import type { LandingLink, NavItem } from '../types'

const props = defineProps<{
  nav: NavItem[]
  fallbackLinks: LandingLink[]
}>()

const appStore = useAppStore()

const topbarLinks = computed(() => {
  if (props.nav.length) return props.nav

  return props.fallbackLinks.slice(0, 5).map((item) => ({
    text: item.text,
    link: item.link,
    icon: item.icon,
  }))
})
</script>

<template>
  <nav
    class="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-3 py-3 sm:px-6 sm:py-5"
    aria-label="Primary navigation"
  >
    <div class="flex min-w-0 items-center gap-2">
      <RouterLink
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover h-12 w-16 rounded-6 bg-md-primary-container text-2xl text-md-on-primary-container hover:rounded-4"
        to="/"
        aria-label="Home"
      >
        <span i-material-symbols-home-rounded aria-hidden="true" />
      </RouterLink>

      <AppLink
        v-for="(item, index) in topbarLinks"
        :key="`${item.text}-${item.link}`"
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover h-12 w-12 rounded-6 text-2xl hover:rounded-4"
        :class="{ 'max-[720px]:hidden': index >= 3 }"
        :to="item.link"
        :aria-label="item.text"
      >
        <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
        <span v-else class="text-xs font-800">{{ item.text.slice(0, 1) }}</span>
      </AppLink>
    </div>

    <div class="flex items-center gap-2">
      <button
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover h-12 w-12 rounded-6 text-2xl hover:rounded-4 max-[720px]:hidden"
        type="button"
        aria-label="Language"
      >
        <span i-material-symbols-translate-rounded aria-hidden="true" />
      </button>

      <button
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover h-12 w-12 rounded-6 text-2xl hover:rounded-4"
        type="button"
        aria-label="Toggle dark mode"
        @click="appStore.toggleDarkWithTransition"
      >
        <span
          v-if="!appStore.isDark"
          i-material-symbols-dark-mode-outline-rounded
          aria-hidden="true"
        />
        <span v-else i-material-symbols-light-mode-outline-rounded aria-hidden="true" />
      </button>

      <button
        class="lgc-topbar-button lgc-icon-button-base lgc-icon-button-hover h-12 w-12 rounded-6 text-2xl hover:rounded-4"
        type="button"
        aria-label="Search"
      >
        <span i-material-symbols-search-rounded aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>
