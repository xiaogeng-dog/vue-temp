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
import './utils/flexible'

const keepAliveRouteNames = computed(() => {
  return useRouteCacheStore().routeCaches as string[]
})

useTitle()
</script>

<style lang="less" scoped>
.app-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;

  /* 隐藏浏览器自带的滚动条 */
  ::-webkit-scrollbar {
    width: 0; /* 调整滚动条宽度 */
  }

  ::-webkit-scrollbar-track {
    background-color: transparent; /* 设置滚动条轨道背景色为透明 */
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2); /* 设置滚动条滑块颜色 */
    border-radius: 0.25em; /* 设置滚动条滑块圆角 */
  }

  /* 显示页面内的滚动条 */
  .scrollable-content {
    overflow-y: auto; /* 启用垂直滚动条 */
  }
}
</style>
