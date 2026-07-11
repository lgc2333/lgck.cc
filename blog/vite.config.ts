import { defineConfig } from 'vite'

import { giscusThemePlugin } from './node/giscus-theme'

const giscusCssCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
}

export default defineConfig({
  preview: { headers: giscusCssCorsHeaders },
  plugins: [giscusThemePlugin()],
  server: {
    allowedHosts: true,
    headers: giscusCssCorsHeaders,
  },
})
