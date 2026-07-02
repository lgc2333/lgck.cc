import type { ResolvedValaxyOptions } from 'valaxy'
import type { Plugin } from 'vite'

import type { ThemeConfig } from '../types'

export { harmonyOSFontFamilyPlugin } from './font'

/**
 * Default Config
 */
export const defaultThemeConfig: ThemeConfig = {
  valaxyDarkOptions: {
    circleTransition: true,
  },
  landing: {
    enable: true,
    showPosts: true,
    compact: false,
    links: [],
  },
  header: {
    addHome: true,
    homeFixed: false,
    nav: [],
    links: {
      activeExpanded: true,
    },
  },
  footer: {
    powered: false,
  },
}

// write a vite plugin
// https://vitejs.dev/guide/api-plugin.html
export function themePlugin(): Plugin {
  return {
    name: 'valaxy-theme-lgcuwukii',
  }
}

/**
 * generateSafelist by config
 * @param options
 */
export function generateSafelist(options: ResolvedValaxyOptions<ThemeConfig>) {
  const themeConfig = options?.config.themeConfig || {}
  const siteConfig = options?.config.siteConfig
  const safelist: string[] = [
    'i-material-symbols-home-rounded',
    'i-material-symbols-menu-rounded',
    'i-material-symbols-close-rounded',
    'i-material-symbols-translate-rounded',
    'i-material-symbols-light-mode-outline-rounded',
    'i-material-symbols-dark-mode-outline-rounded',
    'i-material-symbols-search-rounded',
    'i-material-symbols-keyboard-arrow-down-rounded',
    'i-material-symbols-keyboard-arrow-up-rounded',
    'i-material-symbols-keyboard-arrow-left-rounded',
    'i-material-symbols-keyboard-arrow-right-rounded',
    'i-material-symbols-arrow-forward-rounded',
    'i-material-symbols-person-outline-rounded',
    'i-material-symbols-favorite-outline-rounded',
    'i-material-symbols-rss-feed-rounded',
    'i-material-symbols-mail-outline-rounded',
    'i-material-symbols-article-outline-rounded',
    'i-material-symbols-history-rounded',
    'i-material-symbols-category-outline-rounded',
    'i-material-symbols-tag-rounded',
    'i-material-symbols-dashboard-outline-rounded',
    'i-material-symbols-imagesmode-outline-rounded',
    'i-material-symbols-link-rounded',
    'i-material-symbols-keyboard-return-rounded',
    'i-material-symbols-travel-explore-rounded',
    'i-simple-icons-github',
  ]

  const footerIcon = themeConfig.footer?.icon?.name
  if (footerIcon) safelist.push(footerIcon)

  themeConfig.landing?.links?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  themeConfig.header?.nav?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  siteConfig?.social?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  return safelist
}
