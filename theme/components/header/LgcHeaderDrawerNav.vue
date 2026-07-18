<script setup lang="ts">
import { toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { resolveHeaderNavItemState, useHeaderNavItemState } from '../../composables'
import type { HeaderActivePathRewrite, HeaderNavLink } from '../../types'
import { normalizeLocaleText } from '../../utils/post'

const props = defineProps<{
  activePathRewrites?: HeaderActivePathRewrite[]
  addHome?: boolean
  homeLink: HeaderNavLink
  links: HeaderNavLink[]
}>()

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()
const { t, locale } = useI18n()
const homeLinkState = useHeaderNavItemState({
  activeMatch: 'exact',
  activePathRewrites: toRef(props, 'activePathRewrites'),
  item: toRef(props, 'homeLink'),
})

function isDrawerLinkActive(item: HeaderNavLink) {
  if (item.link === props.homeLink.link) return homeLinkState.isRouteActive.value

  return resolveHeaderNavItemState(
    route.path,
    item,
    item.link === '/' ? 'exact' : 'prefix',
    props.activePathRewrites,
  ).isRouteActive
}

function getDrawerIcon(item: HeaderNavLink) {
  if (item.link === props.homeLink.link) return homeLinkState.iconClass.value

  return resolveHeaderNavItemState(
    route.path,
    item,
    item.link === '/' ? 'exact' : 'prefix',
    props.activePathRewrites,
  ).iconClass
}

function linkLabel(item: HeaderNavLink) {
  return normalizeLocaleText(item.text, locale.value, t)
}
</script>

<template>
  <nav
    flex-1
    grid
    content-start
    gap="1.5"
    pt="$lgc-space-sm"
    :aria-label="t('accessibility.navigation.mobile_links')"
  >
    <AppLink
      v-if="addHome"
      class="lgc-drawer-link lgc-drawer-home"
      :class="{ 'is-route-active': isDrawerLinkActive(homeLink) }"
      :to="homeLink.link"
      @click="emit('close')"
    >
      <span
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        :class="getDrawerIcon(homeLink)"
        aria-hidden="true"
      />
      <span>{{ linkLabel(homeLink) }}</span>
    </AppLink>

    <AppLink
      v-for="item in links"
      :key="`drawer-${item.link}`"
      class="lgc-drawer-link"
      :class="{ 'is-route-active': isDrawerLinkActive(item) }"
      :to="item.link"
      @click="emit('close')"
    >
      <span
        class="lgc-drawer-icon text-size-$lgc-icon-size h-$lgc-icon-size w-$lgc-icon-size"
        :class="getDrawerIcon(item)"
        aria-hidden="true"
      />
      <span>{{ linkLabel(item) }}</span>
    </AppLink>
  </nav>
</template>
