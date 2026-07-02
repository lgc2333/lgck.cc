import {
  calculateScaleFactor,
  cubicsToPath2D,
  morphSequence,
  processCubics,
} from './graphics'
import { indeterminatePolygons } from './material-shapes'

export interface M3LoadingIndicatorCanvasOptions {
  color?: string
  contained?: boolean
  containerColor?: string
  paused?: boolean
  speed?: number
}

export interface M3LoadingIndicatorCanvasController {
  destroy: () => void
  start: () => void
  update: (nextOptions: M3LoadingIndicatorCanvasOptions) => void
}

const CONTAINER_WIDTH = 48
const CONTAINER_HEIGHT = 48
const INDICATOR_SIZE = 38
const ACTIVE_INDICATOR_SCALE =
  INDICATOR_SIZE / Math.min(CONTAINER_WIDTH, CONTAINER_HEIGHT)
const GLOBAL_ROTATION_DURATION = 4666
const MORPH_INTERVAL = 650
const FULL_ROTATION = 360
const QUARTER_ROTATION = FULL_ROTATION / 4

const SPRING_DAMPING_RATIO = 0.6
const SPRING_STIFFNESS = 200

const polygons = indeterminatePolygons()
const sequence = morphSequence(polygons, true)
const shapesScaleFactor = calculateScaleFactor(polygons) * ACTIVE_INDICATOR_SCALE

export function createM3LoadingIndicatorCanvas(
  canvas: HTMLCanvasElement,
  options: M3LoadingIndicatorCanvasOptions = {},
): M3LoadingIndicatorCanvasController {
  let currentOptions = normalizeOptions(options)
  let animationFrame = 0
  let destroyed = false
  let running = false
  let startTime = performance.now()
  let pauseStartTime = 0
  let pausedDuration = 0

  const drawFrame = (timestamp: number) => {
    if (destroyed || !running) return

    if (!currentOptions.paused) {
      draw(
        canvas,
        currentOptions,
        (timestamp - startTime - pausedDuration) * currentOptions.speed,
      )
    }

    animationFrame = window.requestAnimationFrame(drawFrame)
  }

  const controller: M3LoadingIndicatorCanvasController = {
    destroy() {
      destroyed = true
      running = false
      window.cancelAnimationFrame(animationFrame)
    },
    start() {
      if (running || destroyed) return
      running = true
      startTime = performance.now()
      animationFrame = window.requestAnimationFrame(drawFrame)
    },
    update(nextOptions) {
      const wasPaused = currentOptions.paused
      currentOptions = normalizeOptions({ ...currentOptions, ...nextOptions })

      if (currentOptions.paused && !wasPaused) {
        pauseStartTime = performance.now()
      } else if (!currentOptions.paused && wasPaused) {
        pausedDuration += performance.now() - pauseStartTime
      }

      draw(
        canvas,
        currentOptions,
        (performance.now() - startTime - pausedDuration) * currentOptions.speed,
      )
    },
  }

  draw(canvas, currentOptions, 0)
  return controller
}

function draw(
  canvas: HTMLCanvasElement,
  options: Required<M3LoadingIndicatorCanvasOptions>,
  elapsedMs: number,
) {
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  const cssWidth = Math.max(1, rect.width || canvas.clientWidth || CONTAINER_WIDTH)
  const cssHeight = Math.max(1, rect.height || canvas.clientHeight || CONTAINER_HEIGHT)
  const width = Math.round(cssWidth * dpr)
  const height = Math.round(cssHeight * dpr)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssWidth, cssHeight)

  const side = Math.min(cssWidth, cssHeight)
  const left = (cssWidth - side) / 2
  const top = (cssHeight - side) / 2

  if (options.contained) {
    ctx.fillStyle = resolveCanvasColor(canvas, options.containerColor)
    ctx.beginPath()
    ctx.arc(cssWidth / 2, cssHeight / 2, side / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const morphCycle = Math.floor(elapsedMs / MORPH_INTERVAL)
  const currentMorphIndex = positiveModuloInt(morphCycle, sequence.length)
  const rawMorphProgress = springProgress((elapsedMs % MORPH_INTERVAL) / 1000)
  const morphProgress = clamp(rawMorphProgress, 0, 1)
  const bounceScale = 1 + Math.max(0, rawMorphProgress - morphProgress)
  const morphRotationTargetAngle = positiveModulo(
    (morphCycle + 1) * QUARTER_ROTATION,
    FULL_ROTATION,
  )
  const globalRotation = positiveModulo(
    (elapsedMs / GLOBAL_ROTATION_DURATION) * FULL_ROTATION,
    FULL_ROTATION,
  )
  const rotation =
    rawMorphProgress * QUARTER_ROTATION + morphRotationTargetAngle + globalRotation
  const cubics = processCubics(
    sequence[currentMorphIndex].asCubics(morphProgress),
    side,
    shapesScaleFactor * bounceScale,
  )
  const path = cubicsToPath2D(cubics, 0)

  ctx.save()
  ctx.translate(left + side / 2, top + side / 2)
  ctx.rotate((rotation / 180) * Math.PI)
  ctx.translate(-side / 2, -side / 2)
  ctx.fillStyle = resolveCanvasColor(canvas, options.color)
  ctx.fill(path)
  ctx.restore()
}

function springProgress(timeSeconds: number) {
  const dampingRatio = SPRING_DAMPING_RATIO
  const naturalFrequency = Math.sqrt(SPRING_STIFFNESS)
  const dampedFrequency = naturalFrequency * Math.sqrt(1 - dampingRatio * dampingRatio)
  const envelope = Math.exp(-dampingRatio * naturalFrequency * timeSeconds)
  const value =
    1 -
    envelope *
      (Math.cos(dampedFrequency * timeSeconds) +
        (dampingRatio / Math.sqrt(1 - dampingRatio * dampingRatio)) *
          Math.sin(dampedFrequency * timeSeconds))

  return value
}

function normalizeOptions(
  options: M3LoadingIndicatorCanvasOptions,
): Required<M3LoadingIndicatorCanvasOptions> {
  return {
    color: options.color || 'currentColor',
    contained: options.contained ?? false,
    containerColor: options.containerColor || 'transparent',
    paused: options.paused ?? false,
    speed: options.speed && options.speed > 0 ? options.speed : 1,
  }
}

function resolveCanvasColor(canvas: HTMLCanvasElement, value: string) {
  const colorProbe = document.createElement('span')
  colorProbe.style.color =
    value === 'currentColor' ? 'currentColor' : 'var(--lgc-canvas-color)'
  if (value !== 'currentColor') {
    colorProbe.style.setProperty('--lgc-canvas-color', value)
  }
  colorProbe.style.display = 'none'
  canvas.append(colorProbe)
  const resolved = window.getComputedStyle(colorProbe).color
  colorProbe.remove()
  return resolved || value
}

function positiveModulo(num: number, mod: number) {
  return ((num % mod) + mod) % mod
}

function positiveModuloInt(num: number, mod: number) {
  return ((num % mod) + mod) % mod
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
