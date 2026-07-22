import { describe, expect, it } from 'vitest'

import worker, { getRedirectHostname } from './index'

describe('legacy redirect', () => {
  it('maps the apex domain', () => {
    expect(getRedirectHostname('lgc2333.top')).toBe('lgck.cc')
  })

  it('maps the legacy blog subdomain to the apex target', async () => {
    const response = await worker.fetch(
      new Request('https://blog.lgc2333.top/posts/1?from=legacy'),
    )

    expect(getRedirectHostname('blog.lgc2333.top')).toBe('lgck.cc')
    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe('https://lgck.cc/posts/1?from=legacy')
  })

  it('maps any subdomain depth', () => {
    expect(getRedirectHostname('www.lgc2333.top')).toBe('www.lgck.cc')
    expect(getRedirectHostname('foo.bar.lgc2333.top')).toBe('foo.bar.lgck.cc')
  })

  it('preserves protocol, path, and query', async () => {
    const response = await worker.fetch(
      new Request('http://foo.lgc2333.top/posts/1?from=legacy'),
    )

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe(
      'http://foo.lgck.cc/posts/1?from=legacy',
    )
  })

  it('ignores unrelated hosts', async () => {
    const response = await worker.fetch(new Request('https://example.com/'))

    expect(response.status).toBe(404)
  })
})
