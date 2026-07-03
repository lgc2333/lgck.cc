export type LandingLinkVariant = 'primary' | 'tonal' | 'default' | 'cookie' | 'ribbon'

export type LandingMode = 'full' | 'full-only' | 'compact' | 'disabled'

export interface LandingLink {
  text: string
  link: string
  icon?: string
  variant?: LandingLinkVariant
}

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

  links: LandingLink[]
}
