import { $t, defineConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-lgcuwukii'

/**
 * User Config
 * do not use export const config to avoid defu conflict
 */
export default defineConfig<ThemeConfig>({
  theme: 'lgcuwukii',

  // Site-owned non-Material icons (theme only ships material-symbols + ic).
  unocssPresets: {
    icons: {
      collections: {
        ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
      } as any,
    },
  },

  themeConfig: {
    fixedBg: {
      switchMode: 'random',
      image: [
        {
          url: 'https://i.pixiv.cat/img-original/img/2025/11/28/19/59/55/137990343_p0.jpg',
          title: '水着逍遥',
          description: 'by Pixiv @三一未亡',
          sourceUrl: 'https://www.pixiv.net/artworks/142076600',
        },
        {
          url: 'https://i.pixiv.cat/img-original/img/2025/03/31/00/48/06/126303242_p0.png',
          title: '【委托】月下荡秋千',
          description: 'by Pixiv @悠tacC',
          sourceUrl: 'https://www.pixiv.net/artworks/126303242',
        },
        {
          url: 'https://i.pixiv.cat/img-original/img/2025/12/10/20/00/04/138447585_p0.png',
          title: 'smol is good',
          description: 'by Pixiv @NicknameOkupied',
          sourceUrl: 'https://www.pixiv.net/artworks/138447585',
        },
        {
          url: 'https://i.pixiv.cat/img-original/img/2025/11/28/19/59/55/137990343_p0.jpg',
          title: '♥♡',
          description: 'by Pixiv @結月ちい',
          sourceUrl: 'https://www.pixiv.net/artworks/137990343',
        },
      ],
    },
    header: {
      nav: [
        {
          text: $t('nav.posts'),
          link: '/page',
          icon: 'i-material-symbols-article-outline-rounded',
          activeIcon: 'i-material-symbols-article-rounded',
        },
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
      links: {
        activePathRewrites: [{ from: '/posts', to: '/page' }],
        homeLabel: $t('nav.home'),
      },
    },
    landing: {
      mode: 'full-only',
      links: [
        {
          text: $t('landing.posts'),
          link: '/page/1',
          icon: 'i-material-symbols-article-outline-rounded',
          variant: 'primary',
        },
        {
          text: $t('landing.projects'),
          link: '/projects',
          icon: 'i-material-symbols-dashboard-outline-rounded',
          variant: 'tonal',
        },
        {
          text: $t('landing.albums'),
          link: '/albums',
          icon: 'i-material-symbols-imagesmode-outline-rounded',
          variant: 'default',
        },
        {
          text: $t('landing.links'),
          link: '/links',
          icon: 'i-material-symbols-link-rounded',
          variant: 'cookie',
        },
        {
          text: $t('landing.sponsors'),
          link: '/sponsor',
          icon: 'i-material-symbols-favorite-outline-rounded',
          variant: 'ribbon',
        },
        {
          text: $t('landing.about'),
          link: '/about',
          icon: 'i-material-symbols-person-outline-rounded',
          variant: 'default',
        },
      ],
    },

    footer: {
      since: 2016,
      icon: {
        enable: true,
        name: 'i-material-symbols-cookie-rounded',
        // color: 'var(--md-sys-color-primary)',
        url: 'https://lgck.cc',
        title: 'QwQ',
      },
      beian: {
        enable: true,
        icp: 'XXICP备1234567890号',
        police: 'XX公网安备12345671234567号',
      },
    },
  },
})
