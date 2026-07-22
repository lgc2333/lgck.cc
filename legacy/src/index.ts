const sourceDomain = 'lgc2333.top'
const targetDomain = 'lgck.cc'
const redirectStatus = 308

const prefixRedirects = [{ prefix: 'blog', toPrefix: '' }] as const

function getTargetHostname(prefix: string) {
  const redirect = prefixRedirects.find((rule) => rule.prefix === prefix)
  const targetPrefix = redirect?.toPrefix ?? prefix

  return targetPrefix ? `${targetPrefix}.${targetDomain}` : targetDomain
}

export function getRedirectHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase()

  if (normalizedHostname === sourceDomain) return targetDomain

  const sourceSuffix = `.${sourceDomain}`

  if (!normalizedHostname.endsWith(sourceSuffix)) return null

  const legacyPrefix = normalizedHostname.slice(0, -sourceSuffix.length)

  return getTargetHostname(legacyPrefix)
}

export default {
  fetch(request: Request) {
    const redirectUrl = new URL(request.url)
    const redirectHostname = getRedirectHostname(redirectUrl.hostname)

    if (!redirectHostname) return new Response('Not found', { status: 404 })

    redirectUrl.host = redirectHostname

    return Response.redirect(redirectUrl.toString(), redirectStatus)
  },
}
