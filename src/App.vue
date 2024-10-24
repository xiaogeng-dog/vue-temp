<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component, route }">
      <section class="app-wrapper">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" :key="route.name" />
        </keep-alive>
      </section>
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useTitle } from '@/hooks/web/useTitle'
import { RouterView } from 'vue-router'
import useAutoThemeSwitcher from '@/hooks/useAutoThemeSwitcher'
import './utils/flexible'

useHead({
  meta: [
    {
      name: 'description',
      content: 'Vue + Vite H5 Starter Template'
    },
    {
      name: 'theme-color',
      content: () => (isDark.value ? '#00aba9' : '#ffffff')
    }
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => (preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg')
    }
  ]
})
console.log(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
const appStore = useAppStore()
// const { mode } = storeToRefs(appStore)

const { initializeThemeSwitcher } = useAutoThemeSwitcher(appStore)

const keepAliveRouteNames = computed(() => {
  return useRouteCacheStore().routeCaches as string[]
})
onMounted(() => {
  initializeThemeSwitcher()
  useTitle()
})
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
