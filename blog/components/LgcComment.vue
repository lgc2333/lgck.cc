<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useAppStore } from 'valaxy'
import LgcCommentFrame from 'valaxy-theme-lgcuwukii/components/LgcComment.vue'
import { nextTick, onMounted, ref, watch } from 'vue'

import giscusBaseCss from '../styles/giscus/base.css?raw'
import giscusDarkCss from '../styles/giscus/dark.css?raw'
import giscusLightCss from '../styles/giscus/light.css?raw'

const store = useAppStore()

const theme = ref(getFallbackGiscusTheme(store.isDark))

const forwardedVars = [
  '--lgc-font-family-cjk',
  '--lgc-font-family-mono',
  '--lgc-font-family-system',
  '--lgc-font-family-sans',
  '--va-font-sans',
  '--va-font-mono',
  '--md-sys-color-primary',
  '--md-sys-color-on-primary',
  '--md-sys-color-primary-container',
  '--md-sys-color-on-primary-container',
  '--md-sys-color-secondary-container',
  '--md-sys-color-tertiary',
  '--md-sys-color-tertiary-container',
  '--md-sys-color-surface',
  '--md-sys-color-surface-container-low',
  '--md-sys-color-surface-container',
  '--md-sys-color-surface-container-high',
  '--md-sys-color-on-surface',
  '--md-sys-color-on-surface-variant',
  '--md-sys-color-outline',
  '--md-sys-color-outline-variant',
] as const

const forwardedVarsPlaceholder = '/* __GISCUS_FORWARDED_VARS__ */'
const fontCssPath = '/assets/giscus-fonts.css'

function getFallbackGiscusTheme(isDark: boolean) {
  return isDark ? 'dark' : 'light'
}

function updateTheme() {
  theme.value = buildGiscusThemeDataUrl(store.isDark)
}

function buildGiscusThemeDataUrl(isDark: boolean) {
  const themeCss = isDark ? giscusDarkCss : giscusLightCss
  const css = [
    `@import url('${getSiteUrl(fontCssPath)}');`,
    themeCss,
    giscusBaseCss.replace(
      forwardedVarsPlaceholder,
      getForwardedCssVars(getComputedStyle(document.documentElement)),
    ),
  ].join('\n')

  return `data:text/css;charset=utf-8,${encodeURIComponent(css)}`
}

function getSiteUrl(path: string) {
  return new URL(path, window.location.origin).href
}

function getForwardedCssVars(style: CSSStyleDeclaration) {
  return forwardedVars
    .map((name) => {
      const value = style.getPropertyValue(name).trim().replace(/\s+/g, ' ')
      return value ? `${name}: ${value};` : ''
    })
    .filter(Boolean)
    .join('\n  ')
}

onMounted(() => {
  updateTheme()
})

watch(
  () => store.isDark,
  async () => {
    await nextTick()
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
