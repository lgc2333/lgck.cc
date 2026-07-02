<script setup lang="ts">
import { useThemeConfig } from '../composables'

const themeConfig = useThemeConfig()
</script>

<template>
  <LgcLandingHome v-if="themeConfig.landing?.enable !== false" />

  <Layout v-else>
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <StarterHeader />

      <slot>
        <RouterView />
      </slot>
    </div>
  </Layout>
</template>
