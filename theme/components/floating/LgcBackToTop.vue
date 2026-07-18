<script lang="ts" setup>
import { useBackToTop } from 'valaxy'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { show, percentage, backToTop } = useBackToTop({ offset: 100 })

const progressCanvasRef = ref<HTMLCanvasElement>()
const progressFallbackSize = 56
const progressStrokeWidth = 3
const progressCornerRadius = 16
const progressInset = progressStrokeWidth / 2
const progressRadius = progressCornerRadius - progressInset

let progressFrame: number | undefined
let stopShowWatch: (() => void) | undefined

function getClampedProgress() {
  const progress = Number.isFinite(percentage.value) ? percentage.value : 0
  return Math.min(Math.max(progress, 0), 1)
}

function getProgressPerimeter(width: number, height: number, radius: number) {
  return 2 * (width + height - 4 * radius) + 2 * Math.PI * radius
}

function drawProgressPath(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  const innerWidth = Math.max(width - progressStrokeWidth, 0)
  const innerHeight = Math.max(height - progressStrokeWidth, 0)

  if (innerWidth <= 0 || innerHeight <= 0 || progress <= 0) return

  const radius = Math.min(progressRadius, innerWidth / 2, innerHeight / 2)
  const perimeter = getProgressPerimeter(innerWidth, innerHeight, radius)
  const x0 = progressInset
  const y0 = progressInset
  const x1 = x0 + innerWidth
  const y1 = y0 + innerHeight
  const xMid = x0 + innerWidth / 2

  context.beginPath()
  context.moveTo(xMid, y0)
  context.setLineDash(progress >= 1 ? [] : [perimeter * progress, perimeter])
  context.lineDashOffset = 0

  if (radius <= 0) {
    context.lineTo(x1, y0)
    context.lineTo(x1, y1)
    context.lineTo(x0, y1)
    context.lineTo(x0, y0)
    progress >= 1 ? context.closePath() : context.lineTo(xMid, y0)
    return
  }

  context.lineTo(x1 - radius, y0)
  context.arc(x1 - radius, y0 + radius, radius, -Math.PI / 2, 0)
  context.lineTo(x1, y1 - radius)
  context.arc(x1 - radius, y1 - radius, radius, 0, Math.PI / 2)
  context.lineTo(x0 + radius, y1)
  context.arc(x0 + radius, y1 - radius, radius, Math.PI / 2, Math.PI)
  context.lineTo(x0, y0 + radius)
  context.arc(x0 + radius, y0 + radius, radius, Math.PI, Math.PI * 1.5)

  progress >= 1 ? context.closePath() : context.lineTo(xMid, y0)
}

function drawProgressCanvas() {
  const canvas = progressCanvasRef.value
  if (!canvas) return

  const context = canvas.getContext('2d')
  if (!context) return

  const rect = canvas.getBoundingClientRect()
  const width = rect.width || progressFallbackSize
  const height = rect.height || progressFallbackSize
  const pixelRatio = Math.max(window.devicePixelRatio || 1, 1)
  const canvasWidth = Math.max(Math.ceil(width * pixelRatio), 1)
  const canvasHeight = Math.max(Math.ceil(height * pixelRatio), 1)

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  }

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  const progress = getClampedProgress()
  if (progress <= 0) return

  context.strokeStyle = window.getComputedStyle(canvas).color
  context.lineWidth = progressStrokeWidth
  context.lineCap = 'round'
  context.lineJoin = 'round'

  drawProgressPath(context, width, height, progress)
  context.stroke()
  context.setLineDash([])
}

function startProgressLoop() {
  if (progressFrame !== undefined) return

  const tick = () => {
    drawProgressCanvas()

    if (!show.value) {
      progressFrame = undefined
      return
    }

    progressFrame = window.requestAnimationFrame(tick)
  }

  drawProgressCanvas()
  progressFrame = window.requestAnimationFrame(tick)
}

function stopProgressLoop() {
  if (progressFrame === undefined) return

  window.cancelAnimationFrame(progressFrame)
  progressFrame = undefined
}

onMounted(() => {
  stopShowWatch = watch(
    show,
    async (isShown) => {
      if (!isShown) {
        stopProgressLoop()
        return
      }

      await nextTick()
      startProgressLoop()
    },
    { immediate: true },
  )
})

onBeforeUnmount(() => {
  stopShowWatch?.()
  stopProgressLoop()
})
</script>

<template>
  <LgcFloatingActionButton
    :show="show"
    :label="t('sidebar.return_top')"
    @click="backToTop"
  >
    <template #chrome>
      <canvas
        ref="progressCanvasRef"
        w="full"
        h="full"
        pointer-events-none
        inset-0
        absolute
        aria-hidden="true"
      />
    </template>

    <template #detail>
      <span font="900" text="$md-sys-color-on-surface" whitespace="nowrap">
        {{ t('sidebar.return_top') }}
      </span>
    </template>

    <span i-material-symbols-keyboard-arrow-up-rounded aria-hidden="true" />
  </LgcFloatingActionButton>
</template>
