import { defineValaxyConfig } from 'valaxy'

export default defineValaxyConfig({
  vite: {
    optimizeDeps: {
      include: ['@giscus/vue'],
    },
  },
})
