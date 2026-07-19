import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const fontPreloadLinkRE = /<link\b[^>]*>\s*/g
const fontPreloadRelRE = /\brel=["']preload["']/
const fontPreloadAsRE = /\bas=["']font["']/

export function stripFontPreloadLinks(html: string) {
  return html.replace(fontPreloadLinkRE, (tag) =>
    fontPreloadRelRE.test(tag) && fontPreloadAsRE.test(tag) ? '' : tag,
  )
}

export function stripOutputFontPreloadLinks(dir: string) {
  if (!existsSync(dir)) return

  readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const entryPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      stripOutputFontPreloadLinks(entryPath)
      return
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) return

    const html = readFileSync(entryPath, 'utf8')
    const stripped = stripFontPreloadLinks(html)
    if (stripped !== html) {
      writeFileSync(entryPath, stripped, 'utf8')
    }
  })
}
