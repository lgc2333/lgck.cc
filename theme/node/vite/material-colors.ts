import type { ResolvedValaxyOptions } from 'valaxy'
import type { Plugin } from 'vite'

import type { ThemeConfig } from '../../types'
import { generateMaterialColorsCss } from '../material-colors'

const materialColorsVirtualId = 'virtual:lgc-material-colors.css'
const resolvedMaterialColorsVirtualId = `\0${materialColorsVirtualId}`

export function materialColorsPlugin(
  options?: ResolvedValaxyOptions<ThemeConfig>,
): Plugin {
  return {
    name: 'valaxy-theme-lgcuwukii:material-colors',

    resolveId(id) {
      if (id === materialColorsVirtualId) return resolvedMaterialColorsVirtualId
    },

    load(id) {
      if (id !== resolvedMaterialColorsVirtualId) return

      return generateMaterialColorsCss(options?.config.themeConfig?.colors)
    },
  }
}
