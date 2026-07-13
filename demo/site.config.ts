import { $t, defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  languages: ['zh-CN', 'en'],
  title: $t('siteConfig.title'),
  subtitle: $t('siteConfig.subtitle'),
  url: 'https://lgcuwukii.valaxy.site/',
  author: {
    avatar: 'https://www.yunyoujun.cn/images/avatar.jpg',
    name: $t('siteConfig.author.name'),
  },
  description: $t('siteConfig.description'),
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: $t('siteConfig.social.qq'),
      link: 'https://qm.qq.com/cgi-bin/qm/qr?k=kZJzggTTCf4SpvEQ8lXWoi5ZjhAx0ILZ&jump_from=webapi',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/YunYouJun',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: $t('siteConfig.social.weibo'),
      link: 'https://weibo.com/jizhideyunyoujun',
      icon: 'i-ri-weibo-line',
      color: '#E6162D',
    },
    {
      name: $t('siteConfig.social.douban'),
      link: 'https://www.douban.com/people/yunyoujun/',
      icon: 'i-ri-douban-line',
      color: '#007722',
    },
    {
      name: $t('siteConfig.social.netease'),
      link: 'https://music.163.com/#/user/home?id=247102977',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: $t('siteConfig.social.zhihu'),
      link: 'https://www.zhihu.com/people/yunyoujun/',
      icon: 'i-ri-zhihu-line',
      color: '#0084FF',
    },
    {
      name: $t('siteConfig.social.bilibili'),
      link: 'https://space.bilibili.com/1579790',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: $t('siteConfig.social.wechat'),
      link: 'https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/about/white-qrcode-and-search.jpg',
      icon: 'i-ri-wechat-2-line',
      color: '#1AAD19',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/YunYouJun',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
    {
      name: 'Telegram Channel',
      link: 'https://t.me/elpsycn',
      icon: 'i-ri-telegram-line',
      color: '#0088CC',
    },
    {
      name: $t('siteConfig.social.mail'),
      link: 'mailto:me@yunyoujun.cn',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    {
      name: $t('siteConfig.social.travelling'),
      link: 'https://travellings.link',
      icon: 'i-ri-train-line',
      color: 'var(--va-c-text)',
    },
  ],

  comment: {
    enable: true,
  },

  search: {
    enable: true,
    // provider: 'local',  // TODO: Bug in upstream framework valaxy, open a issue soon
  },

  statistics: {
    enable: true,
  },

  redirects: {
    rules: [{ from: '/page', to: '/page/1' }],
  },

  sponsor: {
    enable: true,
    title: $t('siteConfig.sponsor.title'),
    description: $t('siteConfig.sponsor.description'),
    methods: [
      {
        name: $t('siteConfig.sponsor.payment.alipay'),
        url: 'https://blog.lgc2333.top/assets/donate/alipay.jpg',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      {
        name: $t('siteConfig.sponsor.payment.wechat'),
        url: 'https://blog.lgc2333.top/assets/donate/wechat.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
      {
        name: $t('siteConfig.sponsor.payment.qq'),
        url: 'https://blog.lgc2333.top/assets/donate/qq.png',
        color: '#12B7F5',
        icon: 'i-ri-qq-line',
      },
      {
        name: 'Default Test',
        url: 'https://blog.lgc2333.top/assets/favicon.png',
      },
    ],
  },
})
