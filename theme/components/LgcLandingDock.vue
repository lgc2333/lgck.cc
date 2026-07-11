<script setup lang="ts">
import type { LandingLink, LandingLinkVariant } from '../types'

defineProps<{
  links: LandingLink[]
}>()

const variantClass: Record<LandingLinkVariant, string> = {
  default: 'is-default',
  primary: 'is-primary',
  tonal: 'is-tonal',
  cookie: 'is-cookie',
  ribbon: 'is-ribbon',
}
</script>

<template>
  <nav
    class="lgc-dock"
    flex="~ wrap items-center justify-center"
    max-w="$lgc-measure-wide"
    mt="28px sm:36px"
    gap="$lgc-space-sm sm:$lgc-space-md"
    aria-label="Landing links"
  >
    <AppLink
      v-for="item in links"
      :key="`${item.text}-${item.link}`"
      class="lgc-dock-link"
      min-h="$lgc-control-size-compact sm:$lgc-control-size"
      px="$lgc-space-lg sm:$lgc-space-xl"
      :class="variantClass[item.variant || 'default']"
      :to="item.link"
    >
      <span
        v-if="item.icon"
        text="size-$lgc-icon-font-sm"
        :class="item.icon"
        aria-hidden="true"
      />
      <span whitespace-nowrap text-ellipsis overflow-hidden>
        {{ item.text }}
      </span>
    </AppLink>
  </nav>
</template>

<style scoped lang="scss">
// Residual: variant CSS custom properties drive color/bg (JS must not build color utils).
.lgc-dock-link {
  --lgc-dock-color: var(--md-sys-color-on-surface);
  --lgc-dock-bg: transparent;
  --lgc-dock-hover-color: var(--md-sys-color-primary);
  --lgc-dock-hover-bg: var(--md-sys-color-surface-container-highest);

  @apply 'inline-flex max-w-full items-center gap-$lgc-space-sm';
  @apply 'rounded-$lgc-radius-control text-size-$lgc-body-small font-800 no-underline';
  // Residual: Uno leaves transition-[…max-inline-size…] untransformed in dist.
  transition-property:
    background-color, border-radius, color, max-inline-size, transform;
  @apply 'duration-$lgc-motion-short ease-$lgc-easing-standard';
  color: var(--lgc-dock-color);
  background: var(--lgc-dock-bg);

  &.is-primary {
    --lgc-dock-color: var(--md-sys-color-on-primary);
    --lgc-dock-bg: var(--md-sys-color-primary);
    --lgc-dock-hover-color: var(--md-sys-color-on-primary-container);
    --lgc-dock-hover-bg: var(--md-sys-color-primary-container);
  }

  &.is-tonal {
    --lgc-dock-color: var(--md-sys-color-on-secondary-container);
    --lgc-dock-bg: var(--md-sys-color-secondary-container);
    --lgc-dock-hover-color: var(--md-sys-color-on-secondary-container);
    --lgc-dock-hover-bg: var(--md-sys-color-secondary-container);
  }

  &.is-cookie {
    --lgc-dock-color: var(--lgc-color-cookie-on);
    --lgc-dock-bg: var(--lgc-color-cookie);
    --lgc-dock-hover-color: var(--lgc-color-cookie-on);
    --lgc-dock-hover-bg: var(--lgc-color-cookie-hover);
  }

  &.is-ribbon {
    --lgc-dock-color: var(--lgc-color-ribbon-on);
    --lgc-dock-bg: var(--lgc-color-ribbon);
    --lgc-dock-hover-color: var(--lgc-color-ribbon-on);
    --lgc-dock-hover-bg: var(--lgc-color-ribbon-hover);
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
