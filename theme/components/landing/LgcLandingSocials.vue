<script setup lang="ts">
import type { SocialLink } from 'valaxy'
import { useValaxyI18n } from 'valaxy'
import { useI18n } from 'vue-i18n'

defineProps<{
  socials: SocialLink[]
}>()

const { t } = useI18n()
const { $t } = useValaxyI18n()
</script>

<template>
  <nav
    v-if="socials.length"
    flex="~ wrap items-center justify-center"
    mt="$lgc-space-2xl"
    gap="$lgc-space-sm"
    :aria-label="t('accessibility.social_links')"
  >
    <AppLink
      v-for="item in socials"
      :key="`${item.name}-${item.link}`"
      class="lgc-social-link lgc-icon-button-base"
      w="$lgc-control-size-compact"
      h="$lgc-control-size-compact"
      rounded="$lgc-radius-control hover:$lgc-radius-lg-plus active:$lgc-radius-control-active"
      :to="item.link"
      :aria-label="$t(item.name)"
      rel="noopener"
    >
      <!-- font-size on icon host, not AppLink: HTMLAnchorElement.text wipes children -->
      <span class="text-size-$lgc-icon-font-sm" :class="item.icon" aria-hidden="true" />
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
// Residual: transparent dock color-mix vars + classic transform + multi-duration list.
// Quiet morph radius is Uno on the element. Wind4 hover:-translate-y / active:scale
// set `translate`/`scale` props; icon-button-hover's scale cannot be cancelled by
// `transform: none` alone — keep classic transform here and reset `scale`.
.lgc-social-link {
  --lgc-social-transparent-opacity: 30%;
  --lgc-social-transparent-hover-opacity: 50%;
  --lgc-social-color: var(--md-sys-color-on-surface);
  --lgc-social-bg: color-mix(
    in srgb,
    var(--md-sys-color-surface-container-highest) var(--lgc-social-transparent-opacity),
    transparent
  );
  --lgc-social-hover-color: var(--md-sys-color-primary);
  --lgc-social-hover-bg: color-mix(
    in srgb,
    var(--md-sys-color-primary-container) var(--lgc-social-transparent-hover-opacity),
    transparent
  );

  transition-property: background-color, border-radius, color, transform;
  transition-duration:
    var(--lgc-motion-short), var(--lgc-motion-medium), var(--lgc-motion-short),
    var(--lgc-motion-short);
  transition-timing-function: var(--lgc-easing-standard);
  color: var(--lgc-social-color);
  background: var(--lgc-social-bg);
}

.lgc-social-link:hover,
.lgc-social-link:focus-visible {
  color: var(--lgc-social-hover-color);
  background: var(--lgc-social-hover-bg);
  transform: translateY(-1px);
}

.lgc-social-link:active {
  scale: none;
  transform: scale(var(--lgc-control-press-scale));
}
</style>
