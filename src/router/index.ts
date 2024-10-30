import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import remainingRouter from './modules/remaining'

import { useNProgress } from '@/hooks/web/useNProgress'
import type { EnhancedRouteLocation } from './types'
import { isLogin } from '@/utils/auth'

const { start, done } = useNProgress()

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  strict: true,
  routes: remainingRouter as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach(async (to: EnhancedRouteLocation, _from, next) => {
  start()

  const routeCacheStore = useRouteCacheStore()
  const userStore = useAuthStore()

  // Route cache
  routeCacheStore.addRoute(to)

  if (isLogin() && !userStore.userInfo?.uid) await userStore.info()

  next()
})

router.afterEach(() => {
  done()
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      if (router.hasRoute(name)) {
        router.removeRoute(name)
      }
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
