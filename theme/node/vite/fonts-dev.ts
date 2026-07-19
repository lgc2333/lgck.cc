import type { Buffer } from 'node:buffer'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import type { ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative } from 'node:path'

import type { Plugin } from 'vite'

import type { ResolvedThemeFonts, ThemeFontEntry } from './utils'
import {
  buildStaticFontCss,
  extractFontCss,
  getFontContentType,
  getFontFamilyForCssId,
  getStaticFontAssetFileName,
  isSplitFontPath,
  normalizeFontCss,
  publicFontAssetPathPrefix,
  publicFontCssPath,
  resolveFontFamilyByCacheDir,
  setCssCorsHeaders,
  setFontCorsHeaders,
} from './utils'

interface DevFontAsset {
  body: Buffer
  filePath: string
}

export function themeFontDevPlugin(themeFonts: ResolvedThemeFonts): Plugin {
  const staticFontEntries = themeFonts.entries.filter(
    (entry) => !isSplitFontPath(entry.path),
  )
  const fontFamilyByCacheDir = resolveFontFamilyByCacheDir(themeFonts.entries)
  const staticFontAssetByDevPath = resolveStaticFontAssetByDevPath(staticFontEntries)
  let fontCacheDir = ''

  return {
    name: 'valaxy-theme-lgcuwukii:fonts-dev',
    enforce: 'pre',

    configResolved(config) {
      fontCacheDir = config.cacheDir
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          themeFonts.hasFonts &&
          serveDevFont(
            req.url,
            res,
            fontCacheDir,
            fontFamilyByCacheDir,
            staticFontEntries,
            staticFontAssetByDevPath,
            themeFonts.cssImports,
          )
        ) {
          return
        }

        next()
      })
    },

    transform(code, id) {
      if (!themeFonts.hasFonts || !id.includes('.css')) return

      const normalized = normalizeFontCss(
        code,
        getFontFamilyForCssId(id, fontFamilyByCacheDir),
      )
      if (normalized !== code) {
        return { code: normalized, map: null }
      }
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
        extractFontCss(
          normalizeFontCss(
            readFileSync(resultCssPath, 'utf8'),
            fontFamilyByCacheDir.get(entry.name),
          ),
        ),
        entry.name,
      )
    })

  return `${[...fontCssImports, ...staticFontCss, ...new Set(fontCss)].join('\n')}\n`
}

function rewriteDevFontUrls(cssRules: string[], cacheDirName: string) {
  return cssRules.map((rule) =>
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

function resolveStaticFontAssetByDevPath(fontEntries: ThemeFontEntry[]) {
  return new Map(
    fontEntries.map((entry) => [getStaticFontAssetFileName(entry.path), entry.path]),
  )
}
