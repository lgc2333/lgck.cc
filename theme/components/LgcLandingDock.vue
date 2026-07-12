<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { LandingLink, LandingLinkVariant, LandingLinks } from '../types'
import { normalizeLandingLinkRows } from '../utils/landing'
import { normalizeLocaleText } from '../utils/post'

const props = defineProps<{
  links: LandingLinks
}>()

const { t, locale } = useI18n()
const linkRows = computed(() => normalizeLandingLinkRows(props.links))

const variantClass: Record<LandingLinkVariant, string> = {
  brown: 'is-brown',
  pink: 'is-pink',
  primary: 'is-primary',
  secondary: 'is-secondary',
  surface: 'is-surface',
  transparent: 'is-transparent',
}

function linkVariantClass(variant?: LandingLinkVariant) {
  return variantClass[variant || 'primary']
}

function linkLabel(item: LandingLink) {
  return normalizeLocaleText(item.text, locale.value, t)
}
</script>

<template>
  <nav
    class="lgc-dock"
    flex="~ col items-center"
    max-w="$lgc-measure-wide"
    mt="28px sm:36px"
    gap="$lgc-space-sm sm:$lgc-space-md"
    :aria-label="t('accessibility.landing_links')"
  >
    <div
      v-for="(row, rowIndex) in linkRows"
      :key="rowIndex"
      flex="~ wrap items-center justify-center"
      gap="$lgc-space-sm sm:$lgc-space-md"
      max-w="full"
    >
      <AppLink
        v-for="item in row"
        :key="item.link"
        class="lgc-dock-link text-size-$lgc-body-small font-800 rounded-$lgc-radius-control no-underline inline-flex gap-$lgc-space-sm max-w-full items-center"
        min-h="$lgc-control-size-compact sm:$lgc-control-size"
        px="$lgc-space-lg sm:$lgc-space-xl"
        :class="linkVariantClass(item.variant)"
        :to="item.link"
      >
        <span
          v-if="item.icon"
          text="size-$lgc-icon-font-sm"
          :class="item.icon"
          aria-hidden="true"
        />
        <span whitespace-nowrap text-ellipsis overflow-hidden>
          {{ linkLabel(item) }}
        </span>
      </AppLink>
    </div>
  </nav>
</template>

<style scoped lang="scss">
// Residual: variant CSS custom properties drive color/bg (JS must not build color
// utils). Layout chrome is Uno on the element. transition-property residual —
// Uno leaves transition-[…max-inline-size…] untransformed in dist.
.lgc-dock-link {
  --lgc-dock-color: var(--md-sys-color-on-primary-container);
  --lgc-dock-bg: var(--md-sys-color-primary-container);
  --lgc-dock-hover-color: var(--md-sys-color-on-primary);
  --lgc-dock-hover-bg: var(--md-sys-color-primary);

  --lgc-dock-transparent-opacity: 25%;
  --lgc-dock-transparent-hover-opacity: 50%;

  transition-property:
    background-color, border-radius, color, max-inline-size, transform;
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  color: var(--lgc-dock-color);
  background: var(--lgc-dock-bg);

  &.is-surface {
    --lgc-dock-color: var(--md-sys-color-on-surface);
    --lgc-dock-bg: var(--md-sys-color-surface-container-highest);
    --lgc-dock-hover-color: var(--md-sys-color-primary);
    --lgc-dock-hover-bg: color-mix(
      in srgb,
      var(--md-sys-color-primary) 10%,
      var(--md-sys-color-surface-container-highest)
    );
  }

  &.is-secondary {
    --lgc-dock-color: var(--md-sys-color-on-secondary-container);
    --lgc-dock-bg: var(--md-sys-color-secondary-container);
    --lgc-dock-hover-color: var(--md-sys-color-on-secondary);
    --lgc-dock-hover-bg: var(--md-sys-color-secondary);
  }

  &.is-transparent {
    --lgc-dock-color: var(--md-sys-color-on-surface);
    --lgc-dock-bg: color-mix(
      in srgb,
      var(--md-sys-color-surface-container-highest) var(--lgc-dock-transparent-opacity),
      transparent
    );
    --lgc-dock-hover-color: var(--md-sys-color-primary);
    --lgc-dock-hover-bg: color-mix(
      in srgb,
      var(--md-sys-color-primary-container) var(--lgc-dock-transparent-hover-opacity),
      transparent
    );
  }

  &.is-brown {
    --lgc-dock-color: var(--md-custom-color-on-brown-container);
    --lgc-dock-bg: var(--md-custom-color-brown-container);
    --lgc-dock-hover-color: var(--md-custom-color-on-brown);
    --lgc-dock-hover-bg: var(--md-custom-color-brown);
  }

  &.is-pink {
    --lgc-dock-color: var(--md-custom-color-on-pink-container);
    --lgc-dock-bg: var(--md-custom-color-pink-container);
    --lgc-dock-hover-color: var(--md-custom-color-on-pink);
    --lgc-dock-hover-bg: var(--md-custom-color-pink);
  }

  &:hover {
    @apply 'rounded-$lgc-radius-control-morph -translate-y-1px';
    color: var(--lgc-dock-hover-color);
    background: var(--lgc-dock-hover-bg);
  }

  &:active {
    @apply 'scale-$lgc-control-press-scale';
  }
}
</style>
