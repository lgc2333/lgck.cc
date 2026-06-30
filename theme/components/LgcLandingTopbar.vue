<script setup lang="ts">
import type { LandingLink, NavItem } from '../types'
import { useAppStore } from 'valaxy'
import { computed } from 'vue'

const props = defineProps<{
  nav: NavItem[]
  fallbackLinks: LandingLink[]
}>()

const appStore = useAppStore()

const topbarLinks = computed(() => {
  if (props.nav.length)
    return props.nav

  return props.fallbackLinks.slice(0, 5).map(item => ({
    text: item.text,
    link: item.link,
    icon: item.icon,
  }))
})
</script>

<template>
  <nav class="lgc-topbar" aria-label="Primary navigation">
    <div class="flex min-w-0 items-center gap-2">
      <RouterLink class="lgc-icon-button is-active" to="/" aria-label="Home">
        <span i-material-symbols-home-rounded aria-hidden="true" />
      </RouterLink>

      <AppLink
        v-for="item in topbarLinks"
        :key="`${item.text}-${item.link}`"
        class="lgc-icon-button is-optional"
        :to="item.link"
        :aria-label="item.text"
      >
        <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
        <span v-else class="text-xs font-800">{{ item.text.slice(0, 1) }}</span>
      </AppLink>
    </div>

    <div class="flex items-center gap-2">
      <button class="lgc-icon-button is-optional" type="button" aria-label="Language">
        <span i-material-symbols-translate-rounded aria-hidden="true" />
      </button>

      <button class="lgc-icon-button" type="button" aria-label="Toggle dark mode" @click="appStore.toggleDarkWithTransition">
        <span v-if="!appStore.isDark" i-material-symbols-dark-mode-outline-rounded aria-hidden="true" />
        <span v-else i-material-symbols-light-mode-outline-rounded aria-hidden="true" />
      </button>

      <button class="lgc-icon-button" type="button" aria-label="Search">
        <span i-material-symbols-search-rounded aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>
