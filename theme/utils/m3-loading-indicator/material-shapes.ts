import {
  circle,
  cornerRounding,
  rotatePolygon,
  roundedPolygon,
  scalePolygon,
  star,
} from './graphics'
import type { Point, RoundedPolygon } from './graphics'

interface PointNRound {
  o: Point
  r?: ReturnType<typeof cornerRounding>
}

const cornerRound15 = cornerRounding(0.15)
const cornerRound50 = cornerRounding(0.5)

export const MaterialShapes = {
  get Circle() {
    return circle().normalized()
  },
  get Cookie4Sided() {
    return cookie4().normalized()
  },
  get Cookie9Sided() {
    return cookie9().normalized()
  },
  get Oval() {
    return oval().normalized()
  },
  get Pentagon() {
    return pentagon().normalized()
  },
  get Pill() {
    return pill().normalized()
  },
  get SoftBurst() {
    return softBurst().normalized()
  },
  get Sunny() {
    return sunny().normalized()
  },
}

function oval() {
  return rotatePolygon(scalePolygon(circle(), 1, 0.64), -45)
}

function pill() {
  return customPolygon(
    [
      { o: point(0.961, 0.039), r: cornerRounding(0.426) },
      { o: point(1.001, 0.428) },
      { o: point(1.0, 0.609), r: cornerRounding(1) },
    ],
    2,
    point(0.5, 0.5),
    true,
  )
}

function pentagon() {
  return customPolygon(
    [
      { o: point(0.5, -0.009), r: cornerRounding(0.172) },
      { o: point(1.03, 0.365), r: cornerRounding(0.164) },
      { o: point(0.828, 0.97), r: cornerRounding(0.169) },
    ],
    1,
    point(0.5, 0.5),
    true,
  )
}

function sunny() {
  return star(8, 1, 0.8, cornerRound15)
}

function cookie4() {
  return customPolygon(
    [
      { o: point(1.237, 1.236), r: cornerRounding(0.258) },
      { o: point(0.5, 0.918), r: cornerRounding(0.233) },
    ],
    4,
  )
}

function cookie9() {
  return rotatePolygon(star(9, 1, 0.8, cornerRound50), -90)
}

function softBurst() {
  return customPolygon(
    [
      { o: point(0.193, 0.277), r: cornerRounding(0.053) },
      { o: point(0.176, 0.055), r: cornerRounding(0.053) },
    ],
    10,
  )
}

export function indeterminatePolygons(): RoundedPolygon[] {
  return [
    MaterialShapes.SoftBurst,
    MaterialShapes.Cookie9Sided,
    MaterialShapes.Pentagon,
    MaterialShapes.Pill,
    MaterialShapes.Sunny,
    MaterialShapes.Cookie4Sided,
    MaterialShapes.Oval,
  ]
}

function customPolygon(
  pnr: PointNRound[],
  reps: number,
  center = point(0.5, 0.5),
  mirroring = false,
) {
  const actualPoints = repeatPoints(pnr, reps, center, mirroring)
  const vertices = actualPoints.flatMap((entry) => [entry.o.x, entry.o.y])
  const perVertexRounding = actualPoints.map((entry) => entry.r ?? cornerRounding())
  return roundedPolygon(
    vertices,
    cornerRounding(),
    perVertexRounding,
    center.x,
    center.y,
  )
}

function repeatPoints(
  points: PointNRound[],
  reps: number,
  center: Point,
  mirroring: boolean,
) {
  if (!mirroring) {
    return Array.from({ length: points.length * reps }, (_, index) => {
      const pointIndex = index % points.length
      return {
        o: rotatePoint(
          points[pointIndex].o,
          (Math.floor(index / points.length) * 360) / reps,
          center,
        ),
        r: points[pointIndex].r,
      }
    })
  }

  const result: PointNRound[] = []
  const angles = points.map((entry) => angleDegrees(subtract(entry.o, center)))
  const distances = points.map((entry) => length(subtract(entry.o, center)))
  const actualReps = reps * 2
  const sectionAngle = 360 / actualReps

  for (let repeatIndex = 0; repeatIndex < actualReps; repeatIndex++) {
    for (const sourceIndex of points.keys()) {
      const pointIndex =
        repeatIndex % 2 === 0 ? sourceIndex : points.length - 1 - sourceIndex
      if (pointIndex > 0 || repeatIndex % 2 === 0) {
        const radians =
          ((sectionAngle * repeatIndex +
            (repeatIndex % 2 === 0
              ? angles[pointIndex]
              : sectionAngle - angles[pointIndex] + 2 * angles[0])) /
            360) *
          Math.PI *
          2
        result.push({
          o: add(
            point(
              Math.cos(radians) * distances[pointIndex],
              Math.sin(radians) * distances[pointIndex],
            ),
            center,
          ),
          r: points[pointIndex].r,
        })
      }
    }
  }

  return result
}

function rotatePoint(p: Point, degrees: number, center: Point) {
  const radians = (degrees / 360) * Math.PI * 2
  const offset = subtract(p, center)
  return add(
    point(
      offset.x * Math.cos(radians) - offset.y * Math.sin(radians),
      offset.x * Math.sin(radians) + offset.y * Math.cos(radians),
    ),
    center,
  )
}

function point(x: number, y: number): Point {
  return { x, y }
}

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y }
}

function subtract(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y }
}

function length(p: Point) {
  return Math.sqrt(p.x * p.x + p.y * p.y)
}

function angleDegrees(p: Point) {
  return (Math.atan2(p.y, p.x) * 180) / Math.PI
}
