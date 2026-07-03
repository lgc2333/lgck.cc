export function formatLocaleName(locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || locale
  } catch {
    return locale
  }
}
