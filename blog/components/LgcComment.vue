<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useAppStore } from 'valaxy'
import LgcCommentFrame from 'valaxy-theme-lgcuwukii/components/LgcComment.vue'
import { onMounted, ref, watch } from 'vue'

const store = useAppStore()

const theme = ref(getFallbackGiscusTheme(store.isDark))

const giscusLightThemePath = '/assets/giscus/light.css'
const giscusDarkThemePath = '/assets/giscus/dark.css'

function getFallbackGiscusTheme(isDark: boolean) {
  return isDark ? 'dark' : 'light'
}

function updateTheme() {
  theme.value = getGiscusTheme(store.isDark)
}

function getGiscusTheme(isDark: boolean) {
  if (shouldUseFallbackTheme()) {
    return getFallbackGiscusTheme(isDark)
  }

  return getSiteUrl(isDark ? giscusDarkThemePath : giscusLightThemePath)
}

function getSiteUrl(path: string) {
  return new URL(path, window.location.origin).href
}

function shouldUseFallbackTheme() {
  return (
    window.location.protocol !== 'https:' || isPrivateHost(window.location.hostname)
  )
}

function isPrivateHost(hostname: string) {
  return (
    hostname === 'localhost' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    /^127\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(?:1[6-9]|2\d|3[01])\./.test(hostname) ||
    /^169\.254\./.test(hostname)
  )
}

onMounted(() => {
  updateTheme()
})

watch(
  () => store.isDark,
  () => {
    updateTheme()
  },
)
</script>

<template>
  <LgcCommentFrame>
    <Giscus
      repo="lgc2333/blog"
      repo-id="R_kgDOLr1GDQ"
      category="Announcements"
      category-id="DIC_kwDOLr1GDc4Cen96"
      mapping="pathname"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      :theme="theme"
      lang="zh-CN"
      loading="lazy"
    />
  </LgcCommentFrame>
</template>
