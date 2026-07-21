import { resolve } from 'node:path'
import process from 'node:process'

import { normalizePath } from 'vite'
import { afterEach, describe, expect, it } from 'vitest'

import { resolveConfiguredFontPath } from './fonts'

const originalCwd = process.cwd()

describe('theme font path resolution', () => {
  afterEach(() => {
    process.chdir(originalCwd)
  })

  it('keeps absolute paths as filesystem paths', () => {
    const fontPath = resolve(originalCwd, 'theme/assets/fonts')

    expect(resolveConfiguredFontPath(fontPath)).toBe(normalizePath(fontPath))
  })

  it('resolves relative paths from the current working directory', () => {
    const cwd = resolve(originalCwd, 'site')
    process.chdir(cwd)

    expect(resolveConfiguredFontPath('public/fonts')).toBe(
      normalizePath(resolve(cwd, 'public/fonts')),
    )
  })
})
