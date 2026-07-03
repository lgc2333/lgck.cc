export type HeaderLinkMode = 'icon' | 'hover' | 'expanded'

export interface HeaderLinksConfig {
  /**
   * Show the home entry on the left side of the header.
   * @default true
   */
  addHome: boolean

  /**
   * Optional label next to the home icon when there is enough space.
   */
  homeLabel: string

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

export interface HeaderNavLink {
  text: string
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

export interface HeaderActivePathRewrite {
  from: string
  to: string
}
