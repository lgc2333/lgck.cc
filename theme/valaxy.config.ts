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
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.replaceAll('\\', '/').includes('/utils/m3-loading-indicator/')) {
                return 'lgc-loading-indicator'
              }
            },
          },
        },
      },
      plugins: [Font.vite(), harmonyOSFontFamilyPlugin(), themePlugin()],
    },
    unocss: {
      safelist: generateSafelist(options),
      // MD3 window breakpoints as short variants (dp ≈ px).
      // Compact = base (< 600). https://m3.material.io/foundations/layout/breakpoints
      theme: {
        breakpoint: {
          sm: '600px', // medium
          md: '840px', // expanded
          lg: '1200px', // large
          xl: '1600px', // extra-large
        },
      },
    },
    unocssPresets: {
      icons: {
        collections: {
          'material-symbols': () =>
            import('@iconify-json/material-symbols/icons.json').then((i) => i.default),
          ic: () => import('@iconify-json/ic/icons.json').then((i) => i.default),
          'simple-icons': () =>
            import('@iconify-json/simple-icons/icons.json').then((i) => i.default),
          ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
        } as any,
      },
    },
  }
})
