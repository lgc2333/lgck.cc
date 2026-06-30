// vite-plugin-font derives several HarmonyOS family names from font metadata, and its
// generated local("HarmonyOS Sans") source can make Chromium pick the installed
// regular face before the bundled italic file. Normalize the generated faces into a
// private family and remove those ambiguous local sources so font-style/font-weight
// select the bundled face deterministically.

import type { Plugin } from 'vite'

const harmonyOSUnifiedFamily = 'HarmonyOS Sans LgCuwukii'
const harmonyOSFontFaceFamilyRE =
  /font-family\s*:\s*(?:"HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?"|'HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?'|HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?)(?=\s*;)/g
const harmonyOSLocalSourceRE =
  /src\s*:\s*local\(["']?HarmonyOS Sans(?: SC)?(?: (?:Thin|Light|Medium|Bold|Black))?["']?\),\s*/g
const fontFaceBlockRE = /@font-face\s*\{[^}]*\}/g

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

export function harmonyOSFontFamilyPlugin(): Plugin {
  return {
    name: 'valaxy-theme-lgcuwukii:harmonyos-font-family',
    enforce: 'post',

    transform(code, id) {
      if (!id.includes('HarmonyOS_Sans') || !id.includes('.css')) {
        return
      }

      const normalized = normalizeHarmonyOSFontFaceFamilies(code)
      if (normalized !== code) {
        return { code: normalized, map: null }
      }
    },

    generateBundle(_, bundle) {
      Object.values(bundle).forEach((chunk) => {
        if (
          chunk.type !== 'asset' ||
          !chunk.fileName.endsWith('.css') ||
          typeof chunk.source !== 'string'
        ) {
          return
        }

        chunk.source = normalizeHarmonyOSFontFaceFamilies(chunk.source)
      })
    },
  }
}
