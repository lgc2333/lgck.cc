import { $t, defineSiteConfig } from 'valaxy'

const TIME_DAY = 1000 * 60 * 60 * 24

export default defineSiteConfig({
  url: 'https://lgck.cc/',

  title: $t('site.title'),
  subtitle: $t('site.subtitle'),
  description: '',
  author: {
    name: 'LgCuwukii☆',
    link: '/about',
    avatar: '/assets/lgcuwukii-512x.png',
    status: {
      emoji: '🍪',
      message: 'uwu',
    },
  },
  favicon: '/assets/favicon.svg',

  lang: 'zh-CN',
  languages: ['zh-CN', 'en'],
  timezone: 'Asia/Shanghai',

  social: [
    {
      name: $t('social.rss'),
      link: '/feed.xml',
      icon: 'i-tabler-rss',
    },
    {
      name: $t('social.repo'),
      link: 'https://github.com/lgc2333/lgck.cc',
      icon: 'i-tabler-brand-git',
    },
    {
      name: $t('social.github'),
      link: 'https://github.com/lgc2333',
      icon: 'i-mingcute-github-line',
    },
    {
      name: $t('social.bilibili'),
      link: 'https://space.bilibili.com/257534706',
      icon: 'i-mingcute-bilibili-line',
    },
    {
      name: $t('social.qq_group'),
      link: 'https://qm.qq.com/q/EikuZ5sP4G',
      icon: 'i-mingcute-qq-line',
    },
    {
      name: $t('social.telegram'),
      link: 'https://t.me/lgc2333',
      icon: 'i-mingcute-telegram-line',
    },
    {
      name: $t('social.email'),
      link: 'mailto:lgc2333@126.com',
      icon: 'i-mingcute-mail-line',
    },
  ],

  mode: 'auto',
  lastUpdated: true,
  comment: { enable: true },
  encrypt: { enable: true },
  statistics: { enable: true },
  vanillaLazyload: { enable: true },
  feed: { favicon: '/assets/favicon.svg' },
  license: { enabled: true, type: 'by-nc' },
  search: { enable: true, provider: 'fuse' },
  frontmatter: { time_warning: TIME_DAY * 90 },
  mediumZoom: {
    enable: true,
    selector: '.markdown-body *:not(a img, img[data-no-zoom])',
  },

  sponsor: {
    enable: true,
    title: $t('sponsor.title'),
    description: $t('sponsor.description'),
  },

  redirects: {
    rules: [
      { from: '/page', to: '/page/1' }, // site nav
      { from: '/donate', to: '/sponsor' }, // backward compatibility
    ],
  },
})
