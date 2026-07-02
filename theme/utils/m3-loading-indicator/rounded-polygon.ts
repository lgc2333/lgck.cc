import { Cubic } from './geometry'
import {
  DISTANCE_EPSILON,
  PI,
  add,
  convex,
  direction,
  directionVector,
  distance,
  distanceSquared,
  divide,
  dot,
  interpolatePoint,
  length,
  lineIntersection,
  multiply,
  point,
  radialToCartesian,
  rotate90,
  square,
  subtract,
} from './math'
import type { CornerRounding, Feature, Point } from './types'

export class RoundedPolygon {
  center: Point
  cubics: Cubic[]
  features: Feature[]

  constructor(features: Feature[], center: Point) {
    this.features = features
    this.center = center
    this.cubics = flattenFeatures(features, center)
  }

  get centerX() {
    return this.center.x
  }

  get centerY() {
    return this.center.y
  }

  transformed(transform: (p: Point) => Point) {
    return new RoundedPolygon(
      this.features.map((feature) => ({
        ...feature,
        cubics: feature.cubics.map((cubic) => cubic.transformed(transform)),
      })),
      transform(this.center),
    )
  }

  normalized() {
    const bounds = this.calculateBounds()
    const width = bounds[2] - bounds[0]
    const height = bounds[3] - bounds[1]
    const side = Math.max(width, height)
    const offsetX = (side - width) / 2 - bounds[0]
    const offsetY = (side - height) / 2 - bounds[1]
    return this.transformed((p) =>
      point((p.x + offsetX) / side, (p.y + offsetY) / side),
    )
  }

  calculateBounds(approximate = true): [number, number, number, number] {
    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    for (const cubic of this.cubics) {
      const bounds = cubic.calculateBounds(approximate)
      minX = Math.min(minX, bounds[0])
      minY = Math.min(minY, bounds[1])
      maxX = Math.max(maxX, bounds[2])
      maxY = Math.max(maxY, bounds[3])
    }

    return [minX, minY, maxX, maxY]
  }

  calculateMaxBounds(): [number, number, number, number] {
    let maxDistSquared = 0

    for (const cubic of this.cubics) {
      const anchorDistance = distanceSquared(
        cubic.anchor0X - this.centerX,
        cubic.anchor0Y - this.centerY,
      )
      const middlePoint = cubic.pointOnCurve(0.5)
      const middleDistance = distanceSquared(
        middlePoint.x - this.centerX,
        middlePoint.y - this.centerY,
      )
      maxDistSquared = Math.max(maxDistSquared, anchorDistance, middleDistance)
    }

    const d = Math.sqrt(maxDistSquared)
    return [this.centerX - d, this.centerY - d, this.centerX + d, this.centerY + d]
  }
}

export function roundedPolygon(
  vertices: number[],
  rounding: CornerRounding = unrounded(),
  perVertexRounding?: CornerRounding[],
  centerX = Number.NaN,
  centerY = Number.NaN,
) {
  const n = vertices.length / 2
  const roundedCorners: RoundedCorner[] = []

  for (let i = 0; i < n; i++) {
    const vtxRounding = perVertexRounding?.[i] ?? rounding
    const prevIndex = ((i + n - 1) % n) * 2
    const nextIndex = ((i + 1) % n) * 2
    roundedCorners.push(
      new RoundedCorner(
        point(vertices[prevIndex], vertices[prevIndex + 1]),
        point(vertices[i * 2], vertices[i * 2 + 1]),
        point(vertices[nextIndex], vertices[nextIndex + 1]),
        vtxRounding,
      ),
    )
  }

  const cutAdjusts = Array.from({ length: n }, (_, ix) => {
    const expectedRoundCut =
      roundedCorners[ix].expectedRoundCut +
      roundedCorners[(ix + 1) % n].expectedRoundCut
    const expectedCut =
      roundedCorners[ix].expectedCut + roundedCorners[(ix + 1) % n].expectedCut
    const sideSize = distance(
      vertices[ix * 2] - vertices[((ix + 1) % n) * 2],
      vertices[ix * 2 + 1] - vertices[((ix + 1) % n) * 2 + 1],
    )

    if (expectedRoundCut > sideSize) return [sideSize / expectedRoundCut, 0]
    if (expectedCut > sideSize) {
      return [1, (sideSize - expectedRoundCut) / (expectedCut - expectedRoundCut)]
    }
    return [1, 1]
  })

  const corners: Cubic[][] = []
  for (let i = 0; i < n; i++) {
    const allowedCuts = [0, 1].map((delta) => {
      const [roundCutRatio, cutRatio] = cutAdjusts[(i + n - 1 + delta) % n]
      return (
        roundedCorners[i].expectedRoundCut * roundCutRatio +
        (roundedCorners[i].expectedCut - roundedCorners[i].expectedRoundCut) * cutRatio
      )
    })
    corners.push(roundedCorners[i].getCubics(allowedCuts[0], allowedCuts[1]))
  }

  const features: Feature[] = []
  for (let i = 0; i < n; i++) {
    const prevVtxIndex = (i + n - 1) % n
    const nextVtxIndex = (i + 1) % n
    const currVertex = point(vertices[i * 2], vertices[i * 2 + 1])
    const prevVertex = point(vertices[prevVtxIndex * 2], vertices[prevVtxIndex * 2 + 1])
    const nextVertex = point(vertices[nextVtxIndex * 2], vertices[nextVtxIndex * 2 + 1])
    features.push({
      cubics: corners[i],
      convex: convex(prevVertex, currVertex, nextVertex),
      type: 'corner',
    })
    features.push({
      cubics: [
        Cubic.straightLine(
          corners[i][corners[i].length - 1].anchor1X,
          corners[i][corners[i].length - 1].anchor1Y,
          corners[(i + 1) % n][0].anchor0X,
          corners[(i + 1) % n][0].anchor0Y,
        ),
      ],
      type: 'edge',
    })
  }

  const center =
    Number.isNaN(centerX) || Number.isNaN(centerY)
      ? calculateCenter(vertices)
      : point(centerX, centerY)
  return new RoundedPolygon(features, center)
}

export function regularPolygon(
  numVertices: number,
  radius = 1,
  centerX = 0,
  centerY = 0,
  rounding: CornerRounding = unrounded(),
  perVertexRounding?: CornerRounding[],
) {
  const vertices: number[] = []
  for (let i = 0; i < numVertices; i++) {
    const vertex = radialToCartesian(
      radius,
      (PI / numVertices) * 2 * i,
      point(centerX, centerY),
    )
    vertices.push(vertex.x, vertex.y)
  }
  return roundedPolygon(vertices, rounding, perVertexRounding, centerX, centerY)
}

export function circle(numVertices = 8, radius = 1, centerX = 0, centerY = 0) {
  const theta = PI / numVertices
  return regularPolygon(
    numVertices,
    radius / Math.cos(theta),
    centerX,
    centerY,
    cornerRounding(radius),
  )
}

export function rectangle(
  width = 2,
  height = 2,
  rounding: CornerRounding = unrounded(),
  perVertexRounding?: CornerRounding[],
  centerX = 0,
  centerY = 0,
) {
  const left = centerX - width / 2
  const top = centerY - height / 2
  const right = centerX + width / 2
  const bottom = centerY + height / 2
  return roundedPolygon(
    [right, bottom, left, bottom, left, top, right, top],
    rounding,
    perVertexRounding,
    centerX,
    centerY,
  )
}

export function star(
  numVerticesPerRadius: number,
  radius = 1,
  innerRadius = 0.5,
  rounding: CornerRounding = unrounded(),
  innerRounding?: CornerRounding,
  perVertexRounding?: CornerRounding[],
  centerX = 0,
  centerY = 0,
) {
  const pvRounding =
    perVertexRounding ??
    (innerRounding
      ? Array.from({ length: numVerticesPerRadius }).flatMap(() => [
          rounding,
          innerRounding,
        ])
      : undefined)
  const vertices: number[] = []

  for (let i = 0; i < numVerticesPerRadius; i++) {
    let vertex = radialToCartesian(radius, (PI / numVerticesPerRadius) * 2 * i)
    vertices.push(vertex.x + centerX, vertex.y + centerY)
    vertex = radialToCartesian(innerRadius, (PI / numVerticesPerRadius) * (2 * i + 1))
    vertices.push(vertex.x + centerX, vertex.y + centerY)
  }

  return roundedPolygon(vertices, rounding, pvRounding, centerX, centerY)
}

export function cornerRounding(radius = 0, smoothing = 0): CornerRounding {
  return { radius, smoothing }
}

export function unrounded(): CornerRounding {
  return { radius: 0, smoothing: 0 }
}

export function rotatePolygon(polygon: RoundedPolygon, degrees: number) {
  const radians = (degrees / 360) * Math.PI * 2
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  return polygon.transformed((p) => point(p.x * cos - p.y * sin, p.x * sin + p.y * cos))
}

export function scalePolygon(polygon: RoundedPolygon, sx: number, sy: number) {
  return polygon.transformed((p) => point(p.x * sx, p.y * sy))
}

function flattenFeatures(features: Feature[], center: Point) {
  const cubics: Cubic[] = []
  let firstCubic: Cubic | undefined
  let lastCubic: Cubic | undefined
  let firstFeatureSplitStart: Cubic[] | undefined
  let firstFeatureSplitEnd: Cubic[] | undefined

  if (features.length > 0 && features[0].cubics.length === 3) {
    const [start, end] = features[0].cubics[1].split(0.5)
    firstFeatureSplitStart = [features[0].cubics[0], start]
    firstFeatureSplitEnd = [end, features[0].cubics[2]]
  }

  for (let i = 0; i <= features.length; i++) {
    const featureCubics =
      i === 0 && firstFeatureSplitEnd
        ? firstFeatureSplitEnd
        : i === features.length
          ? firstFeatureSplitStart
          : features[i]?.cubics

    if (!featureCubics) break

    for (const cubic of featureCubics) {
      if (!cubic.zeroLength()) {
        if (lastCubic) cubics.push(lastCubic)
        lastCubic = cubic
        firstCubic ||= cubic
      } else if (lastCubic) {
        lastCubic = new Cubic(
          lastCubic.anchor0X,
          lastCubic.anchor0Y,
          lastCubic.control0X,
          lastCubic.control0Y,
          lastCubic.control1X,
          lastCubic.control1Y,
          cubic.anchor1X,
          cubic.anchor1Y,
        )
      }
    }
  }

  if (lastCubic && firstCubic) {
    cubics.push(
      new Cubic(
        lastCubic.anchor0X,
        lastCubic.anchor0Y,
        lastCubic.control0X,
        lastCubic.control0Y,
        lastCubic.control1X,
        lastCubic.control1Y,
        firstCubic.anchor0X,
        firstCubic.anchor0Y,
      ),
    )
  } else {
    cubics.push(Cubic.empty(center.x, center.y))
  }

  return cubics
}

class RoundedCorner {
  center = point(0, 0)
  cornerRadius: number
  d1: Point
  d2: Point
  expectedRoundCut: number
  smoothing: number

  constructor(
    private p0: Point,
    private p1: Point,
    private p2: Point,
    rounding: CornerRounding,
  ) {
    const v01 = subtract(p0, p1)
    const v21 = subtract(p2, p1)
    const d01 = length(v01)
    const d21 = length(v21)

    if (d01 > 0 && d21 > 0) {
      this.d1 = divide(v01, d01)
      this.d2 = divide(v21, d21)
      this.cornerRadius = rounding.radius
      this.smoothing = rounding.smoothing

      const cosAngle = dot(this.d1, this.d2)
      const sinAngle = Math.sqrt(1 - square(cosAngle))
      this.expectedRoundCut =
        sinAngle > 1e-3 ? (this.cornerRadius * (cosAngle + 1)) / sinAngle : 0
    } else {
      this.d1 = point(0, 0)
      this.d2 = point(0, 0)
      this.cornerRadius = 0
      this.smoothing = 0
      this.expectedRoundCut = 0
    }
  }

  get expectedCut() {
    return (1 + this.smoothing) * this.expectedRoundCut
  }

  getCubics(allowedCut0: number, allowedCut1 = allowedCut0) {
    const allowedCut = Math.min(allowedCut0, allowedCut1)
    if (
      this.expectedRoundCut < DISTANCE_EPSILON ||
      allowedCut < DISTANCE_EPSILON ||
      this.cornerRadius < DISTANCE_EPSILON
    ) {
      this.center = this.p1
      return [Cubic.straightLine(this.p1.x, this.p1.y, this.p1.x, this.p1.y)]
    }

    const actualRoundCut = Math.min(allowedCut, this.expectedRoundCut)
    const actualSmoothing0 = this.calculateActualSmoothingValue(allowedCut0)
    const actualSmoothing1 = this.calculateActualSmoothingValue(allowedCut1)
    const actualR = (this.cornerRadius * actualRoundCut) / this.expectedRoundCut
    const centerDistance = Math.sqrt(square(actualR) + square(actualRoundCut))

    this.center = add(
      this.p1,
      multiply(direction(add(this.d1, this.d2)), centerDistance),
    )

    const circleIntersection0 = add(this.p1, multiply(this.d1, actualRoundCut))
    const circleIntersection2 = add(this.p1, multiply(this.d2, actualRoundCut))
    const flanking0 = this.computeFlankingCurve(
      actualRoundCut,
      actualSmoothing0,
      this.p1,
      this.p0,
      circleIntersection0,
      circleIntersection2,
      this.center,
      actualR,
    )
    const flanking2 = this.computeFlankingCurve(
      actualRoundCut,
      actualSmoothing1,
      this.p1,
      this.p2,
      circleIntersection2,
      circleIntersection0,
      this.center,
      actualR,
    ).reverse()

    return [
      flanking0,
      Cubic.circularArc(
        this.center.x,
        this.center.y,
        flanking0.anchor1X,
        flanking0.anchor1Y,
        flanking2.anchor0X,
        flanking2.anchor0Y,
      ),
      flanking2,
    ]
  }

  private calculateActualSmoothingValue(allowedCut: number) {
    if (allowedCut > this.expectedCut) return this.smoothing
    if (allowedCut > this.expectedRoundCut) {
      return (
        (this.smoothing * (allowedCut - this.expectedRoundCut)) /
        (this.expectedCut - this.expectedRoundCut)
      )
    }
    return 0
  }

  private computeFlankingCurve(
    actualRoundCut: number,
    actualSmoothingValue: number,
    corner: Point,
    sideStart: Point,
    circleSegmentIntersection: Point,
    otherCircleSegmentIntersection: Point,
    circleCenter: Point,
    actualR: number,
  ) {
    const sideDirection = direction(subtract(sideStart, corner))
    const curveStart = add(
      corner,
      multiply(sideDirection, actualRoundCut * (1 + actualSmoothingValue)),
    )
    const p = interpolatePoint(
      circleSegmentIntersection,
      divide(add(circleSegmentIntersection, otherCircleSegmentIntersection), 2),
      actualSmoothingValue,
    )
    const curveEnd = add(
      circleCenter,
      multiply(directionVector(p.x - circleCenter.x, p.y - circleCenter.y), actualR),
    )
    const circleTangent = rotate90(subtract(curveEnd, circleCenter))
    const anchorEnd =
      lineIntersection(sideStart, sideDirection, curveEnd, circleTangent) ??
      circleSegmentIntersection
    const anchorStart = divide(add(curveStart, multiply(anchorEnd, 2)), 3)
    return new Cubic(
      curveStart.x,
      curveStart.y,
      anchorStart.x,
      anchorStart.y,
      anchorEnd.x,
      anchorEnd.y,
      curveEnd.x,
      curveEnd.y,
    )
  }
}

function calculateCenter(vertices: number[]) {
  let x = 0
  let y = 0

  for (let i = 0; i < vertices.length; i += 2) {
    x += vertices[i]
    y += vertices[i + 1]
  }

  return point(x / (vertices.length / 2), y / (vertices.length / 2))
}
