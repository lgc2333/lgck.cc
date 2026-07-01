import { defineValaxyConfig } from 'valaxy'
import { addonComponents } from 'valaxy-addon-components'
import type { ThemeConfig } from 'valaxy-theme-lgcwuwkii'

const safelist = [
  'i-ri-rss-line',
  'i-ri-earth-line',
  'i-ri-github-line',
  'i-ri-link',
  'i-ri-heart-2-line',
  'i-ri-folder-2-line',
  'i-ri-information-line',
  'i-ri-user-line',
  'i-ri-price-tag-3-line',
]

export default defineValaxyConfig<ThemeConfig>({
  theme: 'lgcwuwkii',
  themeConfig: {
    // banner: {
    //   enable: true,
    //   title: '饼干的 Blog',
    //   cloud: {
    //     enable: true,
    //   },
    // },
    // say: { enable: false },
    // fireworks: { enable: false },
    // pages: [
    //   {
    //     name: '友链',
    //     url: '/links',
    //     icon: 'i-ri-link',
    //     color: 'var(--va-c-text)',
    //   },
    //   {
    //     name: '赞助',
    //     url: '/sponsor',
    //     icon: 'i-ri-heart-2-line',
    //     color: 'var(--va-c-text)',
    //   },
    // ],
    // notice: {
    //   enable: false,
    //   content: '',
    // },
    footer: {
      since: 2024,
      // icon: { enable: false },
    },
  },
  addons: [addonComponents()],
  unocss: { safelist },
})
