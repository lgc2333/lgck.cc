import { $t, defineValaxyConfig } from 'valaxy'
import { addonComponents } from 'valaxy-addon-components'
import { addonGiscus } from 'valaxy-addon-giscus'
import type { ThemeConfig } from 'valaxy-theme-lgcuwukii'

const safelist: string[] = []

export default defineValaxyConfig<ThemeConfig>({
  theme: 'lgcuwukii',

  themeConfig: {
    header: {
      links: {
        activePathRewrites: [
          { from: '/posts', to: '/page' },
          { from: '/about', to: '/page' },
          { from: '/links', to: '/page' },
          { from: '/sponsor', to: '/page' },
        ],
        homeLabel: $t('nav.home'),
      },
      nav: [
        {
          text: $t('nav.posts'),
          link: '/page',
          icon: 'i-material-symbols-article-outline-rounded',
          activeIcon: 'i-material-symbols-article-rounded',
        },
        // {
        //   text: $t('nav.collections'),
        //   link: '/collections/',
        //   icon: 'i-material-symbols-auto-stories-rounded',
        //   activeIcon: 'i-material-symbols-auto-stories-rounded',
        // },
        {
          text: $t('nav.archives'),
          link: '/archives',
          icon: 'i-material-symbols-history-rounded',
        },
        {
          text: $t('nav.categories'),
          link: '/categories',
          icon: 'i-material-symbols-category-outline-rounded',
          activeIcon: 'i-material-symbols-category-rounded',
        },
        {
          text: $t('nav.tags'),
          link: '/tags',
          icon: 'i-material-symbols-tag-rounded',
        },
      ],
    },

    landing: {
      mode: 'full-only',
      links: [
        {
          text: $t('landing.posts'),
          link: '/page',
          icon: 'i-material-symbols-article-outline-rounded',
          variant: 'primary',
        },
        {
          text: $t('landing.about'),
          link: '/about',
          icon: 'i-material-symbols-person-outline-rounded',
          variant: 'secondary',
        },
        {
          text: $t('landing.links'),
          link: '/links',
          icon: 'i-tabler-link',
          variant: 'brown',
        },
        {
          text: $t('landing.sponsor'),
          link: '/sponsor',
          icon: 'i-material-symbols-favorite-outline-rounded',
          variant: 'pink',
        },
      ],
    },

    footer: { since: 2024 },

    postFooter: {
      sponsor: {
        link: '/sponsor',
      },
    },
  },

  addons: [
    addonComponents(),
    addonGiscus({
      repo: 'lgc2333/blog',
      repoId: 'R_kgDOLr1GDQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOLr1GDc4Cen96',
      mapping: 'pathname',
      strict: '1',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      loading: 'lazy',
    }),
  ],

  unocss: { safelist },
  unocssPresets: {
    // Site-owned icons (theme only ships material-symbols + ic).
    icons: {
      collections: {
        tabler: () => import('@iconify-json/tabler/icons.json').then((i) => i.default),
        mingcute: () =>
          import('@iconify-json/mingcute/icons.json').then((i) => i.default),
        'simple-icons': () =>
          import('@iconify-json/simple-icons/icons.json').then((i) => i.default),
      } as any,
    },
  },

  // vite: {
  //   preview: {
  //     allowedHosts: true,
  //   },
  //   server: {
  //     allowedHosts: true,
  //   },
  // },
})
