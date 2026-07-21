<script setup lang="ts">
import { getAddonModule, isEmptyAddon, useThemeConfig, useValaxyI18n } from 'valaxy'
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

const supportedGiscusLangs = new Set([
  'ar',
  'be',
  'bg',
  'ca',
  'cs',
  'da',
  'de',
  'en',
  'eo',
  'es',
  'eu',
  'fa',
  'fr',
  'gr',
  'gsw',
  'hbs',
  'he',
  'hu',
  'id',
  'it',
  'ja',
  'kh',
  'ko',
  'nl',
  'pl',
  'pt',
  'ro',
  'ru',
  'th',
  'tr',
  'uk',
  'uz',
  'vi',
  'zh-CN',
  'zh-Hans',
  'zh-Hant',
  'zh-HK',
  'zh-TW',
])

const giscusLangAliases: Record<string, NonNullable<GiscusOptions['lang']>> = {
  zh: 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-hans': 'zh-Hans',
  'zh-hant': 'zh-Hant',
  'zh-hk': 'zh-HK',
  'zh-mo': 'zh-Hant',
  'zh-sg': 'zh-Hans',
  'zh-tw': 'zh-TW',
}

const themeConfig = useThemeConfig<ThemeConfig>()
const { locale } = useValaxyI18n()

const themeOverride = computed<Partial<GiscusOptions>>(() => {
  const overrides: Partial<GiscusOptions> = {
    lang: resolveGiscusLang(locale.value),
  }

  if (themeConfig.value.giscus?.useTheme !== false) overrides.theme = themeGiscusTheme

  return overrides
})

const options = isEmptyAddon(addonGiscus)
  ? undefined
  : getAddonModule<{
      useAddonGiscusOptions: (
        overrides: ComputedRef<Partial<GiscusOptions> | undefined>,
      ) => ComputedRef<GiscusOptions | undefined>
    }>(addonGiscus).useAddonGiscusOptions(themeOverride)

function resolveGiscusLang(locale: string): NonNullable<GiscusOptions['lang']> {
  const normalized = locale.trim().replace(/_/g, '-')
  const normalizedLower = normalized.toLowerCase()
  const alias = giscusLangAliases[normalizedLower]
  if (alias) return alias

  if (normalizedLower.startsWith('zh-hans-')) return 'zh-Hans'
  if (normalizedLower.startsWith('zh-hant-')) return 'zh-Hant'

  if (supportedGiscusLangs.has(normalized)) return normalized

  const language = normalized.split('-')[0]?.toLowerCase()
  if (language && supportedGiscusLangs.has(language)) return language

  return 'en'
}
</script>

<template>
  <GiscusClient :options="options" />
</template>
