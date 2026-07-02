import {
  DISTANCE_EPSILON,
  degreesToRadians,
  directionVector,
  distance,
  dot,
  lerp,
  point,
  radiansToDegrees,
  rotate90,
} from './math'
import type { Point } from './types'

export class Cubic {
  points: number[]

  constructor(
    anchor0X: number,
    anchor0Y: number,
    control0X: number,
    control0Y: number,
    control1X: number,
    control1Y: number,
    anchor1X: number,
    anchor1Y: number,
  ) {
    this.points = [
      anchor0X,
      anchor0Y,
      control0X,
      control0Y,
      control1X,
      control1Y,
      anchor1X,
      anchor1Y,
    ]
  }

  get anchor0X() {
    return this.points[0]
  }

  get anchor0Y() {
    return this.points[1]
  }

  get control0X() {
    return this.points[2]
  }

  get control0Y() {
    return this.points[3]
  }

  get control1X() {
    return this.points[4]
  }

  get control1Y() {
    return this.points[5]
  }

  get anchor1X() {
    return this.points[6]
  }

  get anchor1Y() {
    return this.points[7]
  }

  pointOnCurve(t: number): Point {
    const u = 1 - t
    return {
      x:
        this.anchor0X * (u * u * u) +
        this.control0X * (3 * t * u * u) +
        this.control1X * (3 * t * t * u) +
        this.anchor1X * (t * t * t),
      y:
        this.anchor0Y * (u * u * u) +
        this.control0Y * (3 * t * u * u) +
        this.control1Y * (3 * t * t * u) +
        this.anchor1Y * (t * t * t),
    }
  }

  zeroLength() {
    return (
      Math.abs(this.anchor0X - this.anchor1X) < DISTANCE_EPSILON &&
      Math.abs(this.anchor0Y - this.anchor1Y) < DISTANCE_EPSILON
    )
  }

  calculateBounds(approximate = false): [number, number, number, number] {
    if (this.zeroLength()) {
      return [this.anchor0X, this.anchor0Y, this.anchor0X, this.anchor0Y]
    }

    let minX = Math.min(this.anchor0X, this.anchor1X)
    let minY = Math.min(this.anchor0Y, this.anchor1Y)
    let maxX = Math.max(this.anchor0X, this.anchor1X)
    let maxY = Math.max(this.anchor0Y, this.anchor1Y)

    if (approximate) {
      return [
        Math.min(minX, this.control0X, this.control1X),
        Math.min(minY, this.control0Y, this.control1Y),
        Math.max(maxX, this.control0X, this.control1X),
        Math.max(maxY, this.control0Y, this.control1Y),
      ]
    }

    const includePoint = (t: number) => {
      if (t >= 0 && t <= 1) {
        const p = this.pointOnCurve(t)
        minX = Math.min(minX, p.x)
        minY = Math.min(minY, p.y)
        maxX = Math.max(maxX, p.x)
        maxY = Math.max(maxY, p.y)
      }
    }

    solveExtrema(
      -this.anchor0X + 3 * this.control0X - 3 * this.control1X + this.anchor1X,
      2 * this.anchor0X - 4 * this.control0X + 2 * this.control1X,
      -this.anchor0X + this.control0X,
    ).forEach(includePoint)
    solveExtrema(
      -this.anchor0Y + 3 * this.control0Y - 3 * this.control1Y + this.anchor1Y,
      2 * this.anchor0Y - 4 * this.control0Y + 2 * this.control1Y,
      -this.anchor0Y + this.control0Y,
    ).forEach(includePoint)

    return [minX, minY, maxX, maxY]
  }

  split(t: number): [Cubic, Cubic] {
    const u = 1 - t
    const p = this.pointOnCurve(t)
    return [
      new Cubic(
        this.anchor0X,
        this.anchor0Y,
        this.anchor0X * u + this.control0X * t,
        this.anchor0Y * u + this.control0Y * t,
        this.anchor0X * (u * u) +
          this.control0X * (2 * u * t) +
          this.control1X * (t * t),
        this.anchor0Y * (u * u) +
          this.control0Y * (2 * u * t) +
          this.control1Y * (t * t),
        p.x,
        p.y,
      ),
      new Cubic(
        p.x,
        p.y,
        this.control0X * (u * u) +
          this.control1X * (2 * u * t) +
          this.anchor1X * (t * t),
        this.control0Y * (u * u) +
          this.control1Y * (2 * u * t) +
          this.anchor1Y * (t * t),
        this.control1X * u + this.anchor1X * t,
        this.control1Y * u + this.anchor1Y * t,
        this.anchor1X,
        this.anchor1Y,
      ),
    ]
  }

  reverse() {
    return new Cubic(
      this.anchor1X,
      this.anchor1Y,
      this.control1X,
      this.control1Y,
      this.control0X,
      this.control0Y,
      this.anchor0X,
      this.anchor0Y,
    )
  }

  transformed(transform: (p: Point) => Point) {
    const a0 = transform(point(this.anchor0X, this.anchor0Y))
    const c0 = transform(point(this.control0X, this.control0Y))
    const c1 = transform(point(this.control1X, this.control1Y))
    const a1 = transform(point(this.anchor1X, this.anchor1Y))
    return new Cubic(a0.x, a0.y, c0.x, c0.y, c1.x, c1.y, a1.x, a1.y)
  }

  static empty(x: number, y: number) {
    return new Cubic(x, y, x, y, x, y, x, y)
  }

  static straightLine(x0: number, y0: number, x1: number, y1: number) {
    return new Cubic(
      x0,
      y0,
      lerp(x0, x1, 1 / 3),
      lerp(y0, y1, 1 / 3),
      lerp(x0, x1, 2 / 3),
      lerp(y0, y1, 2 / 3),
      x1,
      y1,
    )
  }

  static circularArc(
    centerX: number,
    centerY: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ) {
    const p0d = directionVector(x0 - centerX, y0 - centerY)
    const p1d = directionVector(x1 - centerX, y1 - centerY)
    const rotatedP0 = rotate90(p0d)
    const rotatedP1 = rotate90(p1d)
    const clockwise = dot(rotatedP0, point(x1 - centerX, y1 - centerY)) >= 0
    const cosa = dot(p0d, p1d)

    if (cosa > 0.999) return Cubic.straightLine(x0, y0, x1, y1)

    const k =
      ((distance(x0 - centerX, y0 - centerY) *
        4 *
        (Math.sqrt(2 * (1 - cosa)) - Math.sqrt(1 - cosa * cosa))) /
        (3 * (1 - cosa))) *
      (clockwise ? 1 : -1)

    return new Cubic(
      x0,
      y0,
      x0 + rotatedP0.x * k,
      y0 + rotatedP0.y * k,
      x1 - rotatedP1.x * k,
      y1 - rotatedP1.y * k,
      x1,
      y1,
    )
  }
}

export function rotateCubicsToStartAngle(
  cubics: Cubic[],
  startAngle: number,
  pivot: Point,
) {
  if (startAngle === 0 || cubics.length === 0) return cubics

  const first = cubics[0]
  const angleToFirstCubic = radiansToDegrees(
    Math.atan2(first.anchor0Y - pivot.y, first.anchor0X - pivot.x),
  )
  const radians = degreesToRadians(-angleToFirstCubic + startAngle)
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)

  return cubics.map((cubic) =>
    cubic.transformed((p) => {
      const x = p.x - pivot.x
      const y = p.y - pivot.y
      return point(x * cos - y * sin + pivot.x, x * sin + y * cos + pivot.y)
    }),
  )
}

export function calculateCubicsBounds(
  cubics: Cubic[],
  approximate = true,
): [number, number, number, number] {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const cubic of cubics) {
    const bounds = cubic.calculateBounds(approximate)
    minX = Math.min(minX, bounds[0])
    minY = Math.min(minY, bounds[1])
    maxX = Math.max(maxX, bounds[2])
    maxY = Math.max(maxY, bounds[3])
  }

  return [minX, minY, maxX, maxY]
}

function solveExtrema(a: number, b: number, c: number) {
  if (Math.abs(a) < DISTANCE_EPSILON) {
    return b === 0 ? [] : [(2 * c) / (-2 * b)]
  }

  const determinant = b * b - 4 * a * c
  if (determinant < 0) return []

  return [
    (-b + Math.sqrt(determinant)) / (2 * a),
    (-b - Math.sqrt(determinant)) / (2 * a),
  ]
}
