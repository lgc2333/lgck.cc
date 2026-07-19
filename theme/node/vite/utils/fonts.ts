import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'

import { normalizePath } from 'vite'

export interface ThemeFontEntry {
  family: string
  path: string
}

export interface ResolvedThemeFonts {
  cssImports: string[]
  entries: ThemeFontEntry[]
  hasFonts: boolean
}

export const publicFontCssPath = '/assets/lgc-fonts.css'
export const publicFontAssetPathPrefix = '/assets/lgc-fonts/'
export const emittedFontCssFileName = 'assets/lgc-fonts.css'

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

export function resolveFontFamilyByCacheDir(fontEntries: ThemeFontEntry[]) {
  return new Map(
    fontEntries.map((entry) => [getFontCacheDirName(entry.path), entry.family]),
  )
}

export function getFontCacheDirName(fontPath: string) {
  return basename(fontPath).replaceAll('.', '_')
}

export function buildFontVirtualModule(fontEntries: ThemeFontEntry[]) {
  return fontEntries.map((entry) => `import ${JSON.stringify(entry.path)}`).join('\n')
}

export function getFontFamilyForCssId(
  id: string,
  fontFamilyByCacheDir: Map<string, string>,
) {
  const cleanId = normalizePath(id).split('?')[0]
  const match = cleanId.match(/(?:^|\/)([^/]+)\/result\.css$/)
  if (!match) return

  return fontFamilyByCacheDir.get(match[1])
}

export function normalizeFontCss(css: string, family?: string) {
  return family ? normalizeFontFaceFamily(css, family) : css
}

export function normalizeGeneratedFontFamilies(
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

export function resolveConfiguredFamilyByGeneratedFamily(
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

export function extractFontCss(css: string) {
  return [...css.matchAll(fontFaceBlockRE).map(([rule]) => rule)]
}

export function stripFontCss(css: string) {
  return css.replace(fontFaceBlockRE, '').trimStart()
}

export function isSplitFontPath(fontPath: string) {
  return splitFontExtensions.has(extname(fontPath).toLowerCase())
}

export function isSupportedFontPath(fontPath: string) {
  return supportedFontExtensions.has(extname(fontPath).toLowerCase())
}

export function buildStaticFontCss(
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

export function getStaticFontAssetFileName(fontPath: string) {
  const extension = extname(fontPath).toLowerCase()
  const baseName = basename(fontPath, extname(fontPath))
    .replaceAll(/[^\w-]+/g, '-')
    .replaceAll(/^-|-$/g, '')
  const hash = createHash('sha256').update(fontPath).digest('hex').slice(0, 8)

  return `${baseName || 'font'}.${hash}${extension}`
}

export function getStaticFontOutputFileName(fontPath: string, assetsDir: string) {
  return `${assetsDir}/lgc-fonts/${getStaticFontAssetFileName(fontPath)}`
}

export function getEmittedFontCssUrl(fileName: string) {
  const cssDir = emittedFontCssFileName.split('/').slice(0, -1).join('/')
  const relativePath = normalizePath(relative(cssDir, fileName))

  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}
