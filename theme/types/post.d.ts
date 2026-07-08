import type { Post } from 'valaxy'

export type CoverContentMask = 'card' | 'gradient'

export type CoverContentPosition = 'left' | 'right'

export type LgcPost = Post & {
  /**
   * Mask style used by the post feed cover content.
   * @default themeConfig.postFeed.coverContentMask
   */
  coverContentMask?: CoverContentMask

  /**
   * Position of the cover card content on non-narrow screens.
   * @default themeConfig.postFeed.coverContentPosition
   */
  coverContentPosition?: CoverContentPosition
}

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
