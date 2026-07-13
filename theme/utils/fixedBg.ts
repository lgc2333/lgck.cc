import type { FixedBgImageMeta } from '../types'

export function createFixedBgRandomQueue(
  list: Pick<FixedBgImageMeta, 'url'>[],
  currentUrl?: string,
) {
  const queue = Array.from({ length: list.length }, (_, index) => index)

  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[queue[i], queue[j]] = [queue[j], queue[i]]
  }

  if (!currentUrl || queue.length < 2 || list[queue[0]]?.url !== currentUrl) {
    return queue
  }

  const swapIndex = queue.findIndex((index) => list[index]?.url !== currentUrl)
  if (swapIndex > 0) {
    ;[queue[0], queue[swapIndex]] = [queue[swapIndex], queue[0]]
  }

  return queue
}
