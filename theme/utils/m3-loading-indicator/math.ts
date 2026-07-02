import type { Point } from './types'

export const PI = Math.PI
export const TWO_PI = PI * 2
export const DISTANCE_EPSILON = 1e-4
export const ANGLE_EPSILON = 1e-6

export function point(x: number, y: number): Point {
  return { x, y }
}

export function add(a: Point, b: Point) {
  return point(a.x + b.x, a.y + b.y)
}

export function subtract(a: Point, b: Point) {
  return point(a.x - b.x, a.y - b.y)
}

export function multiply(a: Point, value: number) {
  return point(a.x * value, a.y * value)
}

export function divide(a: Point, value: number) {
  return point(a.x / value, a.y / value)
}

export function dot(a: Point, b: Point) {
  return a.x * b.x + a.y * b.y
}

export function distance(x: number, y: number) {
  return Math.sqrt(x * x + y * y)
}

export function distanceSquared(x: number, y: number) {
  return x * x + y * y
}

export function length(a: Point) {
  return distance(a.x, a.y)
}

export function lengthSquared(a: Point) {
  return distanceSquared(a.x, a.y)
}

export function direction(a: Point) {
  const d = length(a)
  return divide(a, d)
}

export function directionVector(x: number, y: number): Point {
  const d = distance(x, y)
  return point(x / d, y / d)
}

export function radialToCartesian(
  radius: number,
  angleRadians: number,
  center = point(0, 0),
) {
  return add(
    multiply(point(Math.cos(angleRadians), Math.sin(angleRadians)), radius),
    center,
  )
}

export function rotate90(p: Point) {
  return point(-p.y, p.x)
}

export function interpolatePoint(start: Point, stop: Point, fraction: number) {
  return point(lerp(start.x, stop.x, fraction), lerp(start.y, stop.y, fraction))
}

export function lerp(start: number, stop: number, fraction: number) {
  return (1 - fraction) * start + fraction * stop
}

export function square(value: number) {
  return value * value
}

export function positiveModulo(num: number, mod: number) {
  return ((num % mod) + mod) % mod
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function degreesToRadians(degrees: number) {
  return (degrees / 360) * TWO_PI
}

export function radiansToDegrees(radians: number) {
  return (radians * 180) / PI
}

export function convex(previous: Point, current: Point, next: Point) {
  const a = subtract(current, previous)
  const b = subtract(next, current)
  return a.x * b.y - a.y * b.x > 0
}

export function progressInRange(
  progress: number,
  progressFrom: number,
  progressTo: number,
) {
  return progressTo >= progressFrom
    ? progress >= progressFrom && progress <= progressTo
    : progress >= progressFrom || progress <= progressTo
}

export function progressDistance(p1: number, p2: number) {
  const distance = Math.abs(p1 - p2)
  return Math.min(distance, 1 - distance)
}

export function sortedInsertionIndex(mapping: number[][], value: number) {
  let low = 0
  let high = mapping.length

  while (low < high) {
    const mid = (low + high) >> 1
    if (mapping[mid][0] < value) low = mid + 1
    else high = mid
  }

  return low
}

export function lineIntersection(p0: Point, d0: Point, p1: Point, d1: Point) {
  const rotatedD1 = rotate90(d1)
  const den = dot(d0, rotatedD1)
  if (Math.abs(den) < DISTANCE_EPSILON) return undefined

  const num = dot(subtract(p1, p0), rotatedD1)
  if (Math.abs(den) < DISTANCE_EPSILON * Math.abs(num)) return undefined

  return add(p0, multiply(d0, num / den))
}
