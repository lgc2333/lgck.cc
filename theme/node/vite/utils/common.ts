import type { ServerResponse } from 'node:http'
import { extname } from 'node:path'

export function resolveAssetUrl(base: string, assetPath: string) {
  const fileName = assetPath.replace(/^\//, '')
  if (!base || base === './') return `./${fileName}`

  return `${base.replace(/\/$/, '')}/${fileName}`
}

export function setCssCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'text/css; charset=utf-8')
}

export function setFontCorsHeaders(res: ServerResponse, contentType = 'font/woff2') {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', contentType)
}

export function getFontContentType(filePath: string) {
  switch (extname(filePath).toLowerCase()) {
    case '.eot':
      return 'application/vnd.ms-fontobject'
    case '.otf':
      return 'font/otf'
    case '.svg':
      return 'image/svg+xml'
    case '.ttc':
    case '.ttf':
      return 'font/ttf'
    case '.woff':
      return 'font/woff'
    case '.woff2':
      return 'font/woff2'
    default:
      return 'application/octet-stream'
  }
}
