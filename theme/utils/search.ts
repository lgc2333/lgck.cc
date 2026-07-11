import type { SearchTextSegment } from '../types'

const SEARCH_SNIPPET_CONTEXT = 52

export interface FuseSearchMatch {
  key?: string
  value?: string
  indices: ReadonlyArray<readonly [number, number]>
}

export function findFuseMatch(
  matches: readonly FuseSearchMatch[] | undefined,
  key: string,
): FuseSearchMatch | undefined {
  return matches?.find((match) => match.key === key)
}

export function buildSnippetSegments(
  value: string,
  indices: ReadonlyArray<readonly [number, number]>,
): SearchTextSegment[] | undefined {
  const normalized = normalizeMatchRanges(indices, value.length)
  if (normalized.length === 0) {
    const fallback = truncateText(cleanSearchText(value))
    return fallback ? [{ text: fallback }] : undefined
  }

  const first = normalized[0]
  const start = Math.max(0, first[0] - SEARCH_SNIPPET_CONTEXT)
  const end = Math.min(value.length, first[1] + 1 + SEARCH_SNIPPET_CONTEXT)
  const snippetRanges = normalized
    .filter(([from, to]) => to >= start && from < end)
    .map(([from, to]) => [Math.max(from, start), Math.min(to, end)] as const)

  return withEllipsis(
    buildTextSegments(value.slice(start, end), shiftRanges(snippetRanges, -start)),
    {
      before: start > 0,
      after: end < value.length,
    },
  )
}

export function buildTextSegments(
  value: string,
  indices: ReadonlyArray<readonly [number, number]>,
): SearchTextSegment[] | undefined {
  const ranges = normalizeMatchRanges(indices, value.length)
  const segments: SearchTextSegment[] = []
  let cursor = 0

  for (const [from, to] of ranges) {
    pushSearchSegment(segments, value.slice(cursor, from))
    pushSearchSegment(segments, value.slice(from, to + 1), true)
    cursor = to + 1
  }

  pushSearchSegment(segments, value.slice(cursor))

  return trimSearchSegments(segments)
}

export function highlightTerms(
  value: string,
  terms: readonly string[],
): SearchTextSegment[] | undefined {
  const cleanValue = cleanSearchText(value)
  const cleanTerms = terms.map(cleanSearchText).filter(Boolean)
  if (!cleanValue || cleanTerms.length === 0)
    return cleanValue ? [{ text: cleanValue }] : undefined

  const lowerValue = cleanValue.toLowerCase()
  const ranges: Array<[number, number]> = []

  for (const term of cleanTerms) {
    const lowerTerm = term.toLowerCase()
    let from = lowerValue.indexOf(lowerTerm)
    while (from !== -1) {
      ranges.push([from, from + lowerTerm.length - 1])
      from = lowerValue.indexOf(lowerTerm, from + lowerTerm.length)
    }
  }

  return buildTextSegments(cleanValue, ranges)
}

export function segmentsToText(segments?: SearchTextSegment[]) {
  return segments?.map((segment) => segment.text).join('')
}

export function truncateText(value: string, maxLength = SEARCH_SNIPPET_CONTEXT * 2) {
  if (value.length <= maxLength) return value

  return `${value.slice(0, maxLength).trimEnd()}...`
}

export function cleanSearchText(value?: string) {
  if (!value) return ''

  return cleanSearchSegmentText(value).trim()
}

function normalizeMatchRanges(
  indices: ReadonlyArray<readonly [number, number]>,
  length: number,
): Array<[number, number]> {
  const ranges = indices
    .map(
      ([from, to]) => [Math.max(0, from), Math.min(length - 1, to)] as [number, number],
    )
    .filter(([from, to]) => from <= to)
    .sort((a, b) => a[0] - b[0])

  return ranges.reduce<Array<[number, number]>>((merged, range) => {
    const previous = merged.at(-1)
    if (!previous || range[0] > previous[1] + 1) {
      merged.push(range)
      return merged
    }

    previous[1] = Math.max(previous[1], range[1])
    return merged
  }, [])
}

function shiftRanges(
  ranges: ReadonlyArray<readonly [number, number]>,
  offset: number,
): Array<[number, number]> {
  return ranges.map(([from, to]) => [from + offset, to + offset])
}

function pushSearchSegment(
  segments: SearchTextSegment[],
  value: string,
  highlighted = false,
) {
  const text = cleanSearchSegmentText(value)
  if (!text) return

  const previous = segments.at(-1)
  if (previous?.highlighted === highlighted) {
    previous.text += text
    return
  }

  segments.push({ text, highlighted })
}

function trimSearchSegments(segments: SearchTextSegment[]) {
  while (segments[0]) {
    segments[0].text = segments[0].text.trimStart()
    if (segments[0].text) break
    segments.shift()
  }

  while (segments.at(-1)) {
    const last = segments.at(-1)!
    last.text = last.text.trimEnd()
    if (last.text) break
    segments.pop()
  }

  return segments.length > 0 ? segments : undefined
}

function withEllipsis(
  segments: SearchTextSegment[] | undefined,
  options: { before: boolean; after: boolean },
) {
  if (!segments?.length) return segments

  if (options.before) segments.unshift({ text: '...' })
  if (options.after) segments.push({ text: '...' })

  return segments
}

function cleanSearchSegmentText(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')
}
