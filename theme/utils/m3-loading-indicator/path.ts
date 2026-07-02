import { calculateCubicsBounds, rotateCubicsToStartAngle } from './geometry'
import type { Cubic } from './geometry'
import { point } from './math'
import type { Point } from './types'

export function cubicsToPath2D(
  cubics: Cubic[],
  startAngle = 0,
  pivot: Point = point(0, 0),
) {
  const transformedCubics = rotateCubicsToStartAngle(cubics, startAngle, pivot)
  const path = new Path2D()
  const first = transformedCubics[0]

  path.moveTo(first.anchor0X, first.anchor0Y)
  for (const cubic of transformedCubics) {
    path.bezierCurveTo(
      cubic.control0X,
      cubic.control0Y,
      cubic.control1X,
      cubic.control1Y,
      cubic.anchor1X,
      cubic.anchor1Y,
    )
  }
  path.closePath()

  return path
}

export function processCubics(cubics: Cubic[], size: number, scaleFactor: number) {
  const scaled = cubics.map((cubic) =>
    cubic.transformed((p) => point(p.x * size * scaleFactor, p.y * size * scaleFactor)),
  )
  const center = calculateCubicsCentroid(scaled)
  const dx = size / 2 - center.x
  const dy = size / 2 - center.y
  return scaled.map((cubic) => cubic.transformed((p) => point(p.x + dx, p.y + dy)))
}

function calculateCubicsCentroid(cubics: Cubic[]) {
  const sampleCount = 16
  const points: Point[] = []

  for (const cubic of cubics) {
    for (let i = 0; i < sampleCount; i++) {
      points.push(cubic.pointOnCurve(i / sampleCount))
    }
  }

  let area = 0
  let cx = 0
  let cy = 0

  for (let i = 0; i < points.length; i++) {
    const current = points[i]
    const next = points[(i + 1) % points.length]
    const cross = current.x * next.y - next.x * current.y
    area += cross
    cx += (current.x + next.x) * cross
    cy += (current.y + next.y) * cross
  }

  if (Math.abs(area) < 1e-6) {
    const bounds = calculateCubicsBounds(cubics, false)
    return point((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2)
  }

  return point(cx / (3 * area), cy / (3 * area))
}

export function calculateScaleFactor(
  polygons: { calculateBounds: () => number[]; calculateMaxBounds: () => number[] }[],
) {
  let scaleFactor = 1

  for (const polygon of polygons) {
    const bounds = polygon.calculateBounds()
    const maxBounds = polygon.calculateMaxBounds()
    const scaleX = (bounds[2] - bounds[0]) / (maxBounds[2] - maxBounds[0])
    const scaleY = (bounds[3] - bounds[1]) / (maxBounds[3] - maxBounds[1])
    scaleFactor = Math.min(scaleFactor, Math.max(scaleX, scaleY))
  }

  return scaleFactor
}
