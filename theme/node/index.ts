import { fileURLToPath } from 'node:url'

import type { ResolvedValaxyOptions } from 'valaxy'
import { build, normalizePath } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'

import type { ThemeConfig } from '../types'

export { harmonyOSFontFamilyPlugin } from './font'

/**
 * Default Config
 */
export const defaultThemeConfig: ThemeConfig = {
  valaxyDarkOptions: {
    circleTransition: true,
  },
  landing: {
    mode: 'full',
    compactHeight: 65,
    links: [],
  },
  header: {
    i18n: true,
    nav: [],
    links: {
      addHome: true,
      homeFixed: false,
      activeExpanded: true,
    },
  },
  footer: {
    powered: false,
  },
}

// write a vite plugin
// https://vitejs.dev/guide/api-plugin.html
export function themePlugin(): Plugin {
  const loadingBootstrapPath = normalizePath(
    fileURLToPath(new URL('../client/loading-bootstrap.ts', import.meta.url)),
  )
  let config: ResolvedConfig
  let loadingBootstrapFileName: string | undefined
  let buildingLoadingBootstrap = false

  return {
    name: 'valaxy-theme-lgcuwukii',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async buildStart() {
      if (config.command !== 'build' || config.build.ssr) return

      loadingBootstrapFileName = undefined

      if (buildingLoadingBootstrap) return

      buildingLoadingBootstrap = true

      try {
        const result = await build({
          configFile: false,
          publicDir: false,
          logLevel: 'silent',
          build: {
            assetsDir: config.build.assetsDir,
            cssCodeSplit: false,
            emptyOutDir: false,
            minify: config.build.minify,
            modulePreload: false,
            outDir: config.build.outDir,
            rollupOptions: {
              input: loadingBootstrapPath,
              output: {
                codeSplitting: false,
                entryFileNames: 'assets/lgc-loading-bootstrap.[hash].js',
                format: 'es',
              },
            },
            sourcemap: config.build.sourcemap,
            write: false,
          },
        })

        if (!('output' in result) && !Array.isArray(result)) return

        const output = Array.isArray(result)
          ? result.flatMap((item) => item.output)
          : result.output
        const loadingBootstrapChunk = output.find(
          (item) => item.type === 'chunk' && item.isEntry,
        )

        if (!loadingBootstrapChunk || loadingBootstrapChunk.type !== 'chunk') {
          return
        }

        loadingBootstrapFileName = loadingBootstrapChunk.fileName

        this.emitFile({
          type: 'asset',
          fileName: loadingBootstrapFileName,
          source: loadingBootstrapChunk.code,
        })
      } finally {
        buildingLoadingBootstrap = false
      }
    },
    generateBundle(_, bundle) {
      if (loadingBootstrapFileName && bundle[loadingBootstrapFileName]) return

      const loadingBootstrapAsset = Object.values(bundle).find(
        (item) =>
          item.type === 'asset' &&
          item.fileName.startsWith(`${config.build.assetsDir}/lgc-loading-bootstrap.`),
      )

      loadingBootstrapFileName = loadingBootstrapAsset?.fileName
    },
    transformIndexHtml(_, ctx) {
      if (config.command !== 'build') {
        return [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${loadingBootstrapPath}`,
            },
            injectTo: 'head-prepend',
          },
        ]
      }

      const fileName =
        loadingBootstrapFileName ||
        Object.values(ctx.bundle || {}).find(
          (item) =>
            item.type === 'asset' &&
            item.fileName.startsWith(
              `${config.build.assetsDir}/lgc-loading-bootstrap.`,
            ),
        )?.fileName

      if (!fileName) return

      return [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            crossorigin: true,
            src: resolveAssetUrl(config.base, fileName),
          },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

function resolveAssetUrl(base: string, fileName: string) {
  if (!base || base === './') return `./${fileName}`

  return `${base.replace(/\/$/, '')}/${fileName}`
}

/**
 * generateSafelist by config
 * @param options
 */
export function generateSafelist(options: ResolvedValaxyOptions<ThemeConfig>) {
  const themeConfig = options?.config.themeConfig || {}
  const siteConfig = options?.config.siteConfig
  const safelist: string[] = [
    'i-material-symbols-home-rounded',
    'i-material-symbols-menu-rounded',
    'i-material-symbols-close-rounded',
    'i-material-symbols-translate-rounded',
    'i-material-symbols-light-mode-outline-rounded',
    'i-material-symbols-dark-mode-outline-rounded',
    'i-material-symbols-search-rounded',
    'i-ic-round-push-pin',
    'i-material-symbols-visibility-off-rounded',
    'i-material-symbols-visibility-rounded',
    'i-material-symbols-keyboard-arrow-down-rounded',
    'i-material-symbols-keyboard-arrow-up-rounded',
    'i-material-symbols-keyboard-arrow-left-rounded',
    'i-material-symbols-keyboard-arrow-right-rounded',
    'i-material-symbols-arrow-back-ios-new-rounded',
    'i-material-symbols-arrow-forward-ios-rounded',
    'i-material-symbols-arrow-forward-rounded',
    'i-material-symbols-person-outline-rounded',
    'i-material-symbols-favorite-outline-rounded',
    'i-material-symbols-rss-feed-rounded',
    'i-material-symbols-mail-outline-rounded',
    'i-material-symbols-article-outline-rounded',
    'i-material-symbols-history-rounded',
    'i-material-symbols-calendar-month-outline-rounded',
    'i-material-symbols-edit-calendar-outline-rounded',
    'i-material-symbols-category-outline-rounded',
    'i-material-symbols-tag-rounded',
    'i-material-symbols-dashboard-outline-rounded',
    'i-material-symbols-imagesmode-outline-rounded',
    'i-material-symbols-link-rounded',
    'i-material-symbols-keyboard-return-rounded',
    'i-material-symbols-travel-explore-rounded',
    'i-simple-icons-github',
  ]

  const footerIcon = themeConfig.footer?.icon?.name
  if (footerIcon) safelist.push(footerIcon)

  themeConfig.landing?.links?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  themeConfig.header?.nav?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  siteConfig?.social?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  return safelist
}
