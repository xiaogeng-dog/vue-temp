let MAIN_BASE_URL = ''

if (import.meta.env.PROD) {
  // 生产环境
  MAIN_BASE_URL = import.meta.env.VITE_SERVE + '/com-djld-platform/djld-platform/'
} else {
  // 开发环境
  MAIN_BASE_URL = import.meta.env.VITE_APP_BASE_API + '/com-djld-platform/djld-platform/'
}

export const TIME_OUT = 1000000
export { MAIN_BASE_URL }
