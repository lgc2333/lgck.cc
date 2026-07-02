import type { Cubic } from './geometry'

export interface Point {
  x: number
  y: number
}

export interface CornerRounding {
  radius: number
  smoothing: number
}

export type Feature =
  | { cubics: Cubic[]; convex: boolean; type: 'corner' }
  | { cubics: Cubic[]; type: 'edge' }

export interface ProgressableFeature {
  feature: Feature
  progress: number
}

export interface MeasuredCubic {
  cubic: Cubic
  endOutlineProgress: number
  measuredSize: number
  startOutlineProgress: number
}

export interface MeasuredPolygon {
  cubics: MeasuredCubic[]
  features: ProgressableFeature[]
}
