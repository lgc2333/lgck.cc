import type { ThemeConfig } from './types'
import { defineTheme } from 'valaxy'
import Font from 'vite-plugin-font'
import {
  defaultThemeConfig,
  generateSafelist,
  harmonyOSFontFamilyPlugin,
  themePlugin,
} from './node'

export default defineTheme<ThemeConfig>((options) => {
  return {
    themeConfig: defaultThemeConfig,
    vite: {
      plugins: [Font.vite(), harmonyOSFontFamilyPlugin(), themePlugin(options)],
    },
    unocss: {
      safelist: generateSafelist(options.config.themeConfig as ThemeConfig),
    },
  }
})
