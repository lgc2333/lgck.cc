/// <reference path="./font.d.ts" />
import type { DefaultTheme } from 'valaxy'

export namespace StarterTheme {
  export type Config = ThemeConfig
  export type Sidebar = any
}

/**
 * Theme Config
 */
export interface ThemeConfig extends DefaultTheme.Config {
  /**
   * Topbar behavior.
   */
  topBar?: Partial<{
    /**
     * Show the home entry on the left side of the topbar.
     * @default true
     */
    addHome: boolean

    /**
     * Keep the home label visible when there is enough space.
     * Set to false to use the same hover expansion as other links.
     * @default true
     */
    homeFixed: boolean

    /**
     * Optional label next to the home icon when there is enough space.
     */
    homeLabel: string

    /**
     * Desktop topbar link sizing/expansion behavior.
     */
    links: Partial<TopBarLinksConfig>
  }>

  /**
   * footer
   */
  footer?: Partial<{
    /**
     * 建站于
     */
    since: number

    /**
     * Icon between year and copyright info.
     */
    icon: Partial<{
      /**
       * icon name, i-xxx
       */
      enable: boolean
      name: string
      animated: boolean
      color: string
      url: string
      title: string
    }>

    /**
     * Powered by valaxy & valaxy-theme-${name}, default is yun
     */
    powered: boolean

    /**
     * Chinese Users | 中国用户
     * 备案 ICP
     * 国内用户需要在网站页脚展示备案 ICP 号
     * https://beian.miit.gov.cn/
     */
    beian: {
      enable: boolean
      /**
       * 苏ICP备xxxxxxxx号
       */
      icp: string
      /**
       * Custom ICP link.
       * @default 'https://beian.miit.gov.cn/'
       */
      icpLink?: string
      /**
       * 公安网备案号
       */
      police?: string
    }
  }>

  /**
   * Landing screen
   */
  landing?: Partial<LandingConfig>
}

export type LandingLinkVariant = 'primary' | 'tonal' | 'default' | 'cookie' | 'ribbon'

export type TopBarLinkMode = 'icon' | 'hover' | 'expanded'

export interface TopBarLinksConfig {
  /**
   * icon: icon-only, hover: expand on hover/focus, expanded: text always visible.
   * @default 'hover'
   */
  mode: TopBarLinkMode

  /**
   * Fixed width for desktop links. When set, links do not size by content.
   */
  width: string

  /**
   * Minimum width for desktop links.
   * @default '3rem'
   */
  minWidth: string

  /**
   * Maximum width for desktop links.
   * @default '11rem'
   */
  maxWidth: string
}

export interface LandingLink {
  text: string
  link: string
  icon?: string
  variant?: LandingLinkVariant
}

export interface LandingConfig {
  /**
   * Enable landing home.
   * @default true
   */
  enable: boolean

  /**
   * Render current posts below first viewport.
   * @default false
   */
  showPosts: boolean

  /**
   * Use a shorter landing section.
   * @default false
   */
  compact: boolean

  links: LandingLink[]
}

export type ThemeUserConfig = Partial<ThemeConfig>
