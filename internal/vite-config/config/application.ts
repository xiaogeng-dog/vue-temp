import { resolve } from 'node:path'

import dayjs from 'dayjs'
import { readPackageJSON } from 'pkg-types'
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { commonConfig } from './common'

interface DefineOptions {
  overrides?: UserConfig
  options?: {
    //
  }
}

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions
  return defineConfig(async ({ command, mode }) => {
    // 返回 Node.js 进程当前工作的目录
    const root = process.cwd()
    // 根据当前工作目录中的 mode 加载 .env 又件
    // 设置第三个参数为·来加载所有环境变量，而不管是否有VITE_ 前缀
    const { VITE_PUBLIC_PATH, VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(
      mode,
      root
    )
    const defineData = await createDefineData(root)
    const plugins = [vue(), VueDevTools()]
    const pathResolve = (pathname: string) => resolve(root, '.', pathname)

    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH,
      resolve: {
        alias: [
          // @/xxxx => src/xxxx
          {
            find: /@\//,
            replacement: pathResolve('src') + '/'
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: pathResolve('types') + '/'
          }
        ]
      },
      define: defineData,
      plugins
    }
    const mergedConfig = mergeConfig(commonConfig(mode), applicationConfig)

    return mergeConfig(mergedConfig, overrides)
  })
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root)
    const { dependencies, devDependencies, name, version } = pkgJson

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  } catch (error) {
    return {}
  }
}

export { defineApplicationConfig }
