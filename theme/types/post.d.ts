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
