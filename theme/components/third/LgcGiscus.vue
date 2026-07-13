<script setup lang="ts">
import { getAddonModule, isEmptyAddon, useThemeConfig } from 'valaxy'
import * as addonGiscus from 'valaxy-addon-giscus/client/index.ts'
import GiscusClient from 'valaxy-addon-giscus/components/GiscusClient.vue'
import type { GiscusOptions } from 'valaxy-addon-giscus/types/index.ts'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

import type { ThemeConfig } from '../../types'

const themeGiscusTheme = {
  light: '/assets/giscus/light.css',
  dark: '/assets/giscus/dark.css',
} satisfies GiscusOptions['theme']

const themeConfig = useThemeConfig<ThemeConfig>()
const themeOverride = computed<Partial<GiscusOptions> | undefined>(() => {
  if (themeConfig.value.giscus?.useTheme === false) return

  return {
    theme: themeGiscusTheme,
  }
})

const options = isEmptyAddon(addonGiscus)
  ? undefined
  : getAddonModule<{
      useAddonGiscusOptions: (
        overrides: ComputedRef<Partial<GiscusOptions> | undefined>,
      ) => ComputedRef<GiscusOptions | undefined>
    }>(addonGiscus).useAddonGiscusOptions(themeOverride)
</script>

<template>
  <GiscusClient :options="options" />
</template>
