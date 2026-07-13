import type { GiscusProps, Theme } from '@giscus/vue'

export interface GiscusThemeConfig {
  light?: Theme
  dark?: Theme
}

export interface GiscusOptions extends Omit<GiscusProps, 'repo' | 'repoId' | 'theme'> {
  repo: GiscusProps['repo']
  repoId: string
  theme?: Theme | GiscusThemeConfig
}
