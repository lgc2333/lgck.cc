export type SearchProvider = 'fuse' | 'local'

export interface SearchTextSegment {
  text: string
  highlighted?: boolean
}

export interface SearchItem {
  id: string
  title: string
  titleSegments?: SearchTextSegment[]
  excerpt?: string
  excerptSegments?: SearchTextSegment[]
  section?: string
  sectionSegments?: SearchTextSegment[]
  path: string
  to: string
  provider: SearchProvider
}
