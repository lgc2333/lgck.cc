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

  colors: {
    primary: '#2e6f9f',
  },

  landing: {
    enable: true,
    showPosts: true,
    compact: false,
    avatar: '',
    eyebrow: 'soft blue / cookie / ribbon',
    title: '',
    subtitle: '',
    links: [
      {
        text: '博客文章',
        link: '/posts',
        icon: 'i-material-symbols-article-outline-rounded',
        variant: 'primary',
      },
      {
        text: '项目列表',
        link: '/projects',
        icon: 'i-material-symbols-dashboard-outline-rounded',
        variant: 'tonal',
      },
      {
        text: '相册',
        link: '/albums',
        icon: 'i-material-symbols-imagesmode-outline-rounded',
        variant: 'default',
      },
      {
        text: '友情链接',
        link: '/links',
        icon: 'i-material-symbols-link-rounded',
        variant: 'cookie',
      },
      {
        text: '赞助者们',
        link: '/sponsor',
        icon: 'i-material-symbols-favorite-outline-rounded',
        variant: 'ribbon',
      },
      {
        text: '关于',
        link: '/about',
        icon: 'i-material-symbols-person-outline-rounded',
        variant: 'default',
      },
    ],
    socials: [
      {
        text: 'GitHub',
        link: 'https://github.com',
        icon: 'i-simple-icons-github',
      },
      {
        text: 'RSS',
        link: '/atom.xml',
        icon: 'i-material-symbols-rss-feed-rounded',
      },
      {
        text: 'Email',
        link: 'mailto:',
        icon: 'i-material-symbols-mail-outline-rounded',
      },
    ],
  },

  footer: {
    since: 2022,
    icon: {
      name: 'i-ri-cloud-line',
      animated: true,
      color: 'var(--va-c-primary)',
      url: 'https://sponsors.yunyoujun.cn',
      title: 'Sponsor YunYouJun',
    },

    powered: true,

    beian: {
      enable: false,
      icp: '',
    },
  },

  nav: [],
}

// write a vite plugin
// https://vitejs.dev/guide/api-plugin.html
export function themePlugin(options: ResolvedValaxyOptions<ThemeConfig>): Plugin {
  const themeConfig = options.config.themeConfig || {}

  return {
    name: 'valaxy-theme-lgcuwukii',

    config() {
      return {
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: `$c-primary: ${themeConfig.colors?.primary || '#0078E7'} !default;`,
            },
          },
        },

        valaxy: {},
      }
    },
  }
}

/**
 * generateSafelist by config
 * @param options
 */
export function generateSafelist(options: ResolvedValaxyOptions<ThemeConfig>) {
  const themeConfig = options?.config.themeConfig || {}
  const safelist: string[] = [
    'i-material-symbols-home-rounded',
    'i-material-symbols-article-outline-rounded',
    'i-material-symbols-dashboard-outline-rounded',
    'i-material-symbols-imagesmode-outline-rounded',
    'i-material-symbols-link-rounded',
    'i-material-symbols-translate-rounded',
    'i-material-symbols-light-mode-outline-rounded',
    'i-material-symbols-dark-mode-outline-rounded',
    'i-material-symbols-search-rounded',
    'i-material-symbols-keyboard-arrow-down-rounded',
    'i-material-symbols-arrow-forward-rounded',
    'i-material-symbols-person-outline-rounded',
    'i-material-symbols-favorite-outline-rounded',
    'i-material-symbols-rss-feed-rounded',
    'i-material-symbols-mail-outline-rounded',
    'i-simple-icons-github',
  ]

  const footerIcon = themeConfig.footer?.icon?.name
  if (footerIcon) safelist.push(footerIcon)

  themeConfig.nav?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  themeConfig.landing?.links?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  themeConfig.landing?.socials?.forEach((item) => {
    if (item.icon) safelist.push(item.icon)
  })

  return safelist
}
