import { fileURLToPath } from 'node:url'

import { build, normalizePath } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'

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
