export function normalizeRepositoryUrl(repository?: string | { url?: string }) {
  const url = typeof repository === 'string' ? repository : repository?.url

  return url?.replace(/^git\+/, '').replace(/\.git$/, '') || ''
}
