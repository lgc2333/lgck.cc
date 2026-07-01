<script setup lang="ts">
import type { LandingSocial } from '../types'

defineProps<{
  socials: LandingSocial[]
}>()
</script>

<template>
  <nav
    v-if="socials.length"
    class="mt-6 flex flex-wrap items-center justify-center gap-2"
    aria-label="Social links"
  >
    <AppLink
      v-for="item in socials"
      :key="`${item.text}-${item.link}`"
      class="lgc-icon-button-base lgc-icon-button-hover h-11 w-11 rounded-[22px] text-xl hover:translate-y-[-1px] hover:rounded-[15px] active:translate-y-0"
      :to="item.link"
      :aria-label="item.text"
      rel="noopener"
    >
      <span :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>
