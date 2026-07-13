import { defineConfig } from 'vite'

import { giscusFontPlugin } from './node/giscus-font'
import { giscusThemePlugin } from './node/giscus-theme'

const giscusCssCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
}

export default defineConfig({
  preview: { headers: giscusCssCorsHeaders },
  plugins: [giscusFontPlugin(), giscusThemePlugin()],
  server: {
    allowedHosts: true,
    headers: giscusCssCorsHeaders,
  },
})
