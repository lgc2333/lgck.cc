<!-- Overriding because we need layout transition -->

<script setup lang="ts">
// @ts-expect-error virtual module
import ValaxyThemeApp from '/@valaxyjs/ThemeAppVue'
// @ts-expect-error virtual module
import ValaxyUserApp from '/@valaxyjs/UserAppVue'
import { useLayout, useValaxyApp } from 'valaxy'

import { getRouteContentKey } from '../utils/route'

const layout = useLayout()

if (layout.value !== 'empty') {
  useValaxyApp()
}
</script>

<template>
  <template v-if="layout !== 'empty'">
    <ValaxyThemeApp />
    <ValaxyAddons />
    <ValaxyUserApp />
  </template>

  <RouterView v-slot="{ Component, route }">
    <!-- Duration owned by CSS `--lgc-motion-medium` on `.lgc-page-*` (transitionend). -->
    <Transition name="lgc-page" mode="out-in">
      <component :is="Component" :key="getRouteContentKey(route.fullPath)" />
    </Transition>
  </RouterView>
</template>
