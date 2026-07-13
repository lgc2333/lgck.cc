import { defineValaxyAddon } from 'valaxy'

import type { GiscusOptions } from '../types'

export const name = 'valaxy-addon-giscus'

export const addonGiscus = defineValaxyAddon<GiscusOptions>((options) => ({
  name,
  enable: true,
  options,
}))
