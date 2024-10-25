import { defineStore } from 'pinia'

type ConfigProviderTheme = 'dark' | 'light'

interface AppStore {
  theme: ConfigProviderTheme
  pageLoading: boolean
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useAppStore = defineStore('appStore', {
  state: (): AppStore => ({
    theme: prefersDark ? 'dark' : 'light',
    pageLoading: false // 路由跳转loading
  }),
  actions: {
    switchMode(val: ConfigProviderTheme) {
      this.theme = val
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading
    }
  }
})
