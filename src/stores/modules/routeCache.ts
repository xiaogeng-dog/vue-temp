import { defineStore } from 'pinia'
import type { RouteRecordName } from 'vue-router'
import type { EnhancedRouteLocation } from '@/router/types'

interface RouteStore {
  // 鉴权令牌
  routeCaches: RouteRecordName[]
}

export const useRouteCacheStore = defineStore('routeCacheStore', {
  state: (): RouteStore => ({
    routeCaches: []
  }),
  actions: {
    addRoute(route: EnhancedRouteLocation) {
      if (this.routeCaches.includes(route.name)) return
      if (route?.meta?.keepAlive) this.routeCaches.push(route.name)
    },
    delRoute(route: EnhancedRouteLocation) {
      const index = this.routeCaches.indexOf(route.name)
      if (index > -1) {
        this.routeCaches.splice(index, 1)
      }
    },
    delAllRoutes() {
      this.routeCaches = []
    }
  }
})
