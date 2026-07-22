const sourceDomain = 'lgc2333.top'
const targetDomain = 'lgck.cc'
const redirectStatus = 308

export function getRedirectHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase()

  if (normalizedHostname === sourceDomain) return targetDomain

  const sourceSuffix = `.${sourceDomain}`

  if (!normalizedHostname.endsWith(sourceSuffix)) return null

  const legacyPrefix = normalizedHostname.slice(0, -sourceSuffix.length)

  return `${legacyPrefix}.${targetDomain}`
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
