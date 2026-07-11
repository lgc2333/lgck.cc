import { Buffer } from 'node:buffer'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import type { ServerResponse } from 'node:http'
import { extname, isAbsolute, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

const publicBaseThemePath = '/assets/giscus/base.css'
const publicLightThemePath = '/assets/giscus/light.css'
const publicDarkThemePath = '/assets/giscus/dark.css'
const publicFontThemePath = '/assets/giscus-fonts.css'
const publicFontAssetPathPrefix = '/assets/giscus-fonts/'
const emittedBaseThemeFileName = 'assets/giscus/base.css'
const emittedLightThemeFileName = 'assets/giscus/light.css'
const emittedDarkThemeFileName = 'assets/giscus/dark.css'
const baseThemeCssPath = new URL('../styles/giscus/base.css', import.meta.url)
const fontCacheDir = fileURLToPath(
  new URL('../node_modules/.valaxy/cache/', import.meta.url),
)
const tokenCssPath = new URL('../../theme/styles/base.scss', import.meta.url)
const fontFaceBlockRE = /@font-face\s*\{[^}]*\}/g
const fontImportRE =
  /@import\s+url\(["']?https:\/\/fonts\.googleapis\.com\/[^"')]+["']?\);/g
const harmonyOSUnifiedFamily = 'HarmonyOS Sans LgCuwukii'
const harmonyOSFontFaceFamilyRE =
  /font-family\s*:\s*(?:"HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?"|'HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?'|HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?)(?=\s*;)/g
const harmonyOSLocalSourceRE =
  /src\s*:\s*local\(["']?HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?["']?\),\s*/g
const forwardedVarPrefixes = [
  '--lgc-',
  '--md-sys-',
  '--va-c-',
  '--va-font-',
  '--va-font-family-',
]

export function giscusThemePlugin(): Plugin {
  return {
    name: 'blog:giscus-theme',
    enforce: 'post',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (serveDevGiscusTheme(req.url, res)) {
          return
        }

        next()
      })
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/assets/giscus')) {
          setCssCorsHeaders(res)
        }

        next()
      })
    },

    generateBundle(_, bundle) {
      const cssAssets: string[] = []

      Object.values(bundle).forEach((chunk) => {
        if (
          chunk.type === 'asset' &&
          chunk.fileName.endsWith('.css') &&
          typeof chunk.source === 'string'
        ) {
          cssAssets.push(chunk.source)
        }
      })

      const rootVars = collectCssVars(cssAssets, ':root')
      const darkVars = new Map(rootVars)

      collectCssVars(cssAssets, 'html.dark').forEach((value, name) => {
        darkVars.set(name, value)
      })

      const baseThemeCss = readFileSync(baseThemeCssPath, 'utf8')

      this.emitFile({
        type: 'asset',
        fileName: emittedBaseThemeFileName,
        source: buildGiscusBaseCss(baseThemeCss),
      })

      this.emitFile({
        type: 'asset',
        fileName: emittedLightThemeFileName,
        source: buildGiscusThemeCss('light', rootVars),
      })

      this.emitFile({
        type: 'asset',
        fileName: emittedDarkThemeFileName,
        source: buildGiscusThemeCss('dark', darkVars),
      })
    },
  }
}

function serveDevGiscusTheme(url: string | undefined, res: ServerResponse) {
  const pathname = url?.split('?')[0]
  if (!pathname) {
    return false
  }

  const css = getDevGiscusThemeCss(pathname)
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

function getDevGiscusThemeCss(pathname: string) {
  const cssVars = getSourceCssVars()

  if (pathname === publicBaseThemePath) {
    return buildGiscusBaseCss(readFileSync(baseThemeCssPath, 'utf8'))
  }

  if (pathname === publicLightThemePath) {
    return buildGiscusThemeCss('light', cssVars.rootVars)
  }

  if (pathname === publicDarkThemePath) {
    return buildGiscusThemeCss('dark', cssVars.darkVars)
  }

  if (pathname === publicFontThemePath) {
    return buildDevGiscusFontCss()
  }

  if (pathname.startsWith(publicFontAssetPathPrefix)) {
    return readDevGiscusFontAsset(pathname)
  }
}

function getSourceCssVars() {
  const tokenCss = readFileSync(tokenCssPath, 'utf8')
  const rootVars = collectCssVars([tokenCss], ':root')
  const darkVars = new Map(rootVars)

  collectCssVars([tokenCss], 'html.dark').forEach((value, name) => {
    darkVars.set(name, value)
  })

  return { darkVars, rootVars }
}

function setCssCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/css; charset=utf-8')
}

function setFontCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'font/woff2')
}

function buildDevGiscusFontCss() {
  if (!existsSync(fontCacheDir)) {
    return extractFontImportCss(readFileSync(tokenCssPath, 'utf8'))
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
      `url('${publicFontAssetPathPrefix}${cacheDirName}/$1')`,
    ),
  )
}

function readDevGiscusFontAsset(pathname: string) {
  const relativePath = decodeURIComponent(
    pathname.slice(publicFontAssetPathPrefix.length),
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

function buildGiscusBaseCss(baseThemeCss: string) {
  return baseThemeCss
}

function buildGiscusThemeCss(mode: 'light' | 'dark', cssVars: Map<string, string>) {
  return [
    `@import url('https://giscus.app/themes/${mode}.css');`,
    `@import url('../giscus-fonts.css');`,
    `@import url('./base.css');`,
    `html {\n  ${serializeCssVars(cssVars)}\n}`,
  ].join('\n')
}

function collectCssVars(cssAssets: string[], selector: string) {
  const vars = new Map<string, string>()
  const selectorRE = new RegExp(`${escapeRegExp(selector)}\\s*\\{([^{}]*)\\}`, 'g')

  cssAssets.forEach((css) => {
    for (const [, declarations] of css.matchAll(selectorRE)) {
      for (const [, name, value] of declarations.matchAll(/(--[\w-]+):([^;]+);/g)) {
        if (shouldForwardCssVar(name)) {
          vars.set(name, value.trim().replace(/\s+/g, ' '))
        }
      }
    }
  })

  return vars
}

function serializeCssVars(cssVars: Map<string, string>) {
  return [...cssVars]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n  ')
}

function shouldForwardCssVar(name: string) {
  return forwardedVarPrefixes.some((prefix) => name.startsWith(prefix))
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
