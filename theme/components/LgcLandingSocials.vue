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
      rounded="$lgc-radius-control hover:$lgc-radius-lg-plus active:$lgc-radius-control-active"
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
// Residual only: classic transform + multi-duration list.
// Quiet morph radius is Uno on the element. Wind4 hover:-translate-y / active:scale
// set `translate`/`scale` props; icon-button-hover's scale cannot be cancelled by
// `transform: none` alone — keep classic transform here and reset `scale`.
.lgc-social-link {
  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
}

.lgc-social-link:hover,
.lgc-social-link:focus-visible {
  transform: translateY(-1px);
}

.lgc-social-link:active {
  scale: none;
  transform: scale(var(--lgc-control-press-scale));
}
</style>
