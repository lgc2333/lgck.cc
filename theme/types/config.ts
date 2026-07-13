import type { DefaultTheme } from 'valaxy'
import 'valaxy'

// ─── Header ─────────────────────────────────────────────────────────────────

export type HeaderLinkMode = 'icon' | 'hover' | 'expanded'

export interface HeaderActivePathRewrite {
  from: string
  to: string
}

export interface HeaderNavLink {
  /**
   * Plain string, `$locale:key`, or `{ lang: text }` map.
   */
  text: string | Record<string, string>
  link: string
  /**
   * Default icon class, usually the outlined/linear variant.
   */
  icon: string
  /**
   * Icon class used while the link is active. Falls back to `icon`.
   */
  activeIcon?: string
}

export interface HeaderLinksConfig {
  /**
   * Show the home entry on the left side of the header.
   * @default true
   */
  addHome: boolean

  /**
   * Optional label next to the home icon when there is enough space.
   * Plain string, `$locale:key`, or `{ lang: text }` map.
   */
  homeLabel: string | Record<string, string>

  /**
   * Keep the home label visible when there is enough space.
   * @default false
   */
  homeFixed: boolean

  /**
   * Expand the active link label automatically.
   * @default true
   */
  activeExpanded: boolean

  /**
   * Rewrite the current route path before matching active header links.
   *
   * For example, `{ from: '/posts', to: '/page' }` makes `/posts/foo`
   * activate a `/page` navigation link.
   */
  activePathRewrites: HeaderActivePathRewrite[]

  /**
   * icon: icon-only, hover: expand on hover/focus, expanded: text always visible.
   * @default 'hover'
   */
  mode: HeaderLinkMode

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

// ─── Landing ────────────────────────────────────────────────────────────────

export type LandingLinkVariant =
  'primary' | 'secondary' | 'surface' | 'transparent' | 'brown' | 'pink'

export type LandingMode = 'full' | 'full-only' | 'compact' | 'disabled'

export interface LandingLink {
  /**
   * Plain string, `$locale:key`, or `{ lang: text }` map.
   */
  text: string | Record<string, string>
  link: string
  icon?: string
  variant?: LandingLinkVariant
}

export type LandingLinks = LandingLink[] | LandingLink[][]

export interface LandingConfig {
  /**
   * Landing home mode.
   *
   * full: one viewport landing with the post feed below.
   * full-only: one viewport landing with footer pinned to the bottom and no post feed.
   * compact: shorter landing with the post feed below.
   * disabled: use the plain home layout without the landing screen.
   *
   * @default 'full'
   */
  mode: LandingMode

  /**
   * Compact landing height in vh.
   * @default 65
   */
  compactHeight: number

  links: LandingLinks
}

// ─── Fixed background ───────────────────────────────────────────────────────

export interface FixedBgImageMeta {
  url: string
  title?: string
  author?: string
  description?: string
  sourceUrl?: string
}

export type FixedBgImageProvider = () =>
  FixedBgImageMeta | undefined | null | Promise<FixedBgImageMeta | undefined | null>

export type FixedBgImageSource =
  FixedBgImageMeta | FixedBgImageMeta[] | FixedBgImageProvider

export type FixedBgSwitchMode = 'sequential' | 'random'

export interface FixedBgConfig {
  /**
   * Static image meta, image list, or provider called when the route changes.
   */
  image?: FixedBgImageSource

  /**
   * Image selection strategy for lists.
   * @default 'sequential'
   */
  switchMode: FixedBgSwitchMode
}

// ─── Post feed / frontmatter ────────────────────────────────────────────────

export type CoverContentMask = 'card' | 'gradient'

export type CoverContentPosition = 'left' | 'right'

export interface PostFeedConfig {
  /**
   * Mask style used by cover cards in the post feed.
   * @default 'card'
   */
  coverContentMask: CoverContentMask

  /**
   * Position of cover card content on non-narrow screens.
   * @default 'left'
   */
  coverContentPosition: CoverContentPosition
}

export interface PostFooterSponsorConfig {
  /**
   * Sponsor page link. When configured, link mode wins over sponsor methods.
   */
  link?: string
}

export interface PostFooterConfig {
  /**
   * Post sponsor behavior.
   */
  sponsor: Partial<PostFooterSponsorConfig>
}

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

// ─── Colors ─────────────────────────────────────────────────────────────────

export type MaterialColorVariant =
  | 'content'
  | 'expressive'
  | 'fidelity'
  | 'fruitSalad'
  | 'monochrome'
  | 'neutral'
  | 'rainbow'
  | 'tonalSpot'
  | 'vibrant'

export type MaterialColorSpecVersion = '2021' | '2025'

export type MaterialColorPlatform = 'phone' | 'watch'

export interface MaterialCustomColorConfig {
  /**
   * Source color for this fixed custom slot.
   */
  color: string

  /**
   * Harmonize this color toward the main source color.
   * @default true
   */
  blend?: boolean
}

export interface MaterialCustomColorsConfig {
  brown?: Partial<MaterialCustomColorConfig>
  pink?: Partial<MaterialCustomColorConfig>
}

export interface MaterialColorsConfig {
  /**
   * Main source color used to generate the Material color roles.
   * @default '#2e6f9f'
   */
  source: string

  /**
   * Material Dynamic Color scheme variant.
   * @default 'tonalSpot'
   */
  variant: MaterialColorVariant

  /**
   * Contrast level from -1 to 1.
   * @default 0
   */
  contrastLevel: number

  /**
   * Material color specification version.
   * @default '2021'
   */
  specVersion: MaterialColorSpecVersion

  /**
   * Target platform used by the Material color generator.
   * @default 'phone'
   */
  platform: MaterialColorPlatform

  /**
   * Fixed custom color slots used by this theme.
   */
  custom: MaterialCustomColorsConfig
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export interface FooterConfig {
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
    color: string
    url: string
    title: string
  }>

  /**
   * Powered by valaxy & valaxy-theme-${name}
   * @default true
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
}

// ─── Theme config ───────────────────────────────────────────────────────────

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
   * Post footer behavior.
   */
  postFooter?: Partial<PostFooterConfig>

  /**
   * Material color generation.
   */
  colors?: Partial<MaterialColorsConfig>

  /**
   * Fixed page background.
   */
  fixedBg?: Partial<FixedBgConfig>

  /**
   * footer
   */
  footer?: Partial<FooterConfig>
}

export type ThemeUserConfig = Partial<ThemeConfig>
