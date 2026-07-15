export const lgcBreakpointValues = {
  sm: 600,
  md: 840,
  lg: 1200,
  xl: 1600,
} as const

export const lgcBreakpoints = Object.fromEntries(
  Object.entries(lgcBreakpointValues).map(([key, value]) => [key, `${value}px`]),
) as Record<keyof typeof lgcBreakpointValues, string>

export function maxLgcBreakpointQuery(key: keyof typeof lgcBreakpointValues) {
  return `(max-width: ${lgcBreakpointValues[key] - 0.02}px)`
}
