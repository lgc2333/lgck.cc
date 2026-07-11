// For VSCode UnoCSS plugin, not actually used
import type { UserConfig } from 'unocss'
import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export const unoConfig: UserConfig = {
  presets: [presetWind4(), presetAttributify(), presetIcons({ scale: 1.2 })],
  theme: {
    // Sync with theme/valaxy.config.ts
    breakpoint: {
      sm: '600px', // medium
      md: '840px', // expanded
      lg: '1200px', // large
      xl: '1600px', // extra-large
    },
  },
}

export default defineConfig(unoConfig)
