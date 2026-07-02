import { defineTheme } from 'valaxy'
import Font from 'vite-plugin-font'

import {
  defaultThemeConfig,
  generateSafelist,
  harmonyOSFontFamilyPlugin,
  themePlugin,
} from './node'
import type { ThemeConfig } from './types'

export default defineTheme<ThemeConfig>((options) => {
  return {
    themeConfig: defaultThemeConfig,
    vite: {
      plugins: [Font.vite(), harmonyOSFontFamilyPlugin(), themePlugin()],
    },
    unocss: {
      safelist: generateSafelist(options),
    },
    unocssPresets: {
      icons: {
        collections: {
          'material-symbols': () =>
            import('@iconify-json/material-symbols/icons.json').then((i) => i.default),
          'simple-icons': () =>
            import('@iconify-json/simple-icons/icons.json').then((i) => i.default),
          ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
        } as any,
      },
    },
  }
})
