/// <reference path="./font.d.ts" />
import type { DefaultTheme } from 'valaxy'
import 'valaxy'

import type { FooterConfig } from './footer'
import type { HeaderLinksConfig, HeaderNavLink } from './header'
import type { LandingConfig } from './landing'
import type { CoverContentMask, CoverContentPosition, PostFeedConfig } from './post'

declare module 'valaxy' {
  interface PostFrontMatter {
    /**
     * Mask style used by the post feed cover content.
     * @default themeConfig.postFeed.coverContentMask
     */
    coverContentMask?: CoverContentMask

    /**
     * Position of the cover card content mask on non-narrow screens.
     * @default themeConfig.postFeed.coverContentPosition
     */
    coverContentPosition?: CoverContentPosition
  }
}

export namespace LgcTheme {
  export type Config = ThemeConfig
  export type Sidebar = any
}

/**
 * Theme Config
 */
export interface ThemeConfig extends DefaultTheme.Config {
  /**
   * Header behavior.
   */
  header?: Partial<{
    /**
     * Show the i18n language toggle button in the header.
     * @default true
     */
    i18n: boolean

    /**
     * Header navigation links.
     */
    nav: HeaderNavLink[]

    /**
     * Desktop header link sizing/expansion behavior.
     */
    links: Partial<HeaderLinksConfig>
  }>

  /**
   * Landing screen
   */
  landing?: Partial<LandingConfig>

  /**
   * Post feed behavior.
   */
  postFeed?: Partial<PostFeedConfig>

  /**
   * footer
   */
  footer?: Partial<FooterConfig>
}

export type ThemeUserConfig = Partial<ThemeConfig>

export type * from './footer'
export type * from './header'
export type * from './landing'
export type * from './post'
