import { defineValaxyConfig } from 'valaxy'
import { addonComponents } from 'valaxy-addon-components'
import type { ThemeConfig } from 'valaxy-theme-lgcuwukii'

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
  theme: 'lgcuwukii',
  themeConfig: {
    header: {
      i18n: false,
    },
    footer: {
      since: 2024,
    },
  },
  addons: [addonComponents()],
  unocss: { safelist },
  // Site-owned non-Material icons (theme only ships material-symbols + ic).
  unocssPresets: {
    icons: {
      collections: {
        ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
      } as any,
    },
  },
})
