import { defineConfig } from 'valaxy'
import type { ThemeConfig } from 'valaxy-theme-lgcuwukii'

/**
 * User Config
 * do not use export const config to avoid defu conflict
 */
export default defineConfig<ThemeConfig>({
  theme: 'lgcuwukii',

  themeConfig: {
    header: {
      nav: [
        {
          text: 'Posts',
          link: '/page',
          icon: 'i-material-symbols-article-outline-rounded',
          activeIcon: 'i-material-symbols-article-rounded',
        },
        {
          text: 'Archives',
          link: '/archives',
          icon: 'i-material-symbols-history-rounded',
        },
        {
          text: 'Categories',
          link: '/categories',
          icon: 'i-material-symbols-category-outline-rounded',
          activeIcon: 'i-material-symbols-category-rounded',
        },
        {
          text: 'Tags',
          link: '/tags',
          icon: 'i-material-symbols-tag-rounded',
        },
      ],
      links: {
        activePathRewrites: [{ from: '/posts', to: '/page' }],
        homeLabel: 'Home',
      },
    },
    landing: {
      mode: 'full-only',
      links: [
        {
          text: '博客文章',
          link: '/page/1',
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
    },

    footer: {
      since: 2016,
    },
  },
})
