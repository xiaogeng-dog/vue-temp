import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

const store = createPinia()
store.use(piniaPluginPersistedstate)

export const setupStore = (app: App<Element>) => {
  // 1.use的pinia
  app.use(store)
}

export { store }
