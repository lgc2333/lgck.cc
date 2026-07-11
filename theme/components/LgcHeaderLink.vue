<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useHeaderNavItemState } from '../composables'
import type { HeaderActivePathRewrite, HeaderLinkMode, HeaderNavLink } from '../types'
import { normalizeLocaleText } from '../utils/post'
import type { RouteActiveMatch } from '../utils/route'

const props = withDefaults(
  defineProps<{
    activeMatch?: RouteActiveMatch
    activeExpanded?: boolean
    activePathRewrites?: HeaderActivePathRewrite[]
    fixed?: boolean
    item: HeaderNavLink
    linkStyle?: StyleValue
    mode: HeaderLinkMode
    optional?: boolean
  }>(),
  {
    activeMatch: 'prefix',
  },
)

const { t, locale } = useI18n()
const label = computed(() => normalizeLocaleText(props.item.text, locale.value, t))
const { iconClass, isRouteActive } = useHeaderNavItemState({
  activeMatch: toRef(props, 'activeMatch'),
  activePathRewrites: toRef(props, 'activePathRewrites'),
  item: toRef(props, 'item'),
})
</script>

<template>
  <AppLink
    class="lgc-header-button lgc-header-link lgc-icon-button-base lgc-icon-button-hover"
    :class="{
      'is-optional': optional,
      'is-icon': mode === 'icon',
      'is-hover': mode === 'hover',
      'is-expanded': mode === 'expanded',
      'is-active-expanded': activeExpanded,
      'is-fixed': fixed,
      'is-route-active': isRouteActive,
    }"
    :style="linkStyle"
    :to="item.link"
    :aria-label="label"
  >
    <span class="lgc-header-icon" :class="iconClass" aria-hidden="true" />
    <span class="lgc-header-label">{{ label }}</span>
  </AppLink>
</template>

<style scoped lang="scss">
// Residual: config-driven width tokens + rest padding calc + expand transitions.
// open-size fallback 176px = giscus 11rem; never self-ref --lgc-header-link-max-width.
.lgc-header-link {
  --lgc-header-link-icon-size: 1em;
  --lgc-header-link-rest-size: var(
    --lgc-header-link-width,
    var(--lgc-header-link-min-width, var(--lgc-control-size))
  );
  --lgc-header-link-open-size: var(
    --lgc-header-link-width,
    min(var(--lgc-header-link-max-width, 176px), 42vw)
  );
  --lgc-header-link-rest-padding: calc(
    (var(--lgc-header-link-rest-size) - var(--lgc-header-link-icon-size)) / 2
  );

  @apply 'inline-flex items-center justify-start overflow-hidden';
  inline-size: var(--lgc-header-link-width, auto);
  min-inline-size: var(--lgc-header-link-min-width, var(--lgc-control-size));
  max-inline-size: var(--lgc-header-link-rest-size);
  padding-inline: var(--lgc-header-link-rest-padding);

  &:hover,
  &:focus-visible,
  &.is-active-expanded.is-route-active {
    max-inline-size: var(--lgc-header-link-open-size);
  }

  &.is-route-active {
    @apply 'rounded-$lgc-radius-control-active';
    @apply 'text-$md-sys-color-on-primary-container bg-$md-sys-color-primary-container';
  }
}

.lgc-header-icon {
  @apply 'flex-none';
  inline-size: var(--lgc-header-link-icon-size);
  block-size: var(--lgc-header-link-icon-size);
  font-size: var(--lgc-header-link-icon-size);
}

.lgc-header-link.is-icon {
  --lgc-header-link-open-size: var(--lgc-header-link-rest-size);

  &:hover,
  &:focus-visible,
  &.is-active-expanded.is-route-active {
    max-inline-size: var(--lgc-header-link-rest-size);
  }
}

.lgc-header-link.is-fixed {
  inline-size: var(--lgc-header-link-width);
  max-inline-size: var(--lgc-header-link-width);
}

.lgc-header-link.is-expanded {
  max-inline-size: var(--lgc-header-link-open-size);
}

.lgc-header-label {
  @apply 'max-w-0 ml-0 overflow-hidden text-size-$lgc-body-small';
  @apply 'font-800 leading-tight whitespace-nowrap opacity-0 text-ellipsis';
  // Residual: multi-duration list (medium width, short opacity).
  transition:
    margin-left var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-header-link:hover .lgc-header-label,
.lgc-header-link:focus-visible .lgc-header-label,
.lgc-header-link.is-expanded .lgc-header-label,
.lgc-header-link.is-active-expanded.is-route-active .lgc-header-label {
  @apply 'max-w-$lgc-label-width ml-$lgc-gap-compact opacity-100';
}

.lgc-header-link.is-icon .lgc-header-label,
.lgc-header-link.is-icon:hover .lgc-header-label,
.lgc-header-link.is-icon:focus-visible .lgc-header-label,
.lgc-header-link.is-icon.is-active-expanded.is-route-active .lgc-header-label {
  @apply 'max-w-0 ml-0 opacity-0';
}
</style>
