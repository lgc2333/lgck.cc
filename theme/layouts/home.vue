<script setup lang="ts">
import { useThemeConfig } from '../composables'

const themeConfig = useThemeConfig()
</script>

<template>
  <LgcLandingHome v-if="themeConfig.landing?.enable !== false" />

  <Layout v-else>
    <div class="lgc-home-fallback">
      <LgcHomeIntro />

      <slot>
        <RouterView />
      </slot>
    </div>
  </Layout>
</template>

<style scoped lang="scss">
.lgc-home-fallback {
  display: grid;
  border-top: 1px solid var(--md-sys-color-outline-variant);
}
</style>
