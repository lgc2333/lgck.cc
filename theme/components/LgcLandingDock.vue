<script setup lang="ts">
import type { LandingLink, LandingLinkVariant } from '../types'

defineProps<{
  links: LandingLink[]
}>()

const variantClass: Record<LandingLinkVariant, string> = {
  default: '',
  primary: 'bg-md-primary text-md-on-primary',
  tonal: 'bg-md-secondary-container text-md-on-secondary-container',
  cookie: 'bg-cookie text-cookie-text',
  ribbon: 'bg-ribbon text-ribbon-text',
}
</script>

<template>
  <nav
    class="mt-7 flex max-w-[760px] flex-wrap items-center justify-center gap-2 sm:mt-9 sm:gap-3"
    aria-label="Landing links"
  >
    <AppLink
      v-for="item in links"
      :key="`${item.text}-${item.link}`"
      class="lgc-dock-link lgc-dock-link-base min-h-11 px-4 hover:translate-y-[-1px] hover:rounded-[18px] hover:bg-md-surface-container-high active:translate-y-0 sm:min-h-12 sm:px-5"
      :class="variantClass[item.variant || 'default']"
      :to="item.link"
    >
      <span v-if="item.icon" class="text-xl" :class="item.icon" aria-hidden="true" />
      <span class="truncate">{{ item.text }}</span>
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
.lgc-dock-link {
  &:hover {
    background-image: linear-gradient(
      color-mix(
        in srgb,
        currentColor calc(var(--lgc-state-hover-opacity) * 100%),
        transparent
      ),
      color-mix(
        in srgb,
        currentColor calc(var(--lgc-state-hover-opacity) * 100%),
        transparent
      )
    );
  }
}
</style>
