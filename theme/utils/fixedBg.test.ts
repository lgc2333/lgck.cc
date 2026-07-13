import { afterEach, describe, expect, it, vi } from 'vitest'

import { createFixedBgRandomQueue } from './fixedBg'

describe('fixed background random queue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('avoids starting a new shuffled queue with the currently visible image', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)

    const queue = createFixedBgRandomQueue(
      [{ url: 'a' }, { url: 'b' }, { url: 'c' }, { url: 'd' }],
      'a',
    )

    expect(queue[0]).not.toBe(0)
    expect([...queue].sort()).toEqual([0, 1, 2, 3])
  })

  it('keeps the shuffled queue when every candidate has the current URL', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)

    const queue = createFixedBgRandomQueue([{ url: 'a' }, { url: 'a' }], 'a')

    expect(queue).toEqual([0, 1])
  })
})
