import { Buffer } from 'node:buffer'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import type { ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative } from 'node:path'

import type { Plugin } from 'vite'

export const publicGiscusFontThemePath = '/assets/giscus-fonts.css'

const publicGiscusFontAssetPathPrefix = '/assets/giscus-fonts/'
const tokenCssPath = new URL('../../styles/base.scss', import.meta.url)
const fontFaceBlockRE = /@font-face\s*\{[^}]*\}/g
const fontImportRE =
  /@import\s+url\(["']?https:\/\/fonts\.googleapis\.com\/[^"')]+["']?\);/g
const harmonyOSUnifiedFamily = 'HarmonyOS Sans LgCuwukii'
const harmonyOSFontFaceFamilyRE =
  /font-family\s*:\s*(?:"HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?"|'HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?'|HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?)(?=\s*;)/g
const harmonyOSLocalSourceRE =
  /src\s*:\s*local\(["']?HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?["']?\),\s*/g

export function giscusFontPlugin(): Plugin {
  let fontCacheDir = ''

  return {
    name: 'valaxy-theme-lgcuwukii:giscus-font',

    configResolved(config) {
      fontCacheDir = join(config.root, 'node_modules/.valaxy/cache')
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (serveDevGiscusFont(req.url, res, fontCacheDir)) {
          return
        }

        next()
      })
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0]

        if (pathname === publicGiscusFontThemePath) {
          setCssCorsHeaders(res)
        } else if (pathname?.startsWith(publicGiscusFontAssetPathPrefix)) {
          setFontCorsHeaders(res)
        }

        next()
      })
    },
  }
}

function serveDevGiscusFont(
  url: string | undefined,
  res: ServerResponse,
  fontCacheDir: string,
) {
  const pathname = url?.split('?')[0]
  if (!pathname) {
    return false
  }

  const css = getDevGiscusFont(pathname, fontCacheDir)
  if (css === undefined) {
    return false
  }

  if (Buffer.isBuffer(css)) {
    setFontCorsHeaders(res)
  } else {
    setCssCorsHeaders(res)
  }

  res.statusCode = 200
  res.end(css)
  return true
}

function getDevGiscusFont(pathname: string, fontCacheDir: string) {
  if (pathname === publicGiscusFontThemePath) {
    return buildDevGiscusFontCss(fontCacheDir)
  }

  if (pathname.startsWith(publicGiscusFontAssetPathPrefix)) {
    return readDevGiscusFontAsset(pathname, fontCacheDir)
  }
}

function buildDevGiscusFontCss(fontCacheDir: string) {
  if (!existsSync(fontCacheDir)) {
    return `${extractFontImportCss(readFileSync(tokenCssPath, 'utf8')).join('\n')}\n`
  }

  const fontCss = readdirSync(fontCacheDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const resultCssPath = join(fontCacheDir, entry.name, 'result.css')
      if (!existsSync(resultCssPath)) {
        return []
      }

      return rewriteDevFontUrls(
        normalizeHarmonyOSFontFaceFamilies(readFileSync(resultCssPath, 'utf8')),
        entry.name,
      )
    })

  return `${[
    ...extractFontImportCss(readFileSync(tokenCssPath, 'utf8')),
    ...new Set(fontCss),
  ].join('\n')}\n`
}

function rewriteDevFontUrls(css: string, cacheDirName: string) {
  return extractFontCss(css).map((rule) =>
    rule.replaceAll(
      /url\(["']?\.\/([^"')]+)["']?\)/g,
      `url('${publicGiscusFontAssetPathPrefix}${cacheDirName}/$1')`,
    ),
  )
}

function readDevGiscusFontAsset(pathname: string, fontCacheDir: string) {
  const relativePath = decodeURIComponent(
    pathname.slice(publicGiscusFontAssetPathPrefix.length),
  )
  if (isAbsolute(relativePath) || relativePath.includes('..')) {
    return
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

  return readFileSync(filePath)
}

function setCssCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/css; charset=utf-8')
}

function setFontCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'font/woff2')
}

function extractFontImportCss(css: string) {
  return [...css.matchAll(fontImportRE)].map(([rule]) => rule)
}

function extractFontCss(css: string) {
  return [
    ...extractFontImportCss(css),
    ...css.matchAll(fontFaceBlockRE).map(([rule]) => rule),
  ]
}

function normalizeHarmonyOSFontFaceFamilies(css: string) {
  return css.replace(fontFaceBlockRE, (block) => {
    if (!/font-family\s*:\s*["']?HarmonyOS Sans/.test(block)) {
      return block
    }

    return block
      .replace(harmonyOSFontFaceFamilyRE, `font-family:"${harmonyOSUnifiedFamily}"`)
      .replace(harmonyOSLocalSourceRE, 'src:')
  })
}
