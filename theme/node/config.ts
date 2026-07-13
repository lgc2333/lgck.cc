import type { ThemeConfig } from '../types'
import { defaultMaterialColorsConfig } from './material-colors'

/**
 * Default Config
 */
export const defaultThemeConfig: ThemeConfig = {
  valaxyDarkOptions: {
    circleTransition: true,
  },
  landing: {
    mode: 'full',
    compactHeight: 65,
    links: [],
  },
  postFeed: {
    coverContentMask: 'gradient',
    coverContentPosition: 'left',
  },
  postFooter: {
    sponsor: {},
  },
  colors: defaultMaterialColorsConfig,
  fixedBg: {
    switchMode: 'sequential',
  },
  header: {
    i18n: true,
    nav: [],
    links: {
      addHome: true,
      homeFixed: false,
      activeExpanded: true,
    },
  },
  footer: {
    powered: true,
  },
}
