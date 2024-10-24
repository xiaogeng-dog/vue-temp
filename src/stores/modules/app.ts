import { defineStore } from 'pinia'

type ConfigProviderTheme = 'dark' | 'light'

interface AppStore {
  theme: ConfigProviderTheme
}

const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const useAppStore = defineStore('appStore', {
  state: (): AppStore => ({
    theme: prefersDark ? 'dark' : 'light'
  }),
  actions: {
    switchMode(val: ConfigProviderTheme) {
      this.theme = val
    }
  }
})
