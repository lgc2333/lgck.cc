<script setup lang="ts">
import Giscus from '@giscus/vue'
import { useAppStore, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

import { useAddonGiscus } from '../client'
import type { GiscusOptions } from '../types'

const props = defineProps<{
  options?: GiscusOptions
}>()

const addon = useAddonGiscus()
const appStore = useAppStore()
const siteConfig = useSiteConfig()

const options = computed(() => props.options || addon.value?.options)

const theme = computed(() => {
  const configTheme = options.value?.theme
  if (typeof configTheme === 'string')
    return resolveTheme(configTheme, getFallbackTheme())

  return resolveTheme(
    appStore.isDark ? configTheme?.dark : configTheme?.light,
    getFallbackTheme(),
  )
})

function getFallbackTheme() {
  return appStore.isDark ? 'dark' : 'light'
}

function resolveTheme(theme: string | undefined, fallback: 'dark' | 'light') {
  if (!theme) return fallback

  if (!shouldResolveThemeUrl(theme)) return theme

  if (typeof window === 'undefined' || shouldUseFallbackTheme()) return fallback

  return new URL(theme, window.location.origin).href
}

function shouldResolveThemeUrl(theme: string) {
  return theme.startsWith('/') || theme.startsWith('./') || theme.startsWith('../')
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
</script>

<template>
  <Giscus
    v-if="options?.repo && options.repoId"
    :id="options.id"
    :host="options.host"
    :repo="options.repo"
    :repo-id="options.repoId"
    :category="options.category"
    :category-id="options.categoryId"
    :mapping="options.mapping || 'pathname'"
    :term="options.term"
    :theme="theme"
    :strict="options.strict || '0'"
    :reactions-enabled="options.reactionsEnabled || '1'"
    :emit-metadata="options.emitMetadata || '0'"
    :input-position="options.inputPosition || 'top'"
    :lang="options.lang || siteConfig.lang"
    :loading="options.loading || 'lazy'"
  />
</template>
