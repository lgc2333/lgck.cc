<script setup lang="ts">
// @ts-expect-error virtual module
import ValaxyThemeApp from '/@valaxyjs/ThemeAppVue'
// @ts-expect-error virtual module
import ValaxyUserApp from '/@valaxyjs/UserAppVue'
import { useLayout, useValaxyApp } from 'valaxy'

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
    <Transition name="lgc-page" mode="out-in" :duration="260">
      <component :is="Component" :key="route.fullPath" />
    </Transition>
  </RouterView>
</template>
