<script setup lang="ts">
import type { SocialLink } from 'valaxy'

defineProps<{
  socials: SocialLink[]
}>()
</script>

<template>
  <nav
    v-if="socials.length"
    flex="~ wrap items-center justify-center"
    mt="$lgc-space-2xl"
    gap="$lgc-space-sm"
    aria-label="Social links"
  >
    <AppLink
      v-for="item in socials"
      :key="`${item.name}-${item.link}`"
      class="lgc-social-link lgc-icon-button-base lgc-icon-button-hover"
      w="$lgc-control-size-compact"
      h="$lgc-control-size-compact"
      rounded="full hover:$lgc-radius-lg-plus"
      hover="-translate-y-1px"
      active="scale-$lgc-control-press-scale"
      :to="item.link"
      :aria-label="item.name"
      rel="noopener"
    >
      <!-- font-size on icon host, not AppLink: HTMLAnchorElement.text wipes children -->
      <span class="text-size-$lgc-icon-font-sm" :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>
