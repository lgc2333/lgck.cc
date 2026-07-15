import { defineTheme } from 'valaxy'
import Font from 'vite-plugin-font'

import {
  defaultThemeConfig,
  generateSafelist,
  giscusFontPlugin,
  giscusThemePlugin,
  harmonyOSFontFamilyPlugin,
  loadingBootstrapPlugin,
  materialColorsPlugin,
} from './node'
import type { ThemeConfig } from './types'
import { lgcBreakpoints } from './utils/breakpoints'

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
      plugins: [
        Font.vite(),
        harmonyOSFontFamilyPlugin(),
        materialColorsPlugin(options),
        giscusFontPlugin(),
        giscusThemePlugin(options),
        loadingBootstrapPlugin(),
      ],
    },
    unocss: {
      safelist: generateSafelist(options),
      // MD3 window breakpoints as short variants (dp ≈ px).
      // Compact = base (< 600). https://m3.material.io/foundations/layout/breakpoints
      theme: {
        breakpoint: lgcBreakpoints,
      },
    },
    unocssPresets: {
      icons: {
        collections: {
          'material-symbols': () =>
            import('@iconify-json/material-symbols/icons.json').then((i) => i.default),
          ic: () => import('@iconify-json/ic/icons.json').then((i) => i.default),
        } as any,
      },
    },
  }
})
