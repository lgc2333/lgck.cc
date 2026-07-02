<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useThemeConfig } from '../composables'

const route = useRoute()
const themeConfig = useThemeConfig()
const isPage = computed(() => route.path.startsWith('/page'))
</script>

<template>
  <LgcLandingHome v-if="themeConfig.landing?.enable !== false && !isPage" />

  <Layout v-else>
    <div class="lgc-home-fallback">
      <LgcHomeIntro v-if="!isPage" />

      <slot>
        <RouterView />
      </slot>
    </div>
  </Layout>
</template>

<style scoped lang="scss">
.lgc-home-fallback {
  display: grid;
}
</style>
