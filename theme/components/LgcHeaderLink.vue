<script setup lang="ts">
import type { StyleValue } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { HeaderActivePathRewrite, HeaderLinkMode, HeaderNavLink } from '../types'
import type { RouteActiveMatch } from '../utils/route'
import { isRouteLinkActive } from '../utils/route'

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

const route = useRoute()
const isRouteActive = computed(() => {
  return isRouteLinkActive(
    route.path,
    props.item.link,
    props.activeMatch,
    props.activePathRewrites,
  )
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
    :aria-label="item.text"
  >
    <span v-if="item.icon" :class="item.icon" aria-hidden="true" />
    <span v-else class="lgc-header-fallback">{{ item.text.slice(0, 1) }}</span>
    <span class="lgc-header-label">{{ item.text }}</span>
  </AppLink>
</template>

<style scoped lang="scss">
.lgc-header-link {
  --lgc-header-link-icon-size: 1em;
  --lgc-header-link-rest-size: var(
    --lgc-header-link-width,
    var(--lgc-header-link-min-width, var(--lgc-control-size))
  );
  --lgc-header-link-open-size: var(
    --lgc-header-link-width,
    min(var(--lgc-header-link-max-width, 11rem), 42vw)
  );
  --lgc-header-link-rest-padding: calc(
    (var(--lgc-header-link-rest-size) - var(--lgc-header-link-icon-size)) / 2
  );

  inline-size: var(--lgc-header-link-width, auto);
  min-inline-size: var(--lgc-header-link-min-width, var(--lgc-control-size));
  max-inline-size: var(--lgc-header-link-rest-size);
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding-inline: var(--lgc-header-link-rest-padding);

  &:hover,
  &:focus-visible,
  &.is-active-expanded.is-route-active {
    max-inline-size: var(--lgc-header-link-open-size);
  }

  &.is-route-active {
    border-radius: var(--lgc-radius-control-active);
    color: var(--md-sys-color-on-primary-container);
    background: var(--md-sys-color-primary-container);
  }
}

.lgc-header-link > span:first-child {
  flex: 0 0 var(--lgc-header-link-icon-size);
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
  max-width: 0;
  margin-left: 0;
  overflow: hidden;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0;
  transition:
    margin-left var(--lgc-motion-medium) var(--lgc-easing-standard),
    max-width var(--lgc-motion-medium) var(--lgc-easing-standard),
    opacity var(--lgc-motion-short) var(--lgc-easing-standard);
}

.lgc-header-link:hover .lgc-header-label,
.lgc-header-link:focus-visible .lgc-header-label,
.lgc-header-link.is-expanded .lgc-header-label,
.lgc-header-link.is-active-expanded.is-route-active .lgc-header-label {
  max-width: var(--lgc-label-width);
  margin-left: var(--lgc-gap-compact);
  opacity: 1;
}

.lgc-header-link.is-icon .lgc-header-label,
.lgc-header-link.is-icon:hover .lgc-header-label,
.lgc-header-link.is-icon:focus-visible .lgc-header-label,
.lgc-header-link.is-icon.is-active-expanded.is-route-active .lgc-header-label {
  max-width: 0;
  margin-left: 0;
  opacity: 0;
}

.lgc-header-fallback {
  font-size: 1.25rem;
  font-weight: 800;
}
</style>
