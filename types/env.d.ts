/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
declare module '*.mjs'

interface Window {
  arcgisMapService?: import('@/hooks/arcgis/BaseService').BaseService
}
