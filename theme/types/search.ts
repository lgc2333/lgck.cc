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
  score?: number
  to: string
  provider: SearchProvider
}
