import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import type { ServerResponse } from 'node:http'
import { createRequire } from 'node:module'
import { basename, extname, isAbsolute, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import type { ResolvedValaxyOptions } from 'valaxy'
import { normalizePath } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import type Font from 'vite-plugin-font'

import type { FontFamilyConfig, ThemeConfig } from '../../types'
import {
  getFontContentType,
  resolveAssetUrl,
  setCssCorsHeaders,
  setFontCorsHeaders,
  stripFontPreloadLinks,
  stripOutputFontPreloadLinks,
} from './utils'

interface ThemeFontEntry {
  family: string
  path: string
}

interface DevFontAsset {
  body: Buffer
  filePath: string
}

const fontsVirtualId = 'virtual:lgc-fonts'
const resolvedFontsVirtualId = `\0${fontsVirtualId}`
const require = createRequire(import.meta.url)
const bundledFontsDir = fileURLToPath(new URL('../../assets/fonts', import.meta.url))
export const publicFontCssPath = '/assets/lgc-fonts.css'
const bundledFontConfig: FontFamilyConfig = {
  family: 'HarmonyOS Sans LgCuwukii',
  paths: bundledFontsDir,
}
const bundledFontCssImports = [
  "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');",
]
const publicFontAssetPathPrefix = '/assets/lgc-fonts/'
const emittedFontCssFileName = 'assets/lgc-fonts.css'
const splitFontExtensions = new Set(['.otf', '.ttf'])
const staticFontFormatByExtension = new Map([
  ['.eot', 'embedded-opentype'],
  ['.otc', 'collection'],
  ['.svg', 'svg'],
  ['.ttc', 'collection'],
  ['.woff', 'woff'],
  ['.woff2', 'woff2'],
])
const supportedFontExtensions = new Set([
  ...splitFontExtensions,
  ...staticFontFormatByExtension.keys(),
])
const fontFaceFamilyDeclarationRE = /font-family[\t\n\r ]*:[^;]*(?=;)/
const fontFaceLocalSourceRE = /src\s*:\s*local\((?:"[^"]+"|'[^']+'|[^)]+)\),\s*/g
const fontFaceBlockRE = /@font-face\s*\{[^}]*\}/g

export function hasThemeFonts(options?: ResolvedValaxyOptions<ThemeConfig>) {
  return resolveThemeFonts(options).hasFonts
}

export function themeFontPlugins(options?: ResolvedValaxyOptions<ThemeConfig>) {
  const themeFonts = resolveThemeFonts(options)

  return [
    ...(themeFonts.entries.some((entry) => isSplitFontPath(entry.path))
      ? [createViteFontPlugin()]
      : []),
    createThemeFontPlugin(themeFonts.entries, themeFonts.cssImports, options?.userRoot),
  ]
}

export function themeFontPlugin(options?: ResolvedValaxyOptions<ThemeConfig>): Plugin {
  const themeFonts = resolveThemeFonts(options)

  return createThemeFontPlugin(
    themeFonts.entries,
    themeFonts.cssImports,
    options?.userRoot,
  )
}

function createThemeFontPlugin(
  fontEntries: ThemeFontEntry[],
  fontCssImports: string[],
  userRoot = process.cwd(),
): Plugin {
  const splitFontEntries = fontEntries.filter((entry) => isSplitFontPath(entry.path))
  const staticFontEntries = fontEntries.filter((entry) => !isSplitFontPath(entry.path))
  const fontFamilyByCacheDir = resolveFontFamilyByCacheDir(fontEntries)
  const staticFontAssetByDevPath = resolveStaticFontAssetByDevPath(staticFontEntries)
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
      fontCacheDir = join(userRoot, 'node_modules/.valaxy/cache')
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

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          hasFonts &&
          serveDevFont(
            req.url,
            res,
            fontCacheDir,
            fontFamilyByCacheDir,
            staticFontEntries,
            staticFontAssetByDevPath,
            fontCssImports,
          )
        ) {
          return
        }

        next()
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

    transform(code, id) {
      if (!hasFonts || !id.includes('.css')) {
        return
      }

      const normalized = normalizeFontCss(
        code,
        getFontFamilyForCssId(id, fontFamilyByCacheDir),
      )
      if (normalized !== code) {
        return { code: normalized, map: null }
      }
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
        if (!hasFonts || config.command !== 'build') return

        return {
          html: stripFontPreloadLinks(html),
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

function serveDevFont(
  url: string | undefined,
  res: ServerResponse,
  fontCacheDir: string,
  fontFamilyByCacheDir: Map<string, string>,
  staticFontEntries: ThemeFontEntry[],
  staticFontAssetByDevPath: Map<string, string>,
  fontCssImports: string[],
) {
  const pathname = url?.split('?')[0]
  if (!pathname) {
    return false
  }

  const font = getDevFont(
    pathname,
    fontCacheDir,
    fontFamilyByCacheDir,
    staticFontEntries,
    staticFontAssetByDevPath,
    fontCssImports,
  )
  if (font === undefined) {
    return false
  }

  if (typeof font === 'string') {
    setCssCorsHeaders(res)
  } else {
    setFontCorsHeaders(res, getFontContentType(font.filePath))
  }

  res.statusCode = 200
  res.end(typeof font === 'string' ? font : font.body)
  return true
}

function getDevFont(
  pathname: string,
  fontCacheDir: string,
  fontFamilyByCacheDir: Map<string, string>,
  staticFontEntries: ThemeFontEntry[],
  staticFontAssetByDevPath: Map<string, string>,
  fontCssImports: string[],
) {
  if (pathname === publicFontCssPath) {
    return buildDevFontCss(
      fontCacheDir,
      fontFamilyByCacheDir,
      staticFontEntries,
      fontCssImports,
    )
  }

  if (pathname.startsWith(publicFontAssetPathPrefix)) {
    return readDevFontAsset(pathname, fontCacheDir, staticFontAssetByDevPath)
  }
}

function buildDevFontCss(
  fontCacheDir: string,
  fontFamilyByCacheDir: Map<string, string>,
  staticFontEntries: ThemeFontEntry[],
  fontCssImports: string[],
) {
  const staticFontCss = buildStaticFontCss(
    staticFontEntries,
    (fontPath) => `${publicFontAssetPathPrefix}${getStaticFontAssetFileName(fontPath)}`,
  )

  if (!existsSync(fontCacheDir)) {
    return `${[...fontCssImports, ...staticFontCss].join('\n')}\n`
  }

  const fontCss = readdirSync(fontCacheDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fontFamilyByCacheDir.has(entry.name))
    .flatMap((entry) => {
      const resultCssPath = join(fontCacheDir, entry.name, 'result.css')
      if (!existsSync(resultCssPath)) {
        return []
      }

      return rewriteDevFontUrls(
        normalizeFontCss(
          readFileSync(resultCssPath, 'utf8'),
          fontFamilyByCacheDir.get(entry.name),
        ),
        entry.name,
      )
    })

  return `${[...fontCssImports, ...staticFontCss, ...new Set(fontCss)].join('\n')}\n`
}

function rewriteDevFontUrls(css: string, cacheDirName: string) {
  return extractFontCss(css).map((rule) =>
    rule.replaceAll(
      /url\(["']?\.\/([^"')]+)["']?\)/g,
      `url('${publicFontAssetPathPrefix}${cacheDirName}/$1')`,
    ),
  )
}

function readDevFontAsset(
  pathname: string,
  fontCacheDir: string,
  staticFontAssetByDevPath: Map<string, string>,
): DevFontAsset | undefined {
  const relativePath = decodeURIComponent(
    pathname.slice(publicFontAssetPathPrefix.length),
  )
  if (isAbsolute(relativePath) || relativePath.includes('..')) {
    return
  }

  const staticFontPath = staticFontAssetByDevPath.get(relativePath)
  if (staticFontPath && existsSync(staticFontPath)) {
    return {
      body: readFileSync(staticFontPath),
      filePath: staticFontPath,
    }
  }

  const filePath = join(fontCacheDir, relativePath)
  const relativeToCache = relative(fontCacheDir, filePath)
  if (
    relativeToCache.startsWith('..') ||
    isAbsolute(relativeToCache) ||
    extname(filePath) !== '.woff2' ||
    !existsSync(filePath)
  ) {
    return
  }

  return {
    body: readFileSync(filePath),
    filePath,
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

function resolveFontFamilyByCacheDir(fontEntries: ThemeFontEntry[]) {
  return new Map(
    fontEntries.map((entry) => [getFontCacheDirName(entry.path), entry.family]),
  )
}

function getFontCacheDirName(fontPath: string) {
  return basename(fontPath).replaceAll('.', '_')
}

function buildFontVirtualModule(fontEntries: ThemeFontEntry[]) {
  return fontEntries.map((entry) => `import ${JSON.stringify(entry.path)}`).join('\n')
}

function getFontFamilyForCssId(id: string, fontFamilyByCacheDir: Map<string, string>) {
  const cleanId = normalizePath(id).split('?')[0]
  const match = cleanId.match(/(?:^|\/)\.valaxy\/cache\/([^/]+)\/result\.css$/)
  if (!match) return

  return fontFamilyByCacheDir.get(match[1])
}

function normalizeFontCss(css: string, family?: string) {
  return family ? normalizeFontFaceFamily(css, family) : css
}

function normalizeGeneratedFontFamilies(
  css: string,
  configuredFamilyByGeneratedFamily: Map<string, string>,
) {
  if (!configuredFamilyByGeneratedFamily.size) return css

  return css.replace(fontFaceBlockRE, (block) => {
    const generatedFamily = getFontFaceFamily(block)
    if (!generatedFamily) return block

    return normalizeFontFaceBlock(
      block,
      configuredFamilyByGeneratedFamily.get(generatedFamily),
    )
  })
}

function normalizeFontFaceFamily(css: string, family: string) {
  return css.replace(fontFaceBlockRE, (block) => normalizeFontFaceBlock(block, family))
}

function normalizeFontFaceBlock(block: string, family?: string) {
  if (!family || !/src\s*:[^;}]*url\(/.test(block)) {
    return block
  }

  return block
    .replace(fontFaceFamilyDeclarationRE, `font-family:${JSON.stringify(family)}`)
    .replace(fontFaceLocalSourceRE, 'src:')
}

function resolveConfiguredFamilyByGeneratedFamily(
  fontCacheDir: string,
  fontFamilyByCacheDir: Map<string, string>,
) {
  const configuredFamilyByGeneratedFamily = new Map<string, string>()

  if (!existsSync(fontCacheDir)) {
    return configuredFamilyByGeneratedFamily
  }

  fontFamilyByCacheDir.forEach((family, cacheDirName) => {
    const resultCssPath = join(fontCacheDir, cacheDirName, 'result.css')
    if (!existsSync(resultCssPath)) return

    extractFontFaceFamilies(readFileSync(resultCssPath, 'utf8')).forEach(
      (generatedFamily) => {
        configuredFamilyByGeneratedFamily.set(generatedFamily, family)
      },
    )
  })

  return configuredFamilyByGeneratedFamily
}

function extractFontFaceFamilies(css: string) {
  return [
    ...new Set(
      [...css.matchAll(fontFaceBlockRE)]
        .map(([block]) => getFontFaceFamily(block))
        .filter((family): family is string => Boolean(family)),
    ),
  ]
}

function getFontFaceFamily(block: string) {
  const declaration = block.match(fontFaceFamilyDeclarationRE)?.[0]
  const separatorIndex = declaration?.indexOf(':') ?? -1
  if (!declaration || separatorIndex === -1) return

  const family = declaration.slice(separatorIndex + 1).trim()
  if (!family) return

  return family.replace(/^["']|["']$/g, '')
}

function extractFontCss(css: string) {
  return [...css.matchAll(fontFaceBlockRE).map(([rule]) => rule)]
}

function stripFontCss(css: string) {
  return css.replace(fontFaceBlockRE, '').trimStart()
}

function isSplitFontPath(fontPath: string) {
  return splitFontExtensions.has(extname(fontPath).toLowerCase())
}

function isSupportedFontPath(fontPath: string) {
  return supportedFontExtensions.has(extname(fontPath).toLowerCase())
}

function resolveStaticFontAssetByDevPath(fontEntries: ThemeFontEntry[]) {
  return new Map(
    fontEntries.map((entry) => [getStaticFontAssetFileName(entry.path), entry.path]),
  )
}

function buildStaticFontCss(
  fontEntries: ThemeFontEntry[],
  resolveUrl: (fontPath: string) => string | undefined,
) {
  return fontEntries.flatMap((entry) => {
    const url = resolveUrl(entry.path)
    if (!url) return []

    return [buildStaticFontFaceCss(entry, url)]
  })
}

function buildStaticFontFaceCss(entry: ThemeFontEntry, url: string) {
  const format = getStaticFontFormat(entry.path)
  const descriptors = inferStaticFontDescriptors(entry.path)

  return [
    '@font-face{',
    `font-family:${JSON.stringify(entry.family)};`,
    `src:url(${JSON.stringify(url)})${format ? ` format("${format}")` : ''};`,
    'font-display:swap;',
    `font-style:${descriptors.style};`,
    `font-weight:${descriptors.weight};`,
    '}',
  ].join('')
}

function getStaticFontFormat(fontPath: string) {
  return staticFontFormatByExtension.get(extname(fontPath).toLowerCase())
}

function inferStaticFontDescriptors(fontPath: string) {
  const fileName = basename(fontPath).toLowerCase()

  return {
    style: /(?:^|[-_\s.])(?:italic|oblique)(?:[-_\s.]|$)/.test(fileName)
      ? 'italic'
      : 'normal',
    weight: inferStaticFontWeight(fileName),
  }
}

function inferStaticFontWeight(fileName: string) {
  const weightByName: Array<[RegExp, number]> = [
    [/(?:extra|ultra)[-_\s.]*light/, 200],
    [/(?:semi|demi)[-_\s.]*bold/, 600],
    [/(?:extra|ultra)[-_\s.]*bold/, 800],
    [/(?:black|heavy)/, 900],
    [/\bbold\b/, 700],
    [/\bmedium\b/, 500],
    [/\b(?:regular|normal|book)\b/, 400],
    [/\blight\b/, 300],
    [/\bthin\b/, 100],
  ]

  return weightByName.find(([pattern]) => pattern.test(fileName))?.[1] ?? 400
}

function getStaticFontAssetFileName(fontPath: string) {
  const extension = extname(fontPath).toLowerCase()
  const baseName = basename(fontPath, extname(fontPath))
    .replaceAll(/[^\w-]+/g, '-')
    .replaceAll(/^-|-$/g, '')
  const hash = createHash('sha256').update(fontPath).digest('hex').slice(0, 8)

  return `${baseName || 'font'}.${hash}${extension}`
}

function getStaticFontOutputFileName(fontPath: string, assetsDir: string) {
  return `${assetsDir}/lgc-fonts/${getStaticFontAssetFileName(fontPath)}`
}

function getEmittedFontCssUrl(fileName: string) {
  const cssDir = emittedFontCssFileName.split('/').slice(0, -1).join('/')
  const relativePath = normalizePath(relative(cssDir, fileName))

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

function createViteFontPlugin() {
  const fontPlugin = require('vite-plugin-font') as typeof Font

  return fontPlugin.vite()
}
