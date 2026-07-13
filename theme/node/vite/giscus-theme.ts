import { readFileSync } from 'node:fs'
import type { ServerResponse } from 'node:http'

import type { ResolvedValaxyOptions } from 'valaxy'
import type { Plugin } from 'vite'

import type { ThemeConfig } from '../../types'
import { generateMaterialColorsCss } from '../material-colors'
import { publicGiscusFontThemePath } from './giscus-font'

const publicBaseThemePath = '/assets/giscus/base.css'
const publicLightThemePath = '/assets/giscus/light.css'
const publicDarkThemePath = '/assets/giscus/dark.css'
const emittedBaseThemeFileName = 'assets/giscus/base.css'
const emittedLightThemeFileName = 'assets/giscus/light.css'
const emittedDarkThemeFileName = 'assets/giscus/dark.css'
const baseThemeCssPath = new URL('../../styles/giscus/base.css', import.meta.url)
const tokenCssPath = new URL('../../styles/base.scss', import.meta.url)
const forwardedVarPrefixes = [
  '--lgc-',
  '--md-sys-',
  '--va-c-',
  '--va-font-',
  '--va-font-family-',
]

export function giscusThemePlugin(
  options?: ResolvedValaxyOptions<ThemeConfig>,
): Plugin {
  return {
    name: 'valaxy-theme-lgcuwukii:giscus-theme',
    enforce: 'post',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (serveDevGiscusTheme(req.url, res, options)) {
          return
        }

        next()
      })
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0]

        if (
          pathname === publicBaseThemePath ||
          pathname === publicLightThemePath ||
          pathname === publicDarkThemePath
        ) {
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

function serveDevGiscusTheme(
  url: string | undefined,
  res: ServerResponse,
  options?: ResolvedValaxyOptions<ThemeConfig>,
) {
  const pathname = url?.split('?')[0]
  if (!pathname) {
    return false
  }

  const css = getDevGiscusThemeCss(pathname, options)
  if (css === undefined) {
    return false
  }

  setCssCorsHeaders(res)
  res.statusCode = 200
  res.end(css)
  return true
}

function getDevGiscusThemeCss(
  pathname: string,
  options?: ResolvedValaxyOptions<ThemeConfig>,
) {
  const cssVars = getSourceCssVars(options)

  if (pathname === publicBaseThemePath) {
    return buildGiscusBaseCss(readFileSync(baseThemeCssPath, 'utf8'))
  }

  if (pathname === publicLightThemePath) {
    return buildGiscusThemeCss('light', cssVars.rootVars)
  }

  if (pathname === publicDarkThemePath) {
    return buildGiscusThemeCss('dark', cssVars.darkVars)
  }
}

function getSourceCssVars(options?: ResolvedValaxyOptions<ThemeConfig>) {
  const tokenCss = readFileSync(tokenCssPath, 'utf8')
  const sourceCss = [
    generateMaterialColorsCss(options?.config.themeConfig?.colors),
    tokenCss,
  ]
  const rootVars = collectCssVars(sourceCss, ':root')
  const darkVars = new Map(rootVars)

  collectCssVars(sourceCss, 'html.dark').forEach((value, name) => {
    darkVars.set(name, value)
  })

  return { darkVars, rootVars }
}

function setCssCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/css; charset=utf-8')
}

function buildGiscusBaseCss(baseThemeCss: string) {
  return baseThemeCss
}

function buildGiscusThemeCss(mode: 'light' | 'dark', cssVars: Map<string, string>) {
  return [
    `@import url('https://giscus.app/themes/${mode}.css');`,
    `@import url('${publicGiscusFontThemePath.replace('/assets/', '../')}');`,
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
