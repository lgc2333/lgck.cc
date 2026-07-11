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
      :to="item.link"
      :aria-label="item.name"
      rel="noopener"
    >
      <!-- font-size on icon host, not AppLink: HTMLAnchorElement.text wipes children -->
      <span class="text-size-$lgc-icon-font-sm" :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
// Quiet morph: control → lg-plus (14px). Not full/999 as rest (eases from a fake huge value).
// Residual classic transform — Wind4 translate/scale cannot be cancelled cleanly.
.lgc-social-link {
  border-radius: var(--lgc-radius-control);
  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-social-link:hover,
.lgc-social-link:focus-visible {
  border-radius: var(--lgc-radius-lg-plus);
  transform: translateY(-1px);
}

.lgc-social-link:active {
  border-radius: var(--lgc-radius-control-active);
  // Override icon-button-hover's Uno `scale` with classic transform.
  scale: none;
  transform: scale(var(--lgc-control-press-scale));
}
</style>
