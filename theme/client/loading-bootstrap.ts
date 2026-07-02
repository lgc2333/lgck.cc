import { createM3LoadingIndicatorCanvas } from '../utils/m3-loading-indicator'
import type {
  M3LoadingIndicatorCanvasController,
  M3LoadingIndicatorCanvasOptions,
} from '../utils/m3-loading-indicator'

const SELECTOR = '[data-lgc-loading-indicator="boot"]'

declare global {
  interface Window {
    __lgcLoadingIndicator?: {
      canvas: HTMLCanvasElement
      controller: M3LoadingIndicatorCanvasController
    }
    __lgcLoadingIndicatorRuntime?: {
      create: (
        canvas: HTMLCanvasElement,
        options?: M3LoadingIndicatorCanvasOptions,
      ) => M3LoadingIndicatorCanvasController
    }
  }
}

let bootingCanvas: HTMLCanvasElement | undefined

window.__lgcLoadingIndicatorRuntime = {
  create: createM3LoadingIndicatorCanvas,
}

function startLoadingIndicator() {
  const canvas = document.querySelector<HTMLCanvasElement>(SELECTOR)
  if (!canvas) return false
  if (window.__lgcLoadingIndicator?.canvas === canvas) return true
  if (bootingCanvas === canvas) return true

  bootingCanvas = canvas

  if (!canvas.isConnected) return false
  if (window.__lgcLoadingIndicator?.canvas === canvas) return true

  const controller = createM3LoadingIndicatorCanvas(canvas, {
    color: 'var(--md-sys-color-on-primary-container)',
    contained: true,
    containerColor: 'var(--md-sys-color-primary-container)',
  })

  controller.start()
  window.__lgcLoadingIndicator = {
    canvas,
    controller,
  }

  return true
}

let observer: MutationObserver | undefined

function tryStartLoadingIndicator() {
  if (startLoadingIndicator()) observer?.disconnect()
}

tryStartLoadingIndicator()

if (document.readyState === 'loading') {
  observer = new MutationObserver(tryStartLoadingIndicator)

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })

  document.addEventListener(
    'DOMContentLoaded',
    () => {
      tryStartLoadingIndicator()
      observer?.disconnect()
    },
    { once: true },
  )
}
