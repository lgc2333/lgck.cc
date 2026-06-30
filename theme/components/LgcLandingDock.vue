<script setup lang="ts">
import type { LandingLink } from '../types'

defineProps<{
  links: LandingLink[]
}>()
</script>

<template>
  <nav class="lgc-dock" aria-label="Landing links">
    <AppLink
      v-for="item in links"
      :key="`${item.text}-${item.link}`"
      class="lgc-dock-link"
      :class="`is-${item.variant || 'default'}`"
      :to="item.link"
    >
      <span v-if="item.icon" class="lgc-dock-link__icon" :class="item.icon" aria-hidden="true" />
      <span class="truncate">{{ item.text }}</span>
    </AppLink>
  </nav>
</template>
