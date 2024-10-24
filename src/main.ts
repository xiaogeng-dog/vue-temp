import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'
// 引入状态管理
import { setupStore } from '@/stores'
// 路由
import router, { setupRouter } from '@/router'

// normalize.css
import 'normalize.css/normalize.css'
// animate.css
import 'animate.css'
// 全局样式
import './assets/css/index.less'
// tailwindcss
import './assets/css/tailwind.css'

import Logger from '@/utils/Logger'

// import icons from './global/register-icons'
// 创建实例
const setupAll = async () => {
  const app = createApp(App)
  const head = createHead()

  setupStore(app)
  setupRouter(app)
  await setupI18n(app)

  await router.isReady()

  app.use(head)
  app.mount('#app')
}

// app.use(icons)

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
