import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { isAbsolute, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import type { ResolvedValaxyOptions } from 'valaxy'
import { normalizePath } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import type Font from 'vite-plugin-font'

import type { FontFamilyConfig, ThemeConfig } from '../../types'
import { themeFontDevPlugin } from './fonts-dev'
import type { ThemeFontEntry } from './utils'
import {
  buildFontVirtualModule,
  buildStaticFontCss,
  emittedFontCssFileName,
  extractFontCss,
  getEmittedFontCssUrl,
  getFontContentType,
  getStaticFontOutputFileName,
  isSplitFontPath,
  isSupportedFontPath,
  normalizeGeneratedFontFamilies,
  publicFontAssetPathPrefix,
  publicFontCssPath,
  resolveAssetUrl,
  resolveConfiguredFamilyByGeneratedFamily,
  resolveFontFamilyByCacheDir,
  setCssCorsHeaders,
  setFontCorsHeaders,
  stripFontCss,
  stripFontPreloadLinks,
  stripOutputFontPreloadLinks,
} from './utils'

const fontsVirtualId = 'virtual:lgc-fonts'
const resolvedFontsVirtualId = `\0${fontsVirtualId}`
const require = createRequire(import.meta.url)
const bundledFontsDir = fileURLToPath(new URL('../../assets/fonts', import.meta.url))
const bundledFontConfig: FontFamilyConfig = {
  family: 'HarmonyOS Sans LgCuwukii',
  paths: bundledFontsDir,
}
const bundledFontCssImports = [
  "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');",
]

export function hasThemeFonts(options?: ResolvedValaxyOptions<ThemeConfig>) {
  return resolveThemeFonts(options).hasFonts
}

export function themeFontPlugins(options?: ResolvedValaxyOptions<ThemeConfig>) {
  const themeFonts = resolveThemeFonts(options)

  return [
    ...(themeFonts.entries.some((entry) => isSplitFontPath(entry.path))
      ? [createViteFontPlugin()]
      : []),
    themeFontDevPlugin(themeFonts),
    createThemeFontPlugin(themeFonts.entries, themeFonts.cssImports),
  ]
}

export function themeFontPlugin(options?: ResolvedValaxyOptions<ThemeConfig>): Plugin {
  const themeFonts = resolveThemeFonts(options)

  return createThemeFontPlugin(themeFonts.entries, themeFonts.cssImports)
}

function createThemeFontPlugin(
  fontEntries: ThemeFontEntry[],
  fontCssImports: string[],
): Plugin {
  const splitFontEntries = fontEntries.filter((entry) => isSplitFontPath(entry.path))
  const staticFontEntries = fontEntries.filter((entry) => !isSplitFontPath(entry.path))
  const fontFamilyByCacheDir = resolveFontFamilyByCacheDir(fontEntries)
  const staticFontRefByPath = new Map<string, string>()
  const hasFonts = fontEntries.length > 0 || fontCssImports.length > 0
  let config: ResolvedConfig
  let fontCacheDir = ''

  return {
    name: 'valaxy-theme-lgcuwukii:fonts',
    enforce: 'post',

    resolveId(id) {
      if (id === fontsVirtualId) {
        return resolvedFontsVirtualId
      }
    },

    load(id) {
      if (id !== resolvedFontsVirtualId) return

      return buildFontVirtualModule(splitFontEntries)
    },

    configResolved(resolvedConfig) {
      config = resolvedConfig
      fontCacheDir = config.cacheDir
    },

    buildStart() {
      if (config.command !== 'build' || config.build.ssr) return

      staticFontRefByPath.clear()

      staticFontEntries.forEach((entry) => {
        if (staticFontRefByPath.has(entry.path)) return

        staticFontRefByPath.set(
          entry.path,
          this.emitFile({
            type: 'asset',
            fileName: getStaticFontOutputFileName(entry.path, config.build.assetsDir),
            source: readFileSync(entry.path),
          }),
        )
      })
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!hasFonts) {
          next()
          return
        }

        const pathname = req.url?.split('?')[0]

        if (pathname === publicFontCssPath) {
          setCssCorsHeaders(res)
        } else if (pathname?.startsWith(publicFontAssetPathPrefix)) {
          setFontCorsHeaders(res, getFontContentType(pathname))
        }

        next()
      })
    },

    generateBundle(_, bundle) {
      if (!hasFonts) return

      const fontCss = [...fontCssImports]
      const configuredFamilyByGeneratedFamily =
        resolveConfiguredFamilyByGeneratedFamily(fontCacheDir, fontFamilyByCacheDir)

      Object.values(bundle).forEach((chunk) => {
        if (
          chunk.type === 'asset' &&
          chunk.fileName.endsWith('.html') &&
          typeof chunk.source === 'string'
        ) {
          chunk.source = stripFontPreloadLinks(chunk.source)
          return
        }

        if (
          chunk.type !== 'asset' ||
          !chunk.fileName.endsWith('.css') ||
          typeof chunk.source !== 'string'
        ) {
          return
        }

        const normalized = normalizeGeneratedFontFamilies(
          chunk.source,
          configuredFamilyByGeneratedFamily,
        )
        fontCss.push(...extractFontCss(normalized))
        chunk.source = stripFontCss(normalized)
      })

      fontCss.push(
        ...buildStaticFontCss(staticFontEntries, (fontPath) => {
          const refId = staticFontRefByPath.get(fontPath)
          if (!refId) return

          return getEmittedFontCssUrl(this.getFileName(refId))
        }),
      )

      if (!fontCss.length) {
        return
      }

      this.emitFile({
        type: 'asset',
        fileName: emittedFontCssFileName,
        source: `${[...new Set(fontCss)].join('\n')}\n`,
      })
    },

    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!hasFonts) return

        return {
          html: config.command === 'build' ? stripFontPreloadLinks(html) : html,
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'stylesheet',
                href: resolveAssetUrl(config.base, publicFontCssPath),
              },
              injectTo: 'head-prepend',
            },
          ],
        }
      },
    },

    closeBundle() {
      if (!hasFonts || config.command !== 'build' || config.build.ssr) return

      stripOutputFontPreloadLinks(
        isAbsolute(config.build.outDir)
          ? config.build.outDir
          : join(config.root, config.build.outDir),
      )
    },
  }
}

function resolveThemeFonts(options?: ResolvedValaxyOptions<ThemeConfig>) {
  const themeFonts = options?.config.themeConfig?.fonts
  const useBundled = themeFonts?.useBundled !== false
  const fontFamilyConfigs = [
    ...(useBundled ? [bundledFontConfig] : []),
    ...(themeFonts?.families ?? []),
  ]
  const entries: ThemeFontEntry[] = []

  fontFamilyConfigs.forEach((familyConfig) => {
    const family = familyConfig.family.trim()
    if (!family) return

    resolveFontSources(familyConfig.paths).forEach((fontPath) => {
      entries.push(...resolveConfiguredFontEntries(fontPath, family, options?.userRoot))
    })
  })

  const resolvedEntries = [
    ...new Map(
      entries.map((entry) => [`${entry.family}\0${entry.path}`, entry]),
    ).values(),
  ]

  return {
    cssImports: useBundled ? bundledFontCssImports : [],
    entries: resolvedEntries,
    hasFonts: resolvedEntries.length > 0 || useBundled,
  }
}

function resolveConfiguredFontPath(fontPath: string, userRoot = process.cwd()) {
  if (fontPath.startsWith('/') && !fontPath.startsWith('//')) {
    return normalizePath(resolve(userRoot, `public${fontPath}`))
  }

  if (isAbsolute(fontPath)) {
    return normalizePath(fontPath)
  }

  return normalizePath(resolve(userRoot, fontPath))
}

function resolveConfiguredFontEntries(
  fontPath: string,
  family: string,
  userRoot = process.cwd(),
) {
  const resolvedPath = resolveConfiguredFontPath(fontPath, userRoot)

  if (!existsSync(resolvedPath)) {
    throw new Error(
      `Configured font path for "${family}" does not exist: ${resolvedPath}`,
    )
  }

  const stats = statSync(resolvedPath)

  if (stats.isFile()) {
    if (!isSupportedFontPath(resolvedPath)) {
      throw new Error(
        `Configured font file for "${family}" is not a supported font: ${resolvedPath}`,
      )
    }

    return [{ family, path: resolvedPath }]
  }

  if (stats.isDirectory()) {
    return resolveFontDirectoryEntries(resolvedPath, family)
  }

  throw new Error(
    `Configured font path for "${family}" must be a file or directory: ${resolvedPath}`,
  )
}

function resolveFontDirectoryEntries(dir: string, family: string): ThemeFontEntry[] {
  if (!existsSync(dir)) return []

  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        return resolveFontDirectoryEntries(entryPath, family)
      }

      if (entry.isFile() && isSupportedFontPath(entryPath)) {
        return [
          {
            family,
            path: normalizePath(entryPath),
          },
        ]
      }

      return []
    })
    .sort((left, right) => left.path.localeCompare(right.path))
}

function resolveFontSources(paths: string | string[] | undefined) {
  if (!paths) return []

  return Array.isArray(paths) ? paths : [paths]
}

function createViteFontPlugin() {
  const fontPlugin = require('vite-plugin-font') as typeof Font

  return fontPlugin.vite()
}
