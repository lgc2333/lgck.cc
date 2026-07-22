import { resolve } from 'node:path'

import { defineTheme } from 'valaxy'

import {
  defaultThemeConfig,
  generateSafelist,
  giscusThemePlugin,
  hasThemeFonts,
  loadingBootstrapPlugin,
  materialColorsPlugin,
  themeFontPlugins,
} from './node'
import { stripOutputFontPreloadLinks } from './node/vite/utils'
import type { ThemeConfig } from './types'
import { lgcBreakpoints } from './utils/breakpoints'

export default defineTheme<ThemeConfig>((options) => {
  const hasFonts = hasThemeFonts(options)

  return {
    themeConfig: defaultThemeConfig,

    hooks: {
      'build:after': () => {
        if (!hasFonts) return
        stripOutputFontPreloadLinks(resolve(options.userRoot, 'dist'))
      },
    },

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
        ...themeFontPlugins(options),
        materialColorsPlugin(options),
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
        font: {
          mono: 'var(--va-font-mono)',
        },
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
