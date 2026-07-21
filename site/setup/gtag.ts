import type { UserModule } from 'valaxy'
import VueGtag, { trackRouter } from 'vue-gtag-next'

export const install: UserModule = ({ isClient, app, router }) => {
  if (!isClient) return
  app.use(VueGtag, { property: { id: 'G-MYZN4JS1C5' } })
  trackRouter(router)
}
