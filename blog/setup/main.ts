import { defineAppSetup } from 'valaxy'

import { install as installGtag } from './gtag'

export default defineAppSetup(async (ctx) => {
  installGtag(ctx)
})
