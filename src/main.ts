import { createApp } from 'vue'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

// normalize.css
import 'normalize.css/normalize.css'
// animate.css
import 'animate.css'
// 全局样式
import './assets/css/index.less'
// tailwindcss
import './assets/css/tailwind.css'

// import icons from './global/register-icons'

const app = createApp(App)
const head = createHead()
app.use(router)
app.use(pinia)
app.use(head)
// app.use(icons)

app.mount('#app')
