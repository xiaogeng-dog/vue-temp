import { createProdMockServer } from 'vite-plugin-mock/client'
type Recordable<T = any> = Record<string, T>
// 问题描述
// 1. `import.meta.globEager` 已被弃用, 需要升级vite版本,有兼容问题
// 2. `vite-plugin-mock` 插件问题 https://github.com/vbenjs/vite-plugin-mock/issues/56

// const modules: Record<string, any> = import.meta.glob("./**/*.ts", {
//   import: "default",
//   eager: true,
// });

// const mockModules = Object.keys(modules).reduce((pre, key) => {
//   if (!key.includes("/_")) {
//     pre.push(...modules[key]);
//   }
//   return pre;
// }, [] as any[]);

// 逐一导入您的mock.ts文件
// 如果使用vite.mock.config.ts，只需直接导入文件
// 可以使用 import.meta.glob功能来进行全部导入
console.log(JSON.stringify(import.meta))
const modules = import.meta.glob('./**/*.ts', { eager: true })

const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return
  }
  mockModules.push(...(modules as Recordable)[key].default)
})

export function setupProdMockServer() {
  createProdMockServer([mockModules])
}
