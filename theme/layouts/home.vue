<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useThemeConfig } from '../composables'

const route = useRoute()
const themeConfig = useThemeConfig()
const isPage = computed(() => route.path.startsWith('/page'))
const landingEnabled = computed(() => themeConfig.value.landing?.mode !== 'disabled')
</script>

<template>
  <LgcLandingHome v-if="landingEnabled && !isPage" />

  <LgcSiteShell v-else>
    <LgcPageSurface grid>
      <slot>
        <RouterView />
      </slot>
    </LgcPageSurface>
  </LgcSiteShell>
</template>
