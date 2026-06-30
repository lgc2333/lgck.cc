<script setup lang="ts">
import type { LandingSocial } from '../types'

defineProps<{
  socials: LandingSocial[]
}>()
</script>

<template>
  <nav v-if="socials.length" class="lgc-socials" aria-label="Social links">
    <AppLink
      v-for="item in socials"
      :key="`${item.text}-${item.link}`"
      class="lgc-icon-button"
      :to="item.link"
      :aria-label="item.text"
      rel="noopener"
    >
      <span :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>
