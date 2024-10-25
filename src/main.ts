import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'
// 引入状态管理
import { setupStore } from '@/stores'

// normalize.css
import 'normalize.css/normalize.css'
// 引入动画
import '@/plugins/animate.css'
// 全局样式
import './assets/css/index.less'
// tailwindcss
import './assets/css/tailwind.css'

// 路由
import router, { setupRouter } from '@/router'
// 指令
import { setupAuth, setupMountedFocus } from '@/directives'

import Logger from '@/utils/Logger'

// import icons from './global/register-icons'
import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患

// 创建实例
const setupAll = async () => {
  const app = createApp(App)
  const head = createHead()

  setupStore(app)
  setupRouter(app)
  await setupI18n(app)

  // directives 指令
  setupAuth(app)
  setupMountedFocus(app)

  await router.isReady()

  app.use(head)

  app.use(VueDOMPurifyHTML)

  app.mount('#app')
}

// app.use(icons)

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
