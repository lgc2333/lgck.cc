import { describe, expect, it } from 'vitest'

import type { MaterialCustomColorsConfig } from '../types'
import {
  defaultMaterialColorsConfig,
  generateMaterialColorsCss,
} from './material-colors'

const customColorSlots = Object.keys(defaultMaterialColorsConfig.custom)

const overrideColors = ['#2196f3', '#795548', '#e91e63', '#9810fa', '#ff5722']

describe('material colors', () => {
  it('generates Material system and fixed custom color tokens', () => {
    const css = generateMaterialColorsCss()

    expect(readToken(css, ':root', '--md-sys-color-primary')).toMatchHexColor()
    expect(readToken(css, ':root', '--md-sys-color-surface-container')).toMatch(
      /^#[0-9a-f]{6}f3$/,
    )
    expect(readToken(css, 'html.dark', '--md-sys-color-primary')).toMatchHexColor()
    customColorSlots.forEach((slot) => {
      expect(readToken(css, ':root', `--md-custom-color-${slot}`)).toMatchHexColor()
      expect(readToken(css, ':root', `--md-custom-color-on-${slot}`)).toMatchHexColor()
      expect(
        readToken(css, ':root', `--md-custom-color-${slot}-container`),
      ).toMatchHexColor()
      expect(
        readToken(css, 'html.dark', `--md-custom-color-on-${slot}-container`),
      ).toMatchHexColor()
    })
  })

  it('changes generated roles when the scheme variant changes', () => {
    const tonalSpotCss = generateMaterialColorsCss({ variant: 'tonalSpot' })
    const expressiveCss = generateMaterialColorsCss({ variant: 'expressive' })

    expect(readToken(tonalSpotCss, ':root', '--md-sys-color-tertiary')).not.toBe(
      readToken(expressiveCss, ':root', '--md-sys-color-tertiary'),
    )
  })

  it('changes generated roles when the contrast level changes', () => {
    const standardCss = generateMaterialColorsCss({ contrastLevel: 0 })
    const highContrastCss = generateMaterialColorsCss({ contrastLevel: 1 })

    expect(readToken(standardCss, ':root', '--md-sys-color-primary')).not.toBe(
      readToken(highContrastCss, ':root', '--md-sys-color-primary'),
    )
  })

  it('uses the source color as the default blue custom color', () => {
    const defaultCss = generateMaterialColorsCss()
    const customSourceCss = generateMaterialColorsCss({ source: '#2e6f9f' })

    expect(readToken(customSourceCss, ':root', '--md-custom-color-blue')).not.toBe(
      readToken(defaultCss, ':root', '--md-custom-color-blue'),
    )
  })

  it('allows overriding fixed custom colors', () => {
    const defaultCss = generateMaterialColorsCss()
    const css = generateMaterialColorsCss({
      custom: createCustomColorOverrides(),
    })

    customColorSlots.forEach((slot) => {
      expect(readToken(css, ':root', `--md-custom-color-${slot}`)).toMatchHexColor()
      expect(readToken(css, ':root', `--md-custom-color-${slot}`)).not.toBe(
        readToken(defaultCss, ':root', `--md-custom-color-${slot}`),
      )
    })
  })

  it('rejects invalid config', () => {
    expect(() => generateMaterialColorsCss({ source: 'nope' })).toThrow(
      'themeConfig.colors.source must be a valid hex color',
    )
    expect(() => generateMaterialColorsCss({ contrastLevel: 2 })).toThrow(
      'themeConfig.colors.contrastLevel must be between -1 and 1',
    )
  })
})

function createCustomColorOverrides(): MaterialCustomColorsConfig {
  return Object.fromEntries(
    customColorSlots.map((slot, index) => [
      slot,
      {
        color: overrideColors[index % overrideColors.length],
        blend: false,
      },
    ]),
  ) as MaterialCustomColorsConfig
}

function readToken(css: string, selector: ':root' | 'html.dark', token: string) {
  const block = new RegExp(`${escapeRegExp(selector)} \\{(?<body>[\\s\\S]*?)\\}`).exec(
    css,
  )?.groups?.body

  if (!block) throw new Error(`Could not find ${selector} block.`)

  const value = new RegExp(
    `${escapeRegExp(token)}: (?<value>#[0-9a-f]{6}(?:[0-9a-f]{2})?);`,
  ).exec(block)?.groups?.value

  if (!value) throw new Error(`Could not find ${token} in ${selector}.`)

  return value
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

expect.extend({
  toMatchHexColor(received: string) {
    const pass = /^#[0-9a-f]{6}$/.test(received)

    return {
      pass,
      message: () => `expected ${received} to be a lowercase hex color`,
    }
  },
})

declare module 'vitest' {
  interface Assertion {
    toMatchHexColor: () => void
  }
}
