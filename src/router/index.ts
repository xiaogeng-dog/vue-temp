import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import NProgress from '@/utils/progress'
import type { EnhancedRouteLocation } from './types'
import { isLogin } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  // 自动路由已配置
  routes
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

router.beforeEach(async (to: EnhancedRouteLocation, _from, next) => {
  NProgress.start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useAuthStore()

  // Route cache
  routeCacheStore.addRoute(to)

  if (isLogin() && !userStore.userInfo?.uid) await userStore.info()

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
