import type { ResolvedValaxyOptions } from 'valaxy'

import type { ThemeConfig } from '../types'

const baseIconSafelist = [
  'i-material-symbols-home-rounded',
  'i-material-symbols-home-outline-rounded',
  'i-material-symbols-menu-rounded',
  'i-material-symbols-close-rounded',
  'i-material-symbols-translate-rounded',
  'i-material-symbols-light-mode-outline-rounded',
  'i-material-symbols-dark-mode-outline-rounded',
  'i-material-symbols-search-rounded',
  'i-material-symbols-contract-edit-rounded',
  'i-ic-round-push-pin',
  'i-material-symbols-visibility-off-rounded',
  'i-material-symbols-visibility-rounded',
  'i-material-symbols-keyboard-arrow-down-rounded',
  'i-material-symbols-keyboard-arrow-up-rounded',
  'i-material-symbols-keyboard-arrow-left-rounded',
  'i-material-symbols-keyboard-arrow-right-rounded',
  'i-material-symbols-arrow-back-ios-new-rounded',
  'i-material-symbols-arrow-back-rounded',
  'i-material-symbols-arrow-forward-ios-rounded',
  'i-material-symbols-arrow-forward-rounded',
  'i-material-symbols-person-outline-rounded',
  'i-material-symbols-favorite-outline-rounded',
  'i-material-symbols-rss-feed-rounded',
  'i-material-symbols-mail-outline-rounded',
  'i-material-symbols-article-outline-rounded',
  'i-material-symbols-history-rounded',
  'i-material-symbols-calendar-month-outline-rounded',
  'i-material-symbols-edit-calendar-outline-rounded',
  'i-material-symbols-folder-outline-rounded',
  'i-material-symbols-timer-outline-rounded',
  'i-material-symbols-category-outline-rounded',
  'i-material-symbols-tag-rounded',
  'i-material-symbols-dashboard-outline-rounded',
  'i-material-symbols-imagesmode-outline-rounded',
  'i-material-symbols-refresh-rounded',
  'i-material-symbols-link-rounded',
  'i-material-symbols-keyboard-return-rounded',
  'i-material-symbols-travel-explore-rounded',
]

/**
 * generateSafelist by config
 * @param options
 */
export function generateSafelist(options: ResolvedValaxyOptions<ThemeConfig>) {
  return [...baseIconSafelist, ...collectConfiguredIcons(options)]
}

function collectConfiguredIcons(options: ResolvedValaxyOptions<ThemeConfig>) {
  const themeConfig = options?.config.themeConfig || {}
  const siteConfig = options?.config.siteConfig
  const safelist: string[] = []

  const footerIcon = themeConfig.footer?.icon?.name
  if (footerIcon) safelist.push(footerIcon)

  themeConfig.landing?.links?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  themeConfig.header?.nav?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
    if (item.activeIcon) safelist.push(item.activeIcon)
  })

  siteConfig?.social?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  return safelist
}
