import { Cubic } from './geometry'
import {
  ANGLE_EPSILON,
  DISTANCE_EPSILON,
  clamp,
  length,
  lengthSquared,
  positiveModulo,
  progressDistance,
  progressInRange,
  sortedInsertionIndex,
  subtract,
} from './math'
import type { RoundedPolygon } from './rounded-polygon'
import type {
  Feature,
  MeasuredCubic,
  MeasuredPolygon,
  ProgressableFeature,
} from './types'

export class Morph {
  morphMatch: Array<[Cubic, Cubic]>

  constructor(start: RoundedPolygon, end: RoundedPolygon) {
    this.morphMatch = match(start, end)
  }

  asCubics(progress: number) {
    const cubics: Cubic[] = []
    let firstCubic: Cubic | undefined
    let lastCubic: Cubic | undefined

    for (const [start, end] of this.morphMatch) {
      const cubic = new Cubic(
        ...(start.points.map(
          (value, index) => (1 - progress) * value + progress * end.points[index],
        ) as [number, number, number, number, number, number, number, number]),
      )

      firstCubic ||= cubic
      if (lastCubic) cubics.push(lastCubic)
      lastCubic = cubic
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
    }

    return cubics
  }
}

export function morphSequence(polygons: RoundedPolygon[], circularSequence: boolean) {
  const sequence: Morph[] = []

  for (let i = 0; i < polygons.length; i++) {
    if (i + 1 < polygons.length) {
      sequence.push(new Morph(polygons[i].normalized(), polygons[i + 1].normalized()))
    } else if (circularSequence) {
      sequence.push(new Morph(polygons[i].normalized(), polygons[0].normalized()))
    }
  }

  return sequence
}

function match(p1: RoundedPolygon, p2: RoundedPolygon) {
  const measuredPolygon1 = measurePolygon(p1)
  const measuredPolygon2 = measurePolygon(p2)
  const doubleMapper = featureMapper(
    measuredPolygon1.features,
    measuredPolygon2.features,
  )
  const polygon2CutPoint = doubleMapper.map(0)
  const bs1 = measuredPolygon1
  const bs2 = cutAndShift(measuredPolygon2, polygon2CutPoint)
  const result: Array<[Cubic, Cubic]> = []

  let i1 = 0
  let i2 = 0
  let b1: MeasuredCubic | undefined = bs1.cubics[i1++]
  let b2: MeasuredCubic | undefined = bs2.cubics[i2++]

  while (b1 && b2) {
    const b1a = i1 === bs1.cubics.length ? 1 : b1.endOutlineProgress
    const b2a =
      i2 === bs2.cubics.length
        ? 1
        : doubleMapper.mapBack(
            positiveModulo(b2.endOutlineProgress + polygon2CutPoint, 1),
          )
    const minb = Math.min(b1a, b2a)

    let seg1 = b1
    let seg2 = b2

    if (b1a > minb + ANGLE_EPSILON) {
      const split = cutAtProgress(b1, minb)
      seg1 = split[0]
      b1 = split[1]
    } else {
      b1 = bs1.cubics[i1++]
    }

    if (b2a > minb + ANGLE_EPSILON) {
      const split = cutAtProgress(
        b2,
        positiveModulo(doubleMapper.map(minb) - polygon2CutPoint, 1),
      )
      seg2 = split[0]
      b2 = split[1]
    } else {
      b2 = bs2.cubics[i2++]
    }

    result.push([seg1.cubic, seg2.cubic])
  }

  return result
}

function measurePolygon(polygon: RoundedPolygon): MeasuredPolygon {
  const cubics: Cubic[] = []
  const featureToCubic: Array<[Feature, number]> = []

  for (const feature of polygon.features) {
    for (let cubicIndex = 0; cubicIndex < feature.cubics.length; cubicIndex++) {
      if (
        feature.type === 'corner' &&
        cubicIndex === Math.floor(feature.cubics.length / 2)
      ) {
        featureToCubic.push([feature, cubics.length])
      }
      cubics.push(feature.cubics[cubicIndex])
    }
  }

  const measures = [0]
  for (const cubic of cubics) {
    measures.push(measures[measures.length - 1] + measureCubic(cubic))
  }

  const totalMeasure = measures[measures.length - 1]
  const outlineProgress = measures.map((measure) => measure / totalMeasure)
  const features = featureToCubic.map(([feature, ix]) => ({
    feature,
    progress: positiveModulo((outlineProgress[ix] + outlineProgress[ix + 1]) / 2, 1),
  }))

  return createMeasuredPolygon(features, cubics, outlineProgress)
}

function createMeasuredPolygon(
  features: ProgressableFeature[],
  cubics: Cubic[],
  outlineProgress: number[],
): MeasuredPolygon {
  const measuredCubics: MeasuredCubic[] = []
  let startOutlineProgress = 0

  for (let i = 0; i < cubics.length; i++) {
    if (outlineProgress[i + 1] - outlineProgress[i] > DISTANCE_EPSILON) {
      measuredCubics.push({
        cubic: cubics[i],
        endOutlineProgress: outlineProgress[i + 1],
        measuredSize: measureCubic(cubics[i]),
        startOutlineProgress,
      })
      startOutlineProgress = outlineProgress[i + 1]
    }
  }

  measuredCubics[measuredCubics.length - 1].endOutlineProgress = 1
  return { cubics: measuredCubics, features }
}

function cutAndShift(polygon: MeasuredPolygon, cuttingPoint: number): MeasuredPolygon {
  if (cuttingPoint < DISTANCE_EPSILON) return polygon

  const targetIndex = polygon.cubics.findIndex(
    (cubic) =>
      cuttingPoint >= cubic.startOutlineProgress &&
      cuttingPoint <= cubic.endOutlineProgress,
  )
  const target = polygon.cubics[targetIndex]
  const [b1, b2] = cutAtProgress(target, cuttingPoint)
  const retCubics = [b2.cubic]

  for (let i = 1; i < polygon.cubics.length; i++) {
    retCubics.push(polygon.cubics[(i + targetIndex) % polygon.cubics.length].cubic)
  }
  retCubics.push(b1.cubic)

  const retOutlineProgress = Array.from(
    { length: polygon.cubics.length + 2 },
    (_, index) => {
      if (index === 0) return 0
      if (index === polygon.cubics.length + 1) return 1
      const cubicIndex = (targetIndex + index - 1) % polygon.cubics.length
      return positiveModulo(
        polygon.cubics[cubicIndex].endOutlineProgress - cuttingPoint,
        1,
      )
    },
  )
  const features = polygon.features.map((feature) => ({
    feature: feature.feature,
    progress: positiveModulo(feature.progress - cuttingPoint, 1),
  }))

  return createMeasuredPolygon(features, retCubics, retOutlineProgress)
}

function cutAtProgress(
  cubic: MeasuredCubic,
  cutOutlineProgress: number,
): [MeasuredCubic, MeasuredCubic] {
  const boundedCutOutlineProgress = clamp(
    cutOutlineProgress,
    cubic.startOutlineProgress,
    cubic.endOutlineProgress,
  )
  const outlineProgressSize = cubic.endOutlineProgress - cubic.startOutlineProgress
  const relativeProgress =
    (boundedCutOutlineProgress - cubic.startOutlineProgress) / outlineProgressSize
  const t = findCubicCutPoint(cubic.cubic, relativeProgress * cubic.measuredSize)
  const [c1, c2] = cubic.cubic.split(t)

  return [
    {
      cubic: c1,
      endOutlineProgress: boundedCutOutlineProgress,
      measuredSize: measureCubic(c1),
      startOutlineProgress: cubic.startOutlineProgress,
    },
    {
      cubic: c2,
      endOutlineProgress: cubic.endOutlineProgress,
      measuredSize: measureCubic(c2),
      startOutlineProgress: boundedCutOutlineProgress,
    },
  ]
}

function measureCubic(cubic: Cubic) {
  return closestProgressTo(cubic, Number.POSITIVE_INFINITY)[1]
}

function findCubicCutPoint(cubic: Cubic, measure: number) {
  return closestProgressTo(cubic, measure)[0]
}

function closestProgressTo(cubic: Cubic, threshold: number): [number, number] {
  const segments = 3
  let total = 0
  let remainder = threshold
  let prev = { x: cubic.anchor0X, y: cubic.anchor0Y }

  for (let i = 1; i <= segments; i++) {
    const progress = i / segments
    const next = cubic.pointOnCurve(progress)
    const segment = length(subtract(next, prev))

    if (segment >= remainder) {
      return [progress - (1 - remainder / segment) / segments, threshold]
    }

    remainder -= segment
    total += segment
    prev = next
  }

  return [1, total]
}

function featureMapper(
  features1: ProgressableFeature[],
  features2: ProgressableFeature[],
) {
  const filteredFeatures1 = features1.filter(
    (feature) => feature.feature.type === 'corner',
  )
  const filteredFeatures2 = features2.filter(
    (feature) => feature.feature.type === 'corner',
  )
  const mapping = doMapping(filteredFeatures1, filteredFeatures2)
  return new DoubleMapper(mapping)
}

function doMapping(features1: ProgressableFeature[], features2: ProgressableFeature[]) {
  const distanceVertexList = features1
    .flatMap((f1) =>
      features2.map((f2) => ({
        distance: featureDistSquared(f1.feature, f2.feature),
        f1,
        f2,
      })),
    )
    .filter((item) => item.distance !== Number.MAX_VALUE)
    .sort((a, b) => a.distance - b.distance)

  if (distanceVertexList.length === 0) {
    return [
      [0, 0],
      [0.5, 0.5],
    ]
  }
  if (distanceVertexList.length === 1) {
    const f1 = distanceVertexList[0].f1.progress
    const f2 = distanceVertexList[0].f2.progress
    return [
      [f1, f2],
      [(f1 + 0.5) % 1, (f2 + 0.5) % 1],
    ]
  }

  const helper = new MappingHelper()
  distanceVertexList.forEach((item) => helper.addMapping(item.f1, item.f2))
  return helper.mapping
}

class MappingHelper {
  mapping: number[][] = []
  private usedF1 = new Set<ProgressableFeature>()
  private usedF2 = new Set<ProgressableFeature>()

  addMapping(f1: ProgressableFeature, f2: ProgressableFeature) {
    if (this.usedF1.has(f1) || this.usedF2.has(f2)) return

    const insertionIndex = sortedInsertionIndex(this.mapping, f1.progress)
    const n = this.mapping.length

    if (n >= 1) {
      const before = this.mapping[(insertionIndex + n - 1) % n]
      const after = this.mapping[insertionIndex % n]

      if (
        progressDistance(f1.progress, before[0]) < DISTANCE_EPSILON ||
        progressDistance(f1.progress, after[0]) < DISTANCE_EPSILON ||
        progressDistance(f2.progress, before[1]) < DISTANCE_EPSILON ||
        progressDistance(f2.progress, after[1]) < DISTANCE_EPSILON
      ) {
        return
      }

      if (n > 1 && !progressInRange(f2.progress, before[1], after[1])) return
    }

    this.mapping.splice(insertionIndex, 0, [f1.progress, f2.progress])
    this.usedF1.add(f1)
    this.usedF2.add(f2)
  }
}

class DoubleMapper {
  sourceValues: number[]
  targetValues: number[]

  constructor(mappings: number[][]) {
    this.sourceValues = mappings.map((mapping) => mapping[0])
    this.targetValues = mappings.map((mapping) => mapping[1])
  }

  map(x: number) {
    return linearMap(this.sourceValues, this.targetValues, x)
  }

  mapBack(x: number) {
    return linearMap(this.targetValues, this.sourceValues, x)
  }
}

function featureDistSquared(f1: Feature, f2: Feature) {
  if (f1.type === 'corner' && f2.type === 'corner' && f1.convex !== f2.convex) {
    return Number.MAX_VALUE
  }

  return lengthSquared(
    subtract(featureRepresentativePoint(f1), featureRepresentativePoint(f2)),
  )
}

function featureRepresentativePoint(feature: Feature) {
  return {
    x:
      (feature.cubics[0].anchor0X +
        feature.cubics[feature.cubics.length - 1].anchor1X) /
      2,
    y:
      (feature.cubics[0].anchor0Y +
        feature.cubics[feature.cubics.length - 1].anchor1Y) /
      2,
  }
}

function linearMap(xValues: number[], yValues: number[], x: number) {
  const segmentStartIndex = xValues.findIndex((value, index) =>
    progressInRange(x, value, xValues[(index + 1) % xValues.length]),
  )
  const segmentEndIndex = (segmentStartIndex + 1) % xValues.length
  const segmentSizeX = positiveModulo(
    xValues[segmentEndIndex] - xValues[segmentStartIndex],
    1,
  )
  const segmentSizeY = positiveModulo(
    yValues[segmentEndIndex] - yValues[segmentStartIndex],
    1,
  )
  const positionInSegment =
    segmentSizeX < 0.001
      ? 0.5
      : positiveModulo(x - xValues[segmentStartIndex], 1) / segmentSizeX

  return positiveModulo(
    yValues[segmentStartIndex] + segmentSizeY * positionInSegment,
    1,
  )
}
